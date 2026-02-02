import React from 'react';

export default function ResourceFilterChips({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="filter-chips" role="group" aria-label="Filtrar por categoria">
      {categories.map((category) => (
        <button
          key={category}
          className={`filter-chip ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryChange(category)}
          aria-pressed={activeCategory === category}
        >
          {category}
        </button>
      ))}

      <style>{`
        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 32px;
        }

        .filter-chip {
          padding: 10px 18px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #475569;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .filter-chip:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #1e293b;
        }

        .filter-chip:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
        }

        .filter-chip.active {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
        }

        .filter-chip.active:hover {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
        }

        @media (max-width: 640px) {
          .filter-chips {
            gap: 8px;
            margin-bottom: 24px;
          }

          .filter-chip {
            padding: 8px 14px;
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </div>
  );
}
