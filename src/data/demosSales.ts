import type { FreeResource } from './freeResources';

export const demosSales: FreeResource[] = [
  {
    id: 'sales-1',
    type: 'vendas',
    title: 'Técnicas de prospecção ativa para consultores',
    slug: 'tecnicas-prospeccao-ativa-consultores',
    description: 'Aprenda métodos comprovados de prospecção que geram reuniões qualificadas com decisores.',
    thumbnail: '/images/recursos/vendas/thumb-prospeccao.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=sales1',
    tags: ['prospecção', 'outbound', 'leads'],
    category: 'Prospecção',
    isNew: true,
    duration: '20:15',
  },
  {
    id: 'sales-2',
    type: 'vendas',
    title: 'Como qualificar leads usando BANT e GPCT',
    slug: 'qualificar-leads-bant-gpct',
    description: 'Frameworks práticos para identificar leads prontos para comprar e priorizar seu pipeline.',
    thumbnail: '/images/recursos/vendas/thumb-qualificacao.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=sales2',
    tags: ['qualificação', 'BANT', 'GPCT'],
    category: 'Qualificação',
    isNew: true,
    duration: '18:40',
  },
  {
    id: 'sales-3',
    type: 'vendas',
    title: 'Negociação consultiva: como apresentar valor',
    slug: 'negociacao-consultiva-apresentar-valor',
    description: 'Técnicas para conduzir negociações focadas em valor, não em preço, e aumentar ticket médio.',
    thumbnail: '/images/recursos/vendas/thumb-negociacao.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=sales3',
    tags: ['negociação', 'valor', 'preço'],
    category: 'Negociação',
    isNew: false,
    duration: '25:00',
  },
  {
    id: 'sales-4',
    type: 'vendas',
    title: 'Fechamento de contratos de consultoria',
    slug: 'fechamento-contratos-consultoria',
    description: 'Estratégias para acelerar o fechamento e superar objeções comuns em vendas de consultoria.',
    thumbnail: '/images/recursos/vendas/thumb-fechamento.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=sales4',
    tags: ['fechamento', 'objeções', 'contrato'],
    category: 'Fechamento',
    isNew: false,
    duration: '22:30',
  },
  {
    id: 'sales-5',
    type: 'vendas',
    title: 'Pós-venda que gera indicações e upsell',
    slug: 'pos-venda-indicacoes-upsell',
    description: 'Como transformar clientes satisfeitos em promotores e expandir contratos existentes.',
    thumbnail: '/images/recursos/vendas/thumb-posvenda.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=sales5',
    tags: ['pós-venda', 'indicações', 'upsell'],
    category: 'Pós-venda',
    isNew: true,
    duration: '16:45',
  },
  {
    id: 'sales-6',
    type: 'vendas',
    title: 'Pipeline de vendas: gestão e previsibilidade',
    slug: 'pipeline-vendas-gestao-previsibilidade',
    description: 'Organize seu pipeline para ter previsibilidade de receita e foco nas oportunidades certas.',
    thumbnail: '/images/recursos/vendas/thumb-pipeline.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=sales6',
    tags: ['pipeline', 'gestão', 'forecast'],
    category: 'Qualificação',
    isNew: false,
    duration: '19:20',
  },
];

export function getSalesDemos(): FreeResource[] {
  return demosSales;
}

export function getSalesDemoBySlug(slug: string): FreeResource | undefined {
  return demosSales.find((demo) => demo.slug === slug);
}

export function getSalesDemosByCategory(category: string): FreeResource[] {
  if (category === 'Todos') return demosSales;
  return demosSales.filter((demo) => demo.category === category);
}

export function getRelatedSalesDemos(currentId: string, limit: number = 3): FreeResource[] {
  return demosSales.filter((demo) => demo.id !== currentId).slice(0, limit);
}
