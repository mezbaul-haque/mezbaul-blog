import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Link as MuiLink,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { navItems } from '../data/siteData';

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
              Mezbaul Blog
            </MuiLink>

            <Stack
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

      <Container maxWidth="lg" sx={{ pb: 5 }}>
        <Box
          component="footer"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: 2,
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="overline" sx={{ m: 0 }}>
            Mezbaul Blog. Built for thoughtful writing.
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {navItems.map((item) => (
              <NavLink key={`footer-${item.to}`} {...item} />
            ))}
            <Button
              color="primary"
              size="small"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              sx={{ minHeight: 0, p: 0, minWidth: 0 }}
            >
              Back to top
            </Button>
          </Stack>
        </Box>
      </Container>

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
