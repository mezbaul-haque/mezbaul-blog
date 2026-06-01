import {
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getTopPostsByViews } from '../services/analytics';
import { posts as allPosts } from '../data/posts';
import { PostCard } from './PostCard';

export function PopularPosts({ limit = 3 }) {
  const [topPosts, setTopPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopPosts() {
      try {
        setIsLoading(true);
        setError(null);
        
        const stats = await getTopPostsByViews(limit);
        
        if (stats.length === 0) {
          // Fallback: show recent posts if no view data yet
          const recentPosts = allPosts.slice(0, limit).map(post => ({
            ...post,
            viewCount: 0
          }));
          setTopPosts(recentPosts);
          return;
        }

        // Enrich with full post data
        const enrichedPosts = stats
          .map((stat) => {
            const post = allPosts.find((p) => p.slug === stat.postSlug);
            return post ? { ...post, viewCount: stat.viewCount } : null;
          })
          .filter(Boolean);

        setTopPosts(
          enrichedPosts.length > 0
            ? enrichedPosts
            : allPosts.slice(0, limit).map((post) => ({ ...post, viewCount: 0 }))
        );
      } catch (err) {
        console.error('[PopularPosts] Error fetching popular posts:', err);
        setError(err);
        // Fallback to recent posts on error
        setTopPosts(allPosts.slice(0, limit));
      } finally {
        setIsLoading(false);
      }
    }

    fetchTopPosts();
  }, [limit]);

  if (isLoading) {
    return (
      <Stack alignItems="center" sx={{ py: 4 }}>
        <CircularProgress size={28} />
      </Stack>
    );
  }

  if (!topPosts || topPosts.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
        {error ? 'Unable to load popular posts.' : 'No posts available.'}
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {topPosts.map((post) => (
        <PostCard key={post.slug} post={post} horizontal realtime={false} />
      ))}
    </Stack>
  );
}
