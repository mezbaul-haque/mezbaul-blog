import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../services/firebase';

const AuthContext = createContext(null);

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
        const profile = await fetchUserProfile(firebaseUser.uid);
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

  async function signUp(email, password, { name }) {
    if (!auth || !db) {
      throw new Error('Firebase is not configured');
    }
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = {
      id: credential.user.uid,
      email,
      name,
      title: '',
      bio: '',
      avatar: '',
      coverPhoto: '',
      website: '',
      twitter: '',
      role: 'writer',
      isActive: true,
      isProfileVisible: false,
      approvalStatus: 'pending',
      approvedAt: null,
      approvedBy: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', credential.user.uid), newUser);
    return { user: credential.user, profile: newUser };
  }

  async function signIn(email, password) {
    if (!auth) {
      throw new Error('Firebase is not configured');
    }
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await fetchUserProfile(credential.user.uid);
    return { user: credential.user, profile };
  }

  async function logOut() {
    if (!auth) return;
    await signOut(auth);
  }

  const value = {
    user,
    userProfile,
    isLoading,
    isFirebaseConfigured,
    isAuthenticated: !!user,
    isAdmin: userProfile?.role === 'admin',
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
