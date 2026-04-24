import { create } from 'zustand';
import { Session, LearningSetup } from '../types';
import { insertSession, getSessionsByUser, deleteSessionById, updateSession } from '../db/queries';
import { useAuthStore } from './useAuthStore';

interface SessionStore {
  sessions: Session[];
  activeSessionId: string | null;
  setActiveSession: (id: string) => void;
  createSession: (setup: LearningSetup) => Session;
  deleteSession: (id: string) => void;
  updateSessionProgress: (id: string, partial: Partial<Pick<Session, 'curriculum' | 'currentLesson' | 'awaitingAnswer'>>) => void;
  loadFromDB: () => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  activeSessionId: null,

  loadFromDB: () => {
    const user = useAuthStore.getState().user;
    const userId = user?.id ?? 'guest';
    const sessions = getSessionsByUser(userId);
    set({ sessions });
  },

  setActiveSession: (id) => set({ activeSessionId: id }),

  createSession: (setup) => {
    const user = useAuthStore.getState().user;
    const now = Date.now();
    const session: Session = {
      id: `session_${now}`,
      userId: user?.id ?? 'guest',
      setup,
      curriculum: [],
      currentLesson: 0,
      awaitingAnswer: false,
      createdAt: now,
      updatedAt: now,
    };
    insertSession(session);
    set((state) => ({ sessions: [session, ...state.sessions], activeSessionId: session.id }));
    return session;
  },

  deleteSession: (id) => {
    deleteSessionById(id);
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
    }));
  },

  updateSessionProgress: (id, partial) => {
    const now = Date.now();
    updateSession(id, { ...partial, updatedAt: now });
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, ...partial, updatedAt: now } : s
      ),
    }));
  },
}));
