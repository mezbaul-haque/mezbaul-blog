import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  Button,
  Alert,
} from '@mui/material';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

export function ManagePostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePostId, setActivePostId] = useState(null);

  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return undefined;
    }

    const q = query(collection(db, 'posts'), orderBy('publishedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(postsData);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  async function handleDelete(postId) {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deleteDoc(doc(db, 'posts', postId));
    }
  }

  async function handleTogglePublish(post) {
    if (!user) return;

    const nextStatus = post.status === 'published' ? 'unpublished' : 'published';
    const confirmationMessage = nextStatus === 'unpublished'
      ? 'Unpublish this post? It will disappear from the public site.'
      : 'Republish this post to make it visible on the public site again?';

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    setActivePostId(post.id);

    try {
      await updateDoc(doc(db, 'posts', post.id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
        ...(nextStatus === 'unpublished'
          ? {
              unpublishedAt: serverTimestamp(),
              unpublishedBy: user.uid,
            }
          : {
              publishedAt: serverTimestamp(),
              publishedBy: user.uid,
              unpublishedAt: null,
              unpublishedBy: null,
            }),
      });
    } finally {
      setActivePostId(null);
    }
  }

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (!db) {
    return (
      <Alert severity="warning">
        Firebase is not configured, so post management is unavailable.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Posts
      </Typography>

      <Alert severity="info" sx={{ mt: 2 }}>
        Unpublishing removes a post from the public site without deleting it.
      </Alert>

      <List sx={{ mt: 3 }}>
        {posts.map((post) => (
          <Card key={post.id} sx={{ mb: 2 }}>
            <ListItem
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
              }}
            >
              <ListItemText
                primary={post.title}
                secondary={
                  <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: 'wrap' }}>
                    <Typography variant="caption">
                      {post.category}
                    </Typography>
                    <Typography variant="caption">
                      {post.publishedAt?.toDate?.()?.toLocaleDateString() || 'Not published yet'}
                    </Typography>
                  </Stack>
                }
              />
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                <Chip
                  label={post.status === 'published' ? 'Published' : 'Unpublished'}
                  color={post.status === 'published' ? 'success' : 'default'}
                  size="small"
                />
                <Button
                  variant="outlined"
                  color={post.status === 'published' ? 'warning' : 'primary'}
                  size="small"
                  onClick={() => handleTogglePublish(post)}
                  disabled={activePostId === post.id}
                >
                  {post.status === 'published' ? 'Unpublish' : 'Republish'}
                </Button>
                <Button
                  color="error"
                  size="small"
                  onClick={() => handleDelete(post.id)}
                  disabled={activePostId === post.id}
                >
                  Delete
                </Button>
              </Stack>
            </ListItem>
          </Card>
        ))}
      </List>

      {posts.length === 0 && (
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              No published posts yet.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
