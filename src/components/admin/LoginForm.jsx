import React, { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function LoginForm({ redirectUrl = '/registro/dashboard' }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          throw new Error('Por favor, informe seu nome.');
        }
        if (password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres.');
        }
        await register(email, password, name);
        setSuccess('Conta criada com sucesso!');
      } else {
        await login(email, password);
      }
      // Redirect after successful login/register
      window.location.href = redirectUrl;
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Erro ao processar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setSuccess('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/images/logo-evolutto.png" alt="Evolutto" className="login-logo" />
          <h1>{isRegister ? 'Criar Conta' : 'Portal do Colaborador'}</h1>
          <p>{isRegister ? 'Cadastre-se para publicar artigos' : 'Acesse sua conta para gerenciar artigos'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="login-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              {success}
            </div>
          )}

          {isRegister && (
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required={isRegister}
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isRegister ? 'Minimo 6 caracteres' : 'Sua senha'}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                {isRegister ? 'Criando conta...' : 'Entrando...'}
              </>
            ) : (
              isRegister ? 'Criar Conta' : 'Entrar'
            )}
          </button>
        </form>

        <div className="login-toggle">
          <button type="button" onClick={toggleMode} className="toggle-btn">
            {isRegister ? 'Ja tem conta? Faca login' : 'Nao tem conta? Cadastre-se'}
          </button>
        </div>

        <div className="login-footer">
          <a href="/blog">Voltar ao Blog</a>
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          padding: 40px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-logo {
          height: 40px;
          margin-bottom: 24px;
        }

        .login-header h1 {
          margin: 0 0 8px;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .login-header p {
          margin: 0;
          font-size: 0.875rem;
          color: #64748b;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 0.875rem;
        }

        .login-success {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          color: #16a34a;
          font-size: 0.875rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .form-group input {
          padding: 12px 16px;
          font-size: 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          outline: none;
          transition: all 0.15s ease;
        }

        .form-group input:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .form-group input:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        .login-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          background: #0ea5e9;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .login-btn:hover:not(:disabled) {
          background: #0284c7;
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .login-toggle {
          margin-top: 20px;
          text-align: center;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: #0ea5e9;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .toggle-btn:hover {
          color: #0284c7;
          text-decoration: underline;
        }

        .login-footer {
          margin-top: 24px;
          text-align: center;
        }

        .login-footer a {
          font-size: 0.875rem;
          color: #64748b;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .login-footer a:hover {
          color: #0ea5e9;
        }
      `}</style>
    </div>
  );
}
