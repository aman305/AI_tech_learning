# AI Mentor Hub — Expo Mobile App: Full Documentation Plan

> **Source:** Derived from deep analysis of the existing web platform at `/AI_tech_plateform`
> **Target:** React Native (Expo SDK 52+), iOS & Android
> **Date:** 2026-04-18

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack Decisions](#2-tech-stack-decisions)
3. [Architecture Overview](#3-architecture-overview)
4. [Screen Inventory & Navigation](#4-screen-inventory--navigation)
5. [Feature Parity Matrix](#5-feature-parity-matrix)
6. [Data Models](#6-data-models)
7. [API Layer](#7-api-layer)
8. [State Management](#8-state-management)
9. [UI / Design System](#9-ui--design-system)
10. [Screen-by-Screen Specs](#10-screen-by-screen-specs)
11. [New Mobile-Only Features](#11-new-mobile-only-features)
12. [Backend Changes Required](#12-backend-changes-required)
13. [Storage Strategy](#13-storage-strategy)
14. [Build & Folder Structure](#14-build--folder-structure)
15. [Implementation Phases](#15-implementation-phases)
16. [Open Questions / Decisions Needed](#16-open-questions--decisions-needed)

---

## 1. Project Overview

**AI Mentor Hub** is an AI-powered coding tutor platform that teaches programming topics through Socratic, question-driven conversation. A student picks their technology (Python, Docker, Flutter, etc.) and experience level, and the AI conducts structured lessons — explaining concepts, asking questions, evaluating answers, giving hints, and tracking progress through a curriculum.

### What the Mobile App Must Replicate
| Web Feature | Priority |
|---|---|
| 4-step onboarding wizard | P0 |
| AI chat tutor (Socratic method) | P0 |
| Curriculum progress tracking | P0 |
| Command system (start, repeat, hint, etc.) | P0 |
| Multi-session management | P1 |
| Markdown + code block rendering | P0 |
| Lesson lock enforcement | P0 |
| Answer evaluation (correct / partial / wrong) | P0 |

### What the Mobile App Adds
- Persistent user accounts (no existing auth in web)
- Local offline session storage (SQLite)
- Push notifications for study reminders
- Native keyboard behavior (Expo KeyboardAvoidingView)
- Haptic feedback on answer evaluation results
- Dark / light theme toggle

---

## 2. Tech Stack Decisions

### Core Framework
| Concern | Choice | Reason |
|---|---|---|
| Framework | **Expo SDK 52 (managed workflow)** | OTA updates, no Xcode/Android Studio setup required |
| Language | **TypeScript** | Type safety for complex session/state models |
| Navigation | **Expo Router (file-based)** | Same pattern as Next.js, well-maintained |
| Styling | **NativeWind v4** (Tailwind for RN) | Web codebase already uses Tailwind colors; easy token transfer |
| State | **Zustand** | Lightweight, no boilerplate, works well with AsyncStorage |
| Persistence | **expo-sqlite** (for sessions) + **AsyncStorage** (for settings) | SQLite for structured session + chat data; AsyncStorage for simple KV |
| HTTP | **axios** with interceptors | Centralized error handling, easy base URL config |
| Markdown | **react-native-markdown-display** | Renders bold, headers, code blocks natively |
| Code blocks | **react-native-syntax-highlighter** | Dark-theme code blocks matching web |
| Auth | **expo-secure-store** for token storage | Secure JWT storage, replaces localStorage |
| Icons | **@expo/vector-icons (MaterialCommunityIcons)** | Matches web icon set |
| Notifications | **expo-notifications** | Study reminders |
| Haptics | **expo-haptics** | Answer evaluation feedback |

### Backend (Changes Required — See Section 12)
- Add user auth (JWT-based, simple email+password)
- Add PostgreSQL (or MongoDB) for session persistence
- Add a `/sessions` CRUD endpoint

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Expo App (Client)                     │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐    │
│  │  Screens │  │  Stores  │  │   Services Layer   │    │
│  │(Expo     │→ │(Zustand) │→ │  api.ts / auth.ts  │    │
│  │ Router)  │  │          │  │  storage.ts        │    │
│  └──────────┘  └──────────┘  └────────────────────┘    │
│                                      ↕                  │
│                              ┌───────────────┐          │
│                              │ expo-sqlite   │          │
│                              │ AsyncStorage  │          │
│                              │ SecureStore   │          │
│                              └───────────────┘          │
└─────────────────────────────────────────────────────────┘
                               ↕ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│               Express Backend (server/)                 │
│   POST /chat   GET /sessions   POST /auth/login  etc.  │
│                                                         │
│   aiLearningEngine.js → llmRouter.js → Azure OpenAI    │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Screen Inventory & Navigation

### File-Based Route Structure (Expo Router)

```
app/
├── (auth)/
│   ├── _layout.tsx          # Auth stack layout (no tabs)
│   ├── welcome.tsx          # Splash / landing screen
│   ├── login.tsx            # Email + password login
│   └── register.tsx         # Sign up screen
│
├── (app)/
│   ├── _layout.tsx          # Tab navigator (after auth)
│   ├── (tabs)/
│   │   ├── home.tsx         # Dashboard: active session + quick start
│   │   ├── sessions.tsx     # All past sessions list
│   │   └── profile.tsx      # User settings, theme, notifications
│   │
│   ├── setup/
│   │   ├── index.tsx        # Step 1: Field selection
│   │   ├── technology.tsx   # Step 2: Technology picker
│   │   ├── level.tsx        # Step 3: Level picker
│   │   └── mode.tsx         # Step 4: Learning mode picker
│   │
│   └── chat/
│       ├── [sessionId].tsx  # Main chat screen
│       └── curriculum.tsx   # Full-screen curriculum progress modal
│
└── _layout.tsx              # Root layout, auth gate
```

### Navigation Flow

```
App Launch
    ↓
Root _layout (checks SecureStore for JWT)
    ├── No token → (auth)/welcome → login/register
    └── Has token → (app)/(tabs)/home
                        ↓
                 "Start New Learning"
                        ↓
                 setup/index → technology → level → mode
                        ↓
                 chat/[new-sessionId]
                        ↓ (swipe up or button)
                 chat/curriculum (modal)
```

---

## 5. Feature Parity Matrix

| Web Feature | Web Location | Mobile Screen | Status |
|---|---|---|---|
| Landing / marketing page | index.html | (auth)/welcome.tsx | Simplified |
| 4-step wizard | learn.html | setup/* | Full parity |
| AI chat interface | teacher.html | chat/[sessionId].tsx | Full parity |
| Curriculum sidebar | teacher.html (left panel) | chat/curriculum.tsx (modal) | Modal |
| Session list sidebar | teacher.html (left sidebar) | (tabs)/sessions.tsx | Full tab |
| Command buttons | teacher.html | Chat bottom bar | Full parity |
| Markdown rendering | Custom JS renderer | react-native-markdown-display | Full parity |
| Code blocks | Custom dark CSS | react-native-syntax-highlighter | Full parity |
| Lesson lock warning | Red warning card | Red banner + disabled input | Full parity |
| Topic jump | "jump-to:N" command | Tap in curriculum modal | Improved UX |
| New session | "+ New Chat" button | FAB on sessions tab | Improved UX |
| Multi-session | localStorage | SQLite | Improved |
| Answer eval feedback | Text only | Text + haptics + color | Enhanced |
| User accounts | None | login + register screens | **New** |
| Study reminders | None | expo-notifications | **New** |
| Dark mode | None | Theme toggle in profile | **New** |

---

## 6. Data Models

### TypeScript Types (client-side)

```typescript
// User (new — required for auth)
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

// Learning Setup (from wizard — mirrors web's localStorage "learningSetup")
interface LearningSetup {
  field: 'Software Development' | 'QA' | 'Data & AI' | 'DevOps';
  technology: string;          // e.g., "Python", "Docker", "Selenium"
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  mode: 'Guided Lessons' | 'Practice Mode' | 'Interview Prep';
}

// Chat Message (stored locally in SQLite)
interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'ai';
  content: string;             // raw markdown string
  timestamp: number;
}

// Session (one learning session)
interface Session {
  id: string;                  // "session_<timestamp>"
  userId: string;
  setup: LearningSetup;
  curriculum: string[];        // array of topic titles
  currentLesson: number;
  awaitingAnswer: boolean;
  createdAt: number;
  updatedAt: number;
}

// Chat API Response (mirrors existing server /chat response)
interface ChatResponse {
  reply: string;
  curriculum: string[];
  currentLesson: number;
  awaitingAnswer: boolean;
}

// Chat API Request (mirrors existing server /chat request body)
interface ChatRequest {
  message: string;
  sessionId: string;
  setup: LearningSetup;
}
```

### SQLite Schema (expo-sqlite)

```sql
-- Sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  setup_json TEXT NOT NULL,       -- JSON of LearningSetup
  curriculum_json TEXT,           -- JSON array of topic strings
  current_lesson INTEGER DEFAULT 0,
  awaiting_answer INTEGER DEFAULT 0,  -- boolean as 0/1
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Messages table
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,             -- 'user' | 'ai'
  content TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);
```

---

## 7. API Layer

### Existing Endpoint (no change needed for MVP)

```
POST /chat
Body: { message, sessionId, setup }
Response: { reply, curriculum, currentLesson, awaitingAnswer }
```

### New Endpoints Required (see Section 12 for backend work)

```
POST   /auth/register     { email, password, name } → { token, user }
POST   /auth/login        { email, password }        → { token, user }
GET    /sessions          Authorization header       → Session[]
POST   /sessions          { setup }                  → Session
DELETE /sessions/:id      Authorization header       → 204
```

### API Service (client — `services/api.ts`)

```typescript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,  // e.g., http://localhost:3000
  timeout: 30000,
});

// Attach JWT automatically
client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('jwt');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const sendMessage = (req: ChatRequest) =>
  client.post<ChatResponse>('/chat', req).then(r => r.data);

export const getSessions = () =>
  client.get<Session[]>('/sessions').then(r => r.data);

export const createSession = (setup: LearningSetup) =>
  client.post<Session>('/sessions', { setup }).then(r => r.data);

export const deleteSession = (id: string) =>
  client.delete(`/sessions/${id}`);
```

---

## 8. State Management

### Zustand Stores

#### `useAuthStore`
```typescript
interface AuthStore {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;  // restore token from SecureStore on app launch
}
```

#### `useSessionStore`
```typescript
interface SessionStore {
  sessions: Session[];
  activeSessionId: string | null;
  setActiveSession: (id: string) => void;
  createSession: (setup: LearningSetup) => Promise<Session>;
  deleteSession: (id: string) => Promise<void>;
  updateSessionProgress: (id: string, partial: Partial<Session>) => void;
  loadFromDB: () => Promise<void>;  // hydrate from SQLite on startup
}
```

#### `useChatStore`
```typescript
interface ChatStore {
  messagesBySession: Record<string, Message[]>;
  isLoading: boolean;
  sendMessage: (sessionId: string, text: string, setup: LearningSetup) => Promise<void>;
  loadMessages: (sessionId: string) => Promise<void>;
}
```

#### `useSetupStore` (transient — wizard state only)
```typescript
interface SetupStore {
  field: string;
  technology: string;
  level: string;
  mode: string;
  setField: (v: string) => void;
  setTechnology: (v: string) => void;
  setLevel: (v: string) => void;
  setMode: (v: string) => void;
  reset: () => void;
}
```

---

## 9. UI / Design System

### Color Tokens (from web CSS, translated to NativeWind)

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#2563eb` | CTAs, active states, user chat bubble |
| `primary-dark` | `#1d4ed8` | Pressed state |
| `success` | `#10b981` | Completed lessons, correct answers |
| `warning` | `#f59e0b` | Partial answers |
| `error` | `#ef4444` | Lesson lock banner, incorrect answers |
| `bg` | `#f4f6fb` | App background (light mode) |
| `surface` | `#ffffff` | Cards, AI chat bubbles |
| `sidebar` | `#202123` | Session list background (dark always) |
| `text` | `#1f2937` | Primary text |
| `text-muted` | `#6b7280` | Secondary text, timestamps |
| `code-bg` | `#0d1117` | Code block background |
| `code-text` | `#e6edf3` | Code block text |

### Typography Scale
| Style | Size | Weight | Usage |
|---|---|---|---|
| `h1` | 28sp | 700 | Screen titles |
| `h2` | 22sp | 600 | Section headers |
| `h3` | 18sp | 600 | Lesson titles in markdown |
| `body` | 15sp | 400 | Chat messages |
| `code` | 13sp | 400 | Inline code (monospace) |
| `label` | 12sp | 500 | Form labels, tags |
| `caption` | 11sp | 400 | Timestamps, subtitles |

### Component Library

| Component | Description |
|---|---|
| `<ChatBubble role="user|ai" content={md} />` | Renders markdown; user=blue-right, ai=white-left |
| `<CodeBlock language={lang} code={str} />` | Dark-themed syntax-highlighted block |
| `<LessonLockBanner />` | Red sticky banner when `awaitingAnswer=true` |
| `<CommandBar onCommand={fn} />` | Bottom row: Next / Repeat / Hint / Exercise / Summary |
| `<CurriculumItem index={i} title={t} status="active|done|locked" />` | Single lesson row in curriculum modal |
| `<SetupOptionTile label icon selected onPress />` | Wizard option button |
| `<SessionCard session onPress onDelete />` | Session list item with swipe-to-delete |
| `<ProgressBar current={n} total={m} />` | Horizontal progress bar |
| `<MessageInput value onSend loading />` | Multiline input + send button |

---

## 10. Screen-by-Screen Specs

### (auth)/welcome.tsx — Welcome / Landing
- Full-screen gradient (`#2563eb → #4f46e5`) matching web hero
- App logo + tagline "AI-Powered Coding Tutor"
- Two buttons: "Get Started" (→ register) and "Log In" (→ login)
- Feature bullets: "Adaptive Curriculum", "Socratic Method", "Track Progress"

### (auth)/login.tsx — Login
- Email + password inputs
- "Login" button → `useAuthStore.login()` → navigate to `(app)/(tabs)/home`
- "Don't have an account? Sign Up" link
- Error toast on bad credentials

### (auth)/register.tsx — Register
- Name, email, password, confirm password
- Validation: email format, password ≥ 8 chars, passwords match
- On success → auto-login → navigate home

### (app)/(tabs)/home.tsx — Dashboard
- Header: "Hello, {name}" + streak counter (future)
- If no sessions: empty state with "Start Learning" CTA → setup wizard
- If sessions exist: "Continue Learning" card for most recent active session
- "Start New Topic" button → setup wizard
- Quick stats: topics completed (sum across sessions)

### (app)/(tabs)/sessions.tsx — All Sessions
- List of `<SessionCard>` components sorted by `updatedAt` desc
- Each card: technology icon, topic name, progress "3/6 lessons", last-active date
- Swipe left to delete session (with confirmation alert)
- FAB (+) → navigate to setup wizard to create new session
- Pull-to-refresh syncs with backend (future)

### (app)/(tabs)/profile.tsx — Profile & Settings
- User name, email display
- **Dark Mode toggle** (AsyncStorage key `theme`)
- **Notifications toggle** → requests expo-notifications permission, stores preference
- Study reminder time picker (appears when notifications enabled)
- "Log Out" button → clears SecureStore token, navigates to welcome
- App version display

### setup/index.tsx — Wizard Step 1: Field
- Title: "What do you want to learn?"
- 4 option tiles: Software Development, QA, Data & AI, DevOps (each with icon)
- "Next" button disabled until selection made
- Progress indicator: Step 1 of 4

### setup/technology.tsx — Wizard Step 2: Technology
- Title: "Pick your technology"
- Scrollable list of option tiles based on selected field
  - Software Dev: Python, JavaScript, Java, C++, Go, Rust, Flutter, React, Node.js
  - QA: Selenium, Cypress, Playwright, Appium, JMeter
  - Data & AI: ML Fundamentals, TensorFlow, PyTorch, Pandas, SQL, Power BI
  - DevOps: Docker, Kubernetes, CI/CD, AWS, Terraform, Linux
- Back button in header

### setup/level.tsx — Wizard Step 3: Level
- Title: "What's your experience level?"
- 3 tiles: Beginner / Intermediate / Advanced
- Brief description under each

### setup/mode.tsx — Wizard Step 4: Learning Mode
- Title: "How do you want to learn?"
- 3 tiles:
  - Guided Lessons — step-by-step curriculum
  - Practice Mode — exercises and coding challenges
  - Interview Prep — Q&A format for interview readiness
- "Start Learning" button → `createSession(setup)` → navigate to `chat/[newSessionId]`

### chat/[sessionId].tsx — Main Chat Screen

**Layout (top to bottom):**
```
┌─────────────────────────────────┐
│  ← Back    Python - Beginner    │  ← Header (topic + back)
│            Lesson 2/6  [📚]     │  ← Progress pill + curriculum button
├─────────────────────────────────┤
│                                 │
│  [AI Bubble] Welcome! Let's..   │  ← Scrollable FlatList
│                                 │
│  [AI Bubble] ### Variables      │
│  Variables store values...      │
│  ```python                      │
│  x = 10                         │
│  ```                            │
│  **Question:** What does x = 5? │
│                                 │
│  [User Bubble] x equals 5       │
│                                 │
│  [AI Bubble] ✅ Correct!        │
│                                 │
├─────────────────────────────────┤
│  ⚠️ Answer the question above   │  ← Lesson lock banner (conditional)
├─────────────────────────────────┤
│ [Next][Repeat][Hint][Exercise]  │  ← CommandBar
├─────────────────────────────────┤
│  [Type your answer...      ] [→]│  ← MessageInput
└─────────────────────────────────┘
```

**Behavior details:**
- On mount: `loadMessages(sessionId)` from SQLite; if new session, send "hi" automatically
- `FlatList` with `inverted={false}` and auto-scroll to bottom on new message
- `KeyboardAvoidingView` with `behavior="padding"` on iOS, `behavior="height"` on Android
- Typing indicator (animated dots) while `isLoading=true`
- On receiving AI response:
  - If `awaitingAnswer=true` → show lock banner + haptic `ImpactFeedbackStyle.Medium`
  - If answer evaluated correct → `NotificationFeedbackType.Success` haptic + green flash
  - If incorrect → `NotificationFeedbackType.Error` haptic
- CommandBar buttons send the corresponding command string ("next", "repeat", etc.)
- "Next" button disabled and greyed when `awaitingAnswer=true`
- Auto-save every message to SQLite via `useChatStore`

### chat/curriculum.tsx — Curriculum Modal (Bottom Sheet)

- Opens from 📚 icon in chat header
- Full-height bottom sheet (`@gorhom/bottom-sheet`)
- Title: "Python — Beginner" + "3 of 6 topics done"
- `<ProgressBar>` at top
- Scrollable list of `<CurriculumItem>` for each lesson:
  - Completed: green checkmark + strikethrough
  - Active: blue left border + bold text
  - Locked: grey + lock icon (forward jumps blocked)
- Tap on completed/current topic → sends `jump-to:N` command and closes modal
- Tapping locked topics shows toast: "Complete current topic first"

---

## 11. New Mobile-Only Features

### 11.1 User Authentication
- Email + password registration and login
- JWT stored in `expo-secure-store` (encrypted, OS keychain)
- Auto-refresh token on 401 responses (with interceptor)
- Logout clears all stores and SQLite (optional: keep local data)

### 11.2 Offline Message Persistence (SQLite)
- Every message written to local SQLite DB immediately
- Sessions and progress state also stored locally
- App works fully offline for reviewing past conversations
- On reconnect, sync can push new messages to backend (Phase 2)

### 11.3 Push Notifications (Study Reminders)
- User sets a daily reminder time in Profile screen
- `expo-notifications` schedules a local repeating notification
- Message: "Time to learn {technology}! Continue your lesson."
- No backend required — local notifications only (Phase 1)

### 11.4 Haptic Feedback
- Correct answer: `Haptics.notificationAsync(NotificationFeedbackType.Success)`
- Incorrect answer: `Haptics.notificationAsync(NotificationFeedbackType.Error)`
- Partial answer: `Haptics.impactAsync(ImpactFeedbackStyle.Medium)`
- Button press: `Haptics.impactAsync(ImpactFeedbackStyle.Light)`

### 11.5 Dark Mode
- NativeWind `dark:` classes throughout
- Toggle stored in AsyncStorage
- Respects system theme by default, manual override available

---

## 12. Backend Changes Required

The existing Express backend needs the following additions before mobile app MVP:

### Priority 1 (MVP Blockers)
| Change | Why |
|---|---|
| Add `POST /auth/register` and `POST /auth/login` endpoints | Mobile needs user accounts to work across devices |
| Add JWT middleware to protect `/chat` | Currently open; mobile should send `Authorization: Bearer <token>` |
| Add `GET/POST/DELETE /sessions` endpoints | Mobile needs to list sessions from server (for future multi-device sync) |
| Add a real database (PostgreSQL or MongoDB) | In-memory sessions are lost on restart; completely breaks mobile UX |

### Priority 2 (Nice to Have for MVP)
| Change | Why |
|---|---|
| Add CORS origin restriction | Currently `app.use(cors())` allows any origin |
| Add rate limiting (`express-rate-limit`) | Mobile app makes it easier to spam the AI |
| Store chat history in DB per session | Enables full sync and history restore across devices |

### Priority 3 (Post-MVP)
| Change | Why |
|---|---|
| `mode` field differentiation in `aiLearningEngine.js` | Currently ignored; mobile surfaces it more prominently |
| Wire up `courseGenerator.js` | Has richer static curricula (15 Python topics vs current 6) |
| Wire up `learningMemory.js` | Better student model tracking for analytics |
| Interview Prep backend logic | Button exists in web but has zero backend; mobile should complete it |

### Recommended Backend Stack Addition
```
server/
├── middleware/
│   ├── auth.js          # JWT verify middleware
│   └── rateLimiter.js   # express-rate-limit config
├── routes/
│   ├── authRoutes.js    # /auth/register, /auth/login
│   └── sessionRoutes.js # /sessions CRUD
├── models/
│   ├── User.js          # User schema
│   └── Session.js       # Session schema (with chat history)
└── db.js                # PostgreSQL (pg) or MongoDB (mongoose) connection
```

---

## 13. Storage Strategy

| Data | Storage | When |
|---|---|---|
| JWT token | `expo-secure-store` | Login/logout |
| User profile | Zustand (memory) + AsyncStorage | After login |
| App theme preference | AsyncStorage | Toggle |
| Notification time | AsyncStorage | Profile save |
| Sessions list | SQLite `sessions` table | Create/update/delete |
| Chat messages | SQLite `messages` table | Every message |
| Active session ID | Zustand (memory) + AsyncStorage | Session switch |
| Wizard in-progress | Zustand `useSetupStore` (memory only) | Wizard flow |

---

## 14. Build & Folder Structure

```
mobile/                          # New Expo project root
├── app/                         # Expo Router screens (see Section 4)
├── components/
│   ├── chat/
│   │   ├── ChatBubble.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── CommandBar.tsx
│   │   ├── LessonLockBanner.tsx
│   │   ├── MessageInput.tsx
│   │   └── TypingIndicator.tsx
│   ├── curriculum/
│   │   ├── CurriculumItem.tsx
│   │   └── ProgressBar.tsx
│   ├── sessions/
│   │   └── SessionCard.tsx
│   ├── setup/
│   │   └── SetupOptionTile.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Toast.tsx
├── stores/
│   ├── useAuthStore.ts
│   ├── useChatStore.ts
│   ├── useSessionStore.ts
│   └── useSetupStore.ts
├── services/
│   ├── api.ts             # axios client + all API calls
│   ├── auth.ts            # login/register/logout helpers
│   └── storage.ts         # SQLite + AsyncStorage helpers
├── db/
│   ├── client.ts          # expo-sqlite connection
│   ├── migrations.ts      # CREATE TABLE statements
│   └── queries.ts         # typed SQL helpers
├── constants/
│   ├── colors.ts          # design tokens
│   ├── techOptions.ts     # field → technology map (from wizard.js)
│   └── commands.ts        # command strings
├── hooks/
│   ├── useKeyboardOffset.ts
│   └── useHaptics.ts
├── types/
│   └── index.ts           # all shared TypeScript interfaces
├── app.json               # Expo config
├── tailwind.config.js     # NativeWind config
└── tsconfig.json
```

---

## 15. Implementation Phases

### Phase 0 — Setup (Day 1)
- [ ] `npx create-expo-app mobile --template expo-template-blank-typescript`
- [ ] Install dependencies: expo-router, nativewind, zustand, axios, expo-sqlite, expo-secure-store, expo-haptics, expo-notifications, react-native-markdown-display, react-native-syntax-highlighter, @gorhom/bottom-sheet
- [ ] Configure NativeWind + tailwind.config.js with color tokens
- [ ] Set up Expo Router file structure
- [ ] Create `types/index.ts` with all interfaces
- [ ] Set up `EXPO_PUBLIC_API_URL` in `.env`

### Phase 1 — Auth Screens (Days 2–3)
- [ ] Build Welcome screen
- [ ] Build Login screen + `useAuthStore.login()`
- [ ] Build Register screen + `useAuthStore.register()`
- [ ] Implement JWT storage in SecureStore
- [ ] Root `_layout.tsx` auth gate (redirect based on token)
- [ ] **Backend:** Add `/auth/register` and `/auth/login` + JWT middleware

### Phase 2 — Onboarding Wizard (Days 4–5)
- [ ] Build all 4 setup screens
- [ ] Wire up `useSetupStore`
- [ ] Implement `techOptions` constant from `wizard.js`
- [ ] Navigation between wizard steps with progress indicator
- [ ] "Start Learning" → `createSession()` → navigate to chat

### Phase 3 — Core Chat (Days 6–9)
- [ ] SQLite schema + migration on first launch
- [ ] `useChatStore.sendMessage()` → POST /chat → save to SQLite
- [ ] `ChatBubble` with `react-native-markdown-display`
- [ ] `CodeBlock` with syntax highlighting
- [ ] `MessageInput` with `KeyboardAvoidingView`
- [ ] `CommandBar` (Next, Repeat, Hint, Exercise, Summary)
- [ ] `LessonLockBanner` (conditional display)
- [ ] Typing indicator animation
- [ ] Auto-scroll to bottom
- [ ] Haptic feedback on answer evaluation
- [ ] Session progress stored in SQLite on each response

### Phase 4 — Sessions & Navigation (Days 10–11)
- [ ] Sessions tab screen with `SessionCard` list
- [ ] Swipe-to-delete sessions
- [ ] FAB to start new session
- [ ] Home dashboard screen
- [ ] Multi-session switching

### Phase 5 — Curriculum Modal (Day 12)
- [ ] Bottom sheet setup with `@gorhom/bottom-sheet`
- [ ] `CurriculumItem` with status rendering
- [ ] `ProgressBar` component
- [ ] Tap to jump (`jump-to:N` command dispatch)
- [ ] Lock enforcement for forward jumps

### Phase 6 — Profile & Polish (Days 13–14)
- [ ] Profile screen
- [ ] Dark mode toggle + NativeWind dark: classes throughout
- [ ] Push notification setup + local scheduling
- [ ] Logout flow
- [ ] Loading states, error handling, empty states
- [ ] Final testing on iOS + Android

---

## 16. Open Questions / Decisions Needed

| # | Question | Options | Recommendation |
|---|---|---|---|
| 1 | **LLM Provider** — Web code uses Azure but docs say Google Gemini. Which for mobile? | Azure OpenAI / Google Gemini / OpenAI direct | Keep Azure (it's what's working); add env vars |
| 2 | **Database** — What DB to add to backend for persistence? | PostgreSQL / MongoDB / SQLite (server-side) | PostgreSQL; well-supported on most hosting |
| 3 | **Backend hosting** — Where does the server run for mobile? | Local dev only / Render / Railway / Fly.io | Railway or Render for free tier during dev |
| 4 | **Offline mode depth** — Full offline AI responses or just history viewing? | History only / Cached responses / Full offline | History viewing only (Phase 1); full offline is complex |
| 5 | **Interview Prep mode** — Implement in mobile or skip for MVP? | Skip / Implement | Skip for MVP; the backend has no logic for it yet |
| 6 | **Language / Hinglish** — The AI mixes Hindi+English. Surface language toggle? | Yes / No | Yes; add `language` field to setup (already in API schema) |
| 7 | **Expo managed vs bare workflow** — Stay managed or eject? | Managed / Bare | Stay managed; all needed modules are available in managed |

---

*This document should be treated as the source of truth for the Expo mobile app build. Update it as decisions are made.*
