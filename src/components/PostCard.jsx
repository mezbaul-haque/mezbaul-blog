import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import { Link as RouterLink } from 'react-router-dom';
import { PostMeta } from './PostMeta';

export function PostCard({ post, horizontal = false }) {
  return (
    <Card
      sx={{
        height: '100%',
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
          height: '100%',
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
          sx={{
            height: horizontal ? { xs: 220, sm: '100%' } : 240,
            bgcolor: '#e9eeea',
            transition: 'transform 220ms ease',
          }}
        />
        <CardContent
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="overline">{post.category}</Typography>
            <Typography variant="h3" gutterBottom>
              {post.title}
            </Typography>
            <Typography color="text.secondary">{post.summary}</Typography>
          </Box>
          <PostMeta date={post.date} readTime={post.readTime} />
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            className="post-card-cta"
            sx={{
              color: 'text.secondary',
              opacity: 0.88,
              transition: 'transform 180ms ease, color 180ms ease',
            }}
          >
            <Typography
              variant="overline"
              sx={{ letterSpacing: '0.08em' }}
            >
              Read article
            </Typography>
            <EastIcon fontSize="small" />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
