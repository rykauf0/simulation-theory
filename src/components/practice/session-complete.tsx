"use client";

import type { PracticeSession as PracticeSessionType, ExercisePack, ChildProfile } from "@/types";

interface SessionCompleteProps {
  session: PracticeSessionType;
  pack: ExercisePack;
  child: ChildProfile;
  onExit: () => void;
}

export function SessionComplete({
  session,
  pack,
  child,
  onExit,
}: SessionCompleteProps) {
  const avgScore = session.totalScore;
  const isAmazing = avgScore >= 90;
  const isGood = avgScore >= 75;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center">
        <div className="animate-bounce-in rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-100">
          {/* Celebration */}
          <div className="mb-6 text-6xl">
            {isAmazing ? "🏆" : isGood ? "🌟" : "💪"}
          </div>

          <h1 className="mb-2 text-3xl font-black text-gray-900">
            {isAmazing
              ? "Amazing job!"
              : isGood
                ? "Great work!"
                : "Nice effort!"}
          </h1>

          <p className="mb-6 text-gray-500">
            {child.name} completed the {pack.name}!
          </p>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-indigo-50 p-3">
              <p className="text-2xl font-black text-indigo-600">
                {session.exercisesCompleted}
              </p>
              <p className="text-xs font-semibold text-indigo-400">
                Exercises
              </p>
            </div>
            <div className="rounded-xl bg-green-50 p-3">
              <p className="text-2xl font-black text-green-600">
                {Math.round(avgScore)}
              </p>
              <p className="text-xs font-semibold text-green-400">Avg Score</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3">
              <p className="text-2xl font-black text-amber-600">
                {session.attempts.filter((a) => a.score >= 90).length}
              </p>
              <p className="text-xs font-semibold text-amber-400">Perfect!</p>
            </div>
          </div>

          {/* Stars earned */}
          <div className="mb-8">
            <p className="mb-2 text-sm font-bold text-gray-500">
              Stars Earned
            </p>
            <div className="flex justify-center gap-1">
              {session.attempts.map((attempt, i) => (
                <span
                  key={i}
                  className={`text-2xl ${
                    attempt.score >= 90
                      ? ""
                      : attempt.score >= 75
                        ? "opacity-60"
                        : "opacity-30"
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onExit}
              className="w-full rounded-xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Practice Another Pack
            </button>
            <button
              onClick={() => (window.location.href = "/profile")}
              className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 text-sm font-bold text-gray-600 transition-all hover:border-gray-300"
            >
              View Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
