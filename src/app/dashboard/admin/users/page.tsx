'use client';

import { useCollection, useFirestore, useUser } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminUsersPage() {
  const { data: users, loading: usersLoading } = useCollection<UserProfile>(['users']);
  const firestore = useFirestore();
  const { toast } = useToast();
  const { user, claims, loading: userLoading } = useUser();
  const router = useRouter();

  const isAdmin = claims?.role === 'admin';
  
  useEffect(() => {
    if (!userLoading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [user, claims, userLoading, isAdmin, router]);

  const handleRoleChange = (uid: string, role: 'user' | 'admin') => {
    if (!firestore || uid === user?.uid) return; // Prevent admin from changing their own role
    const userDocRef = doc(firestore, 'users', uid);
    
    const updatePayload = { role };

    updateDoc(userDocRef, updatePayload)
    .then(() => {
        toast({
            title: 'Role Updated',
            description: `User role has been changed to ${role}.`,
        });
    })
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: updatePayload
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  };

  if (userLoading || !isAdmin) {
    return (
       <div className="space-y-4">
        <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-80" />
        </div>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">
            Manage Users
        </h1>
        <p className="text-lg text-muted-foreground">
            View all registered users and manage their roles.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>
            Assign roles to users to grant or restrict admin privileges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Display Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Change Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersLoading ? (
                [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-10 w-28" /></TableCell>
                  </TableRow>
                ))
              ) : (
                users?.map((u) => (
                  <TableRow key={u.uid}>
                    <TableCell className="font-medium">
                      {u.displayName || 'N/A'}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={u.role === 'admin' ? 'default' : 'secondary'}
                      >
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(value: 'user' | 'admin') =>
                          handleRoleChange(u.uid, value)
                        }
                        defaultValue={u.role}
                        // Disable select for the current admin user to prevent self-lockout
                        disabled={u.uid === user?.uid}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
