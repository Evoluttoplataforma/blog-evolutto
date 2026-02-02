import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    ArrowRight,
    ChevronRight,
    ExternalLink,
    MessageCircle,
    LogIn,
    Globe,
    Users,
    Home as HomeIcon
} from 'lucide-react';
import { Modal } from './Modal';
import { NewsletterForm } from './LeadForm';
import './Navbar.css';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    const navLinks = [
        { name: 'Blog', path: '/', icon: HomeIcon },
        { name: 'Site', path: 'https://evolutto.com.br', external: true, icon: Globe },
        { name: 'Sobre', path: 'https://evolutto.com.br/sobre', external: true, icon: Users },
    ];

    const ctaLinks = [
        {
            name: 'Acessar Plataforma',
            path: 'https://app.evolutto.com.br',
            external: true,
            variant: 'ghost',
            icon: LogIn
        },
        {
            name: 'Falar com Especialista',
            path: 'https://evolutto.com.br/contato',
            external: true,
            variant: 'primary',
            icon: MessageCircle
        },
    ];

    const renderLink = (link, className, onClick) => {
        if (link.external) {
            return (
                <a
                    href={link.path}
                    className={className}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClick}
                >
                    {link.name}
                    {link.icon && <link.icon size={16} className="nav-link-icon" />}
                </a>
            );
        }
        return (
            <Link to={link.path} className={className} onClick={onClick}>
                {link.name}
            </Link>
        );
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container nav-content">
                    <Link to="/" className="logo">
                        <span className="logo-text">EVOLUTTO</span>
                        <span className="logo-dot">.</span>
                    </Link>

                    <div className="nav-links">
                        {navLinks.map(link => renderLink(link, 'nav-link', null))}
                    </div>

                    <div className="nav-actions">
                        {ctaLinks.map(link => (
                            <a
                                key={link.name}
                                href={link.path}
                                className={`btn btn-${link.variant} hide-mobile nav-cta-btn`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {link.icon && <link.icon size={16} />}
                                <span className="btn-text">{link.name}</span>
                            </a>
                        ))}
                        <button
                            className="menu-toggle"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                    >
                        <div className="mobile-menu-content">
                            <div className="mobile-nav-links">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        {link.external ? (
                                            <a
                                                href={link.path}
                                                className="mobile-nav-link"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {link.icon && <link.icon size={20} className="mobile-link-icon" />}
                                                {link.name}
                                                <ExternalLink size={16} />
                                            </a>
                                        ) : (
                                            <Link
                                                to={link.path}
                                                className="mobile-nav-link"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {link.icon && <link.icon size={20} className="mobile-link-icon" />}
                                                {link.name}
                                                <ChevronRight size={20} />
                                            </Link>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mobile-menu-ctas">
                                {ctaLinks.map((link, index) => (
                                    <motion.a
                                        key={link.name}
                                        href={link.path}
                                        className={`btn btn-${link.variant} btn-lg w-full`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setIsMenuOpen(false)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                        {link.icon && <link.icon size={18} />}
                                        {link.name}
                                    </motion.a>
                                ))}
                            </div>

                            <div className="mobile-menu-footer">
                                <div className="mobile-social">
                                    <a href="https://facebook.com/evolutto" target="_blank" rel="noopener noreferrer" className="social-icon">
                                        <Facebook size={20} />
                                    </a>
                                    <a href="https://twitter.com/evolutto" target="_blank" rel="noopener noreferrer" className="social-icon">
                                        <Twitter size={20} />
                                    </a>
                                    <a href="https://instagram.com/evolutto" target="_blank" rel="noopener noreferrer" className="social-icon">
                                        <Instagram size={20} />
                                    </a>
                                    <a href="https://linkedin.com/company/evolutto" target="_blank" rel="noopener noreferrer" className="social-icon">
                                        <Linkedin size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Newsletter Modal */}
            <Modal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)}>
                <NewsletterForm onSuccess={() => setTimeout(() => setIsNewsletterOpen(false), 3000)} />
            </Modal>
        </>
    );
};

export const Footer = ({ onOpenNewsletter }) => {
    const currentYear = new Date().getFullYear();
    const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        setIsNewsletterOpen(true);
    };

    return (
        <>
            <footer className="footer">
                <div className="container">
                    {/* Footer Top */}
                    <div className="footer-top">
                        <div className="footer-brand">
                            <Link to="/" className="footer-logo">
                                <span className="logo-text">EVOLUTTO</span>
                                <span className="logo-dot">.</span>
                            </Link>
                            <p className="footer-tagline">
                                Elevando o conhecimento digital através de insights estratégicos e inovação contínua.
                            </p>
                            <div className="footer-social">
                                <a href="https://facebook.com/evolutto" target="_blank" rel="noopener noreferrer" className="social-item" aria-label="Facebook">
                                    <Facebook size={18} />
                                </a>
                                <a href="https://twitter.com/evolutto" target="_blank" rel="noopener noreferrer" className="social-item" aria-label="Twitter">
                                    <Twitter size={18} />
                                </a>
                                <a href="https://instagram.com/evolutto" target="_blank" rel="noopener noreferrer" className="social-item" aria-label="Instagram">
                                    <Instagram size={18} />
                                </a>
                                <a href="https://linkedin.com/company/evolutto" target="_blank" rel="noopener noreferrer" className="social-item" aria-label="LinkedIn">
                                    <Linkedin size={18} />
                                </a>
                            </div>
                        </div>

                        <div className="footer-links-grid">
                            <div className="footer-links">
                                <h4 className="footer-heading">Blog</h4>
                                <ul>
                                    <li><Link to="/">Artigos Recentes</Link></li>
                                    <li><Link to="/category/digitalizacao">Digitalização</Link></li>
                                    <li><Link to="/category/marketing">Marketing</Link></li>
                                    <li><Link to="/category/consultoria">Consultoria</Link></li>
                                </ul>
                            </div>

                            <div className="footer-links">
                                <h4 className="footer-heading">Evolutto</h4>
                                <ul>
                                    <li><a href="https://evolutto.com.br" target="_blank" rel="noopener noreferrer">Site Principal</a></li>
                                    <li><a href="https://evolutto.com.br/sobre" target="_blank" rel="noopener noreferrer">Sobre Nós</a></li>
                                    <li><a href="https://app.evolutto.com.br" target="_blank" rel="noopener noreferrer">Acessar Plataforma</a></li>
                                    <li><a href="https://evolutto.com.br/contato" target="_blank" rel="noopener noreferrer">Contato</a></li>
                                </ul>
                            </div>

                            <div className="footer-newsletter">
                                <h4 className="footer-heading">Newsletter</h4>
                                <p className="newsletter-text">
                                    Receba insights semanais sobre tecnologia e inovação.
                                </p>
                                <form className="footer-form" onSubmit={handleNewsletterSubmit}>
                                    <div className="form-wrapper">
                                        <input type="email" placeholder="Seu e-mail" required />
                                        <button type="submit" aria-label="Inscrever">
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="footer-bottom">
                        <p className="copyright">
                            © {currentYear} Evolutto Blog. Criado para mentes em evolução.
                        </p>
                        <div className="footer-bottom-links">
                            <a href="https://evolutto.com.br/termos" target="_blank" rel="noopener noreferrer">Termos</a>
                            <a href="https://evolutto.com.br/privacidade" target="_blank" rel="noopener noreferrer">Privacidade</a>
                            <a href="https://evolutto.com.br/cookies" target="_blank" rel="noopener noreferrer">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Newsletter Modal */}
            <Modal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)}>
                <NewsletterForm onSuccess={() => setTimeout(() => setIsNewsletterOpen(false), 3000)} />
            </Modal>
        </>
    );
};
