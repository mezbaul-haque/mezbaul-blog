import { useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthErrorMessage } from '../../services/authErrors';
import { canWritePostsForRole } from '../../services/accountRoles';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentRole, isAuthenticated, isLoading, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  if (!isLoading && isAuthenticated) {
    return <Navigate to={from || (canWritePostsForRole(currentRole) ? '/dashboard' : '/')} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await signIn(email, password);
      const destination = from || (canWritePostsForRole(result.profile?.role) ? '/dashboard' : '/');
      navigate(destination, { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Sign in failed.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Sign In
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Sign in to your account
      </Typography>

      {error && (
        <Card sx={{ mb: 3, bgcolor: 'error.light' }}>
          <CardContent>
            <Typography variant="body2" color="error.contrastText">
              {error}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </Stack>
      </Box>

      <Typography variant="body2" sx={{ mt: 3 }}>
        Don&apos;t have an account?{' '}
        <Link component={RouterLink} to="/register">
          Create one
        </Link>
      </Typography>
    </Box>
  );
}
