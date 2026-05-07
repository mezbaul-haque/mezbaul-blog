import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getTopPostsByViews } from '../services/analytics';
import { posts as allPosts } from '../data/posts';

export function PopularPosts({ limit = 3, showViewCount = true }) {
  const [topPosts, setTopPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopPosts() {
      try {
        setIsLoading(true);
        setError(null);
        console.log('[PopularPosts] Fetching top', limit, 'posts');
        
        const stats = await getTopPostsByViews(limit);
        console.log('[PopularPosts] Received stats:', stats);
        
        if (stats.length === 0) {
          console.warn('[PopularPosts] No posts with stats, showing recent posts as fallback');
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

        console.log('[PopularPosts] Enriched posts:', enrichedPosts.length);
        setTopPosts(enrichedPosts);
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
        {error ? 'Unable to load popular posts. Check console for errors.' : 'No posts available.'}
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {topPosts.map((post) => (
        <Grid item xs={12} md={6} lg={4} key={post.slug}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardActionArea
              component={RouterLink}
              to={`/posts/${post.slug}`}
              sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            >
              <CardContent sx={{ p: 2.5, flexGrow: 1, width: '100%' }}>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', textTransform: 'uppercase' }}
                >
                  {post.category}
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5, mb: 1 }}>
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {post.summary}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 'auto', pt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography variant="caption" color="text.secondary">
                    {post.readTime}
                  </Typography>
                  {showViewCount && (
                    <Chip
                      label={`${post.viewCount || 0} view${post.viewCount !== 1 ? 's' : ''}`}
                      size="small"
                      variant="outlined"
                      sx={{ height: 'auto', py: 0.5 }}
                    />
                  )}
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
