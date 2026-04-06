import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function PostCard({ post, horizontal = false }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea
        component={RouterLink}
        to={`/posts/${post.slug}`}
        sx={{
          display: 'grid',
          gridTemplateColumns: horizontal
            ? { xs: '1fr', sm: '220px 1fr' }
            : '1fr',
          alignItems: 'stretch',
          height: '100%',
        }}
      >
        <CardMedia
          component="img"
          image={post.thumbImage}
          alt={post.heroAlt}
          sx={{
            height: horizontal ? { xs: 220, sm: '100%' } : 240,
            bgcolor: '#e9eeea',
          }}
        />
        <CardContent sx={{ p: 3 }}>
          <Typography variant="overline">{post.category}</Typography>
          <Typography variant="h3" gutterBottom>
            {post.title}
          </Typography>
          <Typography color="text.secondary">{post.summary}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {post.date}
            </Typography>
            <Box component="span" sx={{ color: 'text.secondary' }}>
              ·
            </Box>
            <Typography variant="body2" color="text.secondary">
              {post.readTime}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
