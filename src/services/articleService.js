import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    orderBy,
    where,
    serverTimestamp
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

const ARTICLES_COLLECTION = 'articles';

// Generate slug from title
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

// Upload image to Firebase Storage
export const uploadImage = async (file, folder = 'articles') => {
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}-${file.name}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return {
        url: downloadURL,
        path: fileName
    };
};

// Delete image from Firebase Storage
export const deleteImage = async (imagePath) => {
    if (!imagePath) return;
    try {
        const storageRef = ref(storage, imagePath);
        await deleteObject(storageRef);
    } catch (error) {
        console.error('Error deleting image:', error);
    }
};

// Create a new article
export const createArticle = async (articleData, authorData) => {
    const slug = generateSlug(articleData.title);
    const now = new Date().toISOString();

    const article = {
        ...articleData,
        slug,
        id: slug,
        author: {
            id: authorData.uid,
            name: authorData.displayName || 'Evolutto Team',
            avatar: authorData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorData.displayName || 'E')}&background=3363ff&color=fff`,
            role: authorData.role || 'Autor'
        },
        status: articleData.status || 'draft', // draft, published, scheduled
        createdAt: now,
        updatedAt: now,
        publishedAt: articleData.status === 'published' ? now : null,
        views: 0,
        likes: 0
    };

    const docRef = await addDoc(collection(db, ARTICLES_COLLECTION), article);
    return { id: docRef.id, ...article };
};

// Update an existing article
export const updateArticle = async (docId, articleData) => {
    const articleRef = doc(db, ARTICLES_COLLECTION, docId);
    const now = new Date().toISOString();

    const updates = {
        ...articleData,
        slug: generateSlug(articleData.title),
        id: generateSlug(articleData.title),
        updatedAt: now
    };

    // If changing to published and wasn't published before
    if (articleData.status === 'published' && !articleData.publishedAt) {
        updates.publishedAt = now;
    }

    await updateDoc(articleRef, updates);
    return { docId, ...updates };
};

// Delete an article
export const deleteArticle = async (docId, imagePath = null) => {
    // Delete cover image if exists
    if (imagePath) {
        await deleteImage(imagePath);
    }

    await deleteDoc(doc(db, ARTICLES_COLLECTION, docId));
};

// Get a single article by document ID
export const getArticle = async (docId) => {
    const articleDoc = await getDoc(doc(db, ARTICLES_COLLECTION, docId));
    if (articleDoc.exists()) {
        return { docId: articleDoc.id, ...articleDoc.data() };
    }
    return null;
};

// Get a single article by slug
export const getArticleBySlug = async (slug) => {
    const q = query(
        collection(db, ARTICLES_COLLECTION),
        where('slug', '==', slug)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { docId: doc.id, ...doc.data() };
    }
    return null;
};

// Get all articles
export const getAllArticles = async (includeUnpublished = false) => {
    let q;

    if (includeUnpublished) {
        q = query(
            collection(db, ARTICLES_COLLECTION),
            orderBy('createdAt', 'desc')
        );
    } else {
        q = query(
            collection(db, ARTICLES_COLLECTION),
            where('status', '==', 'published'),
            orderBy('publishedAt', 'desc')
        );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
};

// Get articles by category
export const getArticlesByCategory = async (category) => {
    const q = query(
        collection(db, ARTICLES_COLLECTION),
        where('status', '==', 'published'),
        where('categories', 'array-contains', category),
        orderBy('publishedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
};

// Get articles by author
export const getArticlesByAuthor = async (authorId) => {
    const q = query(
        collection(db, ARTICLES_COLLECTION),
        where('author.id', '==', authorId),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
};

// Increment article views
export const incrementViews = async (docId) => {
    const articleRef = doc(db, ARTICLES_COLLECTION, docId);
    const articleDoc = await getDoc(articleRef);

    if (articleDoc.exists()) {
        const currentViews = articleDoc.data().views || 0;
        await updateDoc(articleRef, { views: currentViews + 1 });
    }
};

// Available categories
export const CATEGORIES = [
    { value: 'digitalizacao', label: 'Digitalização' },
    { value: 'consultoria', label: 'Consultoria' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'vendas', label: 'Vendas' },
    { value: 'tecnologia', label: 'Tecnologia' },
    { value: 'gestao', label: 'Gestão' },
    { value: 'produtividade', label: 'Produtividade' },
    { value: 'inovacao', label: 'Inovação' },
    { value: 'cases', label: 'Cases de Sucesso' },
    { value: 'geral', label: 'Geral' }
];
