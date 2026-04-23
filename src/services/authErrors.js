const authErrorMessages = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/missing-password': 'Enter your password.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/user-not-found': 'No account was found for this email.',
  'auth/wrong-password': 'Email or password is incorrect.',
  'auth/invalid-login-credentials': 'Email or password is incorrect.',
  'auth/too-many-requests': 'Too many attempts. Please wait a bit and try again.',
  'auth/network-request-failed': 'Network error. Check your internet connection and try again.',
  'auth/operation-not-allowed':
    'Email/password sign-in is not enabled in Firebase Authentication yet.',
  'auth/configuration-not-found':
    'Firebase Authentication is not configured correctly for this app.',
  'auth/unauthorized-domain':
    'This domain is not authorized in Firebase Authentication.',
  'permission-denied':
    'Your account was created, but profile setup was temporarily blocked. Refresh and try again. If it keeps happening, check the deployed Firestore rules.',
};

export function getAuthErrorMessage(error, fallbackMessage) {
  if (!error) return fallbackMessage;

  if (error.message === 'Firebase is not configured') {
    return 'Firebase environment variables are missing for this app.';
  }

  return authErrorMessages[error.code] || error.message || fallbackMessage;
}
