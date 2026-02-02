import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    UserCheck,
    UserX,
    Clock,
    FileText,
    BarChart2,
    Plus,
    LogOut,
    Shield,
    Edit3,
    Check,
    X,
    AlertCircle,
    ChevronDown,
    Mail,
    Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getArticlesByAuthor } from '../../services/articleService';
import './Admin.css';

export const TeamManagement = () => {
    const [users, setUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [processingUser, setProcessingUser] = useState(null);
    const [showRoleMenu, setShowRoleMenu] = useState(null);

    const { user, userProfile, logout, isAdminMaster, getAllUsers, getPendingUsers, approveUser, rejectUser, updateUserRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdminMaster()) {
            navigate('/admin');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [allUsers, pending] = await Promise.all([
                getAllUsers(),
                getPendingUsers()
            ]);

            // Buscar contagem de artigos para cada usuario
            const usersWithArticles = await Promise.all(
                allUsers.map(async (u) => {
                    try {
                        const articles = await getArticlesByAuthor(u.uid);
                        return { ...u, articlesCount: articles.length, articles };
                    } catch (err) {
                        return { ...u, articlesCount: 0, articles: [] };
                    }
                })
            );

            setUsers(usersWithArticles);
            setPendingUsers(pending);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    const handleApprove = async (userId) => {
        setProcessingUser(userId);
        try {
            await approveUser(userId);
            await fetchData();
        } catch (error) {
            console.error('Error approving user:', error);
        } finally {
            setProcessingUser(null);
        }
    };

    const handleReject = async (userId) => {
        setProcessingUser(userId);
        try {
            await rejectUser(userId);
            await fetchData();
        } catch (error) {
            console.error('Error rejecting user:', error);
        } finally {
            setProcessingUser(null);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        setProcessingUser(userId);
        try {
            await updateUserRole(userId, newRole);
            await fetchData();
            setShowRoleMenu(null);
        } catch (error) {
            console.error('Error updating role:', error);
        } finally {
            setProcessingUser(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="status-badge published">Aprovado</span>;
            case 'pending':
                return <span className="status-badge draft">Pendente</span>;
            case 'rejected':
                return <span className="status-badge rejected">Rejeitado</span>;
            default:
                return <span className="status-badge">{status}</span>;
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return <span className="role-badge admin"><Shield size={12} /> Admin</span>;
            case 'editor':
                return <span className="role-badge editor"><Edit3 size={12} /> Editor</span>;
            case 'author':
                return <span className="role-badge author"><FileText size={12} /> Autor</span>;
            default:
                return <span className="role-badge">{role}</span>;
        }
    };

    const stats = {
        total: users.length,
        approved: users.filter(u => u.status === 'approved').length,
        pending: pendingUsers.length,
        totalArticles: users.reduce((sum, u) => sum + (u.articlesCount || 0), 0)
    };

    const approvedUsers = users.filter(u => u.status === 'approved');

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
                    <Link to="/admin" className="nav-item">
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
                    <Link to="/admin/team" className="nav-item active">
                        <Users size={20} />
                        <span>Equipe</span>
                    </Link>
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
                            <span className="user-role">Admin Master</span>
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
                        <h1>Gestao de Equipe</h1>
                        <p>Gerencie usuarios e aprovacoes</p>
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
                            <Users size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total de Usuarios</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="stat-icon green">
                            <UserCheck size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.approved}</span>
                            <span className="stat-label">Aprovados</span>
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
                            <span className="stat-value">{stats.pending}</span>
                            <span className="stat-label">Pendentes</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="stat-icon purple">
                            <FileText size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.totalArticles}</span>
                            <span className="stat-label">Artigos Publicados</span>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="team-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        <Clock size={18} />
                        Pendentes ({pendingUsers.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
                        onClick={() => setActiveTab('approved')}
                    >
                        <UserCheck size={18} />
                        Aprovados ({approvedUsers.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        <Users size={18} />
                        Todos ({users.length})
                    </button>
                </div>

                {/* Content */}
                <section className="team-section">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Carregando usuarios...</p>
                        </div>
                    ) : (
                        <>
                            {/* Pending Users */}
                            {activeTab === 'pending' && (
                                <>
                                    {pendingUsers.length === 0 ? (
                                        <div className="empty-state">
                                            <UserCheck size={48} />
                                            <h3>Nenhuma solicitacao pendente</h3>
                                            <p>Todas as solicitacoes foram processadas.</p>
                                        </div>
                                    ) : (
                                        <div className="users-grid">
                                            {pendingUsers.map((pendingUser) => (
                                                <motion.div
                                                    key={pendingUser.id}
                                                    className="user-card pending"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                >
                                                    <div className="user-card-header">
                                                        <div className="user-card-avatar">
                                                            <img
                                                                src={pendingUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(pendingUser.displayName || 'U')}&background=3363ff&color=fff`}
                                                                alt={pendingUser.displayName}
                                                            />
                                                        </div>
                                                        <div className="user-card-info">
                                                            <h4>{pendingUser.displayName}</h4>
                                                            <span className="user-email">
                                                                <Mail size={14} />
                                                                {pendingUser.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="user-card-meta">
                                                        <span>
                                                            <Calendar size={14} />
                                                            Solicitou em {formatDate(pendingUser.createdAt)}
                                                        </span>
                                                    </div>
                                                    <div className="user-card-actions">
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handleApprove(pendingUser.id)}
                                                            disabled={processingUser === pendingUser.id}
                                                        >
                                                            <Check size={16} />
                                                            {processingUser === pendingUser.id ? 'Processando...' : 'Aprovar'}
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleReject(pendingUser.id)}
                                                            disabled={processingUser === pendingUser.id}
                                                        >
                                                            <X size={16} />
                                                            Rejeitar
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Approved Users */}
                            {activeTab === 'approved' && (
                                <div className="articles-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Usuario</th>
                                                <th>Role</th>
                                                <th>Artigos</th>
                                                <th>Aprovado em</th>
                                                <th>Acoes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {approvedUsers.map((approvedUser) => (
                                                <motion.tr
                                                    key={approvedUser.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <td className="article-cell">
                                                        <div className="article-info">
                                                            <div className="article-thumb user-thumb">
                                                                <img
                                                                    src={approvedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(approvedUser.displayName || 'U')}&background=3363ff&color=fff`}
                                                                    alt={approvedUser.displayName}
                                                                />
                                                            </div>
                                                            <div className="article-details">
                                                                <span className="article-title">{approvedUser.displayName}</span>
                                                                <span className="article-author">{approvedUser.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="role-dropdown">
                                                            <button
                                                                className="role-dropdown-btn"
                                                                onClick={() => setShowRoleMenu(showRoleMenu === approvedUser.id ? null : approvedUser.id)}
                                                            >
                                                                {getRoleBadge(approvedUser.role)}
                                                                <ChevronDown size={14} />
                                                            </button>
                                                            {showRoleMenu === approvedUser.id && (
                                                                <div className="role-dropdown-menu">
                                                                    <button onClick={() => handleRoleChange(approvedUser.id, 'admin')}>
                                                                        <Shield size={14} /> Admin
                                                                    </button>
                                                                    <button onClick={() => handleRoleChange(approvedUser.id, 'editor')}>
                                                                        <Edit3 size={14} /> Editor
                                                                    </button>
                                                                    <button onClick={() => handleRoleChange(approvedUser.id, 'author')}>
                                                                        <FileText size={14} /> Autor
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="views-cell">
                                                        <strong>{approvedUser.articlesCount || 0}</strong>
                                                    </td>
                                                    <td className="date-cell">
                                                        {formatDate(approvedUser.approvedAt)}
                                                    </td>
                                                    <td className="actions-cell">
                                                        <button
                                                            className="action-btn delete"
                                                            title="Revogar acesso"
                                                            onClick={() => handleReject(approvedUser.id)}
                                                            disabled={processingUser === approvedUser.id}
                                                        >
                                                            <UserX size={16} />
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* All Users */}
                            {activeTab === 'all' && (
                                <div className="articles-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Usuario</th>
                                                <th>Status</th>
                                                <th>Role</th>
                                                <th>Artigos</th>
                                                <th>Criado em</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((u) => (
                                                <motion.tr
                                                    key={u.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <td className="article-cell">
                                                        <div className="article-info">
                                                            <div className="article-thumb user-thumb">
                                                                <img
                                                                    src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayName || 'U')}&background=3363ff&color=fff`}
                                                                    alt={u.displayName}
                                                                />
                                                            </div>
                                                            <div className="article-details">
                                                                <span className="article-title">{u.displayName}</span>
                                                                <span className="article-author">{u.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{getStatusBadge(u.status)}</td>
                                                    <td>{getRoleBadge(u.role)}</td>
                                                    <td className="views-cell">
                                                        <strong>{u.articlesCount || 0}</strong>
                                                    </td>
                                                    <td className="date-cell">
                                                        {formatDate(u.createdAt)}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>
        </div>
    );
};
