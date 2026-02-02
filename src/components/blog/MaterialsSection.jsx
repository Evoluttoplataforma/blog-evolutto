import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TypeChips from './TypeChips';
import LeadModal from './LeadModal';

// Material type colors
const typeColors = {
  ebook: { bg: '#dbeafe', color: '#1e40af' },
  template: { bg: '#dcfce7', color: '#166534' },
  planilha: { bg: '#fef3c7', color: '#92400e' },
  kit: { bg: '#f3e8ff', color: '#7c3aed' },
  checklist: { bg: '#fce7f3', color: '#be185d' },
  webinar: { bg: '#fee2e2', color: '#dc2626' },
  calendario: { bg: '#cffafe', color: '#0891b2' },
  ferramenta: { bg: '#e0e7ff', color: '#4338ca' },
  infografico: { bg: '#fef9c3', color: '#a16207' },
  curso: { bg: '#d1fae5', color: '#059669' },
  relatorio: { bg: '#f1f5f9', color: '#475569' },
  tutorial: { bg: '#ffedd5', color: '#c2410c' },
  video: { bg: '#fee2e2', color: '#dc2626' },
  podcast: { bg: '#fae8ff', color: '#a21caf' },
  audio: { bg: '#fae8ff', color: '#a21caf' },
  quiz: { bg: '#fef3c7', color: '#92400e' },
  evento: { bg: '#dbeafe', color: '#1e40af' },
  demonstracao: { bg: '#dbeafe', color: '#1e40af' },
  pesquisa: { bg: '#f1f5f9', color: '#475569' },
  default: { bg: '#f1f5f9', color: '#64748b' },
};

const typeLabels = {
  ebook: 'EBOOK',
  template: 'TEMPLATE',
  planilha: 'PLANILHA',
  kit: 'KIT',
  checklist: 'CHECKLIST',
  webinar: 'WEBINAR',
  calendario: 'CALENDÁRIO',
  ferramenta: 'FERRAMENTA',
  infografico: 'INFOGRÁFICO',
  curso: 'CURSO',
  relatorio: 'RELATÓRIO',
  tutorial: 'TUTORIAL',
  video: 'VÍDEO',
  podcast: 'PODCAST',
  audio: 'ÁUDIO',
  quiz: 'QUIZ',
  evento: 'EVENTO',
  demonstracao: 'DEMONSTRAÇÃO',
  pesquisa: 'PESQUISA',
};

function MaterialCard({ material, onClick }) {
  const isExternal = material.href.startsWith('http');
  const colors = typeColors[material.type] || typeColors.default;
  const typeLabel = typeLabels[material.type] || material.type.toUpperCase();

  const handleClick = (e) => {
    e.preventDefault();
    onClick(material);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="material-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
    >
      <div className="material-thumb">
        <img
          src={material.thumbnail}
          alt={material.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/placeholder-material.jpg';
          }}
        />
        {material.requiresLead && (
          <div className="download-overlay">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
        )}
        {isExternal && !material.requiresLead && (
          <div className="external-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
        )}
      </div>
      <div className="material-content">
        <span
          className="material-tag"
          style={{ background: colors.bg, color: colors.color }}
        >
          {typeLabel}
        </span>
        <h3 className="material-title">{material.title}</h3>
      </div>
    </motion.div>
  );
}

export default function MaterialsSection({ materials }) {
  const [activeType, setActiveType] = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const filteredMaterials = useMemo(() => {
    if (activeType === 'todos') {
      return materials;
    }
    return materials.filter((m) => m.type === activeType);
  }, [materials, activeType]);

  const handleMaterialClick = (material) => {
    if (material.requiresLead) {
      setSelectedMaterial(material);
      setModalOpen(true);
    } else {
      // Open directly
      const isExternal = material.href.startsWith('http');
      if (isExternal) {
        window.open(material.href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = material.href;
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedMaterial(null);
  };

  return (
    <section className="materials-section">
      <div className="materials-container">
        <h2 className="materials-title">Todos os materiais</h2>

        <TypeChips activeType={activeType} onTypeChange={setActiveType} />

        <div className="materials-grid">
          <AnimatePresence mode="popLayout">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onClick={handleMaterialClick}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredMaterials.length === 0 && (
          <div className="no-results">
            <p>Nenhum material encontrado nesta categoria.</p>
          </div>
        )}
      </div>

      {/* Lead Modal with dynamic content */}
      <LeadModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={selectedMaterial?.title || 'Material Gratuito'}
        description="Preencha seus dados para baixar"
        downloadUrl={selectedMaterial?.href}
      />

      <style>{`
        .materials-section {
          padding: 48px 0;
          background: #fff;
        }

        .materials-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .materials-title {
          margin: 0 0 24px;
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .materials-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .material-card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .material-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .material-card:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.3);
        }

        .material-thumb {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #f1f5f9;
        }

        .material-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .material-card:hover .material-thumb img {
          transform: scale(1.05);
        }

        .download-overlay,
        .external-overlay {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          color: #0ea5e9;
          transition: all 0.2s ease;
        }

        .material-card:hover .download-overlay,
        .material-card:hover .external-overlay {
          background: #0ea5e9;
          color: #fff;
          transform: scale(1.1);
        }

        .material-content {
          padding: 16px;
        }

        .material-tag {
          display: inline-block;
          padding: 4px 8px;
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .material-title {
          margin: 0;
          font-size: 0.9375rem;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .no-results {
          padding: 48px 24px;
          text-align: center;
          color: #64748b;
        }

        /* Tablet large */
        @media (max-width: 1024px) {
          .materials-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Tablet */
        @media (max-width: 768px) {
          .materials-section {
            padding: 40px 0;
          }

          .materials-container {
            padding: 0 16px;
          }

          .materials-title {
            font-size: 1.5rem;
            margin-bottom: 20px;
          }

          .materials-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        /* Mobile */
        @media (max-width: 540px) {
          .materials-section {
            padding: 32px 0;
          }

          .materials-title {
            font-size: 1.375rem;
          }

          .materials-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </section>
  );
}
