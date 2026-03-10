import { useState, useEffect, useCallback } from "react";
import { blogApi, BlogPost } from "@/services/api";

/**
 * Shared Blog Store — Database Only
 * 
 * Fetches posts exclusively from the backend API.
 * No static fallback — if the backend is down, shows empty state with error.
 */

export interface SharedBlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
  date: string;
  readTime: string;
  createdAt: string;
}

const mapPost = (p: BlogPost): SharedBlogPost => ({
  _id: p._id,
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  content: p.content,
  category: p.category,
  published: p.published,
  date: p.date,
  readTime: p.readTime,
  createdAt: p.createdAt,
});

export function useBlogStore() {
  const [posts, setPosts] = useState<SharedBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { posts: apiPosts } = await blogApi.getAll();
      setPosts(apiPosts.map(mapPost));
    } catch (err: any) {
      console.error("Blog API error:", err.message);
      setError("Could not load blog posts. Make sure the backend is running.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addPost = useCallback(async (post: Omit<SharedBlogPost, "_id" | "createdAt">) => {
    const created = await blogApi.create(post as any);
    await fetchPosts();
    return created;
  }, [fetchPosts]);

  const updatePost = useCallback(async (id: string, changes: Partial<SharedBlogPost>) => {
    await blogApi.update(id, changes);
    await fetchPosts();
  }, [fetchPosts]);

  const deletePost = useCallback(async (id: string) => {
    await blogApi.delete(id);
    await fetchPosts();
  }, [fetchPosts]);

  const publishedPosts = posts.filter(p => p.published);

  return { posts, publishedPosts, addPost, updatePost, deletePost, loading, error, refetch: fetchPosts };
}
