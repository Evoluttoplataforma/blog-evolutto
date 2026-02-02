export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  type: 'online' | 'presencial' | 'hibrido';
  tag: string;
  ctaText: string;
  ctaUrl: string;
  image?: string;
  featured?: boolean;
}

export const events: Event[] = [
  {
    id: 'evento-1',
    title: 'Webinar: Como Escalar sua Consultoria em 2026',
    description: 'Descubra as estrategias que os consultores de sucesso estao usando para multiplicar seus resultados sem aumentar a equipe.',
    date: new Date('2026-02-15'),
    time: '19:00',
    type: 'online',
    tag: 'Webinar',
    ctaText: 'Inscreva-se Gratis',
    ctaUrl: 'https://evolutto.com.br/webinar',
    image: '/images/evento-webinar.jpg',
    featured: true,
  },
  {
    id: 'evento-2',
    title: 'Workshop: Produtizacao de Consultorias',
    description: 'Aprenda a transformar seu conhecimento em produtos digitais escalaveis.',
    date: new Date('2026-02-20'),
    time: '14:00',
    type: 'online',
    tag: 'Workshop',
    ctaText: 'Ver Detalhes',
    ctaUrl: 'https://evolutto.com.br/workshop',
  },
  {
    id: 'evento-3',
    title: 'Live: Tendencias de Consultoria para 2026',
    description: 'Analise das principais tendencias do mercado de consultoria.',
    date: new Date('2026-02-25'),
    time: '20:00',
    type: 'online',
    tag: 'Live',
    ctaText: 'Ver Detalhes',
    ctaUrl: 'https://evolutto.com.br/live',
  },
  {
    id: 'evento-4',
    title: 'Masterclass: Vendas de Alto Valor',
    description: 'Tecnicas avancadas para fechar contratos de consultoria.',
    date: new Date('2026-03-05'),
    time: '19:30',
    type: 'online',
    tag: 'Masterclass',
    ctaText: 'Ver Detalhes',
    ctaUrl: 'https://evolutto.com.br/masterclass',
  },
];

export function getFeaturedEvent(): Event | undefined {
  return events.find((e) => e.featured);
}

export function getUpcomingEvents(limit = 4): Event[] {
  const now = new Date();
  return events
    .filter((e) => e.date >= now && !e.featured)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, limit);
}

export function formatEventDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}
