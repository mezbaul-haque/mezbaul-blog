import {
  Box,
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
import { AuthorCard } from '../components/AuthorCard';
import { authors, getAuthorById, getPostBySlug, posts } from '../data';

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
  const postIndex = posts.findIndex((item) => item.slug === slug);
  const post = postIndex >= 0 ? posts[postIndex] : undefined;

  if (!post) {
    return <Navigate to="/" replace />;
  }

  const author = getAuthorById(post.authorId) ?? authors.mezbaul;
  const previousPost = postIndex > 0 ? posts[postIndex - 1] : undefined;
  const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : undefined;

  return (
    <Stack spacing={4}>
      <Card sx={{ p: { xs: 3, md: 4 } }}>
        <MuiLink component={RouterLink} to="/" color="text.secondary" sx={{ mb: 2, display: 'inline-block' }}>
          Back to homepage
        </MuiLink>
        <Typography variant="overline">{post.category}</Typography>
        <Typography variant="h1" sx={{ maxWidth: '12ch' }}>
          {post.title}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 720, mt: 2, fontSize: '1.08rem', lineHeight: 1.85 }}>
          {post.intro}
        </Typography>
        <PostMeta
          date={post.date}
          readTime={post.readTime}
          useChips
          ChipComponent={Chip}
        />

        <AuthorCard author={author} profileUrl={`/writers/${author.id}`} />

        <Box sx={{ mt: 3 }}>
          <Box
            component="img"
            src={post.heroImage}
            alt={post.heroAlt}
            sx={{
              width: '100%',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              display: 'block',
            }}
          />
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
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
            const relatedPost = getPostBySlug(item.slug);
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
    </Stack>
  );
}
