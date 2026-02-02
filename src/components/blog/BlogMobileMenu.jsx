import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogMobileMenu({ navLinks = [], actionLinks = {}, recursosDropdown = null, currentPath = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [recursosExpanded, setRecursosExpanded] = useState(false);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isOpen}
      >
        <span className={`hamburger ${isOpen ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.nav
              className="mobile-menu-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              aria-label="Menu mobile"
            >
              <div className="drawer-header">
                <img
                  src="/images/logo-evolutto.png"
                  alt="Evolutto"
                  className="drawer-logo"
                />
                <button
                  className="drawer-close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Fechar menu"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <ul className="drawer-nav">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <a
                      href={link.href}
                      className={`drawer-link ${currentPath.startsWith(link.href) ? 'active' : ''}`}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                      {link.external && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      )}
                    </a>
                  </motion.li>
                ))}

                {/* Recursos Gratuitos Collapsible */}
                {recursosDropdown && (
                  <motion.li
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                    className="drawer-collapse"
                  >
                    <button
                      className={`drawer-link drawer-collapse-trigger ${currentPath.startsWith('/recursos-gratuitos') ? 'active' : ''}`}
                      onClick={() => setRecursosExpanded(!recursosExpanded)}
                      aria-expanded={recursosExpanded}
                    >
                      {recursosDropdown.label}
                      <svg
                        className={`collapse-arrow ${recursosExpanded ? 'expanded' : ''}`}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    <AnimatePresence>
                      {recursosExpanded && (
                        <motion.ul
                          className="drawer-subnav"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {recursosDropdown.items.map((item) => (
                            <li key={item.href}>
                              <a href={item.href} className="drawer-sublink">
                                {item.label}
                              </a>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                )}
              </ul>

              <div className="drawer-footer">
                {actionLinks.login && (
                  <a
                    href={actionLinks.login.href}
                    className="drawer-login"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {actionLinks.login.label}
                  </a>
                )}
                {actionLinks.conheca && (
                  <a
                    href={actionLinks.conheca.href}
                    className="drawer-cta"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {actionLinks.conheca.label}
                  </a>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .mobile-menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          padding: 0;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 1001;
        }

        @media (min-width: 1024px) {
          .mobile-menu-toggle {
            display: none;
          }
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 24px;
          height: 24px;
        }

        .hamburger span {
          display: block;
          width: 100%;
          height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .hamburger.active span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        .hamburger.active span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .mobile-menu-backdrop {
          position: fixed;
          inset: 0;
          background: var(--bg-overlay);
          z-index: 999;
        }

        .mobile-menu-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 320px;
          background: var(--bg-primary);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-2xl);
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-5);
          border-bottom: 1px solid var(--border-light);
        }

        .drawer-logo {
          height: 32px;
          width: auto;
        }

        .drawer-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          padding: 0;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .drawer-close:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .drawer-nav {
          flex: 1;
          padding: var(--space-4) var(--space-2);
          list-style: none;
          margin: 0;
          overflow-y: auto;
        }

        .drawer-link {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          font-size: var(--text-base);
          font-weight: var(--font-medium);
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .drawer-link:hover {
          background: var(--color-primary-50);
          color: var(--color-primary-600);
        }

        .drawer-link.active {
          background: var(--color-primary-50);
          color: var(--color-primary-600);
        }

        .drawer-link svg {
          opacity: 0.6;
        }

        .drawer-footer {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding: var(--space-4) var(--space-5);
          border-top: 1px solid var(--border-light);
        }

        .drawer-login {
          display: block;
          width: 100%;
          padding: var(--space-3) var(--space-4);
          font-size: var(--text-base);
          font-weight: var(--font-medium);
          text-align: center;
          color: var(--text-secondary);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: all var(--transition-fast);
        }

        .drawer-login:hover {
          background: var(--color-primary-50);
          color: var(--color-primary-600);
        }

        .drawer-cta {
          display: block;
          width: 100%;
          padding: var(--space-3) var(--space-4);
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          text-align: center;
          color: var(--text-inverse);
          background: var(--color-primary-500);
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: all var(--transition-fast);
        }

        .drawer-cta:hover {
          background: var(--color-primary-600);
        }

        /* Collapsible menu styles */
        .drawer-collapse {
          border-bottom: 1px solid var(--border-light);
          margin-bottom: var(--space-2);
          padding-bottom: var(--space-2);
        }

        .drawer-collapse-trigger {
          width: 100%;
          justify-content: space-between;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .collapse-arrow {
          transition: transform 0.2s ease;
        }

        .collapse-arrow.expanded {
          transform: rotate(180deg);
        }

        .drawer-subnav {
          list-style: none;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .drawer-sublink {
          display: block;
          padding: var(--space-2) var(--space-4) var(--space-2) var(--space-8);
          font-size: var(--text-sm);
          font-weight: var(--font-normal);
          color: var(--text-muted);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .drawer-sublink:hover {
          background: var(--color-primary-50);
          color: var(--color-primary-600);
        }
      `}</style>
    </>
  );
}
