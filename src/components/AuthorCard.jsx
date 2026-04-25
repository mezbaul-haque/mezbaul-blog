import { Box, Card, CardActionArea, CardMedia, Divider, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { FollowButton } from './engagement/FollowButton';

export function AuthorCard({ author, showLink = true, profileUrl, compact = false, variant = 'default' }) {
  const initials = author.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Professional clickable author card with post-like hover effects
  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 360,
        transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 14px 30px rgba(36, 49, 58, 0.08)',
          borderColor: 'primary.main',
        },
        '&:hover .author-photo': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <CardActionArea
        component={profileUrl ? RouterLink : 'div'}
        to={profileUrl || undefined}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          cursor: profileUrl ? 'pointer' : 'default',
          textDecoration: 'none',
          '&.Mui-focusVisible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '-2px',
          },
        }}
      >
        {/* Round Photo */}
        <Box
          className="author-photo"
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: '#e9eeea',
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
            flexShrink: 0,
            mb: 2,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(215, 220, 214, 0.5)',
            transition: 'transform 220ms ease',
          }}
        >
          {author.avatar ? (
            <CardMedia
              component="img"
              image={author.avatar}
              alt={author.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Typography variant="h4" sx={{ fontWeight: 500, color: 'text.secondary' }}>
              {initials}
            </Typography>
          )}
        </Box>

        {/* Name, Title, and Bio */}
        <Stack spacing={1.25} sx={{ width: '100%', textAlign: 'center' }}>
          {/* Name and Title */}
          <Stack spacing={0.5} alignItems="center">
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: '1.25rem',
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
              }}
            >
              {author.name}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                fontSize: '0.95rem',
                lineHeight: 1.4,
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            >
              {author.title}
            </Typography>
          </Stack>

          {/* Divider */}
          <Divider sx={{ borderColor: '#d7dcd6' }} />

          {/* Bio */}
          {author.bio && (
            <Typography
              color="text.secondary"
              sx={{
                fontSize: '0.9rem',
                lineHeight: 1.5,
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
            >
              {author.bio}
            </Typography>
          )}

          {/* Follow Button */}
          <Box sx={{ pt: 1, mt: 'auto' }}>
            <FollowButton writerId={author.id} variant="outlined" />
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
