import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { PostCard } from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import { usePublicContent } from '../services/content';
import { getReadLaterPosts } from '../services/engagement';

function getSavedAtTime(savedPost) {
  if (typeof savedPost.createdAt?.toMillis === 'function') {
    return savedPost.createdAt.toMillis();
  }

  if (typeof savedPost.createdAt?.seconds === 'number') {
    return savedPost.createdAt.seconds * 1000;
  }

  return 0;
}

export function SavedPostsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { posts } = usePublicContent();
  const location = useLocation();
  const [savedItems, setSavedItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setSavedItems([]);
      return;
    }

    let isMounted = true;

    async function fetchSavedPosts() {
      setIsFetching(true);
      setError(null);

      try {
        const items = await getReadLaterPosts(user.uid);

        if (isMounted) {
          setSavedItems(items);
        }
      } catch (err) {
        console.error('Failed to fetch read later posts:', err);

        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    }

    fetchSavedPosts();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user]);

  const savedPosts = useMemo(() => {
    const postsBySlug = new Map(posts.map((post) => [post.slug, post]));

    return savedItems
      .slice()
      .sort((a, b) => getSavedAtTime(b) - getSavedAtTime(a))
      .map((savedItem) => postsBySlug.get(savedItem.postId))
      .filter(Boolean);
  }, [posts, savedItems]);

  if (isLoading) {
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!isAuthenticated) {
    return (
      <Stack spacing={4}>
        <PageHeader
          eyebrow="Read later"
          title="Save posts for a calmer return."
          intro="Sign in to keep a private list of posts you want to come back to."
          titleWidth="10ch"
          introWidth={620}
        />
        <Card>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2} alignItems="flex-start">
              <BookmarkBorderIcon color="primary" />
              <Typography variant="h3">Your saved posts will appear here.</Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
                Once you sign in, use the bookmark button on any post card to build your read later list.
              </Typography>
              <Button
                component={RouterLink}
                to="/login"
                state={{ from: location }}
                variant="contained"
              >
                Sign in
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack spacing={5}>
      <PageHeader
        eyebrow="Read later"
        title="Posts you saved for later."
        intro="A quiet shelf for writing you marked with the bookmark button."
        titleWidth="10ch"
        introWidth={620}
      />

      {isFetching ? (
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress />
        </Stack>
      ) : null}

      {!isFetching && error ? (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h3" gutterBottom>
              Saved posts could not be loaded.
            </Typography>
            <Typography color="text.secondary">
              Please try again in a moment.
            </Typography>
          </CardContent>
        </Card>
      ) : null}

      {!isFetching && !error && savedPosts.length > 0 ? (
        <Stack spacing={2}>
          {savedPosts.map((post) => (
            <PostCard key={post.slug} post={post} horizontal />
          ))}
        </Stack>
      ) : null}

      {!isFetching && !error && savedPosts.length === 0 ? (
        <Card>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2} alignItems="flex-start">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <BookmarkBorderIcon color="primary" />
              </Box>
              <Typography variant="h3">No saved posts yet.</Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
                Use the bookmark button on post cards to keep articles here for later reading.
              </Typography>
              <Button component={RouterLink} to="/archive" variant="outlined">
                Browse archive
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}
