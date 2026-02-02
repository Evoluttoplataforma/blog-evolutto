import type { FreeResource } from './freeResources';

export const demosPlatform: FreeResource[] = [
  {
    id: 'plat-1',
    type: 'plataforma',
    title: 'Tour completo pela plataforma Evolutto',
    slug: 'tour-completo-plataforma-evolutto',
    description: 'Conheça todas as funcionalidades do Evolutto em um tour guiado de 30 minutos.',
    thumbnail: '/images/recursos/plataforma/thumb-tour.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=plat1',
    tags: ['tour', 'overview', 'funcionalidades'],
    category: 'Tour da plataforma',
    isNew: true,
    duration: '32:00',
  },
  {
    id: 'plat-2',
    type: 'plataforma',
    title: 'Como criar e gerenciar metodologias no Evolutto',
    slug: 'criar-gerenciar-metodologias-evolutto',
    description: 'Passo a passo para digitalizar sua metodologia de consultoria na plataforma.',
    thumbnail: '/images/recursos/plataforma/thumb-metodologias.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=plat2',
    tags: ['metodologias', 'criação', 'gestão'],
    category: 'Metodologias',
    isNew: true,
    duration: '24:15',
  },
  {
    id: 'plat-3',
    type: 'plataforma',
    title: 'Integrações: WhatsApp, Google Agenda e mais',
    slug: 'integracoes-whatsapp-google-agenda',
    description: 'Configure integrações que automatizam sua rotina e melhoram a experiência do cliente.',
    thumbnail: '/images/recursos/plataforma/thumb-integracoes.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=plat3',
    tags: ['integrações', 'WhatsApp', 'Google'],
    category: 'Integrações',
    isNew: false,
    duration: '18:30',
  },
  {
    id: 'plat-4',
    type: 'plataforma',
    title: 'Dashboard de relatórios e métricas',
    slug: 'dashboard-relatorios-metricas',
    description: 'Aprenda a usar os relatórios do Evolutto para tomar decisões baseadas em dados.',
    thumbnail: '/images/recursos/plataforma/thumb-relatorios.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=plat4',
    tags: ['relatórios', 'métricas', 'dashboard'],
    category: 'Relatórios',
    isNew: false,
    duration: '21:00',
  },
  {
    id: 'plat-5',
    type: 'plataforma',
    title: 'Automações que economizam horas por semana',
    slug: 'automacoes-economizam-horas',
    description: 'Configure automações de tarefas, lembretes e acompanhamentos para ganhar produtividade.',
    thumbnail: '/images/recursos/plataforma/thumb-automacoes.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=plat5',
    tags: ['automações', 'produtividade', 'tarefas'],
    category: 'Automações',
    isNew: true,
    duration: '26:45',
  },
  {
    id: 'plat-6',
    type: 'plataforma',
    title: 'Gestão de clientes e projetos no Evolutto',
    slug: 'gestao-clientes-projetos-evolutto',
    description: 'Organize todos os seus clientes e projetos em um só lugar com visão 360°.',
    thumbnail: '/images/recursos/plataforma/thumb-gestao.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=plat6',
    tags: ['clientes', 'projetos', 'gestão'],
    category: 'Tour da plataforma',
    isNew: false,
    duration: '19:50',
  },
];

export function getPlatformDemos(): FreeResource[] {
  return demosPlatform;
}

export function getPlatformDemoBySlug(slug: string): FreeResource | undefined {
  return demosPlatform.find((demo) => demo.slug === slug);
}

export function getPlatformDemosByCategory(category: string): FreeResource[] {
  if (category === 'Todos') return demosPlatform;
  return demosPlatform.filter((demo) => demo.category === category);
}

export function getRelatedPlatformDemos(currentId: string, limit: number = 3): FreeResource[] {
  return demosPlatform.filter((demo) => demo.id !== currentId).slice(0, limit);
}
