'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Event } from '@/lib/types';
import { useEffect } from 'react';
import placeholderImages from '@/lib/placeholder-images.json';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().min(0, { message: 'Price must be positive.' }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format.',
  }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }),
});

export type EventFormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  onSubmit: (values: EventFormValues) => void;
  defaultValues?: Event | null;
}

const getRandomPlaceholder = () => {
    const images = placeholderImages.events;
    return images[Math.floor(Math.random() * images.length)].src;
}

export function EventForm({ onSubmit, defaultValues }: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      date: '',
      imageUrl: '',
    },
  });
  
  useEffect(() => {
    if (defaultValues) {
        const date = defaultValues.date as any; // Firestore timestamp
        const formattedDate = date.seconds ? new Date(date.seconds * 1000).toISOString().split('T')[0] : '';
        form.reset({
            ...defaultValues,
            date: formattedDate,
        });
    } else {
        form.reset({
            name: '',
            description: '',
            price: 0,
            date: new Date().toISOString().split('T')[0],
            imageUrl: getRandomPlaceholder(),
        });
    }
  }, [defaultValues, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Corporate Conference" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A detailed description of the event."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/image.png"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {defaultValues ? 'Save Changes' : 'Create Event'}
        </Button>
      </form>
    </Form>
  );
}
