import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    Save,
    Eye,
    ArrowLeft,
    Image as ImageIcon,
    X,
    Upload,
    CheckCircle,
    AlertCircle,
    FileText,
    Tag,
    Globe,
    Search,
    Calendar,
    User,
    Trash2,
    Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
    createArticle,
    updateArticle,
    getArticle,
    uploadImage,
    CATEGORIES
} from '../../services/articleService';
import './Admin.css';

// Quill editor modules
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['clean']
    ]
};

const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'blockquote', 'code-block',
    'link', 'image', 'color', 'background', 'align'
];

export const ArticleEditor = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();
    const { user, userProfile } = useAuth();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('content'); // content, seo, settings
    const [imageUploading, setImageUploading] = useState(false);

    const [article, setArticle] = useState({
        title: '',
        excerpt: '',
        content: '',
        coverImage: '',
        coverImagePath: '',
        categories: [],
        tags: [],
        status: 'draft',
        date: new Date().toISOString().split('T')[0],
        // SEO fields
        seo: {
            metaTitle: '',
            metaDescription: '',
            keywords: '',
            canonicalUrl: '',
            ogImage: ''
        },
        // Author info
        authorName: user?.displayName || '',
        authorRole: 'Autor',
        authorAvatar: ''
    });

    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        if (isEditing) {
            fetchArticle();
        }
    }, [id]);

    const fetchArticle = async () => {
        try {
            const data = await getArticle(id);
            if (data) {
                setArticle({
                    ...data,
                    date: data.date?.split('T')[0] || new Date().toISOString().split('T')[0],
                    seo: data.seo || {
                        metaTitle: '',
                        metaDescription: '',
                        keywords: '',
                        canonicalUrl: '',
                        ogImage: ''
                    }
                });
            } else {
                navigate('/admin');
            }
        } catch (error) {
            console.error('Error fetching article:', error);
            setError('Erro ao carregar artigo.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setArticle(prev => ({ ...prev, [field]: value }));
        setError('');
        setSuccess('');
    };

    const handleSeoChange = (field, value) => {
        setArticle(prev => ({
            ...prev,
            seo: { ...prev.seo, [field]: value }
        }));
    };

    const handleCategoryToggle = (category) => {
        setArticle(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
        }));
    };

    const handleAddTag = (e) => {
        e.preventDefault();
        if (newTag.trim() && !article.tags.includes(newTag.trim())) {
            setArticle(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setArticle(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            setError('Por favor, selecione uma imagem válida.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('A imagem deve ter no máximo 5MB.');
            return;
        }

        setImageUploading(true);
        setError('');

        try {
            const result = await uploadImage(file, 'covers');
            setArticle(prev => ({
                ...prev,
                coverImage: result.url,
                coverImagePath: result.path
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Erro ao fazer upload da imagem.');
        } finally {
            setImageUploading(false);
        }
    };

    const handleSave = async (status = article.status) => {
        // Validation
        if (!article.title.trim()) {
            setError('O título é obrigatório.');
            setActiveTab('content');
            return;
        }

        if (!article.content.trim()) {
            setError('O conteúdo é obrigatório.');
            setActiveTab('content');
            return;
        }

        if (article.categories.length === 0) {
            setError('Selecione pelo menos uma categoria.');
            setActiveTab('settings');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const articleData = {
                ...article,
                status,
                date: new Date(article.date).toISOString()
            };

            if (isEditing) {
                await updateArticle(id, articleData);
                setSuccess('Artigo atualizado com sucesso!');
            } else {
                const authorData = {
                    uid: user.uid,
                    displayName: article.authorName || user.displayName,
                    photoURL: article.authorAvatar || user.photoURL,
                    role: article.authorRole
                };
                const result = await createArticle(articleData, authorData);
                setSuccess('Artigo criado com sucesso!');
                navigate(`/admin/articles/${result.id}`);
            }
        } catch (error) {
            console.error('Error saving article:', error);
            setError('Erro ao salvar artigo. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Carregando artigo...</p>
            </div>
        );
    }

    return (
        <div className="article-editor">
            {/* Header */}
            <header className="editor-header">
                <div className="header-left">
                    <Link to="/admin" className="back-btn">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="header-info">
                        <h1>{isEditing ? 'Editar Artigo' : 'Novo Artigo'}</h1>
                        <span className={`status-indicator ${article.status}`}>
                            {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>
                    </div>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-ghost"
                        onClick={() => handleSave('draft')}
                        disabled={saving}
                    >
                        <Save size={18} />
                        Salvar Rascunho
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSave('published')}
                        disabled={saving}
                    >
                        {saving ? 'Salvando...' : 'Publicar'}
                    </button>
                </div>
            </header>

            {/* Messages */}
            {error && (
                <motion.div
                    className="editor-message error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button onClick={() => setError('')}><X size={16} /></button>
                </motion.div>
            )}

            {success && (
                <motion.div
                    className="editor-message success"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <CheckCircle size={18} />
                    <span>{success}</span>
                    <button onClick={() => setSuccess('')}><X size={16} /></button>
                </motion.div>
            )}

            {/* Tabs */}
            <div className="editor-tabs">
                <button
                    className={`tab ${activeTab === 'content' ? 'active' : ''}`}
                    onClick={() => setActiveTab('content')}
                >
                    <FileText size={18} />
                    Conteúdo
                </button>
                <button
                    className={`tab ${activeTab === 'seo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('seo')}
                >
                    <Search size={18} />
                    SEO
                </button>
                <button
                    className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    <Tag size={18} />
                    Configurações
                </button>
            </div>

            {/* Content Tab */}
            {activeTab === 'content' && (
                <div className="editor-content">
                    <div className="editor-main">
                        {/* Title */}
                        <div className="form-field">
                            <label>Título do Artigo *</label>
                            <input
                                type="text"
                                value={article.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="Digite o título do artigo"
                                className="title-input"
                            />
                        </div>

                        {/* Excerpt */}
                        <div className="form-field">
                            <label>Resumo / Excerpt</label>
                            <textarea
                                value={article.excerpt}
                                onChange={(e) => handleChange('excerpt', e.target.value)}
                                placeholder="Breve descrição do artigo (aparece na listagem)"
                                rows={3}
                            />
                        </div>

                        {/* Content Editor */}
                        <div className="form-field">
                            <label>Conteúdo *</label>
                            <div className="quill-wrapper">
                                <ReactQuill
                                    theme="snow"
                                    value={article.content}
                                    onChange={(value) => handleChange('content', value)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Escreva o conteúdo do artigo aqui..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="editor-sidebar">
                        {/* Cover Image */}
                        <div className="sidebar-section">
                            <h3><ImageIcon size={18} /> Imagem de Capa</h3>
                            <div className="cover-upload">
                                {article.coverImage ? (
                                    <div className="cover-preview">
                                        <img src={article.coverImage} alt="Capa" />
                                        <button
                                            className="remove-cover"
                                            onClick={() => handleChange('coverImage', '')}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="upload-area"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {imageUploading ? (
                                            <div className="uploading">
                                                <div className="spinner small"></div>
                                                <span>Enviando...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={32} />
                                                <span>Clique para upload</span>
                                                <small>JPG, PNG ou WebP (máx. 5MB)</small>
                                            </>
                                        )}
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        {/* Author Info */}
                        <div className="sidebar-section">
                            <h3><User size={18} /> Autor</h3>
                            <div className="form-field">
                                <label>Nome do Autor</label>
                                <input
                                    type="text"
                                    value={article.authorName}
                                    onChange={(e) => handleChange('authorName', e.target.value)}
                                    placeholder="Nome do autor"
                                />
                            </div>
                            <div className="form-field">
                                <label>Cargo/Função</label>
                                <input
                                    type="text"
                                    value={article.authorRole}
                                    onChange={(e) => handleChange('authorRole', e.target.value)}
                                    placeholder="Ex: Especialista em Marketing"
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div className="sidebar-section">
                            <h3><Calendar size={18} /> Data de Publicação</h3>
                            <input
                                type="date"
                                value={article.date}
                                onChange={(e) => handleChange('date', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
                <div className="editor-content seo-content">
                    <div className="seo-preview">
                        <h3>Pré-visualização no Google</h3>
                        <div className="google-preview">
                            <span className="preview-url">
                                blog.evolutto.com.br › artigo › {article.title.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}...
                            </span>
                            <h4 className="preview-title">
                                {article.seo.metaTitle || article.title || 'Título do Artigo'}
                            </h4>
                            <p className="preview-description">
                                {article.seo.metaDescription || article.excerpt || 'Descrição do artigo aparecerá aqui. É recomendado ter entre 150-160 caracteres.'}
                            </p>
                        </div>
                    </div>

                    <div className="seo-fields">
                        <div className="form-field">
                            <label>
                                Meta Title
                                <span className="char-count">
                                    {article.seo.metaTitle.length}/60
                                </span>
                            </label>
                            <input
                                type="text"
                                value={article.seo.metaTitle}
                                onChange={(e) => handleSeoChange('metaTitle', e.target.value)}
                                placeholder="Título para SEO (recomendado: 50-60 caracteres)"
                                maxLength={70}
                            />
                        </div>

                        <div className="form-field">
                            <label>
                                Meta Description
                                <span className="char-count">
                                    {article.seo.metaDescription.length}/160
                                </span>
                            </label>
                            <textarea
                                value={article.seo.metaDescription}
                                onChange={(e) => handleSeoChange('metaDescription', e.target.value)}
                                placeholder="Descrição para SEO (recomendado: 150-160 caracteres)"
                                maxLength={170}
                                rows={3}
                            />
                        </div>

                        <div className="form-field">
                            <label>Palavras-chave</label>
                            <input
                                type="text"
                                value={article.seo.keywords}
                                onChange={(e) => handleSeoChange('keywords', e.target.value)}
                                placeholder="palavra1, palavra2, palavra3"
                            />
                            <small>Separe as palavras-chave por vírgula</small>
                        </div>

                        <div className="form-field">
                            <label>URL Canônica (opcional)</label>
                            <input
                                type="url"
                                value={article.seo.canonicalUrl}
                                onChange={(e) => handleSeoChange('canonicalUrl', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="editor-content settings-content">
                    {/* Categories */}
                    <div className="settings-section">
                        <h3><Tag size={18} /> Categorias *</h3>
                        <p className="section-description">
                            Selecione uma ou mais categorias para o artigo
                        </p>
                        <div className="categories-grid">
                            {CATEGORIES.map(cat => (
                                <label key={cat.value} className="category-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={article.categories.includes(cat.value)}
                                        onChange={() => handleCategoryToggle(cat.value)}
                                    />
                                    <span className="checkbox-label">{cat.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="settings-section">
                        <h3><Tag size={18} /> Tags</h3>
                        <p className="section-description">
                            Adicione tags para melhorar a busca
                        </p>
                        <form className="tag-input-form" onSubmit={handleAddTag}>
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Digite uma tag e pressione Enter"
                            />
                            <button type="submit" className="btn btn-ghost btn-sm">
                                <Plus size={16} />
                            </button>
                        </form>
                        <div className="tags-list">
                            {article.tags.map(tag => (
                                <span key={tag} className="tag-item">
                                    {tag}
                                    <button onClick={() => handleRemoveTag(tag)}>
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="settings-section">
                        <h3><Globe size={18} /> Status do Artigo</h3>
                        <div className="status-options">
                            <label className={`status-option ${article.status === 'draft' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="status"
                                    value="draft"
                                    checked={article.status === 'draft'}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                />
                                <div className="option-content">
                                    <span className="option-title">Rascunho</span>
                                    <span className="option-desc">Salvar sem publicar</span>
                                </div>
                            </label>
                            <label className={`status-option ${article.status === 'published' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="status"
                                    value="published"
                                    checked={article.status === 'published'}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                />
                                <div className="option-content">
                                    <span className="option-title">Publicado</span>
                                    <span className="option-desc">Visível no blog</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
