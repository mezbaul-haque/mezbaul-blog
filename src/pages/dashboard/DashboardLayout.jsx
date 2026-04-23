import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  Divider,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAccountLabel } from '../../services/accountRoles';

const drawerWidth = 240;

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'My Profile', path: '/dashboard/profile' },
  { label: 'My Drafts', path: '/dashboard/drafts' },
];

const adminNavItems = [
  { label: 'Review Drafts', path: '/admin/review' },
  { label: 'Manage Writers', path: '/admin/writers' },
  { label: 'Manage Posts', path: '/admin/posts' },
];

export function DashboardLayout() {
  const { currentRole, userProfile, logOut, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen((open) => !open);
  };

  const handleNavigate = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const accountLabel = isAdmin ? 'Admin' : getAccountLabel(currentRole);
  const displayName = userProfile?.name || accountLabel;

  const drawerContent = (
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap>
          {displayName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {accountLabel}
        </Typography>
      </Box>

      <Divider />

      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={handleNavigate}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {isAdmin && (
        <>
          <Divider />
          <Typography variant="overline" sx={{ px: 2, pt: 2 }}>
            Admin
          </Typography>
          <List>
            {adminNavItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={location.pathname === item.path}
                  onClick={handleNavigate}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button
          component={RouterLink}
          to="/"
          fullWidth
          sx={{ mb: 1 }}
          onClick={handleNavigate}
        >
          View Site
        </Button>
        <Button
          onClick={handleLogout}
          fullWidth
          color="secondary"
        >
          Sign Out
        </Button>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isMobile && (
        <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar sx={{ gap: 1 }}>
            <IconButton edge="start" onClick={handleDrawerToggle} aria-label="open dashboard navigation">
              <MenuIcon />
            </IconButton>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" noWrap>
                {displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {accountLabel}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
          display: { xs: 'block', md: 'block' },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: { xs: 8, md: 0 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
