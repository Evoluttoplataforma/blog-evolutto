import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Footer } from '../components/LayoutItems';
import { Modal } from '../components/Modal';
import { NewsletterForm, LeadMagnetForm } from '../components/LeadForm';
import { useArticles } from '../hooks/useArticles';
import {
    ArrowRight,
    Clock,
    Eye,
    TrendingUp,
    Mail,
    ChevronRight,
    Sparkles,
    BookOpen,
    Users,
    Zap,
    Play,
    Download
} from 'lucide-react';
import './Home.css';

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

const CATEGORIES_ICONS = {
    'Tecnologia': Zap,
    'Marketing': TrendingUp,
    'Design': Sparkles,
    'Negócios': Users,
    'Geral': BookOpen,
    'Digitalização': Zap,
    'Consultoria': Users,
    'Vendas': TrendingUp,
    'Gestão': BookOpen,
    'Produtividade': Zap,
    'Inovação': Sparkles,
};

export const Home = () => {
    const { articles } = useArticles();
    const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
    const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(20);

    const loadMore = () => {
        setVisibleCount(prev => prev + 12);
    };

    // Handle newsletter form submission
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        setIsNewsletterOpen(true);
    };

    // Get all unique categories and their counts
    const categoryCounts = articles.reduce((acc, article) => {
        const cats = article.categories || [];
        cats.forEach(cat => {
            const formattedCat = cat.charAt(0).toUpperCase() + cat.slice(1);
            acc[formattedCat] = (acc[formattedCat] || 0) + 1;
        });
        return acc;
    }, {});

    const CATEGORIES = Object.keys(categoryCounts).slice(0, 4).map(name => ({
        name,
        icon: CATEGORIES_ICONS[name] || BookOpen,
        count: categoryCounts[name]
    }));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    const featuredArticle = articles[0];

    // Helper to get article link
    const getArticleLink = (article) => {
        return `/article/${article.slug || article.id}`;
    };

    return (
        <div className="home-page">
            {/* Hero Section - Dark Theme */}
            <header className="hero hero-dark">
                <div className="hero-bg-elements">
                    <div className="hero-gradient-orb orb-1"></div>
                    <div className="hero-gradient-orb orb-2"></div>
                    <div className="hero-gradient-orb orb-3"></div>
                    <div className="hero-grid-pattern"></div>
                    <div className="hero-particles"></div>
                </div>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="hero-content"
                    >
                        <motion.span
                            className="badge hero-badge"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Sparkles size={14} />
                            Evolutto Insights 2026
                        </motion.span>
                        <h1 className="hero-title">
                            Escale sua <span className="gradient-text">consultoria</span> com a Evolutto.
                        </h1>
                        <p className="hero-description">
                            Insights profundos sobre tecnologia, produto e marketing para mentes que buscam a próxima evolução.
                        </p>
                        <div className="hero-actions">
                            {featuredArticle && (
                                <Link to={getArticleLink(featuredArticle)} className="btn btn-primary btn-lg">
                                    Começar a Ler <ArrowRight size={18} />
                                </Link>
                            )}
                            <button className="btn btn-outline-light btn-lg">
                                <Play size={18} /> Ver Vídeo
                            </button>
                        </div>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">{articles.length}+</span>
                                <span className="stat-label">Artigos</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-number">50k+</span>
                                <span className="stat-label">Leitores</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-number">4.9</span>
                                <span className="stat-label">Avaliação</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Featured Article Section */}
            {featuredArticle && (
                <section className="featured-section">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="section-header">
                                <div className="section-header-left">
                                    <span className="section-label">Destaque</span>
                                    <h2 className="section-title">Artigo em Destaque</h2>
                                </div>
                            </div>

                            <Link to={getArticleLink(featuredArticle)} className="featured-card group">
                                <div className="featured-image-container">
                                    <img
                                        src={getImageUrl(featuredArticle.coverImage, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800')}
                                        alt={featuredArticle.title}
                                        width={800}
                                        height={500}
                                        loading="eager"
                                        decoding="async"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'; }}
                                    />
                                    <div className="featured-image-overlay"></div>
                                    <span className="featured-category">{featuredArticle.categories?.[0] || 'Destaque'}</span>
                                </div>
                                <div className="featured-content">
                                    <h3 className="featured-title">{featuredArticle.title}</h3>
                                    <p className="featured-excerpt">{featuredArticle.excerpt}</p>
                                    <div className="featured-meta">
                                        <div className="featured-meta-left">
                                            <span className="meta-item">
                                                <Clock size={16} /> {featuredArticle.readTime || '8 min de leitura'}
                                            </span>
                                            <span className="meta-item">
                                                <Eye size={16} /> {featuredArticle.views?.toLocaleString() || '2.4k'} views
                                            </span>
                                        </div>
                                        <span className="read-more-link">
                                            Ler artigo <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Categories Section */}
            {CATEGORIES.length > 0 && (
                <section className="categories-section">
                    <div className="container">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                            className="categories-grid"
                        >
                            {CATEGORIES.map((category, index) => (
                                <motion.div key={category.name} variants={itemVariants}>
                                    <Link to={`/category/${category.name.toLowerCase()}`} className="category-card group">
                                        <div className="category-icon">
                                            <category.icon size={24} />
                                        </div>
                                        <div className="category-info">
                                            <h4 className="category-name">{category.name}</h4>
                                            <span className="category-count">{category.count} artigos</span>
                                        </div>
                                        <ChevronRight size={20} className="category-arrow" />
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Recent Articles Section */}
            {articles.length > 1 && (
                <section className="recent-articles">
                    <div className="container">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                        >
                            <div className="section-header">
                                <div className="section-header-left">
                                    <span className="section-label">Blog</span>
                                    <h2 className="section-title">Artigos Recentes</h2>
                                    <p className="section-description">As últimas tendências analisadas por nossos especialistas.</p>
                                </div>
                                <motion.div variants={itemVariants}>
                                    <Link to="/archive" className="link-btn group">
                                        Ver todos <ArrowRight size={16} className="link-arrow" />
                                    </Link>
                                </motion.div>
                            </div>

                            <div className="articles-grid">
                                {articles.slice(1, 4).map((article, index) => (
                                    <motion.div key={article.docId || article.id} variants={itemVariants}>
                                        <Link to={getArticleLink(article)} className="article-card-link">
                                            <article className="article-card">
                                                <div className="card-image-wrap">
                                                    <img
                                                        src={getImageUrl(article.coverImage, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800')}
                                                        alt={article.title}
                                                        width={800}
                                                        height={500}
                                                        loading="lazy"
                                                        decoding="async"
                                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'; }}
                                                    />
                                                    <div className="card-image-overlay"></div>
                                                    <span className="card-category-tag">{article.categories?.[0] || 'Geral'}</span>
                                                </div>
                                                <div className="card-content">
                                                    <h3 className="card-title">{article.title}</h3>
                                                    <p className="card-excerpt">{article.excerpt}</p>
                                                    <div className="card-meta">
                                                        <span className="meta-item">
                                                            <Clock size={14} /> {article.readTime || '5 min'}
                                                        </span>
                                                        <span className="meta-item">
                                                            <Eye size={14} /> {article.views?.toLocaleString() || '1.2k'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </article>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Inline Banner */}
            <section className="inline-banner-section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-banner"
                        onClick={() => setIsLeadMagnetOpen(true)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="inline-banner-content">
                            <div className="banner-icon">
                                <Download size={32} />
                            </div>
                            <div className="banner-text">
                                <h3>E-book Gratuito: Escale sua Consultoria</h3>
                                <p>Baixe agora e aprenda como digitalizar sua consultoria e aumentar seu faturamento.</p>
                            </div>
                            <button className="btn btn-primary" onClick={() => setIsLeadMagnetOpen(true)}>
                                Baixar Grátis <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* More Articles */}
            {articles.length > 8 && (
                <section className="more-articles">
                    <div className="container">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                        >
                            <div className="section-header">
                                <h2 className="section-title">Nossa Biblioteca Completa</h2>
                            </div>
                            <div className="articles-grid">
                                {articles.slice(8, visibleCount).map((article, index) => (
                                    <motion.div key={article.docId || article.id} variants={itemVariants}>
                                        <Link to={getArticleLink(article)} className="article-card-link">
                                            <article className="article-card">
                                                <div className="card-image-wrap">
                                                    <img
                                                        src={getImageUrl(article.coverImage, 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800')}
                                                        alt={article.title}
                                                        width={800}
                                                        height={500}
                                                        loading="lazy"
                                                        decoding="async"
                                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800'; }}
                                                    />
                                                    <div className="card-image-overlay"></div>
                                                    <span className="card-category-tag">{article.categories?.[0] || 'Geral'}</span>
                                                </div>
                                                <div className="card-content">
                                                    <h3 className="card-title">{article.title}</h3>
                                                    <p className="card-excerpt">{article.excerpt}</p>
                                                    <div className="card-meta">
                                                        <span className="meta-item">
                                                            <Clock size={14} /> {article.readTime || '5 min'}
                                                        </span>
                                                        <span className="meta-item">
                                                            <Eye size={14} /> {article.views?.toLocaleString() || '1k'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </article>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {visibleCount < articles.length && (
                                <div className="load-more-container">
                                    <button className="btn btn-outline btn-lg" onClick={loadMore}>
                                        Carregar Mais Artigos <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Trending Section */}
            {articles.length > 4 && (
                <section className="trending-section">
                    <div className="container">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                        >
                            <div className="section-header section-header-center">
                                <div className="trending-icon-wrapper">
                                    <TrendingUp size={24} />
                                </div>
                                <span className="section-label">Populares</span>
                                <h2 className="section-title">Em Alta Esta Semana</h2>
                            </div>

                            <div className="trending-grid">
                                {articles.slice(4, 8).map((article, index) => (
                                    <motion.div
                                        key={article.docId || article.id}
                                        variants={itemVariants}
                                    >
                                        <Link to={getArticleLink(article)} className="trending-item group">
                                            <span className="trending-number">0{index + 1}</span>
                                            <div className="trending-content">
                                                <span className="trending-category">{article.categories?.[0] || 'Geral'}</span>
                                                <h4 className="trending-title">{article.title}</h4>
                                                <div className="trending-meta">
                                                    <span>{article.readTime || '5 min'}</span>
                                                    <span className="dot">•</span>
                                                    <span>{article.views?.toLocaleString() || '1.5k'} leituras</span>
                                                </div>
                                            </div>
                                            <ChevronRight size={20} className="trending-arrow" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Newsletter Section */}
            <section className="newsletter-section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="newsletter-card"
                    >
                        <div className="newsletter-bg-elements">
                            <div className="newsletter-orb"></div>
                        </div>
                        <div className="newsletter-content">
                            <div className="newsletter-icon">
                                <Mail size={32} />
                            </div>
                            <h2 className="newsletter-title">Mantenha sua mente à frente.</h2>
                            <p className="newsletter-description">
                                Receba nossa curadoria estratégica de conteúdo diretamente no seu e-mail.
                                Sem spam, apenas insights valiosos.
                            </p>
                            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        placeholder="Digite seu melhor e-mail"
                                        required
                                    />
                                    <button type="submit" className="btn btn-primary">
                                        Inscrever-se <ArrowRight size={16} />
                                    </button>
                                </div>
                                <p className="form-note">
                                    Junte-se a mais de 10.000 profissionais. Cancele quando quiser.
                                </p>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="cta-card"
                    >
                        <div className="cta-content">
                            <h2 className="cta-title">Pronto para dar o próximo passo?</h2>
                            <p className="cta-description">
                                Conheça as soluções da Evolutto para acelerar seu negócio e transformar sua equipe.
                            </p>
                        </div>
                        <div className="cta-actions">
                            <button className="btn btn-white btn-lg">
                                Falar com Especialista <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />

            {/* Newsletter Modal */}
            <Modal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)}>
                <NewsletterForm onSuccess={() => setTimeout(() => setIsNewsletterOpen(false), 3000)} />
            </Modal>

            {/* Lead Magnet Modal */}
            <Modal isOpen={isLeadMagnetOpen} onClose={() => setIsLeadMagnetOpen(false)}>
                <LeadMagnetForm
                    leadMagnetTitle="E-book: Escale sua Consultoria"
                    onSuccess={() => setTimeout(() => setIsLeadMagnetOpen(false), 3000)}
                />
            </Modal>
        </div>
    );
};
