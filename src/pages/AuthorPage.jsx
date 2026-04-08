import { Box, Grid, Stack, Typography } from '@mui/material';
import { useParams, Navigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { PostCard } from '../components/PostCard';
import { SectionHeading } from '../components/SectionHeading';
import { AuthorCard } from '../components/AuthorCard';
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

      <AuthorCard author={author} showLink={false} />

      <Box>
        <SectionHeading
          eyebrow="Perspective"
          title="What this writer cares about"
          copy="These posts are grouped by the author’s specific focus, experience, and voice." 
        />
        <Typography color="text.secondary" sx={{ maxWidth: 720, mt: 2 }}>
          {author.bio}
        </Typography>
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
