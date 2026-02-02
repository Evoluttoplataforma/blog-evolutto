import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, query, where, updateDoc, orderBy } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

// Admin master - tem acesso total e aprova outros usuarios
const ADMIN_MASTER_EMAIL = 'rodrigo.souza@templum.com.br';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                // Get user profile from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data());
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);

        // Verificar se o usuario esta aprovado
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.status === 'pending') {
                await signOut(auth);
                throw { code: 'auth/pending-approval', message: 'Sua conta esta aguardando aprovacao.' };
            }
            if (userData.status === 'rejected') {
                await signOut(auth);
                throw { code: 'auth/account-rejected', message: 'Sua conta foi rejeitada.' };
            }
        }

        return result.user;
    };

    const register = async (email, password, displayName) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        // Update display name
        await updateProfile(result.user, { displayName });

        // Verificar se e o admin master
        const isAdminMaster = email.toLowerCase() === ADMIN_MASTER_EMAIL.toLowerCase();

        // Create user profile in Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
            uid: result.user.uid,
            email,
            displayName,
            role: isAdminMaster ? 'admin' : 'author', // admin master tem role admin automaticamente
            status: isAdminMaster ? 'approved' : 'pending', // admin master e aprovado automaticamente
            articlesCount: 0,
            createdAt: new Date().toISOString(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3363ff&color=fff`
        });

        // Se nao for admin master, fazer logout e mostrar mensagem
        if (!isAdminMaster) {
            await signOut(auth);
            throw { code: 'auth/pending-approval', message: 'Conta criada! Aguarde a aprovacao do administrador.' };
        }

        return result.user;
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setUserProfile(null);
    };

    // Verificar se e admin master
    const isAdminMaster = () => {
        return user?.email?.toLowerCase() === ADMIN_MASTER_EMAIL.toLowerCase();
    };

    // Verificar se e admin (admin master ou admin aprovado)
    const isAdmin = () => {
        return isAdminMaster() || userProfile?.role === 'admin';
    };

    // Verificar se pode publicar (usuario aprovado)
    const canPublish = () => {
        return userProfile?.status === 'approved';
    };

    // Buscar usuarios pendentes de aprovacao
    const getPendingUsers = async () => {
        const q = query(
            collection(db, 'users'),
            where('status', '==', 'pending'),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    // Buscar todos os usuarios (para admin)
    const getAllUsers = async () => {
        const q = query(
            collection(db, 'users'),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    // Aprovar usuario
    const approveUser = async (userId) => {
        if (!isAdminMaster()) {
            throw new Error('Apenas o administrador master pode aprovar usuarios.');
        }
        await updateDoc(doc(db, 'users', userId), {
            status: 'approved',
            approvedAt: new Date().toISOString(),
            approvedBy: user.uid
        });
    };

    // Rejeitar usuario
    const rejectUser = async (userId) => {
        if (!isAdminMaster()) {
            throw new Error('Apenas o administrador master pode rejeitar usuarios.');
        }
        await updateDoc(doc(db, 'users', userId), {
            status: 'rejected',
            rejectedAt: new Date().toISOString(),
            rejectedBy: user.uid
        });
    };

    // Alterar role do usuario
    const updateUserRole = async (userId, newRole) => {
        if (!isAdminMaster()) {
            throw new Error('Apenas o administrador master pode alterar roles.');
        }
        await updateDoc(doc(db, 'users', userId), {
            role: newRole,
            updatedAt: new Date().toISOString()
        });
    };

    // Incrementar contador de artigos do usuario
    const incrementUserArticleCount = async (userId) => {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const currentCount = userDoc.data().articlesCount || 0;
            await updateDoc(userRef, {
                articlesCount: currentCount + 1
            });
        }
    };

    const value = {
        user,
        userProfile,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdminMaster,
        isAdmin,
        canPublish,
        getPendingUsers,
        getAllUsers,
        approveUser,
        rejectUser,
        updateUserRole,
        incrementUserArticleCount,
        ADMIN_MASTER_EMAIL
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
