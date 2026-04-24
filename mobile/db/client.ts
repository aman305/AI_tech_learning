import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('ai_mentor.db');
