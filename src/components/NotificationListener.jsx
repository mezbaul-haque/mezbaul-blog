import React, { useContext } from 'react';
import { Snackbar, Alert, Stack } from '@mui/material';
import { useNotify } from '../contexts/NotificationContext';

export function NotificationListener() {
  const { notifications } = useNotify();

  return (
    <Stack spacing={1} sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000 }}>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{ position: 'relative' }}
        >
          <Alert
            severity={notification.severity}
            variant="filled"
            onClose={() => {}}
            sx={{ alignItems: 'center' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
}
