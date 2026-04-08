import { Box, Link as MuiLink, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function AuthorCard({ author, showLink = true, profileUrl }) {
  const initials = author.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const websiteLabel = author.website
    ? author.website.replace(/^https?:\/\/(www\.)?/, '')
    : null;

  return (
    <Stack direction="row" spacing={3} alignItems="center" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          bgcolor: 'divider',
          color: 'text.primary',
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
          flexShrink: 0,
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
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {initials}
          </Typography>
        )}
      </Box>

      <Box sx={{ maxWidth: 680 }}>
        <Typography variant="overline">Writer</Typography>
        <Typography variant="h3">{author.name}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {author.title}
        </Typography>
        {author.bio ? (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {author.bio}
          </Typography>
        ) : null}
        {showLink && (profileUrl || author.website || author.twitter) ? (
          <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
            {profileUrl ? (
              <MuiLink component={RouterLink} to={profileUrl}>
                View profile
              </MuiLink>
            ) : null}
            {websiteLabel ? (
              <MuiLink href={author.website} target="_blank" rel="noreferrer">
                {websiteLabel}
              </MuiLink>
            ) : null}
            {author.twitter ? (
              <MuiLink href={author.twitter} target="_blank" rel="noreferrer">
                {author.twitter.replace(/^https?:\/\/(www\.)?/, '')}
              </MuiLink>
            ) : null}
          </Stack>
        ) : null}
      </Box>
    </Stack>
  );
}
