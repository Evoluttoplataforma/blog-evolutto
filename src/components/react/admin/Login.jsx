import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import '../../../styles/admin.css';

export const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                if (!formData.name.trim()) {
                    setError('Por favor, digite seu nome.');
                    setLoading(false);
                    return;
                }
                await register(formData.email, formData.password, formData.name);
            }
            navigate('/admin');
        } catch (err) {
            console.error('Auth error:', err);
            if (err.code === 'auth/user-not-found') {
                setError('Usuário não encontrado.');
            } else if (err.code === 'auth/wrong-password') {
                setError('Senha incorreta.');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('Este e-mail já está em uso.');
            } else if (err.code === 'auth/weak-password') {
                setError('A senha deve ter pelo menos 6 caracteres.');
            } else if (err.code === 'auth/invalid-email') {
                setError('E-mail inválido.');
            } else if (err.code === 'auth/pending-approval') {
                setError(err.message || 'Sua conta está aguardando aprovação do administrador.');
                setSuccess(true);
            } else if (err.code === 'auth/account-rejected') {
                setError('Sua conta foi rejeitada. Entre em contato com o administrador.');
            } else if (err.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.' ||
                       err.code === 'auth/invalid-api-key' ||
                       err.message?.includes('API key') ||
                       err.message?.includes('invalid-api-key')) {
                setError('Firebase não configurado. Configure as credenciais em src/config/firebase.js (veja INSTRUCOES-CMS.md).');
            } else if (err.code === 'auth/network-request-failed') {
                setError('Erro de conexão. Verifique sua internet.');
            } else if (err.code === 'auth/invalid-credential') {
                setError('E-mail ou senha incorretos.');
            } else {
                setError('Erro ao autenticar. Verifique suas credenciais.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-auth-page">
            <div className="auth-container">
                <motion.div
                    className="auth-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="auth-header">
                        <Link to="/" className="auth-logo">
                            <span className="logo-text">EVOLUTTO</span>
                            <span className="logo-dot">.</span>
                        </Link>
                        <h1 className="auth-title">
                            {isLogin ? 'Entrar no Painel' : 'Criar Conta'}
                        </h1>
                        <p className="auth-subtitle">
                            {isLogin
                                ? 'Acesse o painel de administração do blog'
                                : 'Crie sua conta para começar a publicar'
                            }
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            className={`auth-error ${success ? 'auth-success' : ''}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="form-field">
                                <label htmlFor="name">Nome completo</label>
                                <div className="input-wrapper">
                                    <User size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Seu nome"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-field">
                            <label htmlFor="email">E-mail</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="password">Senha</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="btn-loading">Carregando...</span>
                            ) : (
                                <>
                                    {isLogin ? 'Entrar' : 'Criar Conta'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                            <button
                                type="button"
                                className="auth-toggle"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                    setSuccess(false);
                                }}
                            >
                                {isLogin ? 'Criar conta' : 'Fazer login'}
                            </button>
                        </p>
                    </div>

                    <div className="auth-back">
                        <Link to="/">← Voltar ao blog</Link>
                    </div>
                </motion.div>
            </div>

            <div className="auth-bg">
                <div className="auth-orb orb-1"></div>
                <div className="auth-orb orb-2"></div>
                <div className="auth-orb orb-3"></div>
            </div>
        </div>
    );
};
