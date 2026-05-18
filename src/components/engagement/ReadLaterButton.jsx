import { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { BookmarkBorder, Bookmark } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotify } from '../../contexts/NotificationContext';
import { toggleReadLater, isUserReadLaterPost } from '../../services/engagement';

export function ReadLaterButton({ postId, size = 'medium' }) {
  const { user, isAuthenticated } = useAuth();
  const { notify } = useNotify();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!postId) return;

    if (isAuthenticated && user) {
      isUserReadLaterPost(postId, user.uid)
        .then(setIsSaved)
        .catch(() => setIsSaved(false));
    } else {
      setIsSaved(false);
    }
  }, [postId, isAuthenticated, user]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPending) return;

    if (!isAuthenticated) {
      notify('Sign in to save posts for later.', 'info');
      navigate('/login', { state: { from: location } });
      return;
    }

    setIsPending(true);
    try {
      const newState = await toggleReadLater(postId, user.uid);
      setIsSaved(newState);
      notify(newState ? 'Saved for later.' : 'Removed from read later.', 'success');
    } catch (error) {
      console.error('Failed to update read later status:', error);
      notify('Failed to update read later status. Please try again.', 'error');
    } finally {
      setIsPending(false);
    }
  };

  const iconSize = size === 'small' ? 'small' : 'medium';

  return (
    <Tooltip title={isSaved ? 'Remove from read later' : 'Save for later'}>
      <span>
        <IconButton
          onClick={handleToggle}
          color={isSaved ? 'primary' : 'default'}
          disabled={isPending}
          size={iconSize}
          aria-label={isSaved ? 'Remove from read later' : 'Save for later'}
          sx={{
            p: 0,
            width: 'auto',
          }}
        >
          {isSaved ? <Bookmark sx={{ fontSize: '1.1rem' }} /> : <BookmarkBorder sx={{ fontSize: '1.1rem' }} />}
        </IconButton>
      </span>
    </Tooltip>
  );
}
