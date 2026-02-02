import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../../contexts/AuthContext';
import { Login } from './Login';
import { Dashboard } from './Dashboard';
import { ArticleEditor } from './ArticleEditor';
import { TeamManagement } from './TeamManagement';
import '../../../styles/admin.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading, userProfile } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (userProfile?.status === 'pending') {
    return (
      <div className="admin-pending">
        <h2>Aguardando Aprovacao</h2>
        <p>Sua conta esta aguardando aprovacao do administrador.</p>
      </div>
    );
  }

  if (userProfile?.status === 'rejected') {
    return (
      <div className="admin-rejected">
        <h2>Acesso Negado</h2>
        <p>Sua solicitacao de acesso foi negada.</p>
      </div>
    );
  }

  return children;
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/articles" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/articles/new" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
      <Route path="/articles/:id" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
      <Route path="/team" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/admin">
        <AdminRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
