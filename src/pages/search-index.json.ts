import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');

  const searchIndex = posts.map((post) => ({
    title: post.data.title,
    slug: post.slug,
    excerpt: post.data.excerpt || post.data.description || '',
    categories: post.data.categories || ['Geral'],
  }));

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
