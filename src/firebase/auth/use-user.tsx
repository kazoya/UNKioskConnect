'use client';

import { useEffect, useState } from 'react';
import { onIdTokenChanged, User, IdTokenResult } from 'firebase/auth';
import { doc, getDoc, onSnapshot, Firestore } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';
import type { UserProfile } from '@/lib/types';

// Hardcode admin emails on the client-side
// This is a temporary solution to grant admin access without custom claims functions.
const isAdminByEmail = (user: User | null) => {
    const adminEmails = ['suhib.asrawi@gmail.com', 'ceo@muqasa-jo.com'];
    return user?.email ? adminEmails.includes(user.email) : false;
}

export function useUser(): UserState {
  const auth = useAuth();
  const firestore = useFirestore();
  const [userState, setUserState] = useState<UserState>({
    user: null,
    profile: null,
    claims: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!auth || !firestore) {
      if (!userState.loading) {
        setUserState((s) => ({ ...s, loading: true }));
      }
      return;
    }

    // Use onIdTokenChanged to get the latest claims when the token refreshes.
    const unsubscribe = onIdTokenChanged(
      auth,
      async (user) => {
        if (user) {
          try {
            const tokenResult = await user.getIdTokenResult();
            
            // Special handling for the hardcoded admin user
            const effectiveClaims = {
                ...tokenResult.claims,
                ...(isAdminByEmail(user) && { role: 'admin' })
            };

            const userDocRef = doc(firestore as Firestore, 'users', user.uid);
            
            // Use onSnapshot to listen for real-time updates to the user profile
            const unsubProfile = onSnapshot(userDocRef, (userDocSnap) => {
              if (userDocSnap.exists()) {
                setUserState({
                  user,
                  profile: userDocSnap.data() as UserProfile,
                  claims: effectiveClaims,
                  loading: false,
                  error: null,
                });
              } else {
                setUserState({
                  user,
                  profile: null,
                  claims: effectiveClaims,
                  loading: false,
                  error: null, // Not an error if profile is being created
                });
              }
            }, (error: any) => {
                console.error('Error fetching user profile snapshot:', error);
                 setUserState({
                    user,
                    profile: null,
                    claims: effectiveClaims,
                    loading: false,
                    error,
                });
            });

            return () => unsubProfile();

          } catch (error: any) {
            console.error('Error fetching user data:', error);
            setUserState({
              user,
              profile: null,
              claims: isAdminByEmail(user) ? { role: 'admin' } : null,
              loading: false,
              error,
            });
          }
        } else {
          setUserState({
            user: null,
            profile: null,
            claims: null,
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        console.error('Auth state error:', error);
        setUserState({
          user: null,
          profile: null,
          claims: null,
          loading: false,
          error,
        });
      }
    );

    return () => unsubscribe();
  }, [auth, firestore]);

  return userState;
}

interface UserState {
  user: User | null;
  profile: UserProfile | null;
  claims: IdTokenResult['claims'] | null;
  loading: boolean;
  error: Error | null;
}
