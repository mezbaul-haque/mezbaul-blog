import { Box, Grid, Stack, Typography, Card, CardContent } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { AuthorCard } from '../components/AuthorCard';
import { authorList, posts } from '../data';

export function WritersPage() {
  // Calculate post count for each author
  const getAuthorPostCount = (authorId) => {
    return posts.filter((post) => post.authorId === authorId).length;
  };

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
              <Card
                sx={{
                  transition: 'all 180ms ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(36, 49, 58, 0.12)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <AuthorCard
                    author={author}
                    profileUrl={`/writers/${author.id}`}
                  />
                </CardContent>
              </Card>
              <Box sx={{ mt: 1.5 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  <Box
                    component={RouterLink}
                    to={`/writers/${author.id}`}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: 'primary.main',
                      textDecoration: 'none',
                      transition: 'all 180ms ease',
                      '&:hover': {
                        gap: 0.5,
                      },
                    }}
                  >
                    {getAuthorPostCount(author.id)} article{getAuthorPostCount(author.id) !== 1 ? 's' : ''}
                    <Box component="span" sx={{ opacity: 0.7 }}>→</Box>
                  </Box>
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
