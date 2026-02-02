import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import {
  getPosts,
  getDashboardStats,
  getProductionByAuthor,
  getProductionByCategory,
} from '../../lib/services/local-posts';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [authorStats, setAuthorStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsData, authorData, categoryData, postsData] = await Promise.all([
        getDashboardStats(),
        getProductionByAuthor(),
        getProductionByCategory(),
        getPosts({ limitCount: 5 }),
      ]);

      setStats(statsData);
      setAuthorStats(authorData);
      setCategoryStats(categoryData);
      setRecentPosts(postsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    window.location.href = '/admin-full';
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
          <a href="/blog">
            <img src="/images/logo-evolutto.png" alt="Evolutto" className="admin-logo" />
          </a>
          <nav className="admin-nav">
            <a href="/admin-full" className="admin-nav-link active">
              Dashboard
            </a>
            <a href="/admin-full/artigos" className="admin-nav-link">
              Artigos
            </a>
            <a href="/admin-full/colaboradores" className="admin-nav-link">
              Colaboradores
            </a>
          </nav>
        </div>

        <div className="admin-header-right">
          <div className="admin-user">
            <div className="admin-user-info">
              <div className="admin-user-name">{user?.name}</div>
              <div className="admin-user-role">Administrador</div>
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
          <h1 className="admin-page-title">Dashboard Administrativo</h1>
          <p className="admin-page-subtitle">
            Visao geral do blog e producao de conteudo
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total de Artigos</div>
              <div className="stat-value">{stats.totalPosts}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Publicados (7 dias)</div>
              <div className="stat-value">{stats.publishedLast7Days}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Publicados (30 dias)</div>
              <div className="stat-value">{stats.publishedLast30Days}</div>
            </div>
            <div className="stat-card highlight">
              <div className="stat-label">Em Revisao</div>
              <div className="stat-value">{stats.inReview}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total de Autores</div>
              <div className="stat-value">{stats.totalAuthors}</div>
            </div>
          </div>
        )}

        <div className="dashboard-grid">
          {/* Production by Author */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Producao por Autor</h2>
              <a href="/admin-full/colaboradores" className="card-link">
                Ver todos
              </a>
            </div>
            <div className="admin-card-body table-container">
              {authorStats.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Autor</th>
                      <th>Publicados</th>
                      <th>Revisao</th>
                      <th>Rascunhos</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authorStats.slice(0, 5).map((author) => (
                      <tr key={author.authorId}>
                        <td>{author.authorName}</td>
                        <td>{author.published}</td>
                        <td>{author.inReview}</td>
                        <td>{author.drafts}</td>
                        <td>
                          <strong>{author.total}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state-small">
                  <p>Nenhum dado disponivel</p>
                </div>
              )}
            </div>
          </div>

          {/* Production by Category */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Artigos por Categoria</h2>
            </div>
            <div className="admin-card-body">
              {categoryStats.length > 0 ? (
                <div className="category-bars">
                  {categoryStats.slice(0, 8).map((cat) => (
                    <div key={cat.category} className="category-bar-item">
                      <div className="category-bar-label">
                        <span>{cat.category}</span>
                        <span>{cat.count}</span>
                      </div>
                      <div className="category-bar-track">
                        <div
                          className="category-bar-fill"
                          style={{
                            width: `${(cat.count / categoryStats[0].count) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-small">
                  <p>Nenhum dado disponivel</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Posts in Review */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Artigos Recentes</h2>
            <a href="/admin-full/artigos" className="card-link">
              Ver todos
            </a>
          </div>
          <div className="admin-card-body table-container">
            {recentPosts.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Titulo</th>
                    <th>Autor</th>
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
                      <td>{post.authorName}</td>
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
                            href={`/admin-full/artigo/${post.id}`}
                            className="btn btn-secondary btn-sm"
                          >
                            Revisar
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state-small">
                <p>Nenhum artigo encontrado</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }

        .stat-card.highlight {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-color: #fcd34d;
        }

        .stat-card.highlight .stat-label {
          color: #92400e;
        }

        .stat-card.highlight .stat-value {
          color: #78350f;
        }

        .card-link {
          font-size: 0.8125rem;
          color: #0ea5e9;
          font-weight: 500;
        }

        .card-link:hover {
          text-decoration: underline;
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
          max-width: 250px;
        }

        .post-title {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .empty-state-small {
          padding: 32px;
          text-align: center;
          color: #64748b;
        }

        .category-bars {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .category-bar-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .category-bar-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.8125rem;
        }

        .category-bar-label span:first-child {
          color: #374151;
        }

        .category-bar-label span:last-child {
          color: #64748b;
          font-weight: 500;
        }

        .category-bar-track {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .category-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #0ea5e9, #06b6d4);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
