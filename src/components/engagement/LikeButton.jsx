import { useState, useEffect } from 'react';
import { IconButton, Stack, Typography } from '@mui/material';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotify } from '../../contexts/NotificationContext';
import { subscribeToLikeCount, toggleLike, isUserLikedPost } from '../../services/engagement';

export function LikeButton({ postId, size = 'medium' }) {
  const { user, isAuthenticated } = useAuth();
  const { notify } = useNotify();
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const unsubscribe = subscribeToLikeCount(postId, setLikeCount);

    if (isAuthenticated && user) {
      isUserLikedPost(postId, user.uid).then(setIsLiked);
    }

    return unsubscribe;
  }, [postId, isAuthenticated, user]);

  const handleLike = async () => {
    if (!isAuthenticated || isPending) return;

    setIsPending(true);
    try {
      const newLikedState = await toggleLike(postId, user.uid);
      setIsLiked(newLikedState);
    } catch (error) {
      notify('Failed to update like status. Please try again.', 'error');
    } finally {
      setIsPending(false);
    }
  };

  const iconSize = size === 'small' ? 'small' : 'medium';

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <IconButton
        onClick={handleLike}
        color={isLiked ? 'error' : 'default'}
        disabled={!isAuthenticated || isPending}
        size={iconSize}
        aria-label={isLiked ? 'Unlike' : 'Like'}
      >
        {isLiked ? <Favorite /> : <FavoriteBorder />}
      </IconButton>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 20, fontSize: size === 'small' ? '0.75rem' : '0.875rem' }}
      >
        {likeCount}
      </Typography>
    </Stack>
  );
}
