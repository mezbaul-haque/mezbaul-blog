import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

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
  const { userProfile, logOut, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" noWrap>
            {userProfile?.name || 'Dashboard'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {isAdmin ? 'Admin' : 'Writer'}
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
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}