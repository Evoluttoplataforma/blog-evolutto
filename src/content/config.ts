import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).default(['geral']),
    coverImage: z.string().optional(),
    excerpt: z.string().optional(),
    author: z.object({
      name: z.string(),
      role: z.string().optional(),
      avatar: z.string().optional(),
      bio: z.string().optional(),
    }).optional(),
    readTime: z.string().optional(),
    status: z.enum(['draft', 'published']).default('published'),
    tags: z.array(z.string()).optional(),
  }),
});

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    coverImage: z.string().optional(),
    excerpt: z.string().optional(),
    status: z.enum(['draft', 'published']).default('published'),
  }),
});

export const collections = {
  blog: blogCollection,
  pages: pagesCollection,
};
