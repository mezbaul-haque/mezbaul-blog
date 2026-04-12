import { Box, Card, CardActionArea, CardContent, CardMedia, Link as MuiLink, Stack, Typography, Tooltip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LanguageIcon from '@mui/icons-material/Language';

export function AuthorCard({ author, showLink = true, profileUrl, compact = false, variant = 'default' }) {
  const initials = author.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const websiteLabel = author.website
    ? author.website.replace(/^https?:\/\/(www\.)?/, '')
    : null;
  const isDirectory = variant === 'directory';
  const avatarSize = compact ? 60 : 82;

  if (isDirectory) {
    return (
      <Card
        sx={{
          width: '100%',
          height: '100%',
          minHeight: 180,
          maxHeight: 180,
          transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 14px 30px rgba(36, 49, 58, 0.08)',
            borderColor: 'primary.main',
          },
          '&:hover .author-card-media, &:focus-within .author-card-media': {
            transform: 'scale(1.03)',
          },
        }}
      >
        <CardActionArea
          component={RouterLink}
          to={profileUrl}
          sx={{
            height: '100%',
            display: 'grid',
            gridTemplateColumns: '110px 1fr',
            alignItems: 'stretch',
            '&.Mui-focusVisible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '-2px',
            },
          }}
        >
          {author.avatar ? (
            <CardMedia
              component="img"
              image={author.avatar}
              alt={author.name}
              className="author-card-media"
              loading="lazy"
              sx={{
                height: '100%',
                bgcolor: '#e9eeea',
                transition: 'transform 220ms ease',
              }}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                bgcolor: '#e9eeea',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Typography variant="h2" sx={{ fontWeight: 400, color: 'text.secondary' }}>
                {initials}
              </Typography>
            </Box>
          )}

            <CardContent
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              minWidth: 0,
              height: 1,
            }}
          >
            <Typography variant="h3" sx={{ mb: 0.4, fontSize: '1.05rem', lineHeight: 1.2 }}>
              {author.name}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                fontSize: '0.78rem',
                lineHeight: 1.45,
                mb: 0.7,
                height: '2.3em',
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1,
              }}
            >
              {author.title}
            </Typography>
            {author.bio ? (
              <Typography
                color="text.secondary"
                sx={{
                  mb: 0.9,
                  height: '4.1em',
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  fontSize: '0.76rem',
                  lineHeight: 1.45,
                }}
              >
                {author.bio}
              </Typography>
            ) : null}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 'auto' }}>
              <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.64rem', lineHeight: 1 }}>
                View profile
              </Typography>
              {showLink && websiteLabel ? (
                <Tooltip title={websiteLabel} arrow>
                  <MuiLink
                    href={author.website}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.35,
                      ml: 'auto',
                      fontSize: '0.68rem',
                      color: 'text.secondary',
                      opacity: 0.85,
                      transition: 'color 180ms ease, opacity 180ms ease',
                      '&:hover': {
                        color: 'primary.main',
                        opacity: 1,
                      },
                    }}
                  >
                    <LanguageIcon sx={{ fontSize: '0.95rem' }} />
                    <OpenInNewIcon sx={{ fontSize: '0.9rem', opacity: 0.75 }} />
                  </MuiLink>
                </Tooltip>
              ) : null}
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={compact ? 2 : 3}
      alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
      sx={{
        height: '100%',
        p: compact ? 2 : { xs: 2.5, md: 3 },
        borderRadius: 2,
        border: '1px solid',
        borderColor: compact ? 'transparent' : 'divider',
        bgcolor: compact ? 'transparent' : 'background.paper',
        transition: 'border-color 180ms ease, box-shadow 180ms ease',
        '&:hover': compact
          ? { bgcolor: 'action.hover' }
          : {
              borderColor: 'primary.main',
              boxShadow: '0 8px 20px rgba(36, 49, 58, 0.05)',
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

      <Stack sx={{ maxWidth: compact ? 480 : 680, flex: 1, minWidth: 0, height: '100%' }}>
        <Typography
          variant="overline"
          sx={{ fontSize: compact ? '0.7rem' : '0.75rem', color: 'text.secondary', mb: 0.5 }}
        >
          {compact ? 'By' : 'Writer'}
        </Typography>
        <Typography variant={compact ? "h5" : "h3"} sx={{ mb: 0.5 }}>
          {author.name}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
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
              mt: 1.25,
              fontSize: '0.95rem',
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            {author.bio}
          </Typography>
        )}
        {showLink && (profileUrl || author.website) ? (
          <Stack
            direction="row"
            spacing={compact ? 1 : 1.5}
            sx={{
              mt: 'auto',
              pt: compact ? 1.5 : 2,
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
                  fontWeight: 500,
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
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  );
}
