import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthProvider';
import {
  getPostById,
  createPost,
  updatePost,
  generateSlug,
  isSlugUnique,
} from '../../lib/services/local-posts';
import { CATEGORIES } from '../../types/admin';

export default function PostEditor({ postId = null }) {
  const { user, isAdmin, isAuthor, logout } = useAuth();
  const [loading, setLoading] = useState(!!postId);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    tags: [],
    status: 'draft',
    seo: {
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      noindex: false,
    },
  });

  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  async function loadPost() {
    try {
      const post = await getPostById(postId);
      if (post) {
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          category: post.category,
          tags: post.tags || [],
          status: post.status,
          seo: post.seo || {
            metaTitle: '',
            metaDescription: '',
            canonicalUrl: '',
            ogTitle: '',
            ogDescription: '',
            ogImage: '',
            noindex: false,
          },
        });
      }
    } catch (error) {
      console.error('Error loading post:', error);
      setErrors({ general: 'Erro ao carregar artigo.' });
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('seo.')) {
      const seoField = name.replace('seo.', '');
      setFormData((prev) => ({
        ...prev,
        seo: {
          ...prev.seo,
          [seoField]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    // Clear errors for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleTitleChange(e) {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seo: {
        ...prev.seo,
        metaTitle: prev.seo.metaTitle || title,
      },
    }));

    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  }

  function handleAddTag() {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput('');
    }
  }

  function handleRemoveTag(tagToRemove) {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }

  function handleTagKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }

  async function validateForm() {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Titulo e obrigatorio';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug e obrigatorio';
    } else {
      const slugIsUnique = await isSlugUnique(formData.slug, postId);
      if (!slugIsUnique) {
        newErrors.slug = 'Este slug ja esta em uso';
      }
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Resumo e obrigatorio';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Conteudo e obrigatorio';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria e obrigatoria';
    }

    if (!formData.seo.metaTitle.trim()) {
      newErrors.metaTitle = 'Titulo SEO e obrigatorio';
    } else if (formData.seo.metaTitle.length > 60) {
      newErrors.metaTitle = 'Titulo SEO deve ter no maximo 60 caracteres';
    }

    if (!formData.seo.metaDescription.trim()) {
      newErrors.metaDescription = 'Descricao SEO e obrigatoria';
    } else if (formData.seo.metaDescription.length > 160) {
      newErrors.metaDescription = 'Descricao SEO deve ter no maximo 160 caracteres';
    }

    // Return errors object for handleSubmit to use
    return newErrors;
  }

  async function handleSubmit(e, submitStatus = null) {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({}); // Clear previous errors

    const dataToSave = {
      ...formData,
      status: submitStatus || formData.status,
    };

    const validationErrors = await validateForm();
    const hasErrors = Object.keys(validationErrors).length > 0;

    if (hasErrors) {
      // Check if SEO errors exist to switch tab appropriately
      const hasSeoErrors = validationErrors.metaTitle || validationErrors.metaDescription;
      const hasContentErrors = validationErrors.title || validationErrors.slug ||
                               validationErrors.excerpt || validationErrors.content ||
                               validationErrors.category;

      if (hasContentErrors) {
        setActiveTab('content');
      } else if (hasSeoErrors) {
        setActiveTab('seo');
      }

      // Set all errors including general message
      setErrors({
        ...validationErrors,
        general: 'Por favor, preencha todos os campos obrigatorios antes de publicar.'
      });
      return;
    }

    setSaving(true);

    try {
      if (postId) {
        const success = await updatePost(postId, dataToSave);
        if (success) {
          setSuccessMessage('Artigo atualizado com sucesso!');
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setErrors({ general: 'Erro ao atualizar artigo.' });
        }
      } else {
        const newPost = await createPost(dataToSave, user.id, user.name);
        if (newPost) {
          window.location.href = `/registro/editar/${newPost.id}?created=true`;
        } else {
          setErrors({ general: 'Erro ao criar artigo.' });
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      setErrors({ general: 'Erro ao salvar artigo.' });
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    window.location.href = '/registro';
  }

  function getUserInitials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  if (loading) {
    return (
      <div className="editor-loading">
        <div className="loading-spinner"></div>
        <p>Carregando artigo...</p>

        <style>{`
          .editor-loading {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e2e8f0;
            border-top-color: #0ea5e9;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .editor-loading p {
            color: #64748b;
            font-size: 0.875rem;
          }
        `}</style>
      </div>
    );
  }

  // Permitir que qualquer autor ou admin publique diretamente
  const canPublish = isAdmin || isAuthor;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-left">
          <a href="/blog">
            <img src="/images/logo-evolutto.png" alt="Evolutto" className="admin-logo" />
          </a>
          <nav className="admin-nav">
            <a href="/registro/dashboard" className="admin-nav-link">
              Dashboard
            </a>
            <a href="/registro/novo" className="admin-nav-link active">
              {postId ? 'Editar Artigo' : 'Novo Artigo'}
            </a>
          </nav>
        </div>

        <div className="admin-header-right">
          <div className="admin-user">
            <div className="admin-user-info">
              <div className="admin-user-name">{user?.name}</div>
              <div className="admin-user-role">
                {user?.role === 'admin' ? 'Administrador' : 'Autor'}
              </div>
            </div>
            <div className="admin-avatar">{user && getUserInitials(user.name)}</div>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            Sair
          </button>
        </div>
      </header>

      <main className="admin-content">
        <div className="admin-page-header">
          <h1 className="admin-page-title">
            {postId ? 'Editar Artigo' : 'Novo Artigo'}
          </h1>
          <p className="admin-page-subtitle">
            {postId
              ? 'Faca alteracoes no seu artigo'
              : 'Crie um novo artigo para o blog'}
          </p>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="success-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Tabs */}
          <div className="editor-tabs">
            <button
              type="button"
              className={`editor-tab ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Conteudo
            </button>
            <button
              type="button"
              className={`editor-tab ${activeTab === 'seo' ? 'active' : ''}`}
              onClick={() => setActiveTab('seo')}
            >
              SEO
            </button>
          </div>

          <div className="editor-content">
            <div className="editor-main">
              {/* Content Tab */}
              {activeTab === 'content' && (
                <>
                  <div className="admin-card">
                    <div className="admin-card-body">
                      <div className="form-group">
                        <label className="form-label">Titulo *</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleTitleChange}
                          className={`form-input ${errors.title ? 'error' : ''}`}
                          placeholder="Digite o titulo do artigo"
                        />
                        {errors.title && <span className="form-error">{errors.title}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Slug *</label>
                        <input
                          type="text"
                          name="slug"
                          value={formData.slug}
                          onChange={handleChange}
                          className={`form-input ${errors.slug ? 'error' : ''}`}
                          placeholder="url-do-artigo"
                        />
                        <span className="form-hint">/blog/{formData.slug || 'url-do-artigo'}</span>
                        {errors.slug && <span className="form-error">{errors.slug}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Resumo *</label>
                        <textarea
                          name="excerpt"
                          value={formData.excerpt}
                          onChange={handleChange}
                          className={`form-textarea ${errors.excerpt ? 'error' : ''}`}
                          placeholder="Um breve resumo do artigo (2-3 frases)"
                          rows={3}
                        />
                        {errors.excerpt && <span className="form-error">{errors.excerpt}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Conteudo *</label>
                        <textarea
                          name="content"
                          value={formData.content}
                          onChange={handleChange}
                          className={`form-textarea content-editor ${errors.content ? 'error' : ''}`}
                          placeholder="Escreva o conteudo do artigo aqui... (Suporta Markdown)"
                          rows={20}
                        />
                        {errors.content && <span className="form-error">{errors.content}</span>}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div className="admin-card">
                  <div className="admin-card-body">
                    <div className="form-group">
                      <label className="form-label">Titulo SEO * (max 60 caracteres)</label>
                      <input
                        type="text"
                        name="seo.metaTitle"
                        value={formData.seo.metaTitle}
                        onChange={handleChange}
                        className={`form-input ${errors.metaTitle ? 'error' : ''}`}
                        placeholder="Titulo para buscadores"
                        maxLength={60}
                      />
                      <span className="form-hint">{formData.seo.metaTitle.length}/60</span>
                      {errors.metaTitle && <span className="form-error">{errors.metaTitle}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Descricao SEO * (max 160 caracteres)</label>
                      <textarea
                        name="seo.metaDescription"
                        value={formData.seo.metaDescription}
                        onChange={handleChange}
                        className={`form-textarea ${errors.metaDescription ? 'error' : ''}`}
                        placeholder="Descricao para buscadores"
                        rows={3}
                        maxLength={160}
                      />
                      <span className="form-hint">{formData.seo.metaDescription.length}/160</span>
                      {errors.metaDescription && (
                        <span className="form-error">{errors.metaDescription}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">URL Canonica (opcional)</label>
                      <input
                        type="url"
                        name="seo.canonicalUrl"
                        value={formData.seo.canonicalUrl}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="https://..."
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Titulo Open Graph (opcional)</label>
                      <input
                        type="text"
                        name="seo.ogTitle"
                        value={formData.seo.ogTitle}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Titulo para redes sociais"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Descricao Open Graph (opcional)</label>
                      <textarea
                        name="seo.ogDescription"
                        value={formData.seo.ogDescription}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Descricao para redes sociais"
                        rows={2}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Imagem Open Graph (opcional)</label>
                      <input
                        type="url"
                        name="seo.ogImage"
                        value={formData.seo.ogImage}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="URL da imagem para redes sociais"
                      />
                    </div>

                    <div className="form-group checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="seo.noindex"
                          checked={formData.seo.noindex}
                          onChange={handleChange}
                        />
                        <span>Nao indexar (noindex)</span>
                      </label>
                      <span className="form-hint">Marque para evitar que buscadores indexem esta pagina</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="editor-sidebar">
              {/* Status Card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3 className="admin-card-title">Publicacao</h3>
                </div>
                <div className="admin-card-body">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="review">Em Revisao</option>
                      <option value="published">Publicado</option>
                    </select>
                  </div>

                  <div className="publish-actions">
                    <button type="submit" className="btn btn-secondary" disabled={saving}>
                      {saving ? 'Salvando...' : 'Salvar Rascunho'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={saving}
                      onClick={(e) => handleSubmit(e, 'published')}
                    >
                      {saving ? 'Publicando...' : 'Publicar'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3 className="admin-card-title">Categoria</h3>
                </div>
                <div className="admin-card-body">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`form-select ${errors.category ? 'error' : ''}`}
                    >
                      <option value="">Selecione uma categoria</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && <span className="form-error">{errors.category}</span>}
                  </div>
                </div>
              </div>

              {/* Cover Image Card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3 className="admin-card-title">Imagem de Capa</h3>
                </div>
                <div className="admin-card-body">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <input
                      type="url"
                      name="coverImage"
                      value={formData.coverImage}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="URL da imagem"
                    />
                    {formData.coverImage && (
                      <div className="cover-preview">
                        <img src={formData.coverImage} alt="Preview" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags Card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3 className="admin-card-title">Tags</h3>
                </div>
                <div className="admin-card-body">
                  <div className="tags-input-wrapper">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className="form-input"
                      placeholder="Adicionar tag..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="btn btn-secondary btn-sm add-tag-btn"
                    >
                      +
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="tags-list">
                      {formData.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="tag-remove"
                          >
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <style>{`
        .success-message,
        .error-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .success-message {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }

        .error-message {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .editor-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }

        .editor-tab {
          padding: 10px 20px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .editor-tab:hover {
          background: #f8fafc;
        }

        .editor-tab.active {
          background: #0ea5e9;
          border-color: #0ea5e9;
          color: #fff;
        }

        .editor-content {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
        }

        .editor-main .admin-card {
          margin-bottom: 24px;
        }

        .editor-sidebar .admin-card {
          margin-bottom: 16px;
        }

        .content-editor {
          min-height: 400px;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
          line-height: 1.7;
        }

        .form-input.error,
        .form-textarea.error,
        .form-select.error {
          border-color: #dc2626;
        }

        .publish-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .publish-actions .btn {
          width: 100%;
          justify-content: center;
        }

        .cover-preview {
          margin-top: 12px;
          border-radius: 8px;
          overflow: hidden;
        }

        .cover-preview img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .tags-input-wrapper {
          display: flex;
          gap: 8px;
        }

        .tags-input-wrapper .form-input {
          flex: 1;
        }

        .add-tag-btn {
          padding: 10px 14px !important;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: #f1f5f9;
          border-radius: 9999px;
          font-size: 0.8125rem;
          color: #475569;
        }

        .tag-remove {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 0.875rem;
          padding: 0 2px;
        }

        .tag-remove:hover {
          color: #dc2626;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .editor-content {
            grid-template-columns: 1fr;
          }

          .editor-sidebar {
            order: -1;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .editor-sidebar .admin-card {
            margin-bottom: 0;
          }
        }

        @media (max-width: 640px) {
          .editor-sidebar {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
