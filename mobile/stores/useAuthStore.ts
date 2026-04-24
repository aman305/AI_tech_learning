import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { loginUser, registerUser } from '../services/api';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isHydrated: false,

  hydrate: async () => {
    const token = await SecureStore.getItemAsync('jwt');
    const userJson = await SecureStore.getItemAsync('user');
    if (token && userJson) {
      set({ token, user: JSON.parse(userJson), isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
  },

  login: async (email, password) => {
    const { token, user } = await loginUser(email, password);
    await SecureStore.setItemAsync('jwt', token);
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    set({ token, user: { ...user, createdAt: '' } });
  },

  register: async (email, password, name) => {
    const { token, user } = await registerUser(email, password, name);
    await SecureStore.setItemAsync('jwt', token);
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    set({ token, user: { ...user, createdAt: '' } });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('jwt');
    await SecureStore.deleteItemAsync('user');
    set({ token: null, user: null });
  },
}));
