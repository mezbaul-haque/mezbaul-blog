import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PostMeta } from './PostMeta';

export function PostCard({ post, horizontal = false }) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 14px 30px rgba(36, 49, 58, 0.08)',
          borderColor: 'primary.main',
        },
        '&:hover .post-card-media, &:focus-within .post-card-media': {
          transform: 'scale(1.03)',
        },
        '&:hover .post-card-cta, &:focus-within .post-card-cta': {
          color: 'primary.main',
          transform: 'translateX(4px)',
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/posts/${post.slug}`}
        sx={{
          display: 'grid',
          gridTemplateColumns: horizontal
            ? { xs: '1fr', sm: '220px 1fr' }
            : '1fr',
          alignItems: 'stretch',
          '&.Mui-focusVisible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '-2px',
          },
        }}
      >
        <CardMedia
          component="img"
          image={post.thumbImage}
          alt={post.heroAlt}
          className="post-card-media"
          loading="lazy"
          sx={{
            height: horizontal ? { xs: 140, sm: '100%' } : 240,
            bgcolor: '#e9eeea',
            transition: 'transform 220ms ease',
          }}
        />
        <CardContent
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 0,
          }}
        >
          <Box>
            <Chip
              label={post.category}
              variant="outlined"
              size="small"
              sx={{
                mb: 1.5,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.7rem',
                height: 24
              }}
            />
            <Typography variant="h3" gutterBottom>
              {post.title}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
              }}
            >
              {post.summary}
            </Typography>
            <PostMeta date={post.date} readTime={post.readTime} compact={true} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
