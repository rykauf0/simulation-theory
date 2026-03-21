import { create } from "zustand";
import type { ChildProfile, PracticeSession, PracticeAttempt } from "@/types";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

interface AppState {
  // Child profiles
  children: ChildProfile[];
  activeChildId: string | null;
  addChild: (child: ChildProfile) => void;
  setActiveChild: (id: string) => void;

  // Purchased packs
  purchasedPacks: string[];
  purchasePack: (packId: string) => void;

  // Practice sessions
  sessions: PracticeSession[];
  currentSession: PracticeSession | null;
  startSession: (session: PracticeSession) => void;
  addAttempt: (attempt: PracticeAttempt) => void;
  completeSession: () => void;

  // Hydration
  hydrated: boolean;
  hydrate: () => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  children: [],
  activeChildId: null,
  purchasedPacks: [],
  sessions: [],
  currentSession: null,
  hydrated: false,

  hydrate: () => {
    set({
      children: loadFromStorage("sb_children", []),
      activeChildId: loadFromStorage("sb_activeChild", null),
      purchasedPacks: loadFromStorage("sb_purchasedPacks", []),
      sessions: loadFromStorage("sb_sessions", []),
      hydrated: true,
    });
  },

  addChild: (child) => {
    const updated = [...get().children, child];
    saveToStorage("sb_children", updated);
    saveToStorage("sb_activeChild", child.id);
    set({ children: updated, activeChildId: child.id });
  },

  setActiveChild: (id) => {
    saveToStorage("sb_activeChild", id);
    set({ activeChildId: id });
  },

  purchasePack: (packId) => {
    const updated = [...new Set([...get().purchasedPacks, packId])];
    saveToStorage("sb_purchasedPacks", updated);
    set({ purchasedPacks: updated });
  },

  startSession: (session) => {
    set({ currentSession: session });
  },

  addAttempt: (attempt) => {
    const session = get().currentSession;
    if (!session) return;
    const updated = {
      ...session,
      attempts: [...session.attempts, attempt],
      exercisesCompleted: session.exercisesCompleted + 1,
      totalScore:
        (session.totalScore * session.attempts.length + attempt.score) /
        (session.attempts.length + 1),
    };
    set({ currentSession: updated });
  },

  completeSession: () => {
    const session = get().currentSession;
    if (!session) return;
    const completed = { ...session, completedAt: new Date().toISOString() };
    const updated = [...get().sessions, completed];
    saveToStorage("sb_sessions", updated);
    set({ sessions: updated, currentSession: null });
  },
}));
