import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

const statusColors = {
  draft: 'default',
  submitted: 'primary',
  approved: 'success',
  rejected: 'error',
};

export function DraftListPage() {
  const { user } = useAuth();
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'drafts'),
      where('authorId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const draftsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDrafts(draftsData);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [user]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">My Drafts</Typography>
        <Button
          component={RouterLink}
          to="/dashboard/drafts/new"
          variant="contained"
          fullWidth={false}
        >
          New Draft
        </Button>
      </Stack>

      {drafts.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              No drafts yet. Create your first draft to get started.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List>
          {drafts.map((draft) => (
            <Card key={draft.id} sx={{ mb: 2 }}>
              <ListItem
                sx={{
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 2,
                }}
              >
                <ListItemText
                  primary={draft.title || 'Untitled'}
                  secondary={
                    <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={draft.status}
                        size="small"
                        color={statusColors[draft.status]}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Updated {draft.updatedAt?.toDate?.()?.toLocaleDateString()}
                      </Typography>
                    </Stack>
                  }
                />
                <Button
                  component={RouterLink}
                  to={`/dashboard/drafts/${draft.id}/edit`}
                  sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
                >
                  Edit
                </Button>
              </ListItem>
            </Card>
          ))}
        </List>
      )}
    </Box>
  );
}
