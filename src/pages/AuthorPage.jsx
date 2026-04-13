import { Box, Grid, Stack, Typography } from '@mui/material';
import { useParams, Navigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { PostCard } from '../components/PostCard';
import { SectionHeading } from '../components/SectionHeading';
import { AuthorProfile } from '../components/AuthorProfile';
import { getAuthorById, posts } from '../data';

export function AuthorPage() {
  const { authorId } = useParams();
  const author = getAuthorById(authorId);

  if (!author) {
    return <Navigate to="/writers" replace />;
  }

  const authorPosts = posts.filter((post) => post.authorId === author.id);

  return (
    <Stack spacing={5}>
      <PageHeader
        eyebrow="Writer"
        title={`About ${author.name}`}
        intro={`A closer look at ${author.name}'s interests, approach, and the writing they contribute to this platform.`}
        titleWidth="22ch"
      />

      <AuthorProfile author={author} />

      <Box>
        <SectionHeading
          eyebrow="Perspective"
          title="What this writer cares about"
          copy="These posts are grouped by the author's specific focus, experience, and voice."
        />
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: 'center',
                p: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper',
                transition: 'all 180ms ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(47, 93, 80, 0.08)',
                }
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'primary.main',
                  mb: 0.5 
                }}
              >
                {authorPosts.length}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {authorPosts.length === 1 ? 'Post' : 'Posts'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: 'center',
                p: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper',
                transition: 'all 180ms ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(47, 93, 80, 0.08)',
                }
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'primary.main',
                  mb: 0.5 
                }}
              >
                {new Set(authorPosts.map(post => post.category)).size}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {new Set(authorPosts.map(post => post.category)).size === 1 ? 'Category' : 'Categories'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <SectionHeading eyebrow="Writing" title="Posts by this writer" />
        <Grid container spacing={2}>
          {authorPosts.map((post) => (
            <Grid item xs={12} md={6} key={post.slug}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
