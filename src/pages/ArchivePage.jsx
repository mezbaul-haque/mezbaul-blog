import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { PostCard } from '../components/PostCard';
import { SectionHeading } from '../components/SectionHeading';
import { posts } from '../data';

export function ArchivePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [query, setQuery] = useState('');

  const categories = useMemo(
    () => ['All', ...new Set(posts.map((post) => post.category))],
    [],
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [post.title, post.summary, post.category].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );

      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  return (
    <Stack spacing={5}>
      <PageHeader
        eyebrow="Archive"
        title="All writing in one place."
        intro="A simple archive page keeps the site easy to browse as the number of posts grows."
        titleWidth="9ch"
        introWidth={620}
      />

      <Box>
        <SectionHeading
          eyebrow="All posts"
          title="Browse by title and topic"
          copy="Every article in one running list, with enough context to scan quickly and choose where to start."
        />
        <Stack
          spacing={2.5}
          sx={{
            mb: 4,
            p: { xs: 2, md: 3 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}
        >
          <Box>
            <Typography variant="overline">Refine archive</Typography>
            <Typography color="text.secondary" variant="body2">
              Filter by topic or search for a keyword.
            </Typography>
          </Box>
          <TextField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, summary, or topic"
            fullWidth
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                clickable
                color={selectedCategory === category ? 'primary' : 'default'}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
          </Typography>
        </Stack>

        <Stack spacing={2}>
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} horizontal />
          ))}
        </Stack>
        {filteredPosts.length === 0 ? (
          <Card sx={{ mt: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h3" gutterBottom>
                No posts match your filters.
              </Typography>
              <Typography color="text.secondary">
                Try a different keyword or switch back to the All category.
              </Typography>
            </CardContent>
          </Card>
        ) : null}
      </Box>
    </Stack>
  );
}
