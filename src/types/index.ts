export interface SoundTarget {
  phoneme: string; // e.g., "/r/", "/s/", "/th/"
  label: string; // e.g., "R sound", "S sound"
  description: string;
  positions: ("initial" | "medial" | "final")[];
}

export interface Exercise {
  id: string;
  packId: string;
  soundTarget: string; // phoneme
  position: "initial" | "medial" | "final";
  level: "word" | "phrase" | "sentence";
  prompt: string; // What to display: "Say: rabbit"
  targetWord: string; // The word to say
  imageUrl?: string; // Optional illustration
  hint: string; // Articulation tip
}

export interface ExercisePack {
  id: string;
  name: string; // e.g., "R Sound Starter Pack"
  description: string;
  soundTarget: string; // phoneme
  price: number; // in cents, 0 = free
  exerciseCount: number;
  levels: ("word" | "phrase" | "sentence")[];
  positions: ("initial" | "medial" | "final")[];
  isFree: boolean;
  color: string; // theme color for the pack
  icon: string; // emoji
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  targetSounds: string[]; // phonemes they're working on
  createdAt: string;
}

export interface PracticeAttempt {
  id: string;
  childId: string;
  exerciseId: string;
  timestamp: string;
  audioBlob?: Blob;
  score: number; // 0-100
  feedback: string;
  phonemeAccuracy: Record<string, number>; // per-phoneme scores
}

export interface PracticeSession {
  id: string;
  childId: string;
  packId: string;
  startedAt: string;
  completedAt?: string;
  attempts: PracticeAttempt[];
  totalScore: number;
  exercisesCompleted: number;
  exercisesTotal: number;
}

export interface AnalysisResult {
  transcript: string;
  score: number; // 0-100
  phonemeScores: Record<string, number>;
  feedback: string;
  suggestion: string;
}

export interface ProgressSummary {
  childId: string;
  totalSessions: number;
  totalExercises: number;
  averageScore: number;
  streakDays: number;
  soundProgress: Record<string, { avgScore: number; attempts: number }>;
  recentSessions: PracticeSession[];
}
