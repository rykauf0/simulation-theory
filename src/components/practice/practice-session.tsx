"use client";

import { useState, useCallback } from "react";
import type { ExercisePack, Exercise, ChildProfile } from "@/types";
import { analyzeAudioDemo } from "@/lib/audio";
import { useAppStore } from "@/lib/store";
import { RecordButton } from "./record-button";
import { FeedbackDisplay } from "./feedback-display";
import { SessionComplete } from "./session-complete";

interface PracticeSessionProps {
  pack: ExercisePack;
  exercises: Exercise[];
  child: ChildProfile;
  onExit: () => void;
}

export function PracticeSession({
  pack,
  exercises,
  child,
  onExit,
}: PracticeSessionProps) {
  const { startSession, addAttempt, completeSession, currentSession } =
    useAppStore();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    feedback: string;
    suggestion: string;
  } | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [streak, setStreak] = useState(0);

  const exercise = exercises[exerciseIndex];
  const progress = ((exerciseIndex) / exercises.length) * 100;

  // Initialize session on first render
  useState(() => {
    startSession({
      id: crypto.randomUUID(),
      childId: child.id,
      packId: pack.id,
      startedAt: new Date().toISOString(),
      attempts: [],
      totalScore: 0,
      exercisesCompleted: 0,
      exercisesTotal: exercises.length,
    });
  });

  const handleRecordingComplete = useCallback(
    async (_audioBlob: Blob) => {
      setIsRecording(false);

      // In demo mode, use simulated analysis
      // In production, this would call: analyzeAudio(audioBlob, exercise.targetWord, exercise.soundTarget)
      const result = analyzeAudioDemo(
        exercise.targetWord,
        exercise.soundTarget
      );

      setFeedback(result);
      setShowFeedback(true);

      if (result.score >= 75) {
        setStreak((s) => s + 1);
      } else {
        setStreak(0);
      }

      addAttempt({
        id: crypto.randomUUID(),
        childId: child.id,
        exerciseId: exercise.id,
        timestamp: new Date().toISOString(),
        score: result.score,
        feedback: result.feedback,
        phonemeAccuracy: result.phonemeScores,
      });
    },
    [exercise, child.id, addAttempt]
  );

  const handleNext = () => {
    setShowFeedback(false);
    setFeedback(null);

    if (exerciseIndex + 1 >= exercises.length) {
      completeSession();
      setIsComplete(true);
    } else {
      setExerciseIndex((i) => i + 1);
    }
  };

  const handleTryAgain = () => {
    setShowFeedback(false);
    setFeedback(null);
  };

  if (isComplete) {
    return (
      <SessionComplete
        session={currentSession!}
        pack={pack}
        child={child}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <div className="border-b border-gray-100 bg-white/80 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <button
            onClick={onExit}
            className="text-sm font-semibold text-gray-500 hover:text-gray-700"
          >
            &times; Exit
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-600">
              {exerciseIndex + 1}/{exercises.length}
            </span>
            {streak >= 2 && (
              <span className="animate-bounce-in rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-600">
                {streak} streak!
              </span>
            )}
          </div>
        </div>
        {/* Progress bar */}
        <div className="mx-auto mt-2 max-w-2xl">
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          {!showFeedback ? (
            <>
              {/* Exercise prompt */}
              <div className="mb-8">
                <div className="mb-4 text-6xl animate-float">{pack.icon}</div>
                <div className="mb-2 rounded-xl bg-white px-6 py-4 shadow-sm ring-1 ring-gray-100">
                  <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                    Say this word:
                  </p>
                  <p className="mt-1 text-4xl font-black text-gray-900">
                    {exercise.targetWord}
                  </p>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  {exercise.hint}
                </p>
              </div>

              {/* Record button */}
              <RecordButton
                isRecording={isRecording}
                onStartRecording={() => setIsRecording(true)}
                onStopRecording={handleRecordingComplete}
              />

              <p className="mt-4 text-xs text-gray-400">
                {isRecording
                  ? "Listening... tap when done!"
                  : "Tap the microphone and say the word"}
              </p>
            </>
          ) : (
            <FeedbackDisplay
              score={feedback!.score}
              feedback={feedback!.feedback}
              suggestion={feedback!.suggestion}
              targetWord={exercise.targetWord}
              streak={streak}
              onNext={handleNext}
              onTryAgain={handleTryAgain}
            />
          )}
        </div>
      </div>
    </div>
  );
}
