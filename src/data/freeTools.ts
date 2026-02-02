import type { FreeResource } from './freeResources';

export const freeTools: FreeResource[] = [
  {
    id: 'tool-1',
    type: 'ferramentas',
    title: 'Calculadora de Precificação para Consultoria',
    slug: 'calculadora-precificacao-consultoria',
    description: 'Calcule o preço ideal dos seus serviços baseado em custos, margem e valor entregue.',
    thumbnail: '/images/recursos/ferramentas/thumb-calculadora-preco.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=tool1',
    tags: ['calculadora', 'precificação', 'preço'],
    category: 'Calculadoras',
    isNew: true,
    ctaLabel: 'Acessar calculadora',
    ctaHref: 'https://evolutto.com.br/calculadora-precificacao',
    duration: '8:30',
  },
  {
    id: 'tool-2',
    type: 'ferramentas',
    title: 'Template de Proposta Comercial',
    slug: 'template-proposta-comercial',
    description: 'Modelo profissional de proposta comercial que converte. Editável no Google Docs ou Word.',
    thumbnail: '/images/recursos/ferramentas/thumb-template-proposta.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=tool2',
    tags: ['template', 'proposta', 'vendas'],
    category: 'Templates',
    isNew: true,
    ctaLabel: 'Baixar template',
    ctaHref: '/downloads/template-proposta.docx',
    duration: '12:00',
  },
  {
    id: 'tool-3',
    type: 'ferramentas',
    title: 'Planilha de Gestão de Pipeline',
    slug: 'planilha-gestao-pipeline',
    description: 'Controle seu pipeline de vendas com esta planilha pronta para uso no Google Sheets.',
    thumbnail: '/images/recursos/ferramentas/thumb-planilha-pipeline.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=tool3',
    tags: ['planilha', 'pipeline', 'vendas'],
    category: 'Planilhas',
    isNew: false,
    ctaLabel: 'Baixar planilha',
    ctaHref: '/downloads/planilha-pipeline.xlsx',
    duration: '10:15',
  },
  {
    id: 'tool-4',
    type: 'ferramentas',
    title: 'Checklist de Onboarding de Clientes',
    slug: 'checklist-onboarding-clientes',
    description: 'Garanta uma experiência impecável para novos clientes com este checklist completo.',
    thumbnail: '/images/recursos/ferramentas/thumb-checklist-onboarding.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=tool4',
    tags: ['checklist', 'onboarding', 'clientes'],
    category: 'Checklists',
    isNew: false,
    ctaLabel: 'Baixar checklist',
    ctaHref: '/downloads/checklist-onboarding.pdf',
    duration: '6:45',
  },
  {
    id: 'tool-5',
    type: 'ferramentas',
    title: 'Guia Completo de Vendas Consultivas',
    slug: 'guia-vendas-consultivas',
    description: 'E-book com todas as técnicas e scripts para vender consultoria de alto valor.',
    thumbnail: '/images/recursos/ferramentas/thumb-guia-vendas.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=tool5',
    tags: ['guia', 'vendas', 'ebook'],
    category: 'Guias',
    isNew: true,
    ctaLabel: 'Baixar guia',
    ctaHref: '/downloads/guia-vendas-consultivas.pdf',
    duration: '15:00',
  },
  {
    id: 'tool-6',
    type: 'ferramentas',
    title: 'Calculadora de ROI para Clientes',
    slug: 'calculadora-roi-clientes',
    description: 'Demonstre o retorno sobre investimento da sua consultoria para potenciais clientes.',
    thumbnail: '/images/recursos/ferramentas/thumb-calculadora-roi.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=tool6',
    tags: ['calculadora', 'ROI', 'vendas'],
    category: 'Calculadoras',
    isNew: false,
    ctaLabel: 'Acessar calculadora',
    ctaHref: 'https://evolutto.com.br/calculadora-roi',
    duration: '9:20',
  },
  {
    id: 'tool-7',
    type: 'ferramentas',
    title: 'Template de Contrato de Consultoria',
    slug: 'template-contrato-consultoria',
    description: 'Modelo de contrato de prestação de serviços de consultoria revisado por advogados.',
    thumbnail: '/images/recursos/ferramentas/thumb-template-contrato.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=tool7',
    tags: ['template', 'contrato', 'jurídico'],
    category: 'Templates',
    isNew: false,
    ctaLabel: 'Baixar template',
    ctaHref: '/downloads/template-contrato.docx',
    duration: '11:30',
  },
  {
    id: 'tool-8',
    type: 'ferramentas',
    title: 'Planilha de Controle Financeiro',
    slug: 'planilha-controle-financeiro',
    description: 'Gerencie receitas, despesas e fluxo de caixa da sua consultoria com esta planilha.',
    thumbnail: '/images/recursos/ferramentas/thumb-planilha-financeiro.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=tool8',
    tags: ['planilha', 'financeiro', 'gestão'],
    category: 'Planilhas',
    isNew: true,
    ctaLabel: 'Baixar planilha',
    ctaHref: '/downloads/planilha-financeiro.xlsx',
    duration: '14:00',
  },
];

export function getFreeTools(): FreeResource[] {
  return freeTools;
}

export function getFreeToolBySlug(slug: string): FreeResource | undefined {
  return freeTools.find((tool) => tool.slug === slug);
}

export function getFreeToolsByCategory(category: string): FreeResource[] {
  if (category === 'Todos') return freeTools;
  return freeTools.filter((tool) => tool.category === category);
}

export function getRelatedFreeTools(currentId: string, limit: number = 3): FreeResource[] {
  return freeTools.filter((tool) => tool.id !== currentId).slice(0, limit);
}
