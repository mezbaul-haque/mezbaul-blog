import { useState, useEffect } from 'react';
import { Stack, Typography, IconButton } from '@mui/material';
import { Favorite, Visibility, ChatBubbleOutline } from '@mui/icons-material';
import { getLikeCount, getCommentCount } from '../../services/engagement';
import { usePostViewCount } from '../../hooks/useAnalytics';

export function PostStats({ postId, realtime = false }) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const { viewCount } = usePostViewCount(postId);

  useEffect(() => {
    if (!postId) return;

    getLikeCount(postId).then(setLikes);
    getCommentCount(postId).then(setComments);
  }, [postId]);

  const StatItem = ({ icon: Icon, value }) => (
    <Stack direction="row" alignItems="center" sx={{ gap: '4px' }}>
      <IconButton
        disabled
        size="small"
        sx={{
          p: 0,
          color: 'text.disabled',
          '&.Mui-disabled': { color: 'text.disabled' },
          width: 'auto'
        }}
      >
        <Icon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: '0.85rem', fontWeight: 500, minWidth: 12, lineHeight: 1, display: 'inline-flex', alignItems: 'center' }}
      >
        {value}
      </Typography>
    </Stack>
  );

  return (
    <Stack direction="row" alignItems="center" sx={{ gap: '12px' }}>
      <StatItem icon={Visibility} value={viewCount} />
      <StatItem icon={ChatBubbleOutline} value={comments} />
    </Stack>
  );
}
