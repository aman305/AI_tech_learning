import { CommandType } from '../types';

export const COMMANDS: Record<CommandType, string> = {
  start: 'start',
  next: 'next',
  repeat: 'repeat',
  hint: 'hint',
  exercise: 'exercise',
  summary: 'summary',
};

export const COMMAND_LABELS: Record<CommandType, string> = {
  start: 'Start',
  next: 'Next',
  repeat: 'Repeat',
  hint: 'Hint',
  exercise: 'Exercise',
  summary: 'Summary',
};
