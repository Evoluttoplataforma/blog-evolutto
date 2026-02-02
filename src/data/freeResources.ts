// Types for Free Resources Hub

export type ResourceType = 'marketing' | 'vendas' | 'plataforma' | 'ferramentas';

export interface FreeResource {
  id: string;
  type: ResourceType;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  tags: string[];
  category: string;
  isNew: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  duration?: string;
}

export interface ResourcePageConfig {
  type: ResourceType;
  eyebrow: string;
  title: string;
  description: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  heroImage: string;
  categories: string[];
  basePath: string;
}

// Page configurations
export const resourcePageConfigs: Record<ResourceType, ResourcePageConfig> = {
  marketing: {
    type: 'marketing',
    eyebrow: 'DOMINE O MARKETING DIGITAL',
    title: 'Demonstrações de Marketing',
    description: 'Aprenda estratégias de marketing digital para atrair mais clientes e escalar sua consultoria. Veja demonstrações práticas e replique os resultados.',
    ctaPrimary: { label: 'Assistir agora', href: '#recursos' },
    ctaSecondary: { label: 'Acesse as gravações', href: '#gravacoes' },
    heroImage: '/images/recursos/hero-marketing.jpg',
    categories: ['Todos', 'Análise do funil', 'Atração e Conversão de Leads', 'Relacionamento e Vendas', 'Agências e Consultorias'],
    basePath: '/recursos-gratuitos/demonstracoes/marketing',
  },
  vendas: {
    type: 'vendas',
    eyebrow: 'ACELERE SUAS VENDAS',
    title: 'Demonstrações de Vendas',
    description: 'Descubra técnicas de vendas consultivas que funcionam. Assista demonstrações reais e aprenda a fechar mais contratos.',
    ctaPrimary: { label: 'Assistir agora', href: '#recursos' },
    ctaSecondary: { label: 'Ver todas as demos', href: '#demos' },
    heroImage: '/images/recursos/hero-vendas.jpg',
    categories: ['Todos', 'Prospecção', 'Qualificação', 'Negociação', 'Fechamento', 'Pós-venda'],
    basePath: '/recursos-gratuitos/demonstracoes/vendas',
  },
  plataforma: {
    type: 'plataforma',
    eyebrow: 'APRENDA NA PRÁTICA',
    title: 'Demonstrações da Plataforma',
    description: 'Veja o Evolutto em ação. Tours completos pela plataforma, funcionalidades e casos de uso para maximizar seus resultados.',
    ctaPrimary: { label: 'Assistir agora', href: '#recursos' },
    ctaSecondary: { label: 'Testar grátis', href: 'https://evolutto.com.br/teste-gratis' },
    heroImage: '/images/recursos/hero-plataforma.jpg',
    categories: ['Todos', 'Tour da plataforma', 'Metodologias', 'Integrações', 'Relatórios', 'Automações'],
    basePath: '/recursos-gratuitos/demonstracoes/plataforma',
  },
  ferramentas: {
    type: 'ferramentas',
    eyebrow: 'FERRAMENTAS GRATUITAS',
    title: 'Ferramentas para Escalar sua Consultoria',
    description: 'Calculadoras, templates e ferramentas gratuitas para otimizar sua operação e conquistar mais resultados.',
    ctaPrimary: { label: 'Acessar ferramentas', href: '#recursos' },
    ctaSecondary: { label: 'Ver tutoriais', href: '#tutoriais' },
    heroImage: '/images/recursos/hero-ferramentas.jpg',
    categories: ['Todos', 'Calculadoras', 'Templates', 'Planilhas', 'Checklists', 'Guias'],
    basePath: '/recursos-gratuitos/ferramentas-gratuitas',
  },
};

// Helper function to get YouTube embed URL
export function getYouTubeEmbedUrl(url: string): string {
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  }
  return url;
}

// Helper function to get Vimeo embed URL
export function getVimeoEmbedUrl(url: string): string {
  const videoIdMatch = url.match(/vimeo\.com\/(\d+)/);
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://player.vimeo.com/video/${videoIdMatch[1]}`;
  }
  return url;
}

// Get embed URL from any video URL
export function getEmbedUrl(url: string): string {
  if (url.includes('youtube') || url.includes('youtu.be')) {
    return getYouTubeEmbedUrl(url);
  }
  if (url.includes('vimeo')) {
    return getVimeoEmbedUrl(url);
  }
  return url;
}
