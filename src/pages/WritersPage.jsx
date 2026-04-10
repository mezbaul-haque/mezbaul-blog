import { Box, Grid, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { AuthorCard } from '../components/AuthorCard';
import { authorList } from '../data/authors';

export function WritersPage() {
  return (
    <Stack spacing={5}>
      <PageHeader
        eyebrow="Writers"
        title="Meet the people writing here"
        intro="A directory of authors and a quick way to explore each writer's perspective and work."
        titleWidth="22ch"
      />

      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Our Writing Team
        </Typography>
        <Grid container spacing={4}>
          {authorList.map((author) => (
            <Grid item xs={12} md={6} key={author.id}>
              <AuthorCard
                author={author}
                profileUrl={`/writers/${author.id}`}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
