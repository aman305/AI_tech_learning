export type Field = 'Software Development' | 'QA' | 'Data & AI' | 'DevOps';
export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export type LearningMode = 'Guided Lessons' | 'Practice Mode' | 'Interview Prep';

export interface LearningSetup {
  field: Field;
  technology: string;
  level: Level;
  mode: LearningMode;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export interface Session {
  id: string;
  userId: string;
  setup: LearningSetup;
  curriculum: string[];
  currentLesson: number;
  awaitingAnswer: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ChatRequest {
  message: string;
  sessionId: string;
  setup: LearningSetup;
}

export interface ChatResponse {
  reply: string;
  curriculum: string[];
  currentLesson: number;
  awaitingAnswer: boolean;
}

export type CommandType = 'start' | 'next' | 'repeat' | 'hint' | 'exercise' | 'summary';
