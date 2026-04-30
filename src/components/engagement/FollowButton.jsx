import { useState, useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToFollowerCount, isUserFollowing, toggleFollow } from '../../services/engagement';

export function FollowButton({ writerId, variant = 'contained' }) {
  const { user, isAuthenticated } = useAuth();
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!writerId) return;

    const unsubscribe = subscribeToFollowerCount(writerId, setFollowerCount);

    if (isAuthenticated && user) {
      isUserFollowing(writerId, user.uid).then(setIsFollowing);
    }

    return unsubscribe;
  }, [writerId, isAuthenticated, user]);

  const handleFollow = async () => {
    if (!isAuthenticated || isPending) return;

    setIsPending(true);
    try {
      const newFollowingState = await toggleFollow(writerId, user.uid);
      setIsFollowing(newFollowingState);
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsPending(false);
    }
  };

  const isSelf = isAuthenticated && user && user.uid === writerId;

  if (isSelf) return null;

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Button
        variant={isFollowing ? 'outlined' : variant}
        onClick={handleFollow}
        disabled={!isAuthenticated || isPending}
        size="small"
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
      {followerCount > 0 && (
        <Stack direction="row" alignItems="baseline" spacing={0.5}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{followerCount}</span>
          <span style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {followerCount === 1 ? 'follower' : 'followers'}
          </span>
        </Stack>
      )}
    </Stack>
  );
}
