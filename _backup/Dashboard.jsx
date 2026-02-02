import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FileText,
    Plus,
    Edit3,
    Trash2,
    Eye,
    LogOut,
    BarChart2,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    Search,
    Filter,
    MoreVertical,
    Calendar,
    TrendingUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllArticles, deleteArticle, CATEGORIES } from '../../services/articleService';
import './Admin.css';

export const Dashboard = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { user, userProfile, logout, isAdminMaster } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const data = await getAllArticles(true);
            setArticles(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    const handleDeleteClick = (article) => {
        setArticleToDelete(article);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!articleToDelete) return;

        setDeleting(true);
        try {
            await deleteArticle(articleToDelete.docId, articleToDelete.coverImagePath);
            setArticles(articles.filter(a => a.docId !== articleToDelete.docId));
            setShowDeleteModal(false);
            setArticleToDelete(null);
        } catch (error) {
            console.error('Error deleting article:', error);
        } finally {
            setDeleting(false);
        }
    };

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: articles.length,
        published: articles.filter(a => a.status === 'published').length,
        draft: articles.filter(a => a.status === 'draft').length,
        views: articles.reduce((sum, a) => sum + (a.views || 0), 0)
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <Link to="/" className="admin-logo">
                        <span className="logo-text">EVOLUTTO</span>
                        <span className="logo-dot">.</span>
                    </Link>
                    <span className="admin-badge">Admin</span>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin" className="nav-item active">
                        <BarChart2 size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/articles" className="nav-item">
                        <FileText size={20} />
                        <span>Artigos</span>
                    </Link>
                    <Link to="/admin/articles/new" className="nav-item">
                        <Plus size={20} />
                        <span>Novo Artigo</span>
                    </Link>
                    {isAdminMaster() && (
                        <Link to="/admin/team" className="nav-item">
                            <Users size={20} />
                            <span>Equipe</span>
                        </Link>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            <img
                                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=3363ff&color=fff`}
                                alt={user?.displayName}
                            />
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user?.displayName || 'Usuário'}</span>
                            <span className="user-role">{userProfile?.role || 'Autor'}</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-left">
                        <h1>Dashboard</h1>
                        <p>Gerencie os artigos do blog</p>
                    </div>
                    <div className="header-right">
                        <Link to="/admin/articles/new" className="btn btn-primary">
                            <Plus size={18} />
                            Novo Artigo
                        </Link>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="stat-icon blue">
                            <FileText size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total de Artigos</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="stat-icon green">
                            <CheckCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.published}</span>
                            <span className="stat-label">Publicados</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="stat-icon orange">
                            <Clock size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.draft}</span>
                            <span className="stat-label">Rascunhos</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="stat-icon purple">
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.views.toLocaleString()}</span>
                            <span className="stat-label">Visualizações</span>
                        </div>
                    </motion.div>
                </div>

                {/* Articles Section */}
                <section className="articles-section">
                    <div className="section-header">
                        <h2>Artigos Recentes</h2>
                        <div className="section-actions">
                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar artigos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="filter-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="published">Publicados</option>
                                <option value="draft">Rascunhos</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Carregando artigos...</p>
                        </div>
                    ) : filteredArticles.length === 0 ? (
                        <div className="empty-state">
                            <FileText size={48} />
                            <h3>Nenhum artigo encontrado</h3>
                            <p>Comece criando seu primeiro artigo.</p>
                            <Link to="/admin/articles/new" className="btn btn-primary">
                                <Plus size={18} />
                                Criar Artigo
                            </Link>
                        </div>
                    ) : (
                        <div className="articles-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Artigo</th>
                                        <th>Categoria</th>
                                        <th>Status</th>
                                        <th>Data</th>
                                        <th>Views</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredArticles.map((article) => (
                                        <motion.tr
                                            key={article.docId}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <td className="article-cell">
                                                <div className="article-info">
                                                    <div className="article-thumb">
                                                        {article.coverImage ? (
                                                            <img src={article.coverImage} alt="" />
                                                        ) : (
                                                            <FileText size={24} />
                                                        )}
                                                    </div>
                                                    <div className="article-details">
                                                        <span className="article-title">{article.title}</span>
                                                        <span className="article-author">
                                                            Por {article.author?.name || 'Anônimo'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="category-badge">
                                                    {article.categories?.[0] || 'Geral'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${article.status}`}>
                                                    {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                                                </span>
                                            </td>
                                            <td className="date-cell">
                                                {formatDate(article.createdAt)}
                                            </td>
                                            <td className="views-cell">
                                                {article.views || 0}
                                            </td>
                                            <td className="actions-cell">
                                                <div className="action-buttons">
                                                    {article.status === 'published' && (
                                                        <Link
                                                            to={`/article/${article.slug}`}
                                                            className="action-btn view"
                                                            title="Ver artigo"
                                                            target="_blank"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>
                                                    )}
                                                    <Link
                                                        to={`/admin/articles/${article.docId}`}
                                                        className="action-btn edit"
                                                        title="Editar"
                                                    >
                                                        <Edit3 size={16} />
                                                    </Link>
                                                    <button
                                                        className="action-btn delete"
                                                        title="Excluir"
                                                        onClick={() => handleDeleteClick(article)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <motion.div
                        className="modal-content delete-modal"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="modal-icon danger">
                            <AlertCircle size={32} />
                        </div>
                        <h3>Excluir Artigo</h3>
                        <p>
                            Tem certeza que deseja excluir o artigo{' '}
                            <strong>"{articleToDelete?.title}"</strong>?
                            Esta ação não pode ser desfeita.
                        </p>
                        <div className="modal-actions">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDeleteConfirm}
                                disabled={deleting}
                            >
                                {deleting ? 'Excluindo...' : 'Excluir'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
