export interface NextLive {
  title: string;
  description: string;
  dateISO: string;
  timezone: string;
  ctaLabel: string;
  href: string;
  detailsHref?: string;
  platform: 'YouTube' | 'Zoom' | 'Google Meet' | 'Teams' | 'Outro';
  isActive: boolean;
}

export const nextLive: NextLive = {
  title: 'Como Escalar sua Consultoria sem Aumentar a Equipe',
  description: 'Estrategias praticas para multiplicar seus resultados usando tecnologia e processos inteligentes.',
  dateISO: '2026-02-20T19:00:00-03:00',
  timezone: 'America/Sao_Paulo',
  ctaLabel: 'Garantir minha vaga',
  href: 'https://evolutto.com.br/live',
  detailsHref: 'https://evolutto.com.br/live-detalhes',
  platform: 'YouTube',
  isActive: true,
};

export function isLiveUpcoming(live: NextLive): boolean {
  if (!live.isActive) return false;
  const liveDate = new Date(live.dateISO);
  const now = new Date();
  return liveDate > now;
}

export function formatLiveDate(dateISO: string): string {
  const date = new Date(dateISO);
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export function formatLiveTime(dateISO: string): string {
  const date = new Date(dateISO);
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
