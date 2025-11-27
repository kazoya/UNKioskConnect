'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore } from '@/firebase';
import type { Event, Booking } from '@/lib/types';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, collectionGroup, where } from 'firebase/firestore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarPage() {
  const firestore = useFirestore();
  const { data: events, loading: eventsLoading } = useCollection<Event>(['events']);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings for the current month
  useEffect(() => {
    const fetchBookings = async () => {
      if (!firestore) return;
      
      try {
        setLoading(true);
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        
        // Get all bookings
        const bookingsQuery = query(collectionGroup(firestore, 'bookings'));
        const snapshot = await getDocs(bookingsQuery);
        
        const allBookings: Booking[] = [];
        snapshot.forEach((doc) => {
          allBookings.push({
            id: doc.id,
            ...doc.data(),
          } as Booking);
        });
        
        setBookings(allBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [firestore, currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    if (!events) return [];
    return events.filter(event => {
      const eventDate = new Date((event.date as any).seconds * 1000);
      return isSameDay(eventDate, day);
    });
  };

  // Get bookings count for a specific day
  const getBookingsForDay = (day: Date) => {
    return bookings.filter(booking => {
      if (!booking.event) return false;
      const event = events?.find(e => e.id === booking.eventId);
      if (!event) return false;
      const eventDate = new Date((event.date as any).seconds * 1000);
      return isSameDay(eventDate, day) && booking.status === 'confirmed';
    }).length;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDaysAr = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  // Get first day of month to pad calendar
  const firstDayOfMonth = monthStart.getDay();
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  if (loading || eventsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">
          Events Calendar
        </h1>
        <p className="text-lg text-muted-foreground">
          View events and bookings on a calendar.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(currentDate, 'MMMM yyyy')}
              </CardTitle>
              <CardDescription>
                Interactive calendar showing events and bookings
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {/* Week day headers */}
            {weekDays.map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
                {day}
              </div>
            ))}

            {/* Padding days */}
            {paddingDays.map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square" />
            ))}

            {/* Calendar days */}
            {daysInMonth.map((day) => {
              const dayEvents = getEventsForDay(day);
              const bookingsCount = getBookingsForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={`aspect-square border rounded-lg p-2 ${
                    isToday ? 'bg-primary/10 border-primary' : 'border-border'
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                      {format(day, 'd')}
                    </div>
                    <div className="flex-1 overflow-y-auto mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <Badge
                          key={event.id}
                          variant="secondary"
                          className="text-xs w-full justify-start truncate"
                        >
                          {event.name}
                        </Badge>
                      ))}
                      {dayEvents.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{dayEvents.length - 2} more
                        </Badge>
                      )}
                      {bookingsCount > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {bookingsCount} booking{bookingsCount > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Events list for selected month */}
      <Card>
        <CardHeader>
          <CardTitle>Events in {format(currentDate, 'MMMM yyyy')}</CardTitle>
        </CardHeader>
        <CardContent>
          {events && events.length > 0 ? (
            <div className="space-y-2">
              {events
                .filter(event => {
                  const eventDate = new Date((event.date as any).seconds * 1000);
                  return isSameMonth(eventDate, currentDate);
                })
                .map((event) => {
                  const eventDate = new Date((event.date as any).seconds * 1000);
                  const eventBookings = bookings.filter(
                    b => b.eventId === event.id && b.status === 'confirmed'
                  ).length;
                  
                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{event.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(eventDate, 'MMMM d, yyyy')}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {eventBookings} booking{eventBookings !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No events scheduled for this month.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

