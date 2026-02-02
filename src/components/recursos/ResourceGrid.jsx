import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResourceFilterChips from './ResourceFilterChips';

// Card component (React version)
function ResourceCardReact({ resource, basePath }) {
  const href = `${basePath}/${resource.slug}`;

  return (
    <motion.a
      href={href}
      className="resource-card"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-thumb">
        <img
          src={resource.thumbnail}
          alt={resource.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/placeholder-resource.jpg';
          }}
        />
        <div className="play-overlay">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        {resource.isNew && <span className="new-badge">NOVO CONTEÚDO</span>}
        {resource.duration && <span className="duration-badge">{resource.duration}</span>}
      </div>

      <div className="card-content">
        <div className="card-tags">
          <span className="category-tag">{resource.category}</span>
        </div>
        <h3 className="card-title">{resource.title}</h3>
        <p className="card-description">{resource.description}</p>
      </div>
    </motion.a>
  );
}

export default function ResourceGrid({ resources, categories, basePath }) {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredResources = useMemo(() => {
    if (activeCategory === 'Todos') {
      return resources;
    }
    return resources.filter((r) => r.category === activeCategory);
  }, [resources, activeCategory]);

  return (
    <section className="resource-section" id="recursos">
      <div className="section-container">
        <ResourceFilterChips
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="resource-grid">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((resource) => (
              <ResourceCardReact
                key={resource.id}
                resource={resource}
                basePath={basePath}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredResources.length === 0 && (
          <div className="no-results">
            <p>Nenhum recurso encontrado nesta categoria.</p>
          </div>
        )}
      </div>

      <style>{`
        .resource-section {
          padding: 48px 0 80px;
          background: #fff;
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .resource-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .resource-card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
        }

        .resource-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
        }

        .card-thumb {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #f1f5f9;
        }

        .card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .resource-card:hover .card-thumb img {
          transform: scale(1.05);
        }

        .play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.35);
          transition: all 0.2s ease;
        }

        .play-overlay svg {
          width: 56px;
          height: 56px;
          color: #fff;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
          transition: transform 0.2s ease;
        }

        .resource-card:hover .play-overlay {
          background: rgba(0, 0, 0, 0.45);
        }

        .resource-card:hover .play-overlay svg {
          transform: scale(1.15);
        }

        .new-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 5px 10px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #fff;
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
        }

        .duration-badge {
          position: absolute;
          bottom: 12px;
          right: 12px;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.75);
          color: #fff;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 4px;
        }

        .card-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .category-tag {
          display: inline-block;
          padding: 4px 10px;
          background: #dbeafe;
          color: #1e40af;
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .card-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-description {
          margin: 0;
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
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
          .resource-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        /* Mobile */
        @media (max-width: 640px) {
          .resource-section {
            padding: 32px 0 64px;
          }

          .section-container {
            padding: 0 16px;
          }

          .resource-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .card-content {
            padding: 16px;
          }

          .card-title {
            font-size: 0.9375rem;
          }

          .card-description {
            -webkit-line-clamp: 2;
          }
        }
      `}</style>
    </section>
  );
}
