import { Box, Chip, Stack, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export function PostMeta({ date, readTime, useChips = false, ChipComponent, compact = false }) {
  if (useChips && ChipComponent) {
    return (
      <Stack direction="row" spacing={1} sx={{ mt: compact ? 1 : 2 }}>
        <ChipComponent
          icon={<CalendarTodayIcon />}
          label={date}
          variant="outlined"
          size="small"
          sx={{ fontSize: '0.75rem' }}
        />
        <ChipComponent
          icon={<AccessTimeIcon />}
          label={readTime}
          variant="outlined"
          size="small"
          sx={{ fontSize: '0.75rem' }}
        />
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        mt: compact ? 1 : 2,
        '& .MuiTypography-root': {
          fontSize: compact ? '0.8rem' : '0.875rem',
        },
      }}
    >
      <Stack direction="row" spacing={0.5} alignItems="center">
        <CalendarTodayIcon sx={{ fontSize: compact ? 16 : 18, color: 'text.secondary', opacity: 0.7 }} />
        <Typography variant="body2" color="text.secondary">
          {date}
        </Typography>
      </Stack>
      <Box component="span" sx={{ color: 'text.secondary', opacity: 0.5 }}>
        •
      </Box>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <AccessTimeIcon sx={{ fontSize: compact ? 16 : 18, color: 'text.secondary', opacity: 0.7 }} />
        <Typography variant="body2" color="text.secondary">
          {readTime}
        </Typography>
      </Stack>
    </Stack>
  );
}
