import { Card, CardContent, Typography, Stack, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function AdminHome() {
  const { userProfile } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back, {userProfile?.name}
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pending Reviews
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Review and approve submitted drafts from writers.
            </Typography>
            <Button
              component={RouterLink}
              to="/admin/review"
              variant="contained"
            >
              Review Drafts
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Manage Writers
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              View and manage writer accounts.
            </Typography>
            <Button
              component={RouterLink}
              to="/admin/writers"
              variant="outlined"
            >
              View Writers
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Manage Posts
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              View and manage all published posts.
            </Typography>
            <Button
              component={RouterLink}
              to="/admin/posts"
              variant="outlined"
            >
              View Posts
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}