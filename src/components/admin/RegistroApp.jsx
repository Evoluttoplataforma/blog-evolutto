import React, { useState, useEffect } from 'react';
import AuthProvider, { useAuth } from './AuthProvider';
import ProtectedRoute from './ProtectedRoute';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import PostEditor from './PostEditor';

function AppRouter() {
  const [currentPath, setCurrentPath] = useState('');
  const [postId, setPostId] = useState(null);
  const { isAuthenticated, loading } = useAuth();

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
    // Remove /registro prefix
    const cleanPath = path.replace(/^\/registro\/?/, '') || '';
    setCurrentPath(cleanPath);

    // Extract post ID for edit pages
    const editMatch = cleanPath.match(/^editar\/(.+)$/);
    if (editMatch) {
      setPostId(editMatch[1]);
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
            border-top-color: #0ea5e9;
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

  // Login page (no auth required)
  if (!currentPath || currentPath === 'login') {
    if (isAuthenticated) {
      window.location.href = '/registro/dashboard';
      return null;
    }
    return <LoginForm redirectUrl="/registro/dashboard" />;
  }

  // Protected routes
  return (
    <ProtectedRoute redirectUrl="/registro">
      {currentPath === 'dashboard' && <Dashboard />}
      {currentPath === 'novo' && <PostEditor />}
      {currentPath.startsWith('editar/') && postId && <PostEditor postId={postId} />}
      {!['dashboard', 'novo'].includes(currentPath) && !currentPath.startsWith('editar/') && (
        <Dashboard />
      )}
    </ProtectedRoute>
  );
}

export default function RegistroApp() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
