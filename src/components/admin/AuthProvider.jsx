import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

// Admin master credentials
const ADMIN_EMAIL = 'rodrigo.souza@templum.com.br';
const ADMIN_PASSWORD = 'Templum@2026!';

// Storage keys
const USERS_KEY = 'blog_users';
const CURRENT_USER_KEY = 'blog_current_user';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper functions for localStorage
function getStoredUsers() {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

function saveCurrentUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing session
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);

    // Check if it's the admin
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      const adminUser = {
        id: 'admin-master',
        email: ADMIN_EMAIL,
        name: 'Administrador',
        role: 'admin',
        active: true,
        createdAt: new Date().toISOString()
      };
      setUser(adminUser);
      saveCurrentUser(adminUser);
      return adminUser;
    }

    // Check regular users
    const users = getStoredUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      throw new Error('Usuario nao encontrado.');
    }

    if (foundUser.password !== password) {
      throw new Error('Senha incorreta.');
    }

    if (!foundUser.active) {
      throw new Error('Conta desativada.');
    }

    const userSession = { ...foundUser };
    delete userSession.password; // Don't store password in session

    setUser(userSession);
    saveCurrentUser(userSession);
    return userSession;
  };

  // Register function
  const register = async (email, password, name) => {
    setError(null);

    const users = getStoredUsers();

    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Este email ja esta cadastrado.');
    }

    // Check if trying to register as admin
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      throw new Error('Este email nao pode ser usado para cadastro.');
    }

    const newUser = {
      id: 'user-' + Date.now(),
      email,
      password,
      name,
      role: 'author', // All registered users can publish
      active: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Auto-login after registration
    const userSession = { ...newUser };
    delete userSession.password;

    setUser(userSession);
    saveCurrentUser(userSession);
    return userSession;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    saveCurrentUser(null);
    setError(null);
  };

  // Get all users (for admin)
  const getAllUsers = () => {
    return getStoredUsers().map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
  };

  // Update user (for admin)
  const updateUser = (userId, updates) => {
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      saveUsers(users);
    }
  };

  // Delete user (for admin)
  const deleteUser = (userId) => {
    const users = getStoredUsers().filter(u => u.id !== userId);
    saveUsers(users);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isAuthor: user?.role === 'author' || user?.role === 'admin',
    login,
    register,
    logout,
    getAllUsers,
    updateUser,
    deleteUser,
    ADMIN_EMAIL
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
