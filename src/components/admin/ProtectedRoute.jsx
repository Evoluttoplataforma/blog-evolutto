import React from 'react';
import { useAuth } from './AuthProvider';

export default function ProtectedRoute({
  children,
  requiredRole = null,
  redirectUrl = '/registro'
}) {
  const { user, loading, error, isAuthenticated, isAdmin } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="protected-loading">
        <div className="loading-spinner"></div>
        <p>Verificando autenticacao...</p>

        <style>{`
          .protected-loading {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            background: #f8fafc;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e2e8f0;
            border-top-color: #0ea5e9;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          .protected-loading p {
            color: #64748b;
            font-size: 0.875rem;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = redirectUrl;
    }
    return (
      <div className="protected-redirect">
        <p>Redirecionando para login...</p>

        <style>{`
          .protected-redirect {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
          }

          .protected-redirect p {
            color: #64748b;
            font-size: 0.875rem;
          }
        `}</style>
      </div>
    );
  }

  // Check role requirement
  if (requiredRole === 'admin' && !isAdmin) {
    return (
      <div className="protected-denied">
        <div className="denied-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
        </div>
        <h1>Acesso Negado</h1>
        <p>Voce nao tem permissao para acessar esta pagina.</p>
        <a href="/registro/dashboard" className="back-link">
          Voltar ao Dashboard
        </a>

        <style>{`
          .protected-denied {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            background: #f8fafc;
            padding: 24px;
            text-align: center;
          }

          .denied-icon {
            color: #ef4444;
          }

          .protected-denied h1 {
            margin: 0;
            font-size: 1.5rem;
            color: #1e293b;
          }

          .protected-denied p {
            margin: 0;
            color: #64748b;
          }

          .back-link {
            margin-top: 8px;
            color: #0ea5e9;
            text-decoration: none;
            font-weight: 500;
          }

          .back-link:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }

  // Show error if any
  if (error) {
    return (
      <div className="protected-error">
        <div className="error-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h1>Erro de Autenticacao</h1>
        <p>{error}</p>
        <a href="/registro" className="back-link">
          Voltar ao Login
        </a>

        <style>{`
          .protected-error {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            background: #f8fafc;
            padding: 24px;
            text-align: center;
          }

          .error-icon {
            color: #f59e0b;
          }

          .protected-error h1 {
            margin: 0;
            font-size: 1.5rem;
            color: #1e293b;
          }

          .protected-error p {
            margin: 0;
            color: #64748b;
            max-width: 400px;
          }

          .back-link {
            margin-top: 8px;
            color: #0ea5e9;
            text-decoration: none;
            font-weight: 500;
          }

          .back-link:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }

  // Authenticated and authorized - render children
  return children;
}
