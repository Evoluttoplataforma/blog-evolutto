import React, { useState, useEffect } from 'react';
import AuthProvider, { useAuth } from './AuthProvider';
import AdminDashboard from './AdminDashboard';
import ArticlesManager from './ArticlesManager';
import UsersManager from './UsersManager';
import PostEditor from './PostEditor';

// Login específico para o admin-full
function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, ADMIN_EMAIL } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Reload para verificar se é admin
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Credenciais invalidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <img src="/images/logo-evolutto.png" alt="Evolutto" className="admin-login-logo" />
          <h1>Admin Evolutto</h1>
          <p>Acesso restrito ao administrador</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha do administrador"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/registro">Portal do Colaborador</a>
          <span>|</span>
          <a href="/blog">Voltar ao Blog</a>
        </div>
      </div>

      <style>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        }

        .admin-login-card {
          width: 100%;
          max-width: 400px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          padding: 40px;
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .admin-login-logo {
          height: 40px;
          margin-bottom: 24px;
        }

        .admin-login-header h1 {
          margin: 0 0 8px;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .admin-login-header p {
          margin: 0;
          font-size: 0.875rem;
          color: #64748b;
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .admin-login-error {
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 0.875rem;
        }

        .admin-login-form .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .admin-login-form label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .admin-login-form input {
          padding: 12px 16px;
          font-size: 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          outline: none;
          transition: all 0.15s ease;
        }

        .admin-login-form input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .admin-login-btn {
          padding: 14px 24px;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .admin-login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .admin-login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .admin-login-footer {
          margin-top: 24px;
          text-align: center;
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .admin-login-footer a {
          font-size: 0.875rem;
          color: #64748b;
          text-decoration: none;
        }

        .admin-login-footer a:hover {
          color: #6366f1;
        }

        .admin-login-footer span {
          color: #d1d5db;
        }
      `}</style>
    </div>
  );
}

// Tela de acesso negado
function AccessDenied() {
  const { logout } = useAuth();

  return (
    <div className="access-denied">
      <div className="access-denied-card">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
        </svg>
        <h1>Acesso Restrito</h1>
        <p>Esta area e exclusiva para administradores.</p>
        <div className="access-denied-actions">
          <a href="/registro/dashboard" className="btn-secondary">
            Ir para Portal do Colaborador
          </a>
          <button onClick={() => { logout(); window.location.href = '/admin-full'; }} className="btn-link">
            Entrar com outra conta
          </button>
        </div>
      </div>

      <style>{`
        .access-denied {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: #f8fafc;
        }

        .access-denied-card {
          text-align: center;
          max-width: 400px;
        }

        .access-denied svg {
          color: #ef4444;
          margin-bottom: 24px;
        }

        .access-denied h1 {
          margin: 0 0 12px;
          font-size: 1.5rem;
          color: #1e293b;
        }

        .access-denied p {
          margin: 0 0 32px;
          color: #64748b;
        }

        .access-denied-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-secondary {
          padding: 12px 24px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #1e293b;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .btn-secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .btn-link {
          background: none;
          border: none;
          color: #6366f1;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .btn-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

function AppRouter() {
  const [currentPath, setCurrentPath] = useState('');
  const [postId, setPostId] = useState(null);
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    // Get initial path
    const path = window.location.pathname;
    updatePath(path);

    // Listen for navigation
    const handlePopState = () => {
      updatePath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function updatePath(path) {
    // Remove /admin-full prefix
    const cleanPath = path.replace(/^\/admin-full\/?/, '') || '';
    setCurrentPath(cleanPath);

    // Extract post ID for article pages
    const articleMatch = cleanPath.match(/^artigo\/(.+)$/);
    if (articleMatch) {
      setPostId(articleMatch[1]);
    } else {
      setPostId(null);
    }
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <style>{`
          .app-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e2e8f0;
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Not authenticated - show login
  if (!user) {
    return <AdminLogin />;
  }

  // Authenticated but not admin - show access denied
  if (!isAdmin) {
    return <AccessDenied />;
  }

  // Admin authenticated - show admin content
  return (
    <>
      {(!currentPath || currentPath === 'dashboard') && <AdminDashboard />}
      {currentPath === 'artigos' && <ArticlesManager />}
      {currentPath === 'colaboradores' && <UsersManager />}
      {currentPath.startsWith('artigo/') && postId && <PostEditor postId={postId} />}
    </>
  );
}

export default function AdminFullApp() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
