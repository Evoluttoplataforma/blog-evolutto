import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { getProductionByAuthor } from '../../lib/services/local-posts';

export default function UsersManager() {
  const { user: currentUser, getAllUsers, updateUser, deleteUser, logout, register } = useAuth();
  const [users, setUsers] = useState([]);
  const [authorStats, setAuthorStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'author',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [usersData, productionData] = await Promise.all([
        Promise.resolve(getAllUsers()),
        getProductionByAuthor(),
      ]);

      setUsers(usersData);

      // Create a map of author stats
      const statsMap = {};
      productionData.forEach((author) => {
        statsMap[author.authorId] = author;
      });
      setAuthorStats(statsMap);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'author',
    });
    setFormErrors({});
    setShowModal(true);
  }

  function openEditModal(user) {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setFormErrors({});
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'author',
    });
    setFormErrors({});
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validateForm() {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Nome e obrigatorio';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email e obrigatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email invalido';
    }

    if (!editingUser && !formData.password) {
      errors.password = 'Senha e obrigatoria';
    } else if (!editingUser && formData.password.length < 6) {
      errors.password = 'Senha deve ter no minimo 6 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    try {
      if (editingUser) {
        // Update existing user
        const updateData = {
          name: formData.name,
          role: formData.role,
        };

        updateUser(editingUser.id, updateData);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id ? { ...u, ...updateData } : u
          )
        );
        closeModal();
      } else {
        // Create new user using register
        // Note: This creates the user but logs them in, so we need to reload users
        try {
          // Temporarily store current user
          const currentUserBackup = localStorage.getItem('blog_current_user');

          // Get existing users
          const existingUsers = JSON.parse(localStorage.getItem('blog_users') || '[]');

          // Check if email exists
          if (existingUsers.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
            setFormErrors({ email: 'Este email ja esta em uso' });
            setSaving(false);
            return;
          }

          // Create new user directly in localStorage
          const newUser = {
            id: 'user-' + Date.now(),
            email: formData.email,
            password: formData.password,
            name: formData.name,
            role: formData.role,
            active: true,
            createdAt: new Date().toISOString()
          };

          existingUsers.push(newUser);
          localStorage.setItem('blog_users', JSON.stringify(existingUsers));

          // Restore current user session
          if (currentUserBackup) {
            localStorage.setItem('blog_current_user', currentUserBackup);
          }

          // Add to state without password
          const { password, ...userWithoutPassword } = newUser;
          setUsers((prev) => [...prev, userWithoutPassword]);
          closeModal();
        } catch (error) {
          console.error('Error creating user:', error);
          setFormErrors({ general: 'Erro ao criar usuario' });
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setFormErrors({ general: 'Erro ao salvar usuario' });
    } finally {
      setSaving(false);
    }
  }

  function handleToggleActive(userId, currentActive) {
    try {
      updateUser(userId, { active: !currentActive });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, active: !currentActive } : u
        )
      );
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  }

  function handleRoleChange(userId, newRole) {
    try {
      updateUser(userId, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error('Error changing user role:', error);
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
        <p>Carregando colaboradores...</p>

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
            <a href="/admin-full/artigos" className="admin-nav-link">
              Artigos
            </a>
            <a href="/admin-full/colaboradores" className="admin-nav-link active">
              Colaboradores
            </a>
          </nav>
        </div>

        <div className="admin-header-right">
          <div className="admin-user">
            <div className="admin-user-info">
              <div className="admin-user-name">{currentUser?.name}</div>
              <div className="admin-user-role">Administrador</div>
            </div>
            <div className="admin-avatar">{currentUser && getUserInitials(currentUser.name)}</div>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            Sair
          </button>
        </div>
      </header>

      <main className="admin-content">
        <div className="admin-page-header page-header-with-action">
          <div>
            <h1 className="admin-page-title">Colaboradores</h1>
            <p className="admin-page-subtitle">
              Gerencie os autores e administradores ({users.length} total)
            </p>
          </div>
          <button onClick={openCreateModal} className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Novo Colaborador
          </button>
        </div>

        {/* Users Grid */}
        <div className="users-grid">
          {users.map((user) => {
            const stats = authorStats[user.id];
            return (
              <div
                key={user.id}
                className={`user-card ${!user.active ? 'inactive' : ''}`}
              >
                <div className="user-card-header">
                  <div className="user-avatar-large">
                    {getUserInitials(user.name)}
                  </div>
                  <div className="user-info">
                    <h3 className="user-name">{user.name}</h3>
                    <p className="user-email">{user.email}</p>
                    <div className="user-badges">
                      <span className={`role-badge role-${user.role}`}>
                        {user.role === 'admin' ? 'Admin' : 'Autor'}
                      </span>
                      {!user.active && (
                        <span className="status-badge-inactive">Inativo</span>
                      )}
                    </div>
                  </div>
                </div>

                {stats && (
                  <div className="user-stats">
                    <div className="user-stat">
                      <span className="stat-number">{stats.total}</span>
                      <span className="stat-text">Total</span>
                    </div>
                    <div className="user-stat">
                      <span className="stat-number">{stats.published}</span>
                      <span className="stat-text">Publicados</span>
                    </div>
                    <div className="user-stat">
                      <span className="stat-number">{stats.inReview}</span>
                      <span className="stat-text">Revisao</span>
                    </div>
                  </div>
                )}

                <div className="user-card-footer">
                  <span className="user-since">
                    Desde {formatDate(user.createdAt)}
                  </span>
                  <div className="user-actions">
                    <button
                      onClick={() => openEditModal(user)}
                      className="btn btn-secondary btn-sm"
                    >
                      Editar
                    </button>
                    {user.id !== currentUser?.id && (
                      <button
                        onClick={() => handleToggleActive(user.id, user.active)}
                        className={`btn btn-sm ${user.active ? 'btn-danger' : 'btn-primary'}`}
                      >
                        {user.active ? 'Desativar' : 'Ativar'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* User Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingUser ? 'Editar Colaborador' : 'Novo Colaborador'}</h3>
              <button onClick={closeModal} className="modal-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {formErrors.general && (
                <div className="form-error-banner">{formErrors.general}</div>
              )}

              <div className="form-group">
                <label className="form-label">Nome *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${formErrors.name ? 'error' : ''}`}
                  placeholder="Nome completo"
                />
                {formErrors.name && <span className="form-error">{formErrors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${formErrors.email ? 'error' : ''}`}
                  placeholder="email@exemplo.com"
                  disabled={!!editingUser}
                />
                {formErrors.email && <span className="form-error">{formErrors.email}</span>}
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label className="form-label">Senha *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${formErrors.password ? 'error' : ''}`}
                    placeholder="Minimo 6 caracteres"
                  />
                  {formErrors.password && (
                    <span className="form-error">{formErrors.password}</span>
                  )}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Funcao *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="author">Autor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Salvando...' : editingUser ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .page-header-with-action {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
        }

        .user-card {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .user-card.inactive {
          opacity: 0.7;
        }

        .user-card-header {
          display: flex;
          gap: 16px;
          padding: 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .user-avatar-large {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 600;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .user-email {
          margin: 2px 0 8px;
          font-size: 0.8125rem;
          color: #64748b;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-badges {
          display: flex;
          gap: 8px;
        }

        .role-badge {
          display: inline-block;
          padding: 2px 8px;
          font-size: 0.6875rem;
          font-weight: 600;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .role-badge.role-admin {
          background: #dbeafe;
          color: #1e40af;
        }

        .role-badge.role-author {
          background: #f0fdf4;
          color: #166534;
        }

        .status-badge-inactive {
          display: inline-block;
          padding: 2px 8px;
          font-size: 0.6875rem;
          font-weight: 600;
          border-radius: 9999px;
          background: #fef2f2;
          color: #dc2626;
        }

        .user-stats {
          display: flex;
          padding: 16px 20px;
          background: #f8fafc;
        }

        .user-stat {
          flex: 1;
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-text {
          font-size: 0.6875rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .user-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
        }

        .user-since {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .user-actions {
          display: flex;
          gap: 8px;
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
          max-width: 440px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
        }

        .modal-close {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
        }

        .modal-close:hover {
          color: #1e293b;
        }

        .modal-content form {
          padding: 24px;
        }

        .form-error-banner {
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 0.875rem;
          margin-bottom: 20px;
        }

        .form-input.error,
        .form-select.error {
          border-color: #dc2626;
        }

        .form-input:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        @media (max-width: 768px) {
          .page-header-with-action {
            flex-direction: column;
            gap: 16px;
          }

          .users-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
