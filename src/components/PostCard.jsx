import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PostMeta } from './PostMeta';
import { LikeButton, ReadLaterButton, PostStats } from './engagement';

export function PostCard({ post, horizontal = false, realtime = true }) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
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
            ? { xs: '1fr', sm: '240px 1fr' }
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
            aspectRatio: horizontal ? { xs: '16/9', sm: '4/3' } : '16/9',
            width: horizontal ? { sm: '240px' } : '100%',
            bgcolor: '#e9eeea',
            transition: 'transform 300ms ease',
            objectFit: 'cover',
          }}
        />
        <CardContent
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2,
            minWidth: 0,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <PostMeta date={post.date} readTime={post.readTime} compact={true} />
              <Chip
                label={post.category}
                variant="outlined"
                size="small"
                sx={{
                  flexShrink: 0,
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.65rem',
                  height: 22,
                  color: 'text.secondary',
                  borderColor: 'divider',
                  bgcolor: 'transparent',
                }}
              />
            </Stack>
            <Typography variant="h3" gutterBottom sx={{ lineHeight: 1.2, mb: 1, fontWeight: 600 }}>
              {post.title}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                mb: 3,
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                lineHeight: 1.6,
              }}
            >
              {post.summary}
            </Typography>
            <Box
              sx={{
                mt: 'auto',
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <LikeButton postId={post.slug} size="small" realtime={realtime} />
                <PostStats postId={post.slug} realtime={realtime} />
              </Stack>
              <ReadLaterButton postId={post.slug} size="small" />
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
