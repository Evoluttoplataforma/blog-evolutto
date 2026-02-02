// Local posts service using localStorage
import type { Post, PostFormData, PostStatus, DashboardStats, AuthorProduction, CategoryProduction } from '../../types/admin';

const POSTS_KEY = 'blog_posts';

// Helper functions
function getStoredPosts(): Post[] {
  try {
    const posts = localStorage.getItem(POSTS_KEY);
    return posts ? JSON.parse(posts) : [];
  } catch {
    return [];
  }
}

function savePosts(posts: Post[]): void {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Check if slug is unique
export async function isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const posts = getStoredPosts();
  const existing = posts.find(p => p.slug === slug);

  if (!existing) return true;
  if (excludeId && existing.id === excludeId) return true;

  return false;
}

// Get post by ID
export async function getPostById(id: string): Promise<Post | null> {
  const posts = getStoredPosts();
  return posts.find(p => p.id === id) || null;
}

// Get post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = getStoredPosts();
  return posts.find(p => p.slug === slug) || null;
}

// Get all posts (with optional filters)
export async function getPosts(filters?: {
  status?: PostStatus;
  authorId?: string;
  category?: string;
  limitCount?: number;
}): Promise<Post[]> {
  let posts = getStoredPosts();

  // Sort by updatedAt descending
  posts.sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });

  if (filters?.status) {
    posts = posts.filter(p => p.status === filters.status);
  }
  if (filters?.authorId) {
    posts = posts.filter(p => p.authorId === filters.authorId);
  }
  if (filters?.category) {
    posts = posts.filter(p => p.category === filters.category);
  }
  if (filters?.limitCount) {
    posts = posts.slice(0, filters.limitCount);
  }

  return posts;
}

// Get posts by author
export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  return getPosts({ authorId });
}

// Get posts by status
export async function getPostsByStatus(status: PostStatus): Promise<Post[]> {
  return getPosts({ status });
}

// Create post
export async function createPost(
  data: PostFormData,
  authorId: string,
  authorName: string
): Promise<Post | null> {
  try {
    const posts = getStoredPosts();
    const now = new Date().toISOString();

    const newPost: Post = {
      id: 'post-' + Date.now(),
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      category: data.category,
      tags: data.tags,
      authorId,
      authorName,
      status: data.status,
      publishedAt: data.status === 'published' ? now : null,
      createdAt: now,
      updatedAt: now,
      seo: {
        metaTitle: data.seo.metaTitle,
        metaDescription: data.seo.metaDescription,
        canonicalUrl: data.seo.canonicalUrl || '',
        ogTitle: data.seo.ogTitle || '',
        ogDescription: data.seo.ogDescription || '',
        ogImage: data.seo.ogImage || '',
        noindex: data.seo.noindex || false,
      },
    } as Post;

    posts.push(newPost);
    savePosts(posts);

    return newPost;
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
}

// Update post
export async function updatePost(
  id: string,
  data: Partial<PostFormData>
): Promise<boolean> {
  try {
    const posts = getStoredPosts();
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) return false;

    const now = new Date().toISOString();
    posts[index] = {
      ...posts[index],
      ...data,
      updatedAt: now,
    };

    // Handle publishedAt
    if (data.status === 'published' && !posts[index].publishedAt) {
      posts[index].publishedAt = now;
    }

    savePosts(posts);
    return true;
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
}

// Update post status
export async function updatePostStatus(id: string, status: PostStatus): Promise<boolean> {
  return updatePost(id, { status } as Partial<PostFormData>);
}

// Delete post
export async function deletePost(id: string): Promise<boolean> {
  try {
    const posts = getStoredPosts().filter(p => p.id !== id);
    savePosts(posts);
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

// Get dashboard stats
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const allPosts = await getPosts();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const publishedPosts = allPosts.filter(p => p.status === 'published');
    const uniqueAuthors = new Set(allPosts.map(p => p.authorId));

    return {
      publishedLast7Days: publishedPosts.filter(
        p => p.publishedAt && new Date(p.publishedAt) >= sevenDaysAgo
      ).length,
      publishedLast30Days: publishedPosts.filter(
        p => p.publishedAt && new Date(p.publishedAt) >= thirtyDaysAgo
      ).length,
      inReview: allPosts.filter(p => p.status === 'review').length,
      totalPosts: allPosts.length,
      totalAuthors: uniqueAuthors.size,
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return {
      publishedLast7Days: 0,
      publishedLast30Days: 0,
      inReview: 0,
      totalPosts: 0,
      totalAuthors: 0,
    };
  }
}

// Get production by author
export async function getProductionByAuthor(): Promise<AuthorProduction[]> {
  try {
    const allPosts = await getPosts();
    const authorMap = new Map<string, AuthorProduction>();

    allPosts.forEach(post => {
      const existing = authorMap.get(post.authorId) || {
        authorId: post.authorId,
        authorName: post.authorName,
        published: 0,
        drafts: 0,
        inReview: 0,
        total: 0,
      };

      existing.total++;
      if (post.status === 'published') existing.published++;
      if (post.status === 'draft') existing.drafts++;
      if (post.status === 'review') existing.inReview++;

      authorMap.set(post.authorId, existing);
    });

    return Array.from(authorMap.values()).sort((a, b) => b.total - a.total);
  } catch (error) {
    console.error('Error getting production by author:', error);
    return [];
  }
}

// Get production by category
export async function getProductionByCategory(): Promise<CategoryProduction[]> {
  try {
    const allPosts = await getPosts();
    const categoryMap = new Map<string, number>();

    allPosts.forEach(post => {
      const count = categoryMap.get(post.category) || 0;
      categoryMap.set(post.category, count + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error getting production by category:', error);
    return [];
  }
}
