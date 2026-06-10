import { create } from 'zustand';
import type { Reservation, ReservationFeedback } from '@/types/activity';
import type { VisitNote, TimelineRecord } from '@/types/user';
import type { RouteVisitRecord, RouteStop, Route } from '@/types/route';
import { reservations as initialReservations } from '@/data/activities';
import { visitNotes as initialNotes } from '@/data/user';

const STORAGE_KEY = 'culture_museum_app_state';

const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    if (typeof window !== 'undefined' && localStorage) {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    }
  } catch (e) {
    console.warn('Failed to load from localStorage', e);
  }
  return fallback;
};

const saveToStorage = (key: string, value: any) => {
  try {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.warn('Failed to save to localStorage', e);
  }
};

interface PersistState {
  reservations: Reservation[];
  notes: VisitNote[];
  visitRecords: RouteVisitRecord[];
  timeline: TimelineRecord[];
}

interface AppState extends PersistState {
  addReservation: (reservation: Reservation) => void;
  cancelReservation: (id: string) => void;
  rescheduleReservation: (id: string, newDate: string, newTime: string) => void;
  submitFeedback: (id: string, feedback: ReservationFeedback) => void;

  addNote: (note: VisitNote) => void;

  startRouteVisit: (route: Route) => RouteVisitRecord;
  advanceToNextStop: (recordId: string) => void;
  completeRouteVisit: (recordId: string) => void;
  getActiveVisitRecord: (routeId: string) => RouteVisitRecord | undefined;

  addTimelineRecord: (record: TimelineRecord) => void;
}

const getInitialState = (): PersistState => {
  const saved = loadFromStorage<PersistState | null>(STORAGE_KEY, null);
  if (saved) {
    return {
      reservations: saved.reservations || [...initialReservations],
      notes: saved.notes || [...initialNotes],
      visitRecords: saved.visitRecords || [],
      timeline: saved.timeline || []
    };
  }
  return {
    reservations: [...initialReservations],
    notes: [...initialNotes],
    visitRecords: [],
    timeline: []
  };
};

const getNowTimeStr = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

export const useAppStore = create<AppState>((set, get) => {
  const persist = (state: Partial<AppState>) => {
    const fullState = get();
    const toSave: PersistState = {
      reservations: state.reservations ?? fullState.reservations,
      notes: state.notes ?? fullState.notes,
      visitRecords: state.visitRecords ?? fullState.visitRecords,
      timeline: state.timeline ?? fullState.timeline
    };
    saveToStorage(STORAGE_KEY, toSave);
  };

  return {
    ...getInitialState(),

    addReservation: (reservation) => {
      set((state) => {
        const newReservations = [...state.reservations, reservation];
        const newTimeline = [{
          id: `tl_${Date.now()}`,
          type: 'activity_signup',
          title: `活动报名成功`,
          description: `成功预约「${reservation.activityTitle}」`,
          itemId: reservation.activityId,
          itemType: 'activity',
          timestamp: getNowTimeStr(),
          icon: '✅'
        }, ...state.timeline];
        persist({ reservations: newReservations, timeline: newTimeline });
        return { reservations: newReservations, timeline: newTimeline };
      });
    },

    cancelReservation: (id) => {
      set((state) => {
        const reservation = state.reservations.find(r => r.id === id);
        const newReservations = state.reservations.map((r) =>
          r.id === id ? { ...r, status: 'cancelled' as const } : r
        );
        const newTimeline = reservation ? [{
          id: `tl_${Date.now()}`,
          type: 'activity_cancel',
          title: `活动已取消`,
          description: `已取消「${reservation.activityTitle}」的预约`,
          itemId: reservation.activityId,
          itemType: 'activity',
          timestamp: getNowTimeStr(),
          icon: '❌'
        }, ...state.timeline] : state.timeline;
        persist({ reservations: newReservations, timeline: newTimeline });
        return { reservations: newReservations, timeline: newTimeline };
      });
    },

    rescheduleReservation: (id, newDate, newTime) => {
      set((state) => {
        const reservation = state.reservations.find(r => r.id === id);
        if (!reservation) return state;
        const oldDate = reservation.date;
        const oldTime = reservation.time;
        const historyRecord = {
          oldDate,
          oldTime,
          newDate,
          newTime,
          time: getNowTimeStr()
        };
        const newReservations = state.reservations.map((r) =>
          r.id === id ? {
            ...r,
            date: newDate,
            time: newTime,
            rescheduleHistory: [...(r.rescheduleHistory || []), historyRecord]
          } : r
        );
        const newTimeline = [{
          id: `tl_${Date.now()}`,
          type: 'activity_reschedule',
          title: `预约改签成功`,
          description: `「${reservation.activityTitle}」从 ${oldDate} ${oldTime} 改至 ${newDate} ${newTime}`,
          itemId: reservation.activityId,
          itemType: 'activity',
          timestamp: getNowTimeStr(),
          icon: '📅'
        }, ...state.timeline];
        persist({ reservations: newReservations, timeline: newTimeline });
        return { reservations: newReservations, timeline: newTimeline };
      });
    },

    submitFeedback: (id, feedback) => {
      set((state) => {
        const reservation = state.reservations.find(r => r.id === id);
        const newReservations = state.reservations.map((r) =>
          r.id === id ? { ...r, feedback } : r
        );
        const newTimeline = reservation ? [{
          id: `tl_${Date.now()}`,
          type: 'activity_feedback',
          title: `已提交满意度反馈`,
          description: `「${reservation.activityTitle}」⭐${feedback.rating}分`,
          itemId: reservation.activityId,
          itemType: 'activity',
          timestamp: getNowTimeStr(),
          icon: '⭐'
        }, ...state.timeline] : state.timeline;
        persist({ reservations: newReservations, timeline: newTimeline });
        return { reservations: newReservations, timeline: newTimeline };
      });
    },

    addNote: (note) => {
      set((state) => {
        const newNotes = [note, ...state.notes];
        const newTimeline = [{
          id: `tl_${Date.now()}`,
          type: 'note_create',
          title: `笔记已保存`,
          description: `「${note.title}」${note.exhibitName ? ` - ${note.exhibitName}` : ''}`,
          itemId: note.exhibitId || note.id,
          itemType: note.exhibitId ? 'exhibit' : 'activity',
          timestamp: getNowTimeStr(),
          icon: '📝'
        }, ...state.timeline];
        persist({ notes: newNotes, timeline: newTimeline });
        return { notes: newNotes, timeline: newTimeline };
      });
    },

    startRouteVisit: (route: Route) => {
      const newRecord: RouteVisitRecord = {
        id: `rv_${Date.now()}`,
        routeId: route.id,
        routeName: route.name,
        startStops: [...route.stops],
        completedStops: [],
        currentStopIndex: 0,
        startTime: getNowTimeStr(),
        status: 'in_progress'
      };
      set((state) => {
        const newVisitRecords = [newRecord, ...state.visitRecords];
        persist({ visitRecords: newVisitRecords });
        return { visitRecords: newVisitRecords };
      });
      return newRecord;
    },

    advanceToNextStop: (recordId) => {
      set((state) => {
        const record = state.visitRecords.find(r => r.id === recordId);
        if (!record) return state;
        const newIndex = record.currentStopIndex + 1;
        const completed = [...record.completedStops, record.startStops[record.currentStopIndex].id];
        const isCompleted = newIndex >= record.startStops.length;
        const newVisitRecords = state.visitRecords.map(r =>
          r.id === recordId ? {
            ...r,
            currentStopIndex: newIndex,
            completedStops: completed,
            status: isCompleted ? 'completed' as const : 'in_progress' as const,
            endTime: isCompleted ? getNowTimeStr() : undefined,
            duration: isCompleted ? `已完成全部${record.startStops.length}站` : undefined
          } : r
        );
        let newTimeline = state.timeline;
        if (isCompleted && record) {
          newTimeline = [{
            id: `tl_${Date.now()}`,
            type: 'route_complete',
            title: `路线参观完成`,
            description: `恭喜完成「${record.routeName}」全部${record.startStops.length}个站点`,
            itemId: record.routeId,
            itemType: 'route',
            timestamp: getNowTimeStr(),
            icon: '🏆'
          }, ...state.timeline];
        }
        persist({ visitRecords: newVisitRecords, timeline: newTimeline });
        return { visitRecords: newVisitRecords, timeline: newTimeline };
      });
    },

    completeRouteVisit: (recordId) => {
      set((state) => {
        const record = state.visitRecords.find(r => r.id === recordId);
        if (!record) return state;
        const completed = record.startStops.map(s => s.id);
        const newVisitRecords = state.visitRecords.map(r =>
          r.id === recordId ? {
            ...r,
            currentStopIndex: record.startStops.length,
            completedStops: completed,
            status: 'completed' as const,
            endTime: getNowTimeStr(),
            duration: `已完成全部${record.startStops.length}站`
          } : r
        );
        const newTimeline = [{
          id: `tl_${Date.now()}`,
          type: 'route_complete',
          title: `路线参观完成`,
          description: `恭喜完成「${record.routeName}」全部${record.startStops.length}个站点`,
          itemId: record.routeId,
          itemType: 'route',
          timestamp: getNowTimeStr(),
          icon: '🏆'
        }, ...state.timeline];
        persist({ visitRecords: newVisitRecords, timeline: newTimeline });
        return { visitRecords: newVisitRecords, timeline: newTimeline };
      });
    },

    getActiveVisitRecord: (routeId) => {
      const state = get();
      return state.visitRecords.find(
        r => r.routeId === routeId && r.status === 'in_progress'
      );
    },

    addTimelineRecord: (record) => {
      set((state) => {
        const newTimeline = [record, ...state.timeline];
        persist({ timeline: newTimeline });
        return { timeline: newTimeline };
      });
    }
  };
});
