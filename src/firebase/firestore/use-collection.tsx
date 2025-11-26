'use client';

import React from 'react';
import {
  onSnapshot,
  collection,
  query as firestoreQuery,
  Query,
  DocumentReference,
  FirestoreError,
  Unsubscribe,
  QueryConstraint,
  CollectionReference,
  DocumentSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';

import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type CollectionQuery =
  | Query
  | DocumentReference
  | string // Added to allow raw path strings
  | [string, ...QueryConstraint[]]
  | null;

const useMemoCompare = <T,>(
  next: any,
  compare: (prev: T | undefined, next: any) => boolean
) => {
  const previousRef = React.useRef<T>();
  const previous = previousRef.current;

  const isEqual = compare(previous, next);

  React.useEffect(() => {
    if (!isEqual) {
      previousRef.current = next;
    }
  });

  return isEqual ? previous : next;
};

export function useMemoFirebase<T extends CollectionQuery>(
  value: () => T,
  deps: React.DependencyList
) {
  const firestore = useFirestore();

  const getQuery = React.useCallback(value, deps);

  return useMemoCompare(getQuery(), (prev, next) => {
    if (prev === null && next === null) return true;
    if (!prev || !next) return false;
    
    if (typeof prev === 'string' || typeof next === 'string') {
      return prev === next;
    }

    if (Array.isArray(prev) || Array.isArray(next)) return false;
    
    return prev.isEqual(next);
  });
}

const isDocumentReference = (obj: any): obj is DocumentReference => {
  return obj && typeof obj.path === 'string' && typeof obj.parent === 'object';
};

const isDocSnap = (snap: any): snap is DocumentSnapshot => {
    return 'exists' in snap;
}

function useBase<T>(
  queryParam: CollectionQuery,
  { includeMetadataChanges = false } = {}
) {
  const firestore = useFirestore();
  const [data, setData] = React.useState<T | undefined>(undefined);
  const [error, setError] = React.useState<FirestoreError>();
  const [loading, setLoading] = React.useState(true);
  const [isValidating, setIsValidating] = React.useState(true);

  const memoQuery = useMemoCompare(queryParam, (prev, next) => {
    if (prev === null && next === null) return true;
    if (!prev || !next) return false;

    if (typeof prev === 'string' || typeof next === 'string') {
        return prev === next;
    }

    if (isDocumentReference(prev) || 'where' in prev) {
      if (isDocumentReference(next) || 'where' in next) {
        return prev.isEqual(next as Query);
      }
      return false;
    }

    if (Array.isArray(next)) {
      if (
        !Array.isArray(prev) ||
        prev.length !== next.length ||
        prev[0] !== next[0]
      ) {
        return false;
      }
      return prev
        .slice(1)
        .every((c, i) =>
          (c as any).isEqual((next as [string, ...any[]])[i + 1])
        );
    }
    return false;
  });

  React.useEffect(() => {
    let unsub: Unsubscribe = () => {};

    if (firestore && memoQuery) {
      setLoading(true);
      setIsValidating(true);
      let ref: Query | DocumentReference;

      if (typeof memoQuery === 'string') {
          ref = collection(firestore, memoQuery);
      } else if (Array.isArray(memoQuery)) {
        const [path, ...constraints] = memoQuery;
        ref = firestoreQuery(collection(firestore, path), ...constraints);
      } else {
        ref = memoQuery;
      }

      unsub = onSnapshot(
        ref,
        { includeMetadataChanges },
        (snap: DocumentSnapshot | QuerySnapshot) => {
          let result: any;
          if (isDocSnap(snap)) {
            result = snap.exists()
              ? { id: snap.id, ...snap.data() }
              : undefined;
          } else {
            result = snap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
          }
          setData(result);
          setError(undefined);
          setLoading(false);
          setIsValidating(false);
        },
        async (err) => {
          const permissionError = new FirestorePermissionError({
            path: (ref as DocumentReference | CollectionReference).path,
            operation: isDocumentReference(ref) ? 'get' : 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
          setError(err);
          setLoading(false);
          setIsValidating(false);
        }
      );
    } else {
      setData(undefined);
      setLoading(false);
      setIsValidating(false);
    }

    return () => {
      unsub();
    };
  }, [firestore, memoQuery, includeMetadataChanges]);

  return { data, error, loading, isValidating };
}

export function useCollection<T>(
  query: CollectionQuery,
  options?: { includeMetadataChanges?: boolean }
) {
  return useBase<T[]>(query, options);
}

export function useDoc<T>(
  query: CollectionQuery,
  options?: { includeMetadataChanges?: boolean }
) {
  return useBase<T>(query, options);
}
