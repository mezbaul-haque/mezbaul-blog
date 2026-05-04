import { Box, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

export function NotFoundPage() {
  return (
    <Stack spacing={4}>
      <PageHeader
        eyebrow="404"
        title="Page not found"
        intro="The page you're looking for doesn't exist or may have been moved."
        titleWidth="15ch"
        introWidth={600}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button variant="contained" component={RouterLink} to="/" size="large">
            Go to Homepage
          </Button>
          <Button variant="outlined" component={RouterLink} to="/archive" size="large">
            Browse Archive
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
