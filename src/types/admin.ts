import { Timestamp } from 'firebase/firestore';

// User roles
export type UserRole = 'author' | 'admin';

// Post status
export type PostStatus = 'draft' | 'review' | 'published';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: Timestamp;
}

// SEO data embedded in post
export interface PostSEO {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noindex: boolean;
}

// Post interface
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  status: PostStatus;
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  seo: PostSEO;
}

// Form data for creating/editing posts
export interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  status: PostStatus;
  publishedAt: Date | null;
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    noindex: boolean;
  };
}

// Dashboard stats
export interface DashboardStats {
  publishedLast7Days: number;
  publishedLast30Days: number;
  inReview: number;
  totalPosts: number;
  totalAuthors: number;
}

// Production by author
export interface AuthorProduction {
  authorId: string;
  authorName: string;
  published: number;
  drafts: number;
  inReview: number;
  total: number;
}

// Production by category
export interface CategoryProduction {
  category: string;
  count: number;
}

// Auth context state
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Validation errors
export interface ValidationErrors {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  general?: string;
}

// Categories available
export const CATEGORIES = [
  'Marketing',
  'Vendas',
  'Gestao',
  'Tecnologia',
  'Estrategia',
  'Empreendedorismo',
  'Produtividade',
  'Lideranca',
  'Inovacao',
  'Financas',
  'Digitalizacao',
  'Escala',
  'Produtizacao',
] as const;

export type Category = typeof CATEGORIES[number];
