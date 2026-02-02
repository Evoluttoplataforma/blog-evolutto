import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// UTM utility functions
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
const UTM_STORAGE_KEY = 'evolutto_utm_params';

function getUtmFromUrl() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utms = {};
  UTM_PARAMS.forEach(param => {
    const value = params.get(param);
    if (value) utms[param] = value;
  });
  return utms;
}

function getUtmFromStorage() {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveUtmToStorage(utms) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getUtmFromStorage();
    const merged = { ...existing, ...utms };
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Ignore storage errors
  }
}

function getAllUtms() {
  const urlUtms = getUtmFromUrl();
  const storedUtms = getUtmFromStorage();

  // Save URL UTMs to storage for future visits
  if (Object.keys(urlUtms).length > 0) {
    saveUtmToStorage(urlUtms);
  }

  // URL takes priority over stored
  return { ...storedUtms, ...urlUtms };
}

function getReferrer() {
  if (typeof document === 'undefined') return '';
  return document.referrer || '';
}

// Phone validation
function isValidPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

// Format phone as (XX) XXXXX-XXXX
function formatPhone(value) {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 11) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
}

export default function LeadModal({ isOpen, onClose, title = 'E-book Gratuito', description = 'Preencha seus dados para baixar', downloadUrl = '/downloads/ebook-evolutto.pdf' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [utmData, setUtmData] = useState({});

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const lastButtonRef = useRef(null);

  // Capture UTMs on mount
  useEffect(() => {
    setUtmData({
      ...getAllUtms(),
      referrer: getReferrer(),
    });
  }, []);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus first input on open
    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 100);

    // Handle ESC key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }

      // Focus trap
      if (e.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '' });
        setErrors({});
        setIsSuccess(false);
      }, 300);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setFormData(prev => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome e obrigatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email e obrigatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone e obrigatorio';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Telefone invalido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      ...formData,
      phone: formData.phone.replace(/\D/g, ''),
      ...utmData,
      submitted_at: new Date().toISOString(),
      page_url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      // Mock API call - replace with real endpoint
      console.log('Lead submitted:', payload);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, uncomment:
      // await fetch('/api/lead', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });

      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting lead:', error);
      setErrors({ submit: 'Erro ao enviar. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    const isExternal = downloadUrl.startsWith('http');
    if (isExternal) {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(downloadUrl, '_blank');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="lead-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            ref={modalRef}
            className="lead-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Fechar modal"
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {!isSuccess ? (
              <>
                <div className="modal-header">
                  <div className="modal-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </div>
                  <h2 id="modal-title" className="modal-title">{title}</h2>
                  <p className="modal-description">{description}</p>
                </div>

                <form onSubmit={handleSubmit} className="modal-form" noValidate>
                  <div className="form-group">
                    <label htmlFor="lead-name">Nome</label>
                    <input
                      ref={firstInputRef}
                      type="text"
                      id="lead-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      className={errors.name ? 'error' : ''}
                      autoComplete="name"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lead-email">Email</label>
                    <input
                      type="email"
                      id="lead-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      className={errors.email ? 'error' : ''}
                      autoComplete="email"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lead-phone">Telefone</label>
                    <input
                      type="tel"
                      id="lead-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className={errors.phone ? 'error' : ''}
                      autoComplete="tel"
                      maxLength={16}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>

                  {/* Hidden UTM fields */}
                  {UTM_PARAMS.map(param => (
                    <input key={param} type="hidden" name={param} value={utmData[param] || ''} />
                  ))}
                  <input type="hidden" name="referrer" value={utmData.referrer || ''} />

                  {errors.submit && (
                    <div className="submit-error">{errors.submit}</div>
                  )}

                  <button
                    ref={lastButtonRef}
                    type="submit"
                    className="modal-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Enviando...
                      </>
                    ) : (
                      'Quero baixar agora'
                    )}
                  </button>

                  <p className="modal-privacy">
                    Ao enviar, voce concorda com nossa politica de privacidade.
                  </p>
                </form>
              </>
            ) : (
              <div className="modal-success">
                <div className="success-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3>Obrigado!</h3>
                <p>Seu material esta pronto para download.</p>
                <button className="download-button" onClick={handleDownload}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Baixar Material
                </button>
              </div>
            )}
          </motion.div>

          <style>{`
            .lead-modal-backdrop {
              position: fixed;
              inset: 0;
              z-index: 9999;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 16px;
              background: rgba(15, 23, 42, 0.7);
              backdrop-filter: blur(4px);
            }

            .lead-modal {
              position: relative;
              width: 100%;
              max-width: 440px;
              max-height: calc(100vh - 32px);
              overflow-y: auto;
              background: #fff;
              border-radius: 16px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }

            .modal-close {
              position: absolute;
              top: 12px;
              right: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 40px;
              height: 40px;
              padding: 0;
              background: transparent;
              border: none;
              border-radius: 8px;
              color: #64748b;
              cursor: pointer;
              transition: all 0.15s ease;
              z-index: 1;
            }

            .modal-close:hover {
              background: #f1f5f9;
              color: #1e293b;
            }

            .modal-header {
              padding: 32px 24px 0;
              text-align: center;
            }

            .modal-icon {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 64px;
              height: 64px;
              margin-bottom: 16px;
              background: linear-gradient(135deg, #00a7e1 0%, #0080ba 100%);
              border-radius: 16px;
              color: #fff;
            }

            .modal-title {
              margin: 0 0 8px;
              font-size: 1.5rem;
              font-weight: 700;
              color: #1e293b;
            }

            .modal-description {
              margin: 0;
              font-size: 0.9375rem;
              color: #64748b;
            }

            .modal-form {
              padding: 24px;
            }

            .form-group {
              margin-bottom: 16px;
            }

            .form-group label {
              display: block;
              margin-bottom: 6px;
              font-size: 0.875rem;
              font-weight: 500;
              color: #1e293b;
            }

            .form-group input {
              width: 100%;
              padding: 12px 16px;
              font-size: 1rem;
              font-family: inherit;
              color: #1e293b;
              background: #f8fafc;
              border: 2px solid #e2e8f0;
              border-radius: 8px;
              outline: none;
              transition: all 0.15s ease;
            }

            .form-group input:focus {
              background: #fff;
              border-color: #00a7e1;
              box-shadow: 0 0 0 3px rgba(0, 167, 225, 0.1);
            }

            .form-group input.error {
              border-color: #ef4444;
            }

            .form-group input::placeholder {
              color: #94a3b8;
            }

            .error-message {
              display: block;
              margin-top: 4px;
              font-size: 0.8125rem;
              color: #ef4444;
            }

            .submit-error {
              margin-bottom: 16px;
              padding: 12px;
              font-size: 0.875rem;
              color: #991b1b;
              background: #fef2f2;
              border-radius: 8px;
              text-align: center;
            }

            .modal-submit {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              width: 100%;
              padding: 14px 24px;
              font-size: 1rem;
              font-weight: 600;
              font-family: inherit;
              color: #fff;
              background: linear-gradient(135deg, #00a7e1 0%, #0080ba 100%);
              border: none;
              border-radius: 8px;
              cursor: pointer;
              transition: all 0.15s ease;
            }

            .modal-submit:hover:not(:disabled) {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(0, 167, 225, 0.3);
            }

            .modal-submit:disabled {
              opacity: 0.7;
              cursor: not-allowed;
            }

            .spinner {
              width: 18px;
              height: 18px;
              border: 2px solid rgba(255, 255, 255, 0.3);
              border-top-color: #fff;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
            }

            @keyframes spin {
              to { transform: rotate(360deg); }
            }

            .modal-privacy {
              margin: 12px 0 0;
              font-size: 0.75rem;
              color: #94a3b8;
              text-align: center;
            }

            .modal-success {
              padding: 48px 24px;
              text-align: center;
            }

            .success-icon {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 80px;
              height: 80px;
              margin-bottom: 20px;
              background: #dcfce7;
              border-radius: 50%;
              color: #22c55e;
            }

            .modal-success h3 {
              margin: 0 0 8px;
              font-size: 1.5rem;
              font-weight: 700;
              color: #1e293b;
            }

            .modal-success p {
              margin: 0 0 24px;
              font-size: 1rem;
              color: #64748b;
            }

            .download-button {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 14px 32px;
              font-size: 1rem;
              font-weight: 600;
              font-family: inherit;
              color: #fff;
              background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
              border: none;
              border-radius: 8px;
              cursor: pointer;
              transition: all 0.15s ease;
            }

            .download-button:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
            }

            /* Mobile styles */
            @media (max-width: 480px) {
              .lead-modal-backdrop {
                padding: 12px;
                align-items: flex-end;
              }

              .lead-modal {
                max-width: 100%;
                max-height: calc(100vh - 24px);
                border-radius: 20px 20px 0 0;
              }

              .modal-header {
                padding: 28px 20px 0;
              }

              .modal-icon {
                width: 56px;
                height: 56px;
              }

              .modal-icon svg {
                width: 28px;
                height: 28px;
              }

              .modal-title {
                font-size: 1.25rem;
              }

              .modal-form {
                padding: 20px;
              }

              .form-group input {
                padding: 14px 16px;
                font-size: 16px; /* Prevent iOS zoom */
              }

              .modal-submit {
                padding: 16px 24px;
              }

              .modal-success {
                padding: 40px 20px;
              }

              .download-button {
                width: 100%;
                padding: 16px 24px;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
