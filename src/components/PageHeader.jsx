import { Box, Typography } from '@mui/material';

export function PageHeader({ eyebrow, title, intro, titleWidth = '10ch', introWidth = 720 }) {
  return (
    <Box sx={{ pb: 5, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="overline">{eyebrow}</Typography>
      <Typography variant="h1" sx={{ maxWidth: titleWidth }}>
        {title}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ maxWidth: introWidth, mt: 2, fontSize: '1.08rem', lineHeight: 1.85 }}
      >
        {intro}
      </Typography>
    </Box>
  );
}
