import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { getPosts, getDashboardStats } from '../../lib/services/local-posts';

export default function Dashboard() {
  const { user, isAdmin, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    if (!user) return;

    try {
      const [statsData, postsData] = await Promise.all([
        getDashboardStats(),
        getPosts({
          authorId: isAdmin ? undefined : user.id,
          limitCount: 10,
        }),
      ]);

      setStats(statsData);
      setRecentPosts(postsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    window.location.href = '/registro';
  }

  function formatDate(timestamp) {
    if (!timestamp) return '-';
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  }

  function getStatusLabel(status) {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'review':
        return 'Em Revisao';
      case 'published':
        return 'Publicado';
      default:
        return status;
    }
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
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dashboard...</p>

        <style>{`
          .dashboard-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
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

          .dashboard-loading p {
            color: #64748b;
            font-size: 0.875rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-left">
          <a href="/">
            <img src="/images/logo-evolutto.png" alt="Evolutto" className="admin-logo" />
          </a>
          <nav className="admin-nav">
            <a href="/registro/dashboard" className="admin-nav-link active">
              Dashboard
            </a>
            <a href="/registro/novo" className="admin-nav-link">
              Novo Artigo
            </a>
            {isAdmin && (
              <a href="/admin-full" className="admin-nav-link">
                Admin Completo
              </a>
            )}
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
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">
            Bem-vindo(a), {user?.name?.split(' ')[0]}! Gerencie seus artigos aqui.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Meus Artigos</div>
            <div className="stat-value">{recentPosts.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Publicados</div>
            <div className="stat-value">
              {recentPosts.filter((p) => p.status === 'published').length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Em Revisao</div>
            <div className="stat-value">
              {recentPosts.filter((p) => p.status === 'review').length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Rascunhos</div>
            <div className="stat-value">
              {recentPosts.filter((p) => p.status === 'draft').length}
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="admin-card action-card">
          <div className="action-content">
            <div className="action-text">
              <h3>Criar Novo Artigo</h3>
              <p>Comece a escrever um novo artigo para o blog</p>
            </div>
            <a href="/registro/novo" className="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Novo Artigo
            </a>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Seus Artigos Recentes</h2>
          </div>
          <div className="admin-card-body table-container">
            {recentPosts.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Titulo</th>
                    <th>Categoria</th>
                    <th>Status</th>
                    <th>Atualizado</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <div className="post-title-cell">
                          <span className="post-title">{post.title}</span>
                        </div>
                      </td>
                      <td>{post.category}</td>
                      <td>
                        <span className={`status-badge status-${post.status}`}>
                          {getStatusLabel(post.status)}
                        </span>
                      </td>
                      <td>{formatDate(post.updatedAt)}</td>
                      <td>
                        <div className="table-actions">
                          <a
                            href={`/registro/editar/${post.id}`}
                            className="btn btn-secondary btn-sm"
                          >
                            Editar
                          </a>
                          {post.status === 'published' && (
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary btn-sm"
                            >
                              Ver
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <h3>Nenhum artigo ainda</h3>
                <p>Comece criando seu primeiro artigo!</p>
                <a href="/registro/novo" className="btn btn-primary">
                  Criar Artigo
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .action-card {
          margin-bottom: 24px;
        }

        .action-content {
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 12px;
        }

        .action-text h3 {
          margin: 0 0 4px;
          font-size: 1.125rem;
          font-weight: 600;
          color: #0c4a6e;
        }

        .action-text p {
          margin: 0;
          font-size: 0.875rem;
          color: #0369a1;
        }

        .table-container {
          padding: 0;
          overflow-x: auto;
        }

        .table-actions {
          display: flex;
          gap: 8px;
        }

        .post-title-cell {
          max-width: 300px;
        }

        .post-title {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .empty-state {
          padding: 48px 24px;
          text-align: center;
          color: #64748b;
        }

        .empty-state svg {
          margin-bottom: 16px;
          color: #94a3b8;
        }

        .empty-state h3 {
          margin: 0 0 8px;
          font-size: 1.125rem;
          color: #1e293b;
        }

        .empty-state p {
          margin: 0 0 24px;
        }

        @media (max-width: 640px) {
          .action-content {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
