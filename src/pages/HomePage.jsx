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
import { featuredPostSlug, getPostBySlug, posts } from '../data';

const featuredPost = getPostBySlug(featuredPostSlug);

export function HomePage() {
  const recentPosts = posts.filter((post) => post.slug !== featuredPostSlug).slice(0, 3);

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
        </Stack>
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
