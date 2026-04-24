import { db } from './client';
import { Session, Message, LearningSetup } from '../types';

// Sessions
export function insertSession(s: Session) {
  db.runSync(
    `INSERT INTO sessions (id, user_id, setup_json, curriculum_json, current_lesson, awaiting_answer, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    s.id, s.userId, JSON.stringify(s.setup), JSON.stringify(s.curriculum),
    s.currentLesson, s.awaitingAnswer ? 1 : 0, s.createdAt, s.updatedAt
  );
}

export function updateSession(id: string, fields: Partial<Pick<Session, 'curriculum' | 'currentLesson' | 'awaitingAnswer' | 'updatedAt'>>) {
  const parts: string[] = [];
  const values: (string | number)[] = [];

  if (fields.curriculum !== undefined) { parts.push('curriculum_json = ?'); values.push(JSON.stringify(fields.curriculum)); }
  if (fields.currentLesson !== undefined) { parts.push('current_lesson = ?'); values.push(fields.currentLesson); }
  if (fields.awaitingAnswer !== undefined) { parts.push('awaiting_answer = ?'); values.push(fields.awaitingAnswer ? 1 : 0); }
  if (fields.updatedAt !== undefined) { parts.push('updated_at = ?'); values.push(fields.updatedAt); }

  if (parts.length === 0) return;
  values.push(id);
  db.runSync(`UPDATE sessions SET ${parts.join(', ')} WHERE id = ?`, ...values);
}

export function getSessionsByUser(userId: string): Session[] {
  const rows = db.getAllSync<any>(
    `SELECT * FROM sessions WHERE user_id = ? ORDER BY updated_at DESC`, userId
  );
  return rows.map(rowToSession);
}

export function deleteSessionById(id: string) {
  db.runSync(`DELETE FROM sessions WHERE id = ?`, id);
}

// Messages
export function insertMessage(m: Message) {
  db.runSync(
    `INSERT INTO messages (id, session_id, role, content, timestamp) VALUES (?, ?, ?, ?, ?)`,
    m.id, m.sessionId, m.role, m.content, m.timestamp
  );
}

export function getMessagesBySession(sessionId: string): Message[] {
  return db.getAllSync<Message>(
    `SELECT * FROM messages WHERE session_id = ? ORDER BY timestamp ASC`, sessionId
  );
}

export function deleteMessagesBySession(sessionId: string) {
  db.runSync(`DELETE FROM messages WHERE session_id = ?`, sessionId);
}

function rowToSession(row: any): Session {
  return {
    id: row.id,
    userId: row.user_id,
    setup: JSON.parse(row.setup_json) as LearningSetup,
    curriculum: JSON.parse(row.curriculum_json || '[]'),
    currentLesson: row.current_lesson,
    awaitingAnswer: row.awaiting_answer === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
