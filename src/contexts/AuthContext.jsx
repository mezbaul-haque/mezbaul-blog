import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../services/firebase';
import {
  ACCOUNT_ROLE,
  canEngageForRole,
  canWritePostsForRole,
  getAccountLabel,
  normalizeAccountRole,
} from '../services/accountRoles';

const AuthContext = createContext(null);
const PENDING_PROFILE_STORAGE_KEY = 'pendingUserProfileSeed';
const PROFILE_WRITE_RETRY_DELAYS_MS = [250, 600, 1200];

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function buildUserProfile({ uid, email, name, role = ACCOUNT_ROLE.reader }) {
  const normalizedRole = normalizeAccountRole(role);
  const isWriter = normalizedRole === ACCOUNT_ROLE.writer;

  return {
    id: uid,
    email,
    name,
    title: '',
    bio: '',
    avatar: '',
    coverPhoto: '',
    website: '',
    twitter: '',
    role: normalizedRole,
    isActive: true,
    isProfileVisible: false,
    approvalStatus: isWriter ? 'pending' : 'approved',
    approvedAt: isWriter ? null : serverTimestamp(),
    approvedBy: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

function savePendingProfileSeed(seed) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PENDING_PROFILE_STORAGE_KEY, JSON.stringify(seed));
}

function getPendingProfileSeed(uid) {
  if (typeof window === 'undefined') return null;

  const rawSeed = window.localStorage.getItem(PENDING_PROFILE_STORAGE_KEY);
  if (!rawSeed) return null;

  try {
    const seed = JSON.parse(rawSeed);
    return seed?.uid === uid ? seed : null;
  } catch {
    window.localStorage.removeItem(PENDING_PROFILE_STORAGE_KEY);
    return null;
  }
}

function clearPendingProfileSeed(uid) {
  if (typeof window === 'undefined') return;

  const existingSeed = getPendingProfileSeed(uid);
  if (!uid || existingSeed) {
    window.localStorage.removeItem(PENDING_PROFILE_STORAGE_KEY);
  }
}

function buildRecoveryProfileSeed(firebaseUser, pendingSeed) {
  if (pendingSeed) {
    return {
      uid: firebaseUser.uid,
      email: pendingSeed.email || firebaseUser.email || '',
      name: pendingSeed.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Member',
      role: normalizeAccountRole(pendingSeed.role),
    };
  }

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Member',
    role: ACCOUNT_ROLE.reader,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      setIsLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let profile = await fetchUserProfile(firebaseUser.uid);

        if (!profile) {
          profile = await recoverMissingUserProfile(firebaseUser);
        }

        setUser(firebaseUser);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  async function fetchUserProfile(uid) {
    if (!db) return null;
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  }

  async function writeUserProfile(seed, firebaseUser) {
    let lastError = null;

    await firebaseUser.getIdToken();

    for (const retryDelay of [0, ...PROFILE_WRITE_RETRY_DELAYS_MS]) {
      if (retryDelay > 0) {
        await firebaseUser.getIdToken(true);
        await delay(retryDelay);
      }

      try {
        const nextProfile = buildUserProfile(seed);
        await setDoc(doc(db, 'users', seed.uid), nextProfile);
        clearPendingProfileSeed(seed.uid);
        return nextProfile;
      } catch (error) {
        lastError = error;
        if (error?.code !== 'permission-denied') {
          throw error;
        }
      }
    }

    throw lastError;
  }

  async function recoverMissingUserProfile(firebaseUser) {
    const pendingSeed = getPendingProfileSeed(firebaseUser.uid);

    try {
      const recoverySeed = buildRecoveryProfileSeed(firebaseUser, pendingSeed);
      return await writeUserProfile(recoverySeed, firebaseUser);
    } catch (error) {
      console.error('Unable to recover missing user profile after sign-in:', error);
      return null;
    }
  }

  async function signUp(email, password, { name, role = ACCOUNT_ROLE.reader }) {
    if (!auth || !db) {
      throw new Error('Firebase is not configured');
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const profileSeed = {
      uid: credential.user.uid,
      email,
      name,
      role: normalizeAccountRole(role),
    };

    savePendingProfileSeed(profileSeed);

    const newUser = await writeUserProfile(profileSeed, credential.user);
    return { user: credential.user, profile: newUser };
  }

  async function signIn(email, password) {
    if (!auth) {
      throw new Error('Firebase is not configured');
    }
    const credential = await signInWithEmailAndPassword(auth, email, password);
    let profile = await fetchUserProfile(credential.user.uid);

    if (!profile) {
      profile = await recoverMissingUserProfile(credential.user);
    }

    return { user: credential.user, profile };
  }

  async function logOut() {
    if (!auth) return;
    await signOut(auth);
  }

  const currentRole = normalizeAccountRole(userProfile?.role, null);

  const value = {
    user,
    userProfile,
    isLoading,
    isFirebaseConfigured,
    isAuthenticated: !!user,
    hasProfile: !!userProfile,
    currentRole,
    accountLabel: getAccountLabel(currentRole),
    isReader: currentRole === ACCOUNT_ROLE.reader,
    isWriter: currentRole === ACCOUNT_ROLE.writer,
    isAdmin: currentRole === ACCOUNT_ROLE.admin,
    canWritePosts: canWritePostsForRole(currentRole),
    canEngage: canEngageForRole(currentRole),
    signIn,
    signUp,
    logOut,
    refreshProfile: () => user && fetchUserProfile(user.uid).then(setUserProfile),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
