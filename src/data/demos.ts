export interface Demo {
  id: string;
  title: string;
  tag: string;
  thumbnail: string;
  href: string;
  isNew: boolean;
  isVideo: boolean;
}

export const demos: Demo[] = [
  {
    id: 'demo-1',
    title: 'Como criar sua primeira consultoria digital no Evolutto',
    tag: 'DEMONSTRAÇÃO',
    thumbnail: '/images/demos/demo-consultoria-digital.jpg',
    href: 'https://www.youtube.com/watch?v=example1',
    isNew: true,
    isVideo: true,
  },
  {
    id: 'demo-2',
    title: 'Automatize sua metodologia e ganhe tempo com IA',
    tag: 'DEMONSTRAÇÃO',
    thumbnail: '/images/demos/demo-ia-metodologia.jpg',
    href: 'https://www.youtube.com/watch?v=example2',
    isNew: false,
    isVideo: true,
  },
  {
    id: 'demo-3',
    title: 'Tour completo pela plataforma Evolutto',
    tag: 'DEMONSTRAÇÃO',
    thumbnail: '/images/demos/demo-tour-plataforma.jpg',
    href: 'https://www.youtube.com/watch?v=example3',
    isNew: false,
    isVideo: true,
  },
  {
    id: 'demo-4',
    title: 'Integração com WhatsApp e Google Agenda',
    tag: 'DEMONSTRAÇÃO',
    thumbnail: '/images/demos/demo-integracoes.jpg',
    href: 'https://www.youtube.com/watch?v=example4',
    isNew: true,
    isVideo: true,
  },
  {
    id: 'demo-5',
    title: 'Dashboard de métricas e acompanhamento de clientes',
    tag: 'DEMONSTRAÇÃO',
    thumbnail: '/images/demos/demo-dashboard.jpg',
    href: 'https://www.youtube.com/watch?v=example5',
    isNew: false,
    isVideo: true,
  },
];

export function getFeaturedDemos(count: number = 3): Demo[] {
  return demos.slice(0, count);
}

export function getAllDemos(): Demo[] {
  return demos;
}
