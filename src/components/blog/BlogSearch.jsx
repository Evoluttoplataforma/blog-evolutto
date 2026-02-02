import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const searchTimeout = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    // Handle Cmd/Ctrl + K shortcut
    const handleShortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleShortcut);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleShortcut);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Search handler with debounce
  const handleSearch = (value) => {
    setQuery(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    searchTimeout.current = setTimeout(async () => {
      try {
        // In a real implementation, this would call an API or search index
        // For now, we'll simulate a client-side search
        const response = await fetch('/search-index.json');
        if (response.ok) {
          const posts = await response.json();
          const filtered = posts
            .filter((post) => {
              const searchLower = value.toLowerCase();
              return (
                post.title.toLowerCase().includes(searchLower) ||
                post.excerpt?.toLowerCase().includes(searchLower) ||
                post.categories?.some((cat) => cat.toLowerCase().includes(searchLower))
              );
            })
            .slice(0, 8);
          setResults(filtered);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <>
      {/* Search Button */}
      <button
        className="search-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Buscar artigos"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span className="search-shortcut">
          <kbd>⌘</kbd>
          <kbd>K</kbd>
        </span>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="search-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            <motion.div
              className="search-modal"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="search-input-wrapper">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  className="search-input"
                  placeholder="Buscar artigos..."
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {query && (
                  <button
                    className="search-clear"
                    onClick={() => handleSearch('')}
                    aria-label="Limpar busca"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>

              <div className="search-results">
                {isLoading && (
                  <div className="search-loading">
                    <div className="spinner-small"></div>
                    <span>Buscando...</span>
                  </div>
                )}

                {!isLoading && query.length >= 2 && results.length === 0 && (
                  <div className="search-empty">
                    <p>Nenhum resultado encontrado para "{query}"</p>
                  </div>
                )}

                {!isLoading && results.length > 0 && (
                  <ul className="search-list">
                    {results.map((result, index) => (
                      <motion.li
                        key={result.slug}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <a href={`/${result.slug}`} className="search-result" onClick={handleClose}>
                          <div className="result-content">
                            <h4 className="result-title">{result.title}</h4>
                            {result.excerpt && (
                              <p className="result-excerpt">{result.excerpt}</p>
                            )}
                          </div>
                          {result.categories?.[0] && (
                            <span className="result-category">{result.categories[0]}</span>
                          )}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {!isLoading && query.length < 2 && (
                  <div className="search-hint">
                    <p>Digite pelo menos 2 caracteres para buscar</p>
                    <div className="search-shortcuts">
                      <span><kbd>ESC</kbd> para fechar</span>
                      <span><kbd>Enter</kbd> para selecionar</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .search-trigger {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2);
          background: transparent;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .search-trigger:hover {
          border-color: var(--color-primary-300);
          color: var(--color-primary-600);
        }

        .search-shortcut {
          display: none;
          align-items: center;
          gap: 2px;
        }

        @media (min-width: 768px) {
          .search-trigger {
            padding: var(--space-2) var(--space-3);
          }

          .search-shortcut {
            display: flex;
          }
        }

        .search-shortcut kbd {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          padding: 2px 4px;
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: var(--font-medium);
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: 4px;
          color: var(--text-muted);
        }

        .search-backdrop {
          position: fixed;
          inset: 0;
          background: var(--bg-overlay);
          z-index: var(--z-modal-backdrop);
        }

        .search-modal {
          position: fixed;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 600px;
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-2xl);
          z-index: var(--z-modal);
          overflow: hidden;
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4) var(--space-5);
          border-bottom: 1px solid var(--border-light);
        }

        .search-icon {
          flex-shrink: 0;
          color: var(--text-muted);
        }

        .search-input {
          flex: 1;
          font-size: var(--text-lg);
          font-family: var(--font-sans);
          color: var(--text-primary);
          background: transparent;
          border: none;
          outline: none;
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .search-clear {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          padding: 0;
          background: var(--bg-secondary);
          border: none;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .search-clear:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .search-results {
          max-height: 400px;
          overflow-y: auto;
        }

        .search-loading,
        .search-empty,
        .search-hint {
          padding: var(--space-8) var(--space-5);
          text-align: center;
          color: var(--text-muted);
        }

        .search-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
        }

        .spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border-light);
          border-top-color: var(--color-primary-500);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .search-shortcuts {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-4);
          margin-top: var(--space-3);
          font-size: var(--text-sm);
        }

        .search-shortcuts kbd {
          display: inline-flex;
          padding: 2px 6px;
          font-family: var(--font-sans);
          font-size: 11px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: 4px;
        }

        .search-list {
          list-style: none;
          margin: 0;
          padding: var(--space-2);
        }

        .search-result {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }

        .search-result:hover {
          background: var(--bg-secondary);
        }

        .result-content {
          flex: 1;
          min-width: 0;
        }

        .result-title {
          margin: 0;
          font-size: var(--text-base);
          font-weight: var(--font-medium);
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .result-excerpt {
          margin: var(--space-1) 0 0;
          font-size: var(--text-sm);
          color: var(--text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .result-category {
          flex-shrink: 0;
          padding: var(--space-1) var(--space-2);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          color: var(--color-primary-600);
          background: var(--color-primary-50);
          border-radius: var(--radius-full);
          text-transform: capitalize;
        }
      `}</style>
    </>
  );
}
