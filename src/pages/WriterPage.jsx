import { Box, Grid, Stack, Typography } from '@mui/material';
import { PageHeader } from '../components/PageHeader';
import { PostCard } from '../components/PostCard';
import { SectionHeading } from '../components/SectionHeading';
import { AuthorCard } from '../components/AuthorCard';
import { authors, posts } from '../data';

const writer = authors.mezbaul;
const writerPosts = posts.filter((post) => post.authorId === writer.id);

export function WriterPage() {
  return (
    <Stack spacing={5}>
      <PageHeader
        eyebrow="Writer"
        title="About the writer"
        intro="A short introduction to the person behind the writing, with a quick sense of the themes and practical perspective that shape this blog."
        titleWidth="17ch"
      />

      <AuthorCard author={writer} />

      <Box>
        <SectionHeading
          eyebrow="Perspective"
          title="Writing about systems, clarity, and calm work"
          copy="These posts reflect an interest in operational rhythm, useful documentation, and the quiet value of working with intention."
        />
        <Typography color="text.secondary" sx={{ maxWidth: 720, mt: 2 }}>
          {writer.bio}
        </Typography>
      </Box>

      <Box>
        <SectionHeading eyebrow="Writing" title="Posts by the writer" />
        <Grid container spacing={2}>
          {writerPosts.map((post) => (
            <Grid item xs={12} md={6} key={post.slug}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
