'use client';

import React,
{
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from 'react';
import {
    onAuthStateChanged,
    type User,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile, getUserProfile, type AppUser } from '@/services/user';

type AuthContextType = {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<any>;
  refreshAppUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAppUser = async () => {
    if (user) {
        setLoading(true);
        const profile = await getUserProfile(user.uid);
        if (profile) {
            setAppUser(profile);
        }
        setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const profile = await getUserProfile(user.uid);
        if (profile) {
            setAppUser(profile);
        } else {
            // This might happen on the very first sign-in
            const newProfile = await createUserProfile(user);
            // Ensure newProfile is correctly typed before setting
            if (newProfile) {
              setAppUser(newProfile as AppUser);
            }
        }
      } else {
        setUser(null);
        setAppUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, appUser, loading, login, logout, refreshAppUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};
