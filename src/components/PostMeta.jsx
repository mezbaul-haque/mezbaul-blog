import { Box, Stack, Typography } from '@mui/material';

export function PostMeta({ date, readTime, useChips = false, ChipComponent }) {
  if (useChips && ChipComponent) {
    return (
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <ChipComponent label={date} variant="outlined" size="small" />
        <ChipComponent label={readTime} variant="outlined" size="small" />
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {date}
      </Typography>
      <Box component="span" sx={{ color: 'text.secondary' }}>
        ·
      </Box>
      <Typography variant="body2" color="text.secondary">
        {readTime}
      </Typography>
    </Stack>
  );
}
