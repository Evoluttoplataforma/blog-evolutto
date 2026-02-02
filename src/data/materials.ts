export type MaterialType =
  | 'todos'
  | 'calendario'
  | 'evento'
  | 'kit'
  | 'curso'
  | 'ferramenta'
  | 'ebook'
  | 'template'
  | 'planilha'
  | 'demonstracao'
  | 'pesquisa'
  | 'relatorio'
  | 'tutorial'
  | 'webinar'
  | 'podcast'
  | 'video'
  | 'quiz'
  | 'checklist'
  | 'audio'
  | 'infografico';

export interface MaterialTypeOption {
  value: MaterialType;
  label: string;
}

export const materialTypes: MaterialTypeOption[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'calendario', label: 'Calendário' },
  { value: 'evento', label: 'Evento' },
  { value: 'kit', label: 'Kit' },
  { value: 'curso', label: 'Curso' },
  { value: 'ferramenta', label: 'Ferramenta' },
  { value: 'ebook', label: 'Ebook' },
  { value: 'template', label: 'Template' },
  { value: 'planilha', label: 'Planilha' },
  { value: 'demonstracao', label: 'Demonstração' },
  { value: 'pesquisa', label: 'Pesquisa' },
  { value: 'relatorio', label: 'Relatório' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'video', label: 'Vídeo' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'checklist', label: 'Checklist' },
  { value: 'audio', label: 'Áudio' },
  { value: 'infografico', label: 'Infográfico' },
];

export interface Material {
  id: string;
  title: string;
  type: MaterialType;
  thumbnail: string;
  href: string;
  requiresLead: boolean;
}

export const materials: Material[] = [
  {
    id: 'mat-1',
    title: 'Kit Completo para Consultores: Do Zero ao Primeiro Cliente',
    type: 'kit',
    thumbnail: '/images/materials/kit-consultores.jpg',
    href: '/downloads/kit-consultores.pdf',
    requiresLead: true,
  },
  {
    id: 'mat-2',
    title: 'Ebook: 10 Estratégias para Escalar sua Consultoria',
    type: 'ebook',
    thumbnail: '/images/materials/ebook-escalar.jpg',
    href: '/downloads/ebook-escalar-consultoria.pdf',
    requiresLead: true,
  },
  {
    id: 'mat-3',
    title: 'Template de Proposta Comercial para Consultorias',
    type: 'template',
    thumbnail: '/images/materials/template-proposta.jpg',
    href: '/downloads/template-proposta.docx',
    requiresLead: true,
  },
  {
    id: 'mat-4',
    title: 'Planilha de Precificação de Serviços',
    type: 'planilha',
    thumbnail: '/images/materials/planilha-preco.jpg',
    href: '/downloads/planilha-precificacao.xlsx',
    requiresLead: true,
  },
  {
    id: 'mat-5',
    title: 'Checklist: Como Estruturar sua Metodologia',
    type: 'checklist',
    thumbnail: '/images/materials/checklist-metodologia.jpg',
    href: '/downloads/checklist-metodologia.pdf',
    requiresLead: false,
  },
  {
    id: 'mat-6',
    title: 'Webinar: Transformação Digital em Consultorias',
    type: 'webinar',
    thumbnail: '/images/materials/webinar-digital.jpg',
    href: 'https://www.youtube.com/watch?v=webinar1',
    requiresLead: false,
  },
  {
    id: 'mat-7',
    title: 'Calendário Editorial 2025 para Consultores',
    type: 'calendario',
    thumbnail: '/images/materials/calendario-2025.jpg',
    href: '/downloads/calendario-editorial-2025.pdf',
    requiresLead: true,
  },
  {
    id: 'mat-8',
    title: 'Ferramenta: Calculadora de ROI para Clientes',
    type: 'ferramenta',
    thumbnail: '/images/materials/ferramenta-roi.jpg',
    href: 'https://evolutto.com.br/calculadora-roi',
    requiresLead: false,
  },
  {
    id: 'mat-9',
    title: 'Infográfico: Jornada do Consultor de Sucesso',
    type: 'infografico',
    thumbnail: '/images/materials/infografico-jornada.jpg',
    href: '/downloads/infografico-jornada.pdf',
    requiresLead: true,
  },
  {
    id: 'mat-10',
    title: 'Curso Gratuito: Primeiros Passos na Consultoria Digital',
    type: 'curso',
    thumbnail: '/images/materials/curso-primeiros-passos.jpg',
    href: 'https://evolutto.com.br/cursos/primeiros-passos',
    requiresLead: true,
  },
  {
    id: 'mat-11',
    title: 'Relatório: Tendências de Consultoria 2025',
    type: 'relatorio',
    thumbnail: '/images/materials/relatorio-tendencias.jpg',
    href: '/downloads/relatorio-tendencias-2025.pdf',
    requiresLead: true,
  },
  {
    id: 'mat-12',
    title: 'Tutorial: Como Usar o Evolutto do Zero',
    type: 'tutorial',
    thumbnail: '/images/materials/tutorial-evolutto.jpg',
    href: 'https://www.youtube.com/watch?v=tutorial1',
    requiresLead: false,
  },
];

export function getMaterialsByType(type: MaterialType): Material[] {
  if (type === 'todos') {
    return materials;
  }
  return materials.filter((m) => m.type === type);
}

export function getAllMaterials(): Material[] {
  return materials;
}

export function getTypeLabel(type: MaterialType): string {
  const found = materialTypes.find((t) => t.value === type);
  return found ? found.label : type.toUpperCase();
}
