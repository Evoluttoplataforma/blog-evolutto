import { useState, useEffect } from 'react';
import { getAllArticles, getArticleBySlug, incrementViews } from '../services/articleService';
import localArticles from '../data/articles.json';

// Preparar artigos locais com formato compatível
const preparedLocalArticles = localArticles.map(article => ({
    ...article,
    docId: article.id,
    slug: article.id,
    isLocal: true
}));

// Função para encontrar artigo local
const findLocalArticle = (idOrSlug) => {
    return preparedLocalArticles.find(
        a => a.id === idOrSlug || a.slug === idOrSlug
    );
};

// Hook to fetch all articles (carrega local primeiro, depois Firebase)
export const useArticles = () => {
    // Inicializa com artigos locais imediatamente (sem loading)
    const [articles, setArticles] = useState(preparedLocalArticles);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFirebaseArticles = async () => {
            try {
                // Tentar buscar do Firebase em background
                const firebaseArticles = await getAllArticles(false);

                if (firebaseArticles && firebaseArticles.length > 0) {
                    // Combinar Firebase (primeiro) com locais
                    setArticles([
                        ...firebaseArticles,
                        ...preparedLocalArticles
                    ]);
                }
            } catch (err) {
                // Silenciosamente falha - artigos locais já estão carregados
                console.log('Firebase não configurado, usando artigos locais');
            }
        };

        // Buscar Firebase em background sem bloquear
        fetchFirebaseArticles();
    }, []);

    return { articles, loading, error };
};

// Hook to fetch a single article by ID or slug
export const useArticle = (idOrSlug) => {
    // Tentar encontrar artigo local imediatamente
    const localArticle = idOrSlug ? findLocalArticle(idOrSlug) : null;

    // Se encontrou local, inicializa com ele (sem loading)
    const [article, setArticle] = useState(localArticle);
    const [loading, setLoading] = useState(!localArticle && !!idOrSlug);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Se já tem artigo local, não precisa buscar
        if (localArticle) {
            setArticle(localArticle);
            setLoading(false);
            return;
        }

        // Se não tem ID, não faz nada
        if (!idOrSlug) {
            setLoading(false);
            return;
        }

        // Buscar no Firebase apenas se não encontrou localmente
        const fetchFromFirebase = async () => {
            try {
                const firebaseArticle = await getArticleBySlug(idOrSlug);

                if (firebaseArticle) {
                    setArticle(firebaseArticle);
                    // Incrementar views em background
                    incrementViews(firebaseArticle.docId).catch(() => {});
                } else {
                    setError('Artigo não encontrado');
                }
            } catch (err) {
                console.log('Firebase não disponível');
                setError('Artigo não encontrado');
            } finally {
                setLoading(false);
            }
        };

        fetchFromFirebase();
    }, [idOrSlug, localArticle]);

    return { article, loading, error };
};
