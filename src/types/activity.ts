export interface Activity {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  signedUp: number;
  price: number;
  type: 'lecture' | 'workshop' | 'tour' | 'performance';
  status: 'upcoming' | 'ongoing' | 'ended';
  isReservation?: boolean;
}

export interface Reservation {
  id: string;
  activityId: string;
  activityTitle: string;
  date: string;
  time: string;
  status: 'reserved' | 'cancelled' | 'completed';
  ticketCount: number;
  reservationTime: string;
}
