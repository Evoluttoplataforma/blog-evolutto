import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { getPosts, updatePostStatus, deletePost } from '../../lib/services/local-posts';
import { CATEGORIES } from '../../types/admin';

export default function ArticlesManager() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, statusFilter, categoryFilter]);

  async function loadPosts() {
    try {
      const data = await getPosts();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterPosts() {
    let filtered = [...posts];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.authorName.toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((post) => post.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter((post) => post.category === categoryFilter);
    }

    setFilteredPosts(filtered);
  }

  async function handleStatusChange(postId, newStatus) {
    try {
      const success = await updatePostStatus(postId, newStatus);
      if (success) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, status: newStatus } : post
          )
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }

  async function handleDelete(postId) {
    try {
      const success = await deletePost(postId);
      if (success) {
        setPosts((prev) => prev.filter((post) => post.id !== postId));
        setConfirmDelete(null);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
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
      year: 'numeric',
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
        <p>Carregando artigos...</p>

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
            <a href="/admin-full" className="admin-nav-link">
              Dashboard
            </a>
            <a href="/admin-full/artigos" className="admin-nav-link active">
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
        <div className="admin-page-header page-header-with-action">
          <div>
            <h1 className="admin-page-title">Artigos</h1>
            <p className="admin-page-subtitle">
              Gerencie todos os artigos do blog ({posts.length} total)
            </p>
          </div>
          <a href="/registro/novo" className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Novo Artigo
          </a>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-input-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Buscar por titulo ou autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os status</option>
            <option value="draft">Rascunho</option>
            <option value="review">Em Revisao</option>
            <option value="published">Publicado</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas as categorias</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Articles Table */}
        <div className="admin-card">
          <div className="admin-card-body table-container">
            {filteredPosts.length > 0 ? (
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
                  {filteredPosts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <div className="post-title-cell">
                          <span className="post-title">{post.title}</span>
                          <span className="post-slug">/blog/{post.slug}</span>
                        </div>
                      </td>
                      <td>{post.authorName}</td>
                      <td>{post.category}</td>
                      <td>
                        <select
                          value={post.status}
                          onChange={(e) => handleStatusChange(post.id, e.target.value)}
                          className={`status-select status-${post.status}`}
                        >
                          <option value="draft">Rascunho</option>
                          <option value="review">Em Revisao</option>
                          <option value="published">Publicado</option>
                        </select>
                      </td>
                      <td>{formatDate(post.updatedAt)}</td>
                      <td>
                        <div className="table-actions">
                          <a
                            href={`/admin-full/artigo/${post.id}`}
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
                          <button
                            onClick={() => setConfirmDelete(post.id)}
                            className="btn btn-danger btn-sm"
                          >
                            Excluir
                          </button>
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
                </svg>
                <h3>Nenhum artigo encontrado</h3>
                <p>Tente ajustar os filtros de busca</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusao</h3>
            <p>Tem certeza que deseja excluir este artigo? Esta acao nao pode ser desfeita.</p>
            <div className="modal-actions">
              <button
                onClick={() => setConfirmDelete(null)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="btn btn-danger"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .page-header-with-action {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .filters-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .search-input-wrapper {
          flex: 1;
          min-width: 280px;
          position: relative;
        }

        .search-input-wrapper svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 10px 14px 10px 44px;
          font-size: 0.9375rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          outline: none;
          transition: all 0.15s ease;
        }

        .search-input:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .filter-select {
          padding: 10px 14px;
          font-size: 0.9375rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          outline: none;
          background: #fff;
          min-width: 180px;
        }

        .filter-select:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
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
          display: flex;
          flex-direction: column;
          gap: 2px;
          max-width: 300px;
        }

        .post-title {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-weight: 500;
        }

        .post-slug {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .status-select {
          padding: 4px 8px;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          outline: none;
        }

        .status-select.status-draft {
          background: #f1f5f9;
          color: #64748b;
        }

        .status-select.status-review {
          background: #fef3c7;
          color: #d97706;
        }

        .status-select.status-published {
          background: #dcfce7;
          color: #16a34a;
        }

        .empty-state {
          padding: 64px 24px;
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
          margin: 0;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }

        .modal-content {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
          width: 100%;
        }

        .modal-content h3 {
          margin: 0 0 12px;
          font-size: 1.125rem;
          color: #1e293b;
        }

        .modal-content p {
          margin: 0 0 24px;
          color: #64748b;
          font-size: 0.9375rem;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        @media (max-width: 768px) {
          .page-header-with-action {
            flex-direction: column;
            gap: 16px;
          }

          .filters-bar {
            flex-direction: column;
          }

          .search-input-wrapper {
            min-width: 100%;
          }

          .filter-select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
