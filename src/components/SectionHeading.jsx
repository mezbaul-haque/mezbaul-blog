import { Box, Stack, Typography } from '@mui/material';

export function SectionHeading({ eyebrow, title, copy }) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', md: 'flex-end' }}
      spacing={2}
      sx={{ mb: 3 }}
    >
      <Box>
        <Typography variant="overline">{eyebrow}</Typography>
        <Typography variant="h2">{title}</Typography>
      </Box>
      {copy ? (
        <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
          {copy}
        </Typography>
      ) : null}
    </Stack>
  );
}
