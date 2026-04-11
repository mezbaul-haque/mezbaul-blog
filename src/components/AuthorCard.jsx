import { Box, Link as MuiLink, Stack, Typography, Tooltip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LanguageIcon from '@mui/icons-material/Language';

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
  const twitterHandle = author.twitter
    ? author.twitter.replace(/^https?:\/\/(www\.)?twitter\.com\//, '')
    : null;
  const avatarSize = compact ? 64 : 96;

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={compact ? 2 : 3}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      sx={{
        p: compact ? 2 : { xs: 2.5, md: 3 },
        borderRadius: 2,
        border: '1px solid',
        borderColor: compact ? 'transparent' : 'divider',
        bgcolor: compact ? 'transparent' : 'rgba(255, 253, 249, 0.7)',
        transition: 'background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
        '&:hover': compact
          ? {
              bgcolor: 'action.hover',
            }
          : {
              borderColor: 'primary.main',
              boxShadow: '0 10px 24px rgba(36, 49, 58, 0.06)',
            },
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

      <Box sx={{ maxWidth: compact ? 480 : 680, flex: 1, minWidth: 0 }}>
        <Typography
          variant="overline"
          sx={{ fontSize: compact ? '0.7rem' : '0.75rem', color: 'text.secondary' }}
        >
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
            spacing={compact ? 1 : 1.5}
            sx={{
              mt: compact ? 1.5 : 2,
              flexWrap: 'wrap',
              rowGap: 1,
              alignItems: 'center',
            }}
          >
            {profileUrl ? (
              <MuiLink
                component={RouterLink}
                to={profileUrl}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontWeight: 600,
                  fontSize: compact ? '0.8rem' : '0.875rem',
                  transition: 'color 180ms ease, transform 180ms ease',
                  color: 'primary.main',
                  '&:hover': {
                    color: 'primary.dark',
                    transform: 'translateX(2px)',
                  },
                }}
              >
                View profile
                <Box component="span" sx={{ fontSize: '1.1em', opacity: 0.8 }}>→</Box>
              </MuiLink>
            ) : null}
            {websiteLabel ? (
              <Tooltip title={websiteLabel} arrow>
                <MuiLink
                  href={author.website}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.4,
                    fontSize: compact ? '0.8rem' : '0.875rem',
                    transition: 'color 180ms ease, opacity 180ms ease',
                    opacity: 0.85,
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      opacity: 1,
                    },
                  }}
                >
                  <LanguageIcon sx={{ fontSize: '1rem' }} />
                  {websiteLabel}
                  <OpenInNewIcon sx={{ fontSize: '0.95rem', opacity: 0.75 }} />
                </MuiLink>
              </Tooltip>
            ) : null}
            {twitterHandle ? (
              <Tooltip title={`@${twitterHandle}`} arrow>
                <MuiLink
                  href={author.twitter}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.4,
                    fontSize: compact ? '0.8rem' : '0.875rem',
                    transition: 'color 180ms ease, opacity 180ms ease',
                    opacity: 0.85,
                    color: 'text.secondary',
                    '&:hover': {
                      color: '#1DA1F2',
                      opacity: 1,
                    },
                  }}
                >
                  <svg
                    width="1rem"
                    height="1rem"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ display: 'block' }}
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                  </svg>
                  @{twitterHandle}
                  <OpenInNewIcon sx={{ fontSize: '0.95rem', opacity: 0.75 }} />
                </MuiLink>
              </Tooltip>
            ) : null}
          </Stack>
        ) : null}
      </Box>
    </Stack>
  );
}
