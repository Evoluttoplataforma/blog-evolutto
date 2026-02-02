import React, { useState } from 'react';
import LeadModal from './LeadModal.jsx';

export default function SidebarCTA({
  title = 'E-book Gratuito',
  description = 'Escale sua Consultoria com estrategias comprovadas',
  buttonText = 'Baixar Agora',
  modalTitle = 'E-book Gratuito',
  modalDescription = 'Preencha seus dados para receber o e-book',
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="sidebar-cta">
        <div className="cta-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <h3 className="cta-title">{title}</h3>
        <p className="cta-description">{description}</p>
        <button
          className="cta-button"
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          {buttonText}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </button>
      </div>

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        description={modalDescription}
      />

      <style>{`
        .sidebar-cta {
          padding: 24px;
          background: linear-gradient(135deg, #00a7e1 0%, #0080ba 100%);
          border-radius: 16px;
          text-align: center;
          color: #fff;
        }

        .cta-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          margin-bottom: 16px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
        }

        .cta-title {
          margin: 0 0 8px;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .cta-description {
          margin: 0 0 20px;
          font-size: 0.9375rem;
          opacity: 0.9;
          line-height: 1.5;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: inherit;
          color: #0080ba;
          background: #fff;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 1023px) {
          .sidebar-cta {
            padding: 20px;
          }

          .cta-icon {
            width: 56px;
            height: 56px;
          }

          .cta-title {
            font-size: 1.125rem;
          }

          .cta-description {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </>
  );
}
