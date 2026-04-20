import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { PostMeta } from '../components/PostMeta';
import { SectionHeading } from '../components/SectionHeading';
import { PostCard } from '../components/PostCard';
import { usePublicContent } from '../services/content';

function AdjacentPostCard({ eyebrow, post }) {
  if (!post) return null;

  return (
    <Grid item xs={12} md={6}>
      <Card>
        <CardActionArea component={RouterLink} to={`/posts/${post.slug}`}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="overline">{eyebrow}</Typography>
            <Typography variant="h3">{post.title}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export function PostPage() {
  const { slug } = useParams();
  const { authorsById, postsBySlug, posts } = usePublicContent();
  const postIndex = posts.findIndex((item) => item.slug === slug);
  const post = postIndex >= 0 ? posts[postIndex] : undefined;

  if (!post) {
    return <Navigate to="/" replace />;
  }

  const author = authorsById[post.authorId] || (
    post.authorName
      ? {
          id: post.authorId,
          name: post.authorName,
          title: post.authorTitle,
          avatar: post.authorAvatar,
        }
      : null
  );
  const authorProfileUrl = author ? `/writers/${author.id}` : '/writers';
  const authorInitials = (author?.name || 'Unknown writer')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const previousPost = postIndex > 0 ? posts[postIndex - 1] : undefined;
  const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : undefined;

  return (
    <Stack spacing={4}>
      <Card sx={{ p: { xs: 3, md: 4 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Button
            component={RouterLink}
            to="/"
            variant="text"
            size="small"
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 400,
              p: 0,
              minHeight: 'auto',
              '&:hover': {
                color: 'primary.main',
                bgcolor: 'transparent'
              }
            }}
            startIcon="←"
          >
            Back to homepage
          </Button>
          <Chip
            label={post.category}
            variant="outlined"
            size="small"
            sx={{
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '0.75rem'
            }}
          />
        </Stack>
        <Typography variant="h1" sx={{ maxWidth: '12ch' }}>
          {post.title}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 720, mt: 2, fontSize: '1.08rem', lineHeight: 1.85 }}>
          {post.intro}
        </Typography>
        <PostMeta date={post.date} readTime={post.readTime} />

        <Box
          sx={{
            mt: 3,
            pt: 2.5,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              component={RouterLink}
              to={authorProfileUrl}
              aria-label={`View ${(author?.name || 'this writer')}'s writer profile`}
              sx={{
                width: 36,
                height: 36,
                minWidth: 36,
                borderRadius: '50%',
                bgcolor: 'divider',
                color: 'text.primary',
                display: 'grid',
                placeItems: 'center',
                overflow: 'hidden',
                fontSize: '0.76rem',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'transform 180ms ease, box-shadow 180ms ease',
                '&:hover': {
                  transform: 'scale(1.04)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                },
              }}
            >
              {author?.avatar ? (
                <Box
                  component="img"
                  src={author.avatar}
                  alt={author.name}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                authorInitials
              )}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" color="text.secondary">
                Written by{' '}
                <MuiLink
                  component={RouterLink}
                  to={authorProfileUrl}
                  sx={{ color: 'text.primary', fontWeight: 500 }}
                >
                  {author?.name || 'Unknown writer'}
                </MuiLink>
              </Typography>
              {author?.title ? (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                  {author.title}
                </Typography>
              ) : null}
            </Box>
          </Stack>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Box
            component="img"
            src={post.heroImage}
            alt={post.heroAlt}
            loading="lazy"
            sx={{
              width: '100%',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              display: 'block',
            }}
          />
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1, fontSize: '0.82rem' }}>
            Photo:{' '}
            <MuiLink href={post.photoCreditUrl} target="_blank" rel="noreferrer">
              {post.photoCreditLabel}
            </MuiLink>
          </Typography>
        </Box>

        <Stack spacing={3} sx={{ mt: 4, maxWidth: 720 }}>
          {post.sections.map((section) => (
            <Box key={section.heading || section.paragraphs[0]}>
              {section.heading ? (
                <Typography variant="h2" sx={{ mb: 1.5 }}>
                  {section.heading}
                </Typography>
              ) : null}
              <Stack spacing={2}>
                {section.paragraphs.map((paragraph) => (
                  <Typography key={paragraph}>{paragraph}</Typography>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Card>

      <Box>
        <SectionHeading eyebrow="Post navigation" title="Continue reading" />
        <Grid container spacing={2}>
          <AdjacentPostCard eyebrow="Previous post" post={previousPost} />
          <AdjacentPostCard eyebrow="Next post" post={nextPost} />
        </Grid>
      </Box>

      <Box>
        <SectionHeading eyebrow="More writing" title="Related posts" />
        <Grid container spacing={2}>
          {post.related.map((item) => {
            const relatedPost = postsBySlug[item.slug];
            if (!relatedPost) return null;

            return (
              <Grid item xs={12} md={6} key={item.slug}>
                <Card>
                  <CardActionArea component={RouterLink} to={`/posts/${item.slug}`}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h3" gutterBottom>
                        {relatedPost.title}
                      </Typography>
                      <Typography color="text.secondary">{item.blurb}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Box>
        <SectionHeading 
          eyebrow={`By ${author?.name || 'this writer'}`}
          title="More from this writer" 
          copy={`Explore other articles by ${author?.name || 'this writer'} and discover more of their perspectives.`}
        />
        <Grid container spacing={2}>
          {posts
            .filter((p) => p.authorId === author?.id && p.slug !== post.slug)
            .slice(0, 2)
            .map((authorPost) => (
              <Grid item xs={12} md={6} key={authorPost.slug}>
                <PostCard post={authorPost} />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Stack>
  );
}
