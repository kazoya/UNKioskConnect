'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useUser } from '@/firebase';
import type { Event, Booking } from '@/lib/types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useMemo } from 'react';
import placeholderImages from '@/lib/placeholder-images.json';

const placeholderImageSrcs = placeholderImages.events.map(img => img.src);

export default function EventsPage() {
  const { user } = useUser();
  const { data: events, loading: eventsLoading } = useCollection<Event>(['events']);
  const { data: bookings, loading: bookingsLoading } = useCollection<Booking>(
    user ? `users/${user.uid}/bookings` : null
  );
  const firestore = useFirestore();
  const { toast } = useToast();

  const bookedEventIds = useMemo(() => {
    if (!bookings) return new Set();
    return new Set(bookings.map((b) => b.eventId));
  }, [bookings]);

  const loading = eventsLoading || bookingsLoading;

  const handleBookEvent = (event: Event) => {
    if (!firestore || !user) return;

    const bookingPayload = {
      userId: user.uid,
      eventId: event.id,
      bookingDate: serverTimestamp(),
      status: 'confirmed',
    };

    const bookingsColRef = collection(firestore, 'users', user.uid, 'bookings');
    
    addDoc(bookingsColRef, bookingPayload)
      .then(() => {
        toast({
          title: 'Booking Confirmed!',
          description: `You have successfully booked "${event.name}".`,
        });
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: bookingsColRef.path,
          operation: 'create',
          requestResourceData: bookingPayload
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const getValidImageUrl = (url: string) => {
    // If URL is empty or invalid, use placeholder
    if (!url || url.trim() === '') {
      return placeholderImageSrcs[0];
    }
    // If it's a placeholder URL, return it as is
    if (placeholderImageSrcs.includes(url)) {
      return url;
    }
    // Otherwise, it's a real uploaded image URL (Supabase or external), return it
    return url;
  }
  
  const findImageHint = (imageUrl: string) => {
    const image = placeholderImages.events.find(img => img.src === imageUrl);
    return image ? image.hint : 'event image';
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline text-primary">
        Book an Event
      </h1>
      <p className="text-lg text-muted-foreground">
        Browse our available event packages and book your next experience.
      </p>

      {loading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
             <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-24" />
                </CardFooter>
             </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events?.map((event) => {
          const isBooked = bookedEventIds.has(event.id);
          const imageUrl = getValidImageUrl(event.imageUrl);
          return (
            <Card key={event.id} className="flex flex-col overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={imageUrl}
                  alt={event.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  data-ai-hint={findImageHint(imageUrl)}
                  unoptimized={!imageUrl.includes('supabase.co') && !imageUrl.includes('firebasestorage.googleapis.com')}
                />
              </div>
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>
                  {new Date((event.date as any).seconds * 1000).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <p className="text-lg font-bold text-primary">
                  ${event.price.toFixed(2)}
                </p>
                <Button onClick={() => handleBookEvent(event)} disabled={isBooked}>
                  {isBooked ? 'Booked' : 'Book Now'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
