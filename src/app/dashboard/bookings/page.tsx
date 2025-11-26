'use client';
import { useUser, useCollection, useFirestore } from '@/firebase';
import type { Booking, Event } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function BookingsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const { data: bookings, loading: bookingsLoading } = useCollection<Booking>(
    user ? `users/${user.uid}/bookings` : null
  );

  const [populatedBookings, setPopulatedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const populateBookings = async () => {
      if (bookings && firestore) {
        setLoading(true);
        const bookingsWithEvents = await Promise.all(
          bookings.map(async (booking) => {
            const eventDocRef = doc(firestore, 'events', booking.eventId);
            const eventSnap = await getDoc(eventDocRef);
            return {
              ...booking,
              event: eventSnap.exists()
                ? (eventSnap.data() as Event)
                : undefined,
            };
          })
        );
        setPopulatedBookings(bookingsWithEvents);
        setLoading(false);
      } else if (!bookingsLoading) {
        setLoading(false);
      }
    };

    populateBookings();
  }, [bookings, firestore, bookingsLoading]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!firestore || !user) return;
    const bookingDocRef = doc(
      firestore,
      'users',
      user.uid,
      'bookings',
      bookingId
    );

    const updatePayload = { status: 'cancelled' };

    updateDoc(bookingDocRef, updatePayload)
    .then(() => {
        toast({
            title: 'Booking Cancelled',
            description: 'Your booking has been successfully cancelled.',
        });
    })
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: bookingDocRef.path,
            operation: 'update',
            requestResourceData: updatePayload
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline text-primary">
        My Bookings
      </h1>
      <p className="text-lg text-muted-foreground">
        Here are all the events you have booked.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Your Upcoming and Past Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : populatedBookings.length > 0 ? (
                populatedBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.event?.name || 'Unknown Event'}
                    </TableCell>
                    <TableCell>
                      {booking.event
                        ? new Date(
                            (booking.event.date as any).seconds * 1000
                          ).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          booking.status === 'confirmed'
                            ? 'default'
                            : 'destructive'
                        }
                        className={booking.status === 'confirmed' ? 'bg-green-500' : ''}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {booking.status === 'confirmed' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    You have no bookings yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
