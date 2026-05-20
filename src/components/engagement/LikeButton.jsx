import { useState, useEffect } from 'react';
import { IconButton, Stack, Typography } from '@mui/material';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotify } from '../../contexts/NotificationContext';
import { subscribeToLikeCount, toggleLike, isUserLikedPost, getLikeCount } from '../../services/engagement';

export function LikeButton({ postId, size = 'medium', realtime = true }) {
  const { user, isAuthenticated } = useAuth();
  const { notify } = useNotify();
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!postId) return;

    let unsubscribe = () => {};

    if (realtime) {
      unsubscribe = subscribeToLikeCount(postId, setLikeCount);
    } else {
      getLikeCount(postId).then(setLikeCount);
    }

    if (isAuthenticated && user) {
      isUserLikedPost(postId, user.uid).then(setIsLiked);
    } else {
      setIsLiked(false);
    }

    return unsubscribe;
  }, [postId, isAuthenticated, user, realtime]);

  const handleLike = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!isAuthenticated || isPending) return;

    setIsPending(true);
    try {
      const newLikedState = await toggleLike(postId, user.uid);
      setIsLiked(newLikedState);
    } catch {
      notify('Failed to update like status. Please try again.', 'error');
    } finally {
      setIsPending(false);
    }
  };

  const iconSize = size === 'small' ? 'small' : 'medium';

  return (
    <Stack direction="row" alignItems="center" sx={{ gap: '4px' }}>
      <IconButton
        onClick={handleLike}
        color={isLiked ? 'error' : 'default'}
        disabled={!isAuthenticated || isPending}
        size={iconSize}
        aria-label={isLiked ? 'Unlike' : 'Like'}
        sx={{
          p: 0,
          width: 'auto',
        }}
      >
        {isLiked ? <Favorite sx={{ fontSize: '1.3rem' }} /> : <FavoriteBorder sx={{ fontSize: '1.3rem' }} />}
      </IconButton>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          fontSize: '0.85rem',
          fontWeight: 500,
          minWidth: 12,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center'
        }}
      >
        {likeCount}
      </Typography>
    </Stack>
  );
}
