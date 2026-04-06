import React, { useState, useEffect, createContext, useContext } from 'react';
import { UserProfile } from '../types';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  uid: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email);
      
      if (firebaseUser) {
        setUid(firebaseUser.uid);
        
        // Use a real-time listener for the profile too!
        // This ensures the role/salary etc update INSTANTLY if changed in the backend
        const profileUnsub = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setUser({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
          } else {
            setUser(null);
          }
          setLoading(false);
        }, (err) => {
          console.error('Profile listener error:', err);
          setLoading(false);
          setUser(null);
        });

        return () => profileUnsub();
      } else {
        setUser(null);
        setUid(null);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle setting user state
  };

  const logout = () => {
    signOut(auth);
  };

  const updateUser = (userData: UserProfile) => {
    setUser(userData);
    setUid(userData.uid);
  };

  return (
    <AuthContext.Provider value={{ user, uid, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
