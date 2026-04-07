import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link as MuiLink,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { navItems, siteDescription, siteTitle } from '../data';

function NavLink({ to, label, onClick }) {
  const { pathname } = useLocation();
  const active = useMemo(
    () => (to === '/' ? pathname === '/' : pathname.startsWith(to)),
    [pathname, to],
  );

  return (
    <MuiLink
      component={RouterLink}
      to={to}
      color={active ? 'text.primary' : 'text.secondary'}
      underline="none"
      onClick={onClick}
      sx={{
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: '0.95rem',
      }}
    >
      {label}
    </MuiLink>
  );
}

export function SiteLayout({ children }) {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 82, gap: 2 }}>
            <MuiLink
              component={RouterLink}
              to="/"
              underline="none"
              color="text.primary"
              sx={{
                flexGrow: 1,
                fontFamily:
                  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: '0.95rem',
              }}
            >
              {siteTitle}
            </MuiLink>

            <Stack
              component="nav"
              aria-label="Primary navigation"
              direction="row"
              spacing={3}
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              {navItems.map((item) => (
                <NavLink key={item.to} {...item} />
              ))}
            </Stack>

            <IconButton
              onClick={() => setOpen(true)}
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          mt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} sx={{ py: { xs: 3, md: 4 } }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              spacing={3}
            >
              <Box sx={{ maxWidth: 420 }}>
                <Typography
                  variant="overline"
                  sx={{ display: 'block', mb: 0.75 }}
                >
                  {siteTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {siteDescription}
                </Typography>
              </Box>

              <Stack
                component="nav"
                direction="row"
                spacing={3}
                useFlexGap
                flexWrap="wrap"
                aria-label="Footer navigation"
              >
                {navItems.map((item) => (
                  <NavLink key={`footer-${item.to}`} {...item} />
                ))}
              </Stack>
            </Stack>

            <Divider />

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={1.5}
            >
              <Typography variant="body2" color="text.secondary">
                © {currentYear} Mezbaul Blog. All rights reserved.
              </Typography>
              <Button
                color="primary"
                size="small"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                sx={{ minHeight: 0, p: 0, minWidth: 0 }}
              >
                Back to top
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Stack sx={{ p: 3, minWidth: 220 }} spacing={2}>
          {navItems.map((item) => (
            <NavLink
              key={`drawer-${item.to}`}
              {...item}
              onClick={() => setOpen(false)}
            />
          ))}
        </Stack>
      </Drawer>
    </Box>
  );
}
