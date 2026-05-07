import { useEffect, useState } from 'react';
import { getPostViewCount, getTopPostsByViews, getAllPostsViewStats } from '../services/analytics';

/**
 * Hook to fetch and cache the view count for a specific post
 */
export function usePostViewCount(postSlug) {
  const [viewCount, setViewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postSlug) {
      setIsLoading(false);
      return;
    }

    async function fetchViewCount() {
      try {
        setIsLoading(true);
        const count = await getPostViewCount(postSlug);
        setViewCount(count);
      } catch (err) {
        console.error('Error fetching view count:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchViewCount();
  }, [postSlug]);

  return { viewCount, isLoading, error };
}

/**
 * Hook to fetch top posts by view count
 */
export function useTopPosts(limit = 5) {
  const [topPosts, setTopPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopPosts() {
      try {
        setIsLoading(true);
        const posts = await getTopPostsByViews(limit);
        setTopPosts(posts);
      } catch (err) {
        console.error('Error fetching top posts:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTopPosts();
  }, [limit]);

  return { topPosts, isLoading, error };
}

/**
 * Hook to fetch view statistics for all posts
 */
export function useAllPostsStats() {
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        const allStats = await getAllPostsViewStats();
        setStats(allStats);
      } catch (err) {
        console.error('Error fetching all posts stats:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading, error };
}
