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
import EastIcon from '@mui/icons-material/East';
import { Link as RouterLink } from 'react-router-dom';
import { PostMeta } from './PostMeta';
import { getAuthorById } from '../data';

export function PostCard({ post, horizontal = false }) {
  const author = getAuthorById(post.authorId);
  const authorInitials = author?.name
    ? author.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : null;

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
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {post.summary}
            </Typography>
            <PostMeta date={post.date} readTime={post.readTime} compact={true} />
          </Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            className="post-card-cta"
            sx={{
              color: 'text.secondary',
              opacity: 0.88,
              transition: 'transform 180ms ease, color 180ms ease',
              mt: 1,
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

      {author ? (
        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            px: 3,
            py: 2,
            mt: 'auto',
            bgcolor: 'rgba(47, 93, 80, 0.03)',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              component={RouterLink}
              to={`/writers/${author.id}`}
              aria-label={`View ${author.name}'s writer profile`}
              sx={{
                width: 44,
                height: 44,
                minWidth: 44,
                borderRadius: '50%',
                bgcolor: 'divider',
                color: 'text.primary',
                display: 'grid',
                placeItems: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
                overflow: 'hidden',
                transition: 'transform 180ms ease, box-shadow 180ms ease',
                '&:hover': {
                  transform: 'scale(1.06)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                },
              }}
            >
              {author.avatar ? (
                <Box
                  component="img"
                  src={author.avatar}
                  alt={author.name}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                authorInitials
              )}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="overline"
                sx={{ display: 'block', color: 'text.secondary', lineHeight: 1 }}
              >
                Written by
              </Typography>
              <Typography
                variant="body2"
                component={RouterLink}
                to={`/writers/${author.id}`}
                sx={{
                  display: 'inline-block',
                  fontWeight: 600,
                  color: 'text.primary',
                  transition: 'color 180ms ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {author.name}
              </Typography>
              {author.title && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    lineHeight: 1.35,
                    mt: 0.25,
                  }}
                >
                  {author.title}
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>
      ) : null}
    </Card>
  );
}
