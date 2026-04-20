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
  Button,
  Stack,
  Avatar,
} from '@mui/material';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

export function ManageWritersPage() {
  const { user } = useAuth();
  const [writers, setWriters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setWriters(users);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  async function handleToggleActive(writer) {
    await updateDoc(doc(db, 'users', writer.id), {
      isActive: !writer.isActive,
    });
  }

  async function handleApproveProfile(writer) {
    if (!user) return;

    await updateDoc(doc(db, 'users', writer.id), {
      approvalStatus: 'approved',
      isProfileVisible: true,
      approvedAt: serverTimestamp(),
      approvedBy: user.uid,
    });
  }

  async function handleToggleVisibility(writer) {
    await updateDoc(doc(db, 'users', writer.id), {
      isProfileVisible: !writer.isProfileVisible,
    });
  }

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Writers
      </Typography>

      <List sx={{ mt: 3 }}>
        {writers.map((writer) => (
          <Card key={writer.id} sx={{ mb: 2 }}>
            <ListItem>
              <Avatar src={writer.avatar} sx={{ mr: 2 }} />
              <ListItemText
                primary={writer.name}
                secondary={
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Typography variant="caption">
                      {writer.email}
                    </Typography>
                    <Chip
                      label={writer.role}
                      size="small"
                      color={writer.role === 'admin' ? 'secondary' : 'default'}
                    />
                    <Chip
                      label={writer.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={writer.isActive ? 'success' : 'error'}
                    />
                    <Chip
                      label={writer.approvalStatus || 'pending'}
                      size="small"
                      color={writer.approvalStatus === 'approved' ? 'primary' : 'warning'}
                    />
                    <Chip
                      label={writer.isProfileVisible ? 'Visible' : 'Hidden'}
                      size="small"
                      color={writer.isProfileVisible ? 'success' : 'default'}
                    />
                  </Stack>
                }
              />
              {writer.role !== 'admin' && (
                <Stack direction="row" spacing={1}>
                  {writer.approvalStatus !== 'approved' && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleApproveProfile(writer)}
                    >
                      Approve
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleToggleVisibility(writer)}
                  >
                    {writer.isProfileVisible ? 'Hide Profile' : 'Show Profile'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleToggleActive(writer)}
                  >
                    {writer.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </Stack>
              )}
            </ListItem>
          </Card>
        ))}
      </List>
    </Box>
  );
}
