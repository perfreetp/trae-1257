export interface ActivityGuest {
  name: string;
  title: string;
  bio: string;
  avatar: string;
}

export interface Activity {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  capacity: number;
  signedUp: number;
  price: number;
  type: 'lecture' | 'workshop' | 'tour' | 'performance';
  status: 'upcoming' | 'ongoing' | 'ended';
  isReservation?: boolean;
  guest?: ActivityGuest;
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
  feedback?: ReservationFeedback;
}

export interface ReservationFeedback {
  rating: number;
  comment: string;
  submitTime: string;
}
