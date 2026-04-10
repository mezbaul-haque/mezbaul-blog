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
            justifyContent: 'space-between',
            gap: 2,
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
            <Typography color="text.secondary">{post.summary}</Typography>
            {author ? (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'divider',
                    color: 'text.primary',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    overflow: 'hidden',
                    transition: 'transform 180ms ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
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
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontWeight: 500,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'color 180ms ease',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                    component={RouterLink}
                    to={`/writers/${author.id}`}
                  >
                    {author.name}
                  </Typography>
                  {author.title && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        lineHeight: 1.2,
                        mt: 0.25,
                        opacity: 0.75,
                      }}
                    >
                      {author.title}
                    </Typography>
                  )}
                </Box>
              </Stack>
            ) : null}
          </Box>
          <PostMeta date={post.date} readTime={post.readTime} compact={true} />
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
