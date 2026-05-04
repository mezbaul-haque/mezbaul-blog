import { Box, Card, CardMedia, Stack, Typography, Link, IconButton } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import XIcon from '@mui/icons-material/X';
import { FollowButton } from './engagement/FollowButton';

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
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        borderRadius: 3,
      }}
    >
      {/* Cover Photo */}
      <Box
        sx={{
          position: 'relative',
          height: 180,
          bgcolor: 'primary.light',
          overflow: 'hidden',
        }}
      >
        {author.coverPhoto ? (
          <CardMedia
            component="img"
            image={author.coverPhoto}
            alt={`${author.name} cover`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #2f5d50 0%, #4a7c6a 100%)',
            }}
          />
        )}
        {/* Overlay gradient for better text readability */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 100%)',
          }}
        />
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          position: 'relative',
          pt: 7,
          pb: 4,
          px: 4,
          textAlign: 'center',
        }}
      >
        {/* Avatar - overlapping the cover */}
        <Box
          sx={{
            position: 'absolute',
            top: -55,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 110,
            height: 110,
            borderRadius: '50%',
            bgcolor: '#e9eeea',
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            border: '4px solid',
            borderColor: 'background.paper',
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
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {initials}
            </Typography>
          )}
        </Box>

        {/* Name */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: '1.5rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            mb: 0.5,
          }}
        >
          {author.name}
        </Typography>

        {/* Title/Designation */}
        <Typography
          color="text.secondary"
          sx={{
            fontSize: '0.9rem',
            fontWeight: 500,
            letterSpacing: '0.01em',
            mb: 2.5,
          }}
        >
          {author.title}
        </Typography>

        {/* Bio */}
        <Typography
          color="text.secondary"
          sx={{
            fontSize: '0.95rem',
            lineHeight: 1.75,
            fontWeight: 400,
            maxWidth: 480,
            mx: 'auto',
            mb: 3,
          }}
        >
          {author.bio}
        </Typography>

        {/* Follow Button */}
        <Box sx={{ mb: 2 }}>
          <FollowButton writerId={author.id} />
        </Box>

        {/* Social Links */}
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          {author.website && (
            <IconButton
              component={Link}
              href={author.website}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover',
                },
              }}
              aria-label="Visit website"
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          )}
          {author.twitter && (
            <IconButton
              component={Link}
              href={author.twitter}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover',
                },
              }}
              aria-label="Visit X profile"
            >
              <XIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Box>
    </Card>
  );
}
