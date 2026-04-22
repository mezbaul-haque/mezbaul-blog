import { Box, Typography, Card, CardContent, Stack, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function DashboardHome() {
  const { userProfile, isAdmin } = useAuth();
  const isApprovedWriter = userProfile?.approvalStatus === 'approved';

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
        Welcome, {userProfile?.name}
      </Typography>

      {!isAdmin && !isApprovedWriter && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profile awaiting approval
            </Typography>
            <Typography variant="body2" color="text.secondary">
              An admin needs to approve your public writer profile before it appears on the Writers page.
              You can still complete your profile and work on drafts in the meantime.
            </Typography>
          </CardContent>
        </Card>
      )}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Update your bio, avatar, and social links.
            </Typography>
            <Button
              component={RouterLink}
              to="/dashboard/profile"
              variant="outlined"
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Write a Post
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Create a new draft and submit it for review.
            </Typography>
            <Button
              component={RouterLink}
              to="/dashboard/drafts/new"
              variant="outlined"
            >
              New Draft
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Drafts
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              View and manage your draft posts, including submitted and approved work.
            </Typography>
            <Button
              component={RouterLink}
              to="/dashboard/drafts"
              variant="outlined"
            >
              View Drafts
            </Button>
          </CardContent>
        </Card>
      </Stack>

      {isAdmin && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Admin Actions
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                component={RouterLink}
                to="/admin/review"
                variant="contained"
                fullWidth
              >
                Review Drafts
              </Button>
              <Button
                component={RouterLink}
                to="/admin/writers"
                variant="outlined"
                fullWidth
              >
                Manage Writers
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
