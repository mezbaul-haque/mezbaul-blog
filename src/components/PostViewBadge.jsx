import { Chip, Stack, Typography } from '@mui/material';
import { usePostViewCount } from '../hooks/useAnalytics';

/**
 * Component to display view count for a post
 * Can be displayed as a badge or inline text
 */
export function PostViewBadge({ postSlug, showLabel = false, variant = 'outlined' }) {
  const { viewCount } = usePostViewCount(postSlug);

  if (viewCount === 0 && !showLabel) {
    return null;
  }

  return (
    <Chip
      label={`${viewCount} ${viewCount === 1 ? 'view' : 'views'}`}
      size="small"
      variant={variant}
      sx={{ height: 'auto', py: 0.5 }}
    />
  );
}

/**
 * Component to display reading engagement stats (views + likes, etc.)
 */
export function PostEngagementStats({ postSlug, likeCount = 0 }) {
  const { viewCount } = usePostViewCount(postSlug);

  return (
    <Stack direction="row" spacing={1} sx={{ fontSize: '0.875rem' }}>
      {viewCount > 0 && (
        <Typography variant="caption" color="text.secondary">
          {viewCount} {viewCount === 1 ? 'view' : 'views'}
        </Typography>
      )}
      {likeCount > 0 && (
        <Typography variant="caption" color="text.secondary">
          {likeCount} {likeCount === 1 ? 'like' : 'likes'}
        </Typography>
      )}
    </Stack>
  );
}
