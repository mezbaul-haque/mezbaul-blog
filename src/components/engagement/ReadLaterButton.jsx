import { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { BookmarkBorder, Bookmark } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotify } from '../../contexts/NotificationContext';
import { toggleReadLater, isUserReadLaterPost } from '../../services/engagement';

export function ReadLaterButton({ postId, size = 'medium' }) {
  const { user, isAuthenticated } = useAuth();
  const { notify } = useNotify();
  const [isSaved, setIsSaved] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!postId) return;

    if (isAuthenticated && user) {
      isUserReadLaterPost(postId, user.uid).then(setIsSaved);
    } else {
      setIsSaved(false);
    }
  }, [postId, isAuthenticated, user]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || isPending) return;

    setIsPending(true);
    try {
      const newState = await toggleReadLater(postId, user.uid);
      setIsSaved(newState);
    } catch {
      notify('Failed to update read later status. Please try again.', 'error');
    } finally {
      setIsPending(false);
    }
  };

  const iconSize = size === 'small' ? 'small' : 'medium';

  return (
    <IconButton
      onClick={handleToggle}
      color={isSaved ? 'primary' : 'default'}
      disabled={!isAuthenticated || isPending}
      size={iconSize}
      aria-label={isSaved ? 'Remove from read later' : 'Save for later'}
      sx={{
        p: 0,
        width: 'auto',
      }}
    >
      {isSaved ? <Bookmark sx={{ fontSize: '1.1rem' }} /> : <BookmarkBorder sx={{ fontSize: '1.1rem' }} />}
    </IconButton>
  );
}
