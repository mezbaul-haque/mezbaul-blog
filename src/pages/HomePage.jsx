import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { PostMeta } from '../components/PostMeta';
import { SectionHeading } from '../components/SectionHeading';
import { PopularPosts } from '../components/PopularPosts';
import { useAuth } from '../contexts/AuthContext';
import { featuredPostSlug } from '../data';
import { usePublicContent } from '../services/content';

const featuredSlide = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
`;

function FeaturedPostSlider({ posts }) {
  const sliderPosts = posts.slice(0, 7);
  const trackPosts = [...sliderPosts, ...sliderPosts];

  return (
    <Box
      sx={{
        maxWidth: 1120,
        mx: 'auto',
        overflow: 'hidden',
        py: 0.5,
        maskImage: {
          xs: 'none',
          md: 'linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: 'max-content',
          animation: `${featuredSlide} 34s linear infinite`,
          '&:hover': {
            animationPlayState: 'paused',
          },
        }}
      >
        {trackPosts.map((post, index) => (
          <Box
            key={`${post.slug}-${index}`}
            sx={{
              flex: '0 0 auto',
              width: {
                xs: 'min(78vw, 300px)',
                sm: '280px',
                md: '250px',
                lg: '256px',
              },
              mr: 2,
            }}
          >
            <Card
              sx={{
                height: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'transform 250ms ease, border-color 250ms ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: 'primary.main',
                },
                '&:hover .featured-post-image, &:focus-within .featured-post-image': {
                  transform: 'scale(1.04)',
                },
              }}
            >
              <CardActionArea
                component={RouterLink}
                to={`/posts/${post.slug}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                }}
              >
                <Box sx={{ overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    image={post.thumbImage}
                    alt={post.heroAlt}
                    className="featured-post-image"
                    loading="lazy"
                    sx={{
                      aspectRatio: '5/3',
                      objectFit: 'cover',
                      bgcolor: '#e9eeea',
                      transition: 'transform 300ms ease',
                    }}
                  />
                </Box>
                <CardContent
                  sx={{
                    p: 2,
                    minHeight: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Chip
                    label={post.category}
                    variant="outlined"
                    size="small"
                    sx={{
                      alignSelf: 'flex-start',
                      height: 22,
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.65rem',
                    }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: '1.05rem',
                      lineHeight: 1.25,
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: '0.9rem',
                      lineHeight: 1.55,
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                    }}
                  >
                    {post.summary}
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <PostMeta date={post.date} readTime={post.readTime} compact />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function HomePage() {
  const { isAuthenticated, canWritePosts } = useAuth();
  const { postsBySlug, posts } = usePublicContent();
  const featuredPost = postsBySlug[featuredPostSlug] || posts[0];
  const featuredPosts = [
    featuredPost,
    ...posts.filter((post) => post.slug !== featuredPost?.slug),
  ].filter(Boolean).slice(0, 7);
  const recentPosts = posts.filter((post) => post.slug !== featuredPost?.slug).slice(0, 3);

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
          eyebrow="Featured"
          title="Start with these"
          copy="A rotating shelf of selected writing from across the site."
        />
        <FeaturedPostSlider posts={featuredPosts} />
      </Box>

      <Box>
        <SectionHeading
          eyebrow="Popular"
          title="What readers love"
          copy="The most-read articles from our community this month."
        />
        <PopularPosts limit={3} showViewCount={true} />
      </Box>

      <Box>
        <SectionHeading
          eyebrow="Recent Writing"
          title="Latest posts"
          copy="Recent articles across operations, support, and documentation."
        />
        <Stack spacing={2}>
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} horizontal realtime={false} />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
