import { Box, Grid, Stack } from '@mui/material';
import { PageHeader } from '../components/PageHeader';
import { AuthorCard } from '../components/AuthorCard';
import { authorList } from '../data';

export function WritersPage() {
  return (
      <Stack spacing={5}>
      <PageHeader
        eyebrow="Writers"
        title="Meet the people writing here"
        intro="A small directory of the people behind the writing, with a simple way to learn more about each voice and perspective."
        titleWidth="22ch"
      />

      <Box>
        <Grid
          container
          spacing={3}
          sx={{
            alignItems: 'stretch',
            '& > .MuiGrid-item': {
              display: 'flex',
            },
          }}
        >
          {authorList.map((author) => (
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }} key={author.id}>
              <AuthorCard
                author={author}
                profileUrl={`/writers/${author.id}`}
                variant="directory"
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
