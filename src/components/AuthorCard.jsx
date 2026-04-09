import { Box, Link as MuiLink, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function AuthorCard({ author, showLink = true, profileUrl, compact = false }) {
  const initials = author.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const websiteLabel = author.website
    ? author.website.replace(/^https?:\/\/(www\.)?/, '')
    : null;

  const avatarSize = compact ? 64 : 96;

  return (
    <Stack
      direction="row"
      spacing={compact ? 2 : 3}
      alignItems="center"
      sx={{
        mt: compact ? 2 : 4,
        mb: compact ? 2 : 4,
        p: compact ? 2 : 0,
        borderRadius: compact ? 2 : 0,
        transition: 'background-color 180ms ease',
        '&:hover': compact ? {
          bgcolor: 'action.hover',
        } : {},
      }}
    >
      <Box
        sx={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: '50%',
          bgcolor: 'divider',
          color: 'text.primary',
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
          flexShrink: 0,
          transition: 'transform 180ms ease, box-shadow 180ms ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
          <Typography variant={compact ? "h5" : "h4"} sx={{ fontWeight: 700 }}>
            {initials}
          </Typography>
        )}
      </Box>

      <Box sx={{ maxWidth: compact ? 480 : 680, flex: 1 }}>
        <Typography variant="overline" sx={{ fontSize: compact ? '0.7rem' : '0.75rem' }}>
          {compact ? 'By' : 'Writer'}
        </Typography>
        <Typography variant={compact ? "h5" : "h3"} sx={{ mb: 0.5 }}>
          {author.name}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            mt: compact ? 0.5 : 1,
            fontSize: compact ? '0.875rem' : '1rem',
            lineHeight: 1.5
          }}
        >
          {author.title}
        </Typography>
        {author.bio && !compact && (
          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: '0.95rem',
              lineHeight: 1.6,
              opacity: 0.9
            }}
          >
            {author.bio}
          </Typography>
        )}
        {showLink && (profileUrl || author.website || author.twitter) ? (
          <Stack
            direction="row"
            spacing={compact ? 1.5 : 2}
            sx={{
              mt: compact ? 1 : 2,
              flexWrap: 'wrap',
              '& .MuiLink-root': {
                fontSize: compact ? '0.8rem' : '0.875rem',
                transition: 'color 180ms ease',
                '&:hover': {
                  color: 'primary.main',
                },
              },
            }}
          >
            {profileUrl ? (
              <MuiLink
                component={RouterLink}
                to={profileUrl}
                sx={{ fontWeight: 500 }}
              >
                View profile →
              </MuiLink>
            ) : null}
            {websiteLabel ? (
              <MuiLink
                href={author.website}
                target="_blank"
                rel="noreferrer"
                sx={{ opacity: 0.8 }}
              >
                {websiteLabel}
              </MuiLink>
            ) : null}
            {author.twitter ? (
              <MuiLink
                href={author.twitter}
                target="_blank"
                rel="noreferrer"
                sx={{ opacity: 0.8 }}
              >
                @{author.twitter.replace(/^https?:\/\/(www\.)?twitter\.com\//, '')}
              </MuiLink>
            ) : null}
          </Stack>
        ) : null}
      </Box>
    </Stack>
  );
}
