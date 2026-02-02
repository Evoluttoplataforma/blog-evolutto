import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Footer } from '../components/LayoutItems';
import { useArticles } from '../hooks/useArticles';
import { CATEGORIES } from '../services/articleService';
import {
    ArrowLeft,
    ArrowRight,
    Clock,
    Eye,
    BookOpen,
    Zap,
    TrendingUp,
    Sparkles,
    Users,
    Tag
} from 'lucide-react';
import './Home.css';

// Helper function to get image URL
const getImageUrl = (coverImage, fallback) => {
    if (!coverImage) return fallback;
    if (coverImage.startsWith('http')) return coverImage;
    if (coverImage.startsWith('/')) return coverImage;
    return `/images/${coverImage}`;
};

const CATEGORIES_ICONS = {
    'tecnologia': Zap,
    'marketing': TrendingUp,
    'design': Sparkles,
    'negocios': Users,
    'geral': BookOpen,
    'digitalizacao': Zap,
    'consultoria': Users,
    'vendas': TrendingUp,
    'gestao': BookOpen,
    'produtividade': Zap,
    'inovacao': Sparkles,
    'cases': Sparkles,
};

export const Category = () => {
    const { name } = useParams();
    const { articles } = useArticles();

    // Normalize category name for comparison
    const normalizedName = name?.toLowerCase() || '';

    // Find the category label from CATEGORIES
    const categoryInfo = CATEGORIES.find(c => c.value.toLowerCase() === normalizedName);
    const categoryLabel = categoryInfo?.label || name?.charAt(0).toUpperCase() + name?.slice(1) || 'Categoria';

    // Filter articles by category
    const filteredArticles = articles.filter(article => {
        const articleCategories = article.categories || [];
        return articleCategories.some(cat => cat.toLowerCase() === normalizedName);
    });

    // Get the icon for this category
    const CategoryIcon = CATEGORIES_ICONS[normalizedName] || Tag;

    // Helper to get article link
    const getArticleLink = (article) => {
        return `/article/${article.slug || article.id}`;
    };

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

    return (
        <div className="home-page category-page">
            {/* Category Header */}
            <header className="category-header">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="category-header-content"
                    >
                        <Link to="/" className="back-link">
                            <ArrowLeft size={18} />
                            Voltar ao Blog
                        </Link>
                        <div className="category-title-wrapper">
                            <div className="category-icon-large">
                                <CategoryIcon size={32} />
                            </div>
                            <div>
                                <span className="category-label">Categoria</span>
                                <h1 className="category-page-title">{categoryLabel}</h1>
                                <p className="category-count-text">
                                    {filteredArticles.length} {filteredArticles.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Articles Grid */}
            <section className="category-articles">
                <div className="container">
                    {filteredArticles.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="articles-grid articles-grid-full"
                        >
                            {filteredArticles.map((article) => (
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
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="empty-state"
                        >
                            <div className="empty-state-icon">
                                <BookOpen size={48} />
                            </div>
                            <h2>Nenhum artigo encontrado</h2>
                            <p>Ainda não temos artigos nesta categoria. Explore outras categorias ou volte ao blog.</p>
                            <Link to="/" className="btn btn-primary">
                                <ArrowLeft size={18} /> Voltar ao Blog
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Other Categories */}
            <section className="other-categories">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">Outras Categorias</h2>
                        <div className="categories-list">
                            {CATEGORIES.filter(cat => cat.value.toLowerCase() !== normalizedName).slice(0, 6).map(category => {
                                const Icon = CATEGORIES_ICONS[category.value] || Tag;
                                const count = articles.filter(a =>
                                    a.categories?.some(c => c.toLowerCase() === category.value.toLowerCase())
                                ).length;

                                return (
                                    <Link
                                        key={category.value}
                                        to={`/category/${category.value}`}
                                        className="category-pill"
                                    >
                                        <Icon size={16} />
                                        {category.label}
                                        <span className="pill-count">{count}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};
