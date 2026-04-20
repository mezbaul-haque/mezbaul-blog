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
} from '@mui/material';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export function ManagePostsPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Posts
      </Typography>

      <List sx={{ mt: 3 }}>
        {posts.map((post) => (
          <Card key={post.id} sx={{ mb: 2 }}>
            <ListItem>
              <ListItemText
                primary={post.title}
                secondary={
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Typography variant="caption">
                      {post.category}
                    </Typography>
                    <Typography variant="caption">
                      {post.publishedAt?.toDate?.()?.toLocaleDateString()}
                    </Typography>
                  </Stack>
                }
              />
              <Chip label="Published" color="success" size="small" sx={{ mr: 2 }} />
              <Button
                color="error"
                size="small"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </Button>
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