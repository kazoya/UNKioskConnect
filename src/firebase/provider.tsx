'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  firestore: null,
});

export const FirebaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [app, setApp] = useState<FirebaseApp | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !getApps().length) {
      try {
        const firebaseApp = initializeApp(firebaseConfig);
        setApp(firebaseApp);
      } catch (e) {
        console.error('Failed to initialize Firebase', e);
      }
    } else if (getApps().length) {
      setApp(getApps()[0]);
    }
  }, []);

  const auth = useMemo(() => (app ? getAuth(app) : null), [app]);
  const firestore = useMemo(() => (app ? getFirestore(app) : null), [app]);

  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseApp = () => useContext(FirebaseContext)?.app;
export const useAuth = () => useContext(FirebaseContext)?.auth;
export const useFirestore = () => useContext(FirebaseContext)?.firestore;
