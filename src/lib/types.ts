import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin';
}

export interface Event {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  date: Timestamp;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  bookingDate: Timestamp;
  status: 'confirmed' | 'pending' | 'cancelled';
  event?: Event; // populated after fetching
}
