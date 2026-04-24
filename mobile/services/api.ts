import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ChatRequest, ChatResponse } from '../types';

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 60000,
});

client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('jwt');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const sendChatMessage = (req: ChatRequest): Promise<ChatResponse> =>
  client.post<ChatResponse>('/chat', req).then((r) => r.data);

export const loginUser = (email: string, password: string) =>
  client.post<{ token: string; user: { id: string; email: string; name: string } }>('/auth/login', { email, password }).then((r) => r.data);

export const registerUser = (email: string, password: string, name: string) =>
  client.post<{ token: string; user: { id: string; email: string; name: string } }>('/auth/register', { email, password, name }).then((r) => r.data);
