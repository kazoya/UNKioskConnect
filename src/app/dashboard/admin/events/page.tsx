'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useCollection,
  useFirestore,
  useUser,
} from '@/firebase';
import type { Event } from '@/lib/types';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EventForm, EventFormValues } from './event-form';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import placeholderImages from '@/lib/placeholder-images.json';
import { useFirebaseApp, useStorage } from '@/firebase';
import { uploadImage, getEventImagePath } from '@/lib/storage';

const placeholderImageSrcs = placeholderImages.events.map(img => img.src);

export default function AdminEventsPage() {
  const { user, claims, loading: userLoading } = useUser();
  const router = useRouter();
  const { data: events, loading: eventsLoading } = useCollection<Event>(['events']);
  const firestore = useFirestore();
  const storage = useStorage();
  const app = useFirebaseApp();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isAdmin = claims?.role === 'admin';

  useEffect(() => {
    // Redirect if loading is finished and user is not an admin
    if (!userLoading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [user, claims, userLoading, isAdmin, router]);

  const handleFormSubmit = async (values: EventFormValues, imageFile?: File | null) => {
    if (!firestore) return;
    
    setIsUploading(true);
    let imageUrl = values.imageUrl;

    // Upload image file if provided
    if (imageFile && storage && app) {
      try {
        const eventId = editingEvent?.id || 'new';
        const imagePath = getEventImagePath(eventId, imageFile.name);
        imageUrl = await uploadImage(storage, imageFile, imagePath);
        toast({ 
          title: 'Image Uploaded', 
          description: 'Image uploaded successfully.' 
        });
      } catch (error: any) {
        toast({
          title: 'Upload Error',
          description: error.message || 'Failed to upload image.',
          variant: 'destructive',
        });
        setIsUploading(false);
        return;
      }
    }
    
    const eventPayload = {
        ...values,
        imageUrl,
        date: new Date(values.date),
    };

    if (editingEvent) {
      // Update existing event
      const eventDocRef = doc(firestore, 'events', editingEvent.id);
      updateDoc(eventDocRef, eventPayload)
      .then(() => {
        toast({ title: 'Success', description: 'Event updated successfully.' });
        setIsFormOpen(false);
        setEditingEvent(null);
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: eventDocRef.path,
            operation: 'update',
            requestResourceData: eventPayload
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => setIsUploading(false));
    } else {
      // Add new event
      const eventsColRef = collection(firestore, 'events');
      addDoc(eventsColRef, eventPayload)
      .then(() => {
        toast({ title: 'Success', description: 'Event created successfully.' });
        setIsFormOpen(false);
        setEditingEvent(null);
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: eventsColRef.path,
            operation: 'create',
            requestResourceData: eventPayload
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => setIsUploading(false));
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!firestore) return;
    if (confirm('Are you sure you want to delete this event?')) {
        const eventDocRef = doc(firestore, 'events', eventId);
      deleteDoc(eventDocRef)
      .then(() => {
        toast({
          title: 'Event Deleted',
          description: 'The event has been removed.',
          variant: 'destructive',
        });
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: eventDocRef.path,
            operation: 'delete'
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    }
  };

  const openEditForm = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };
  
  const openNewForm = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  }

  // Render skeleton while user data or admin status is loading
  if (userLoading || !isAdmin) {
     return (
       <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-6 w-80" />
            </div>
            <Skeleton className="h-10 w-32" />
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent className="p-6">
                <Skeleton className="h-48 w-full" />
            </CardContent>
        </Card>
      </div>
     )
  }

  const getValidImageUrl = (url: string) => {
    return placeholderImageSrcs.includes(url) ? url : placeholderImageSrcs[0];
  }

  const findImageHint = (imageUrl: string) => {
    const image = placeholderImages.events.find(img => img.src === imageUrl);
    return image ? image.hint : 'event image';
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline text-primary">
              Manage Events
            </h1>
            <p className="text-lg text-muted-foreground">
              Create, update, or delete event packages.
            </p>
          </div>
          <Button onClick={openNewForm}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Existing Events</CardTitle>
            <CardDescription>
              This is the list of all events currently available for booking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(eventsLoading) && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
                ))}
              </div>
            )}
            {!eventsLoading && events?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No events have been created yet.</p>
                <p>Click "Create Event" to get started.</p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events?.map((event) => {
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
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      ${event.price.toFixed(2)}
                    </p>
                  </CardContent>
                  <CardContent className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => openEditForm(event)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )})}
            </div>
          </CardContent>
        </Card>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>
        <EventForm
          onSubmit={handleFormSubmit}
          defaultValues={editingEvent}
          isSubmitting={isUploading}
        />
      </DialogContent>
    </Dialog>
  );
}
