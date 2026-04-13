import { useState } from 'react';
import { Box, Card, CardMedia, Button, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FlipIcon from '@mui/icons-material/Flip';

export function AuthorCard({ author, showLink = true, profileUrl, compact = false, variant = 'default', disableFlip = false }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const initials = author.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const isDirectory = variant === 'directory';
  const avatarSize = compact ? 60 : 82;

  // Card component with flip button and round photo
  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 380,
        position: 'relative',
        transition: 'box-shadow 200ms ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Front side - Photo and Info */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            opacity: isFlipped ? 0 : 1,
            transition: 'opacity 300ms ease',
            pointerEvents: isFlipped ? 'none' : 'auto',
          }}
        >
          {/* Flip Button - Top Right */}
          {!disableFlip && (
            <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
              <Tooltip title="See bio" arrow>
                <IconButton
                  onClick={() => setIsFlipped(true)}
                  aria-label="View bio"
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                    transition: 'all 200ms ease',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <FlipIcon 
                    sx={{ 
                      fontSize: '1.1rem', 
                      color: 'text.secondary',
                      transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }} 
                  />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Round Photo */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: '#e9eeea',
              display: 'grid',
              placeItems: 'center',
              overflow: 'hidden',
              flexShrink: 0,
              mb: 2.5,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(215, 220, 214, 0.5)',
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

          {/* Name and Title */}
          <Stack spacing={0.75} alignItems="center" sx={{ textAlign: 'center', mb: 3, flex: 1, justifyContent: 'center' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                fontSize: '1.15rem',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
              }}
            >
              {author.name}
            </Typography>
            <Typography 
              color="text.secondary" 
              sx={{ 
                fontSize: '0.875rem', 
                lineHeight: 1.5, 
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            >
              {author.title}
            </Typography>
          </Stack>

          {/* View Profile Button */}
          {profileUrl && (
            <Button
              component={RouterLink}
              to={profileUrl}
              variant="outlined"
              size="medium"
              sx={{
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.01em',
                transition: 'all 200ms ease',
                '&:hover': {
                  backgroundColor: 'rgba(47, 93, 80, 0.04)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              View Profile →
            </Button>
          )}
        </Box>

        {/* Back side - Bio */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            bgcolor: 'background.paper',
            opacity: isFlipped ? 1 : 0,
            transition: 'opacity 300ms ease',
            pointerEvents: isFlipped ? 'auto' : 'none',
          }}
        >
          {/* Flip Back Button - Top Right */}
          {!disableFlip && (
            <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
              <Tooltip title="Back" arrow>
                <IconButton
                  onClick={() => setIsFlipped(false)}
                  aria-label="Back to profile"
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                    transition: 'all 200ms ease',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <FlipIcon 
                    sx={{ 
                      fontSize: '1.1rem', 
                      color: 'text.secondary', 
                      transform: 'scaleX(-1)',
                      transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }} 
                  />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <Typography 
            color="text.secondary" 
            sx={{ 
              fontSize: '0.95rem', 
              lineHeight: 1.7,
              textAlign: 'center',
              fontWeight: 400,
              letterSpacing: '0.01em',
              maxWidth: '95%',
            }}
          >
            {author.bio}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
