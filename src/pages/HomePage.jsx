import EastIcon from '@mui/icons-material/East';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { PostMeta } from '../components/PostMeta';
import { SectionHeading } from '../components/SectionHeading';
import { useAuth } from '../contexts/AuthContext';
import { featuredPostSlug } from '../data';
import { getAccountLabel } from '../services/accountRoles';
import { usePublicContent } from '../services/content';

export function HomePage() {
  const { currentRole, isAuthenticated, isAdmin, canWritePosts, userProfile } = useAuth();
  const { postsBySlug, posts } = usePublicContent();
  const featuredPost = postsBySlug[featuredPostSlug] || posts[0];
  const recentPosts = posts.filter((post) => post.slug !== featuredPost?.slug).slice(0, 3);
  const accountLabel = getAccountLabel(currentRole, 'reader').toLowerCase();

  if (!featuredPost) {
    return null;
  }

  return (
    <Stack spacing={6}>
      <Box sx={{ pb: 5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="overline">Blog</Typography>
        <Typography variant="h1" sx={{ maxWidth: '10ch' }}>
          Thoughtful writing on work, systems, and everyday life.
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ maxWidth: 720, mt: 2, fontSize: '1.1rem', lineHeight: 1.85 }}
        >
          A personal blog for practical writing across operations, technology,
          documentation, travel, and other ideas worth keeping in one place.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            component={RouterLink}
            to={`/posts/${featuredPost.slug}`}
          >
            Read Featured Post
          </Button>
          <Button variant="outlined" component={RouterLink} to="/archive">
            View Archive
          </Button>
          {canWritePosts ? (
            <Button variant="outlined" component={RouterLink} to="/dashboard">
              Open Dashboard
            </Button>
          ) : isAuthenticated ? (
            <Button variant="outlined" component={RouterLink} to="/writers">
              Explore Writers
            </Button>
          ) : (
            <Button variant="outlined" component={RouterLink} to="/register">
              Join the Community
            </Button>
          )}
        </Stack>
      </Box>

      <Box>
        <SectionHeading
          eyebrow="Writer Portal"
          title={isAuthenticated ? `Welcome back, ${userProfile?.name || accountLabel}` : 'Contribute to Eubello'}
          copy={
            canWritePosts
              ? 'Your writing workflow is now connected to Firebase with account access, draft management, and admin review tools.'
              : isAuthenticated
              ? 'Your account is ready for reader features now, with likes, follows, and comments ready to grow next.'
              : 'Firebase-backed writer accounts, private drafts, and editorial review are now built into the site.'
          }
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Authentication
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Readers and writers can register, sign in, and keep a persistent account.
                </Typography>
                <Button component={RouterLink} to={canWritePosts ? '/dashboard/profile' : '/login'}>
                  {canWritePosts ? 'Edit profile' : 'Sign in'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Draft Workflow
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Create drafts, save progress, and submit posts for review from the dashboard.
                </Typography>
                <Button component={RouterLink} to={canWritePosts ? '/dashboard/drafts' : '/register'}>
                  {canWritePosts ? 'View drafts' : 'Create writer account'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Editorial Review
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Admins can review incoming drafts, manage writers, and publish approved work.
                </Typography>
                <Button
                  component={RouterLink}
                  to={isAdmin ? '/admin' : canWritePosts ? '/dashboard' : '/register'}
                >
                  {isAdmin ? 'Open admin panel' : canWritePosts ? 'See dashboard' : 'Become a writer'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <SectionHeading
          eyebrow="Featured"
          title="Start here"
          copy="A selected article that reflects the tone and direction of the site."
        />
        <Card>
          <Grid container>
            <Grid item xs={12} md={4}>
              <CardMedia
                component="img"
                image={featuredPost.heroImage}
                alt={featuredPost.heroAlt}
                loading="lazy"
                sx={{ height: { xs: 280, md: '100%' }, bgcolor: '#e9eeea' }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <CardContent sx={{ p: 4 }}>
                <Chip
                  label={featuredPost.category}
                  variant="outlined"
                  size="small"
                  sx={{
                    mb: 2,
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: '0.75rem'
                  }}
                />
                <Typography variant="h2" sx={{ mb: 2 }}>
                  {featuredPost.title}
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
                  {featuredPost.summary}
                </Typography>
                <PostMeta date={featuredPost.date} readTime={featuredPost.readTime} />
                <Button
                  component={RouterLink}
                  to={`/posts/${featuredPost.slug}`}
                  endIcon={<EastIcon />}
                  sx={{ mt: 3 }}
                >
                  Read article
                </Button>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Box>

      <Box>
        <SectionHeading
          eyebrow="Recent Writing"
          title="Latest posts"
          copy="Recent articles across operations, support, and documentation."
        />
        <Stack spacing={2}>
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} horizontal />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
