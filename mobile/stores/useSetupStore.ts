import { create } from 'zustand';
import { Field, Level, LearningSetup } from '../types';

interface SetupStore {
  field: Field | null;
  technology: string | null;
  level: Level | null;
  setField: (v: Field) => void;
  setTechnology: (v: string) => void;
  setLevel: (v: Level) => void;
  getSetup: () => LearningSetup | null;
  reset: () => void;
}

export const useSetupStore = create<SetupStore>((set, get) => ({
  field: null,
  technology: null,
  level: null,

  setField: (v) => set({ field: v, technology: null }),
  setTechnology: (v) => set({ technology: v }),
  setLevel: (v) => set({ level: v }),

  getSetup: () => {
    const { field, technology, level } = get();
    if (!field || !technology || !level) return null;
    return { field, technology, level, mode: 'Guided Lessons' };
  },

  reset: () => set({ field: null, technology: null, level: null }),
}));
