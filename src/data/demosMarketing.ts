import type { FreeResource } from './freeResources';

export const demosMarketing: FreeResource[] = [
  {
    id: 'mkt-1',
    type: 'marketing',
    title: 'Como criar campanhas de captação de leads qualificados',
    slug: 'campanhas-captacao-leads-qualificados',
    description: 'Aprenda a estruturar campanhas que atraem leads qualificados para sua consultoria, desde a definição do público até a conversão.',
    thumbnail: '/images/recursos/marketing/thumb-captacao-leads.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    tags: ['leads', 'campanhas', 'captação'],
    category: 'Atração e Conversão de Leads',
    isNew: true,
    duration: '15:30',
  },
  {
    id: 'mkt-2',
    type: 'marketing',
    title: 'Análise completa do funil de vendas no Evolutto',
    slug: 'analise-funil-vendas-evolutto',
    description: 'Veja como analisar cada etapa do seu funil de vendas e identificar gargalos para otimizar sua conversão.',
    thumbnail: '/images/recursos/marketing/thumb-funil-vendas.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    tags: ['funil', 'análise', 'conversão'],
    category: 'Análise do funil',
    isNew: true,
    duration: '22:45',
  },
  {
    id: 'mkt-3',
    type: 'marketing',
    title: 'Estratégias de relacionamento que geram vendas',
    slug: 'estrategias-relacionamento-vendas',
    description: 'Descubra como construir relacionamentos duradouros com leads e transformá-los em clientes fiéis.',
    thumbnail: '/images/recursos/marketing/thumb-relacionamento.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    tags: ['relacionamento', 'vendas', 'nurturing'],
    category: 'Relacionamento e Vendas',
    isNew: false,
    duration: '18:20',
  },
  {
    id: 'mkt-4',
    type: 'marketing',
    title: 'Marketing para agências e consultorias B2B',
    slug: 'marketing-agencias-consultorias-b2b',
    description: 'Estratégias específicas de marketing para empresas que vendem para outras empresas no mercado de consultoria.',
    thumbnail: '/images/recursos/marketing/thumb-b2b.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    tags: ['B2B', 'agências', 'consultorias'],
    category: 'Agências e Consultorias',
    isNew: false,
    duration: '25:10',
  },
  {
    id: 'mkt-5',
    type: 'marketing',
    title: 'Como medir ROI de campanhas de marketing digital',
    slug: 'medir-roi-campanhas-marketing',
    description: 'Aprenda a calcular o retorno sobre investimento das suas campanhas e otimizar seus gastos com marketing.',
    thumbnail: '/images/recursos/marketing/thumb-roi.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example5',
    tags: ['ROI', 'métricas', 'análise'],
    category: 'Análise do funil',
    isNew: false,
    duration: '12:55',
  },
  {
    id: 'mkt-6',
    type: 'marketing',
    title: 'Automação de marketing para consultorias',
    slug: 'automacao-marketing-consultorias',
    description: 'Configure fluxos de automação que trabalham 24/7 para nutrir e converter leads em clientes.',
    thumbnail: '/images/recursos/marketing/thumb-automacao.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example6',
    tags: ['automação', 'fluxos', 'email'],
    category: 'Atração e Conversão de Leads',
    isNew: true,
    duration: '28:00',
  },
];

export function getMarketingDemos(): FreeResource[] {
  return demosMarketing;
}

export function getMarketingDemoBySlug(slug: string): FreeResource | undefined {
  return demosMarketing.find((demo) => demo.slug === slug);
}

export function getMarketingDemosByCategory(category: string): FreeResource[] {
  if (category === 'Todos') return demosMarketing;
  return demosMarketing.filter((demo) => demo.category === category);
}

export function getRelatedMarketingDemos(currentId: string, limit: number = 3): FreeResource[] {
  return demosMarketing.filter((demo) => demo.id !== currentId).slice(0, limit);
}
