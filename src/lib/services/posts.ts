import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Post, PostFormData, PostStatus, DashboardStats, AuthorProduction, CategoryProduction } from '../../types/admin';

const COLLECTION = 'posts';

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
  if (!db) return false;

  try {
    const q = query(collection(db, COLLECTION), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return true;

    if (excludeId) {
      return querySnapshot.docs.every((doc) => doc.id === excludeId);
    }

    return false;
  } catch (error) {
    console.error('Error checking slug:', error);
    return false;
  }
}

// Get post by ID
export async function getPostById(id: string): Promise<Post | null> {
  if (!db) return null;

  try {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Post;
    }
    return null;
  } catch (error) {
    console.error('Error getting post:', error);
    return null;
  }
}

// Get post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!db) return null;

  try {
    const q = query(collection(db, COLLECTION), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Post;
    }
    return null;
  } catch (error) {
    console.error('Error getting post by slug:', error);
    return null;
  }
}

// Get all posts (with optional filters)
export async function getPosts(filters?: {
  status?: PostStatus;
  authorId?: string;
  category?: string;
  limitCount?: number;
}): Promise<Post[]> {
  if (!db) return [];

  try {
    let q = query(collection(db, COLLECTION), orderBy('updatedAt', 'desc'));

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.authorId) {
      q = query(q, where('authorId', '==', filters.authorId));
    }
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters?.limitCount) {
      q = query(q, limit(filters.limitCount));
    }

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
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
  if (!db) return null;

  try {
    const now = Timestamp.now();

    const postData = {
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
    };

    const docRef = await addDoc(collection(db, COLLECTION), postData);

    return { id: docRef.id, ...postData } as Post;
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
  if (!db) return false;

  try {
    const docRef = doc(db, COLLECTION, id);
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    // Handle publishedAt
    if (data.status === 'published') {
      const existingPost = await getPostById(id);
      if (!existingPost?.publishedAt) {
        updateData.publishedAt = Timestamp.now();
      }
    }

    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
}

// Update post status
export async function updatePostStatus(id: string, status: PostStatus): Promise<boolean> {
  if (!db) return false;

  try {
    const docRef = doc(db, COLLECTION, id);
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: Timestamp.now(),
    };

    if (status === 'published') {
      const existingPost = await getPostById(id);
      if (!existingPost?.publishedAt) {
        updateData.publishedAt = Timestamp.now();
      }
    }

    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating post status:', error);
    return false;
  }
}

// Delete post
export async function deletePost(id: string): Promise<boolean> {
  if (!db) return false;

  try {
    await deleteDoc(doc(db, COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

// Get dashboard stats
export async function getDashboardStats(): Promise<DashboardStats> {
  if (!db) {
    return {
      publishedLast7Days: 0,
      publishedLast30Days: 0,
      inReview: 0,
      totalPosts: 0,
      totalAuthors: 0,
    };
  }

  try {
    const allPosts = await getPosts();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const publishedPosts = allPosts.filter((p) => p.status === 'published');
    const uniqueAuthors = new Set(allPosts.map((p) => p.authorId));

    return {
      publishedLast7Days: publishedPosts.filter(
        (p) => p.publishedAt && p.publishedAt.toDate() >= sevenDaysAgo
      ).length,
      publishedLast30Days: publishedPosts.filter(
        (p) => p.publishedAt && p.publishedAt.toDate() >= thirtyDaysAgo
      ).length,
      inReview: allPosts.filter((p) => p.status === 'review').length,
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
  if (!db) return [];

  try {
    const allPosts = await getPosts();
    const authorMap = new Map<string, AuthorProduction>();

    allPosts.forEach((post) => {
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
  if (!db) return [];

  try {
    const allPosts = await getPosts();
    const categoryMap = new Map<string, number>();

    allPosts.forEach((post) => {
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
