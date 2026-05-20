import { Box, Typography, List, ListItemButton, ListItemText, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function PostTableOfContents({ sections }) {
  const headings = sections.filter((section) => section.heading);

  if (headings.length === 0) return null;

  return (
    <Box
      sx={{
        my: 4,
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        maxWidth: 720,
      }}
    >
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Table of Contents
      </Typography>
      <List dense disablePadding>
        {headings.map((section, index) => {
          const anchorId = section.heading.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
          return (
            <ListItemButton
              key={anchorId}
              component="a"
              href={`#${anchorId}`}
              sx={{
                px: 0,
                py: 0.5,
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <ListItemText
                primary={section.heading}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 400 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
