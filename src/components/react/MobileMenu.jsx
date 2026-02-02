import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  LogIn,
  Globe,
  Users,
  Home as HomeIcon
} from 'lucide-react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
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
                        onClick={() => setIsOpen(false)}
                      >
                        {link.icon && <link.icon size={20} className="mobile-link-icon" />}
                        {link.name}
                        <ExternalLink size={16} />
                      </a>
                    ) : (
                      <a
                        href={link.path}
                        className="mobile-nav-link"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.icon && <link.icon size={20} className="mobile-link-icon" />}
                        {link.name}
                        <ChevronRight size={20} />
                      </a>
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
                    onClick={() => setIsOpen(false)}
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
    </>
  );
}
