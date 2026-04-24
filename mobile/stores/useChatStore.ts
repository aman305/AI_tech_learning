import { create } from 'zustand';
import { Message, LearningSetup } from '../types';
import { insertMessage, getMessagesBySession } from '../db/queries';
import { sendChatMessage } from '../services/api';
import { useSessionStore } from './useSessionStore';

interface ChatStore {
  messagesBySession: Record<string, Message[]>;
  isLoading: boolean;
  loadMessages: (sessionId: string) => void;
  sendMessage: (sessionId: string, text: string, setup: LearningSetup) => Promise<void>;
  initGreeting: (sessionId: string, setup: LearningSetup) => Promise<void>;
  addMessage: (msg: Message) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messagesBySession: {},
  isLoading: false,

  loadMessages: (sessionId) => {
    const messages = getMessagesBySession(sessionId);
    set((state) => ({
      messagesBySession: { ...state.messagesBySession, [sessionId]: messages },
    }));
  },

  addMessage: (msg) => {
    insertMessage(msg);
    set((state) => {
      const existing = state.messagesBySession[msg.sessionId] ?? [];
      return {
        messagesBySession: {
          ...state.messagesBySession,
          [msg.sessionId]: [...existing, msg],
        },
      };
    });
  },

  initGreeting: async (sessionId, setup) => {
    const { addMessage } = get();
    set({ isLoading: true });
    try {
      const response = await sendChatMessage({ message: 'hi', sessionId, setup });
      const aiMsg: Message = {
        id: `msg_${Date.now()}_ai`,
        sessionId,
        role: 'ai',
        content: response.reply,
        timestamp: Date.now(),
      };
      addMessage(aiMsg);
      useSessionStore.getState().updateSessionProgress(sessionId, {
        curriculum: response.curriculum,
        currentLesson: response.currentLesson,
        awaitingAnswer: response.awaitingAnswer,
      });
    } catch (err) {
      const errMsg: Message = {
        id: `msg_${Date.now()}_err`,
        sessionId,
        role: 'ai',
        content: `⚠️ Could not reach server.\n\n${err instanceof Error ? err.message : 'Unknown error'}\n\nMake sure the backend is running at \`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'}\`.`,
        timestamp: Date.now(),
      };
      addMessage(errMsg);
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (sessionId, text, setup) => {
    const { addMessage } = get();
    const now = Date.now();

    const userMsg: Message = {
      id: `msg_${now}_user`,
      sessionId,
      role: 'user',
      content: text,
      timestamp: now,
    };
    addMessage(userMsg);

    set({ isLoading: true });
    try {
      const response = await sendChatMessage({ message: text, sessionId, setup });

      const aiMsg: Message = {
        id: `msg_${Date.now()}_ai`,
        sessionId,
        role: 'ai',
        content: response.reply,
        timestamp: Date.now(),
      };
      addMessage(aiMsg);

      useSessionStore.getState().updateSessionProgress(sessionId, {
        curriculum: response.curriculum,
        currentLesson: response.currentLesson,
        awaitingAnswer: response.awaitingAnswer,
      });
    } catch (err) {
      const errMsg: Message = {
        id: `msg_${Date.now()}_err`,
        sessionId,
        role: 'ai',
        content: `⚠️ Could not reach server.\n\n${err instanceof Error ? err.message : 'Unknown error'}\n\nMake sure the backend is running at \`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'}\`.`,
        timestamp: Date.now(),
      };
      addMessage(errMsg);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));
