import { useState, useEffect } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { Visibility, ChatBubbleOutline } from '@mui/icons-material';
import { getCommentCount } from '../../services/engagement';
import { usePostViewCount } from '../../hooks/useAnalytics';

const StatItem = ({ icon: Icon, value }) => (
  <Stack direction="row" alignItems="center" sx={{ gap: '4px' }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.disabled',
        width: 'auto'
      }}
    >
      <Icon sx={{ fontSize: '1.3rem' }} />
    </Box>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ fontSize: '0.85rem', fontWeight: 500, minWidth: 12, lineHeight: 1, display: 'inline-flex', alignItems: 'center' }}
    >
      {value}
    </Typography>
  </Stack>
);

export function PostStats({ postId }) {
  const [comments, setComments] = useState(0);
  const { viewCount } = usePostViewCount(postId);

  useEffect(() => {
    if (!postId) return;

    getCommentCount(postId).then(setComments);
  }, [postId]);

  return (
    <Stack direction="row" alignItems="center" sx={{ gap: '12px' }}>
      <StatItem icon={Visibility} value={viewCount} />
      <StatItem icon={ChatBubbleOutline} value={comments} />
    </Stack>
  );
}
