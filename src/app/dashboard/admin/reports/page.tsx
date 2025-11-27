'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore } from '@/firebase';
import type { Event, Booking } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, query, collectionGroup } from 'firebase/firestore';
import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

interface BookingStats {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  bookingsByEvent: Array<{ eventName: string; count: number }>;
  bookingsByStatus: Array<{ status: string; count: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ReportsPage() {
  const firestore = useFirestore();
  const { data: events, loading: eventsLoading } = useCollection<Event>(['events']);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllBookings = async () => {
      if (!firestore) return;
      
      try {
        setLoading(true);
        // Get all bookings from all users
        const bookingsQuery = query(collection(firestore, 'bookings'));
        const snapshot = await getDocs(bookingsQuery);
        
        // Also check subcollections (users/{userId}/bookings)
        const allBookingsData: Booking[] = [];
        
        // For now, we'll use a simpler approach - get bookings from known structure
        // In production, you'd use collectionGroup query
        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        
        for (const userDoc of usersSnapshot.docs) {
          const userBookingsSnapshot = await getDocs(
            collection(firestore, 'users', userDoc.id, 'bookings')
          );
          userBookingsSnapshot.forEach((bookingDoc) => {
            allBookingsData.push({
              id: bookingDoc.id,
              ...bookingDoc.data(),
            } as Booking);
          });
        }
        
        setAllBookings(allBookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, [firestore]);

  const stats = useMemo<BookingStats>(() => {
    if (!events || allBookings.length === 0) {
      return {
        totalBookings: 0,
        confirmedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        bookingsByEvent: [],
        bookingsByStatus: [],
      };
    }

    const confirmed = allBookings.filter(b => b.status === 'confirmed');
    const cancelled = allBookings.filter(b => b.status === 'cancelled');
    
    // Calculate revenue (only confirmed bookings)
    const revenue = confirmed.reduce((sum, booking) => {
      const event = events.find(e => e.id === booking.eventId);
      return sum + (event?.price || 0);
    }, 0);

    // Bookings by event
    const eventCounts: Record<string, number> = {};
    confirmed.forEach(booking => {
      const eventName = events.find(e => e.id === booking.eventId)?.name || 'Unknown';
      eventCounts[eventName] = (eventCounts[eventName] || 0) + 1;
    });
    const bookingsByEvent = Object.entries(eventCounts).map(([eventName, count]) => ({
      eventName,
      count,
    }));

    // Bookings by status
    const statusCounts: Record<string, number> = {};
    allBookings.forEach(booking => {
      statusCounts[booking.status] = (statusCounts[booking.status] || 0) + 1;
    });
    const bookingsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
    }));

    return {
      totalBookings: allBookings.length,
      confirmedBookings: confirmed.length,
      cancelledBookings: cancelled.length,
      totalRevenue: revenue,
      bookingsByEvent: bookingsByEvent.sort((a, b) => b.count - a.count).slice(0, 5),
      bookingsByStatus,
    };
  }, [events, allBookings]);

  if (loading || eventsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">
          Reports & Analytics
        </h1>
        <p className="text-lg text-muted-foreground">
          View insights and statistics about bookings and events.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.confirmedBookings} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From confirmed bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmedBookings}</div>
            <p className="text-xs text-muted-foreground">
              Active bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Available events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bookings by Event</CardTitle>
            <CardDescription>Top 5 most booked events</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.bookingsByEvent.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.bookingsByEvent}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="eventName" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                No booking data available
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings by Status</CardTitle>
            <CardDescription>Distribution of booking statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.bookingsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.bookingsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.bookingsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                No booking data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

