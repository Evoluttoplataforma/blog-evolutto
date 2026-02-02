import React from 'react';

const materialTypes = [
  { value: 'todos', label: 'Todos' },
  { value: 'ebook', label: 'Ebook' },
  { value: 'template', label: 'Template' },
  { value: 'planilha', label: 'Planilha' },
  { value: 'kit', label: 'Kit' },
  { value: 'checklist', label: 'Checklist' },
  { value: 'calendario', label: 'Calendário' },
  { value: 'ferramenta', label: 'Ferramenta' },
  { value: 'curso', label: 'Curso' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'video', label: 'Vídeo' },
  { value: 'infografico', label: 'Infográfico' },
  { value: 'relatorio', label: 'Relatório' },
  { value: 'pesquisa', label: 'Pesquisa' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'audio', label: 'Áudio' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'evento', label: 'Evento' },
  { value: 'demonstracao', label: 'Demonstração' },
];

export default function TypeChips({ activeType, onTypeChange }) {
  return (
    <div className="type-chips">
      {materialTypes.map((type) => (
        <button
          key={type.value}
          className={`type-chip ${activeType === type.value ? 'active' : ''}`}
          onClick={() => onTypeChange(type.value)}
        >
          {type.label}
        </button>
      ))}

      <style>{`
        .type-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }

        .type-chip {
          padding: 8px 16px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #64748b;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .type-chip:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #475569;
        }

        .type-chip.active {
          background: #0ea5e9;
          border-color: #0ea5e9;
          color: #fff;
        }

        .type-chip.active:hover {
          background: #0284c7;
          border-color: #0284c7;
        }

        @media (max-width: 640px) {
          .type-chips {
            gap: 6px;
            margin-bottom: 20px;
          }

          .type-chip {
            padding: 6px 12px;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
