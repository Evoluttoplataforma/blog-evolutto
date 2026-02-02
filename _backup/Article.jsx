import React, { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Footer } from '../components/LayoutItems';
import { Modal } from '../components/Modal';
import { NewsletterForm, LeadMagnetForm } from '../components/LeadForm';
import { useArticle, useArticles } from '../hooks/useArticles';
import {
    Calendar,
    Share2,
    Bookmark,
    ArrowLeft,
    Clock,
    ChevronRight,
    ArrowRight,
    Heart,
    Copy,
    Twitter,
    Linkedin,
    Facebook,
    Download,
    Star,
    TrendingUp,
    CheckCircle,
    Loader
} from 'lucide-react';
import './Article.css';

// Helper function to get image URL
const getImageUrl = (coverImage, fallback) => {
    if (!coverImage) return fallback;
    // If it's a full URL, use it directly
    if (coverImage.startsWith('http')) return coverImage;
    // If it's a relative path to public folder
    if (coverImage.startsWith('/')) return coverImage;
    // Otherwise, try the images folder or use fallback
    return `/images/${coverImage}`;
};

export const Article = () => {
    const { id } = useParams();
    const { article, loading, error } = useArticle(id);
    const { articles } = useArticles();

    const [progress, setProgress] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false);
    const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const handleScroll = () => {
            const articleEl = document.querySelector('.article-body-premium');
            if (articleEl) {
                const rect = articleEl.getBoundingClientRect();
                const articleTop = rect.top + window.scrollY;
                const articleHeight = articleEl.offsetHeight;
                const windowHeight = window.innerHeight;
                const scrollY = window.scrollY;

                const progressValue = Math.min(
                    Math.max((scrollY - articleTop + windowHeight * 0.3) / articleHeight * 100, 0),
                    100
                );
                setProgress(progressValue);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [id]);

    // Handle newsletter form submission from sidebar
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        setIsNewsletterOpen(true);
    };

    // Loading state
    if (loading) {
        return (
            <div className="article-page">
                <div className="loading-container">
                    <Loader className="spinner" size={40} />
                    <p>Carregando artigo...</p>
                </div>
            </div>
        );
    }

    // Error or not found
    if (error || !article) {
        return <Navigate to="/" />;
    }

    // Get related articles
    const relatedArticles = articles
        .filter(a => (a.docId || a.id) !== (article.docId || article.id) &&
            a.categories?.some(c => article.categories?.includes(c)))
        .slice(0, 3);

    // Get all categories from articles
    const CATEGORIES = [...new Set(articles.flatMap(a => a.categories || []))]
        .map(c => c.charAt(0).toUpperCase() + c.slice(1));

    const publishDate = new Date(article.publishedAt || article.date || article.createdAt).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Get author info
    const authorName = article.author?.name || 'Evolutto Team';
    const authorRole = article.author?.role || 'Inovação & Estratégia';
    const authorAvatar = article.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100';

    // Helper to get article link
    const getArticleLink = (art) => {
        return `/article/${art.slug || art.id}`;
    };

    return (
        <div className="article-page">
            {/* Progress Bar */}
            <div className="reading-progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <main className="article-main">
                <div className="container">
                    {/* Back Navigation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="back-nav"
                    >
                        <Link to="/" className="back-link">
                            <ArrowLeft size={16} /> Voltar ao Blog
                        </Link>
                    </motion.div>

                    <div className="article-layout">
                        {/* Main Article Content */}
                        <article className="article-content">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                {/* Article Header */}
                                <header className="article-header">
                                    <div className="article-category-wrapper">
                                        <span className="badge">{article.categories?.[0] || 'Geral'}</span>
                                        <span className="reading-time">
                                            <Clock size={14} /> {article.readTime || '5 min de leitura'}
                                        </span>
                                    </div>
                                    <h1 className="article-title">{article.title}</h1>

                                    <div className="article-meta-bar">
                                        <div className="author-info">
                                            <div className="author-avatar">
                                                <img
                                                    src={authorAvatar}
                                                    alt={authorName}
                                                    width={48}
                                                    height={48}
                                                    loading="eager"
                                                    decoding="async"
                                                />
                                            </div>
                                            <div className="author-details">
                                                <span className="author-name">{authorName}</span>
                                                <span className="author-role">{authorRole}</span>
                                            </div>
                                        </div>
                                        <div className="meta-right">
                                            <span className="publish-date">
                                                <Calendar size={14} /> {publishDate}
                                            </span>
                                        </div>
                                    </div>
                                </header>

                                {/* Featured Image */}
                                <div className="article-featured-image">
                                    <img
                                        src={getImageUrl(article.coverImage, "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200")}
                                        alt={article.title}
                                        width={1200}
                                        height={630}
                                        loading="eager"
                                        decoding="async"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200'; }}
                                    />
                                </div>

                                {/* Article Body */}
                                <div className="article-body-premium">
                                    {article.content ? (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {article.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <div dangerouslySetInnerHTML={{ __html: article.contentHtml || '' }} />
                                    )}
                                </div>

                                {/* Article Footer */}
                                <footer className="article-footer">
                                    {/* Tags */}
                                    <div className="article-tags">
                                        <span className="tags-label">Categorias:</span>
                                        <div className="tags-list">
                                            {(article.categories || []).map(tag => (
                                                <Link key={tag} to={`/category/${tag.toLowerCase()}`} className="tag-item">
                                                    #{tag}
                                                </Link>
                                            ))}
                                            {(article.tags || []).map(tag => (
                                                <span key={tag} className="tag-item">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Share & Actions */}
                                    <div className="article-actions">
                                        <div className="share-section">
                                            <span className="share-label">Compartilhar:</span>
                                            <div className="share-buttons">
                                                <button className="share-btn twitter">
                                                    <Twitter size={18} />
                                                </button>
                                                <button className="share-btn linkedin">
                                                    <Linkedin size={18} />
                                                </button>
                                                <button className="share-btn facebook">
                                                    <Facebook size={18} />
                                                </button>
                                                <button className="share-btn copy">
                                                    <Copy size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="action-buttons">
                                            <button
                                                className={`action-btn ${isLiked ? 'active' : ''}`}
                                                onClick={() => setIsLiked(!isLiked)}
                                            >
                                                <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                                                <span>{isLiked ? (article.likes || 248) + 1 : (article.likes || 248)}</span>
                                            </button>
                                            <button
                                                className={`action-btn ${isBookmarked ? 'active' : ''}`}
                                                onClick={() => setIsBookmarked(!isBookmarked)}
                                            >
                                                <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                                                <span>Salvar</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Author Card */}
                                    <div className="author-card">
                                        <div className="author-card-avatar">
                                            <img
                                                src={authorAvatar}
                                                alt={authorName}
                                                width={80}
                                                height={80}
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </div>
                                        <div className="author-card-info">
                                            <span className="author-label">Escrito por</span>
                                            <h4 className="author-card-name">{authorName}</h4>
                                            <p className="author-card-bio">
                                                {article.author?.bio || 'Especialistas em digitalização de consultorias, trazendo insights valiosos para escalar seu negócio com tecnologia e inteligência.'}
                                            </p>
                                        </div>
                                    </div>
                                </footer>

                                {/* Related Articles */}
                                {relatedArticles.length > 0 && (
                                    <section className="related-articles">
                                        <h3 className="related-title">Artigos Relacionados</h3>
                                        <div className="related-grid">
                                            {relatedArticles.map(rel => (
                                                <Link key={rel.docId || rel.id} to={getArticleLink(rel)} className="related-card">
                                                    <div className="related-image">
                                                        <img
                                                            src={getImageUrl(rel.coverImage, "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400")}
                                                            alt={rel.title}
                                                            width={400}
                                                            height={200}
                                                            loading="lazy"
                                                            decoding="async"
                                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400'; }}
                                                        />
                                                    </div>
                                                    <div className="related-content">
                                                        <span className="related-category">{rel.categories?.[0] || 'Geral'}</span>
                                                        <h4 className="related-card-title">{rel.title}</h4>
                                                        <span className="related-meta">
                                                            <Clock size={12} /> {rel.readTime || '5 min'}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </motion.div>
                        </article>

                        {/* Sidebar */}
                        <aside className="article-sidebar">
                            <div className="sticky-sidebar">
                                {/* Isca - CTA E-book (Topo da sidebar) */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="sidebar-premium-banner sidebar-cta-ebook"
                                    onClick={() => setIsLeadMagnetOpen(true)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="premium-banner-bg"></div>
                                    <div className="premium-banner-content">
                                        <div className="premium-badge">E-book Gratuito</div>
                                        <h4>Escale sua Consultoria</h4>
                                        <p>Baixe agora e aprenda como digitalizar sua consultoria e aumentar seu faturamento.</p>
                                        <ul className="premium-features">
                                            <li><CheckCircle size={14} /> Estratégias de digitalização</li>
                                            <li><CheckCircle size={14} /> Aumento de faturamento</li>
                                            <li><CheckCircle size={14} /> Cases de sucesso reais</li>
                                        </ul>
                                        <button className="btn btn-white btn-sm w-full">
                                            <Download size={14} /> Baixar grátis
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Newsletter Widget */}
                                <div className="sidebar-widget newsletter-widget">
                                    <div className="widget-icon">
                                        <Star size={20} />
                                    </div>
                                    <h4 className="widget-title">Newsletter</h4>
                                    <p className="widget-description">
                                        Receba os melhores conteúdos sobre tecnologia e inovação.
                                    </p>
                                    <form className="sidebar-form" onSubmit={handleNewsletterSubmit}>
                                        <input type="email" placeholder="Seu melhor e-mail" required />
                                        <button type="submit" className="btn btn-primary btn-sm w-full">
                                            Inscrever-se Gratuitamente
                                        </button>
                                    </form>
                                </div>

                                {/* Related Posts Sidebar Widget */}
                                {relatedArticles.length > 0 && (
                                    <div className="sidebar-widget related-posts-widget">
                                        <h4 className="widget-title">Artigos Relacionados</h4>
                                        <div className="sidebar-related-list">
                                            {relatedArticles.slice(0, 3).map(rel => (
                                                <Link key={rel.docId || rel.id} to={getArticleLink(rel)} className="sidebar-related-item">
                                                    <div className="sidebar-related-image">
                                                        <img src={getImageUrl(rel.coverImage, "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=150")} alt={rel.title} />
                                                    </div>
                                                    <div className="sidebar-related-info">
                                                        <h5 className="sidebar-related-title">{rel.title}</h5>
                                                        <span className="sidebar-related-date">{new Date(rel.date).toLocaleDateString('pt-BR')}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Categories Widget */}
                                <div className="sidebar-widget categories-widget">
                                    <h4 className="widget-title">Categorias</h4>
                                    <ul className="category-list">
                                        {CATEGORIES.slice(0, 8).map(cat => (
                                            <li key={cat}>
                                                <Link to={`/category/${cat.toLowerCase()}`} className="category-link">
                                                    <span>{cat}</span>
                                                    <ChevronRight size={16} />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Social Follow */}
                                <div className="sidebar-widget social-widget">
                                    <h4 className="widget-title">Siga-nos</h4>
                                    <div className="social-buttons">
                                        <a href="https://twitter.com/evolutto" target="_blank" rel="noopener noreferrer" className="social-btn twitter"><Twitter size={18} /></a>
                                        <a href="https://linkedin.com/company/evolutto" target="_blank" rel="noopener noreferrer" className="social-btn linkedin"><Linkedin size={18} /></a>
                                        <a href="https://facebook.com/evolutto" target="_blank" rel="noopener noreferrer" className="social-btn facebook"><Facebook size={18} /></a>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Lead Magnet Modal */}
            <Modal isOpen={isLeadMagnetOpen} onClose={() => setIsLeadMagnetOpen(false)}>
                <LeadMagnetForm
                    leadMagnetTitle="E-book: Escale sua Consultoria"
                    onSuccess={() => setTimeout(() => setIsLeadMagnetOpen(false), 3000)}
                />
            </Modal>

            {/* Newsletter Modal */}
            <Modal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)}>
                <NewsletterForm onSuccess={() => setTimeout(() => setIsNewsletterOpen(false), 3000)} />
            </Modal>
        </div>
    );
};
