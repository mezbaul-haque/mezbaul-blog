import { Box, Card, CardMedia, Stack, Typography } from '@mui/material';

export function AuthorProfile({ author }) {
  const initials = author.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Card
      sx={{
        maxWidth: '100%',
        mx: 'auto',
        p: 4,
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Stack spacing={2.5} alignItems="center">
        {/* Round Photo */}
        <Box
          sx={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            bgcolor: '#e9eeea',
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
            border: '2px solid rgba(215, 220, 214, 0.6)',
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
            <Typography variant="h3" sx={{ fontWeight: 500, color: 'text.secondary' }}>
              {initials}
            </Typography>
          )}
        </Box>

        {/* Name */}
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: '1.35rem',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              mb: 0.5,
            }}
          >
            {author.name}
          </Typography>

          {/* Title/Designation */}
          <Typography
            color="text.secondary"
            sx={{
              fontSize: '0.95rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
              lineHeight: 1.5,
            }}
          >
            {author.title}
          </Typography>
        </Box>

        {/* Bio Summary */}
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2.5, w: '100%' }}>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: '0.95rem',
              lineHeight: 1.7,
              fontWeight: 400,
              letterSpacing: '0.01em',
            }}
          >
            {author.bio}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
