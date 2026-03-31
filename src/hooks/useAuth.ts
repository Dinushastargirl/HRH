import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const demoUserStr = localStorage.getItem('hr_pulse_demo_user');
      const demoUser = demoUserStr ? JSON.parse(demoUserStr) : null;

      if (firebaseUser) {
        setUid(firebaseUser.uid);
        const unsubProfile = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data() as UserProfile);
          }
          setLoading(false);
        });
        return () => unsubProfile();
      } else if (demoUser) {
        setUid(demoUser.uid);
        const unsubProfile = onSnapshot(doc(db, 'users', demoUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data() as UserProfile);
          } else {
            // If doc doesn't exist in Firestore but we have it in localStorage, use localStorage as fallback
            setUser(demoUser);
          }
          setLoading(false);
        });
        return () => unsubProfile();
      } else {
        setUid(null);
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, uid, loading };
}
