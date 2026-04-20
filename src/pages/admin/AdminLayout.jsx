import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

const adminNavItems = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Review Drafts', path: '/admin/review' },
  { label: 'Manage Writers', path: '/admin/writers' },
  { label: 'Manage Posts', path: '/admin/posts' },
];

export function AdminLayout() {
  const { userProfile } = useAuth();
  const location = useLocation();

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
            Admin Panel
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {userProfile?.name}
          </Typography>
        </Box>

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

        <Box sx={{ mt: 'auto', p: 2 }}>
          <Button component={RouterLink} to="/dashboard" fullWidth>
            Back to Dashboard
          </Button>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}