import { create } from 'zustand';
import type { Reservation, ReservationFeedback } from '@/types/activity';
import type { VisitNote } from '@/types/user';
import { reservations as initialReservations } from '@/data/activities';
import { visitNotes as initialNotes } from '@/data/user';

interface AppState {
  reservations: Reservation[];
  notes: VisitNote[];

  addReservation: (reservation: Reservation) => void;
  cancelReservation: (id: string) => void;
  rescheduleReservation: (id: string, newDate: string, newTime: string) => void;
  submitFeedback: (id: string, feedback: ReservationFeedback) => void;

  addNote: (note: VisitNote) => void;
}

export const useAppStore = create<AppState>((set) => ({
  reservations: [...initialReservations],
  notes: [...initialNotes],

  addReservation: (reservation) => {
    set((state) => ({
      reservations: [...state.reservations, reservation]
    }));
  },

  cancelReservation: (id) => {
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === id ? { ...r, status: 'cancelled' as const } : r
      )
    }));
  },

  rescheduleReservation: (id, newDate, newTime) => {
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === id ? { ...r, date: newDate, time: newTime } : r
      )
    }));
  },

  submitFeedback: (id, feedback) => {
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === id ? { ...r, feedback } : r
      )
    }));
  },

  addNote: (note) => {
    set((state) => ({
      notes: [note, ...state.notes]
    }));
  }
}));
