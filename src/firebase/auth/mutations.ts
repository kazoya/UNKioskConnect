'use client';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, Firestore, serverTimestamp, getDocs, collection, limit, query } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';
import type { AuthFormValues } from '@/components/auth-form';

// Function to check if there are any users in the database
async function isFirstUser(firestore: Firestore): Promise<boolean> {
    const usersCollectionRef = collection(firestore, 'users');
    const q = query(usersCollectionRef, limit(1));
    const snapshot = await getDocs(q);
    return snapshot.empty;
}


export async function signUp(
  auth: Auth,
  firestore: Firestore,
  data: AuthFormValues
) {
  const { email, password, displayName } = data;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update profile and create user document
    await updateProfile(user, { displayName });

    const firstUser = await isFirstUser(firestore);

    const userDocRef = doc(firestore, 'users', user.uid);
    const userPayload = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: firstUser ? 'admin' : 'user', // Assign 'admin' if first user
      createdAt: serverTimestamp(),
    };
    
    setDoc(userDocRef, userPayload, { merge: true }).catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'create',
        requestResourceData: userPayload,
      });
      errorEmitter.emit('permission-error', permissionError);
      // We still want to throw the original error to be caught by the UI
      throw serverError;
    });

    return userCredential;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signIn(auth: Auth, data: AuthFormValues) {
  const { email, password } = data;
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}
