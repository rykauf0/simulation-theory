"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

export default function ProfilePage() {
  const { hydrated, hydrate, children, activeChildId, sessions } =
    useAppStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl font-bold text-gray-400">Loading...</div>
      </div>
    );
  }

  const child = children.find((c) => c.id === activeChildId);

  if (!child) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 text-5xl">👋</div>
          <h1 className="mb-2 text-2xl font-black text-gray-900">
            No profile yet
          </h1>
          <p className="mb-6 text-gray-500">
            Start practicing to create your child&apos;s profile.
          </p>
          <Link
            href="/practice"
            className="inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  const childSessions = sessions.filter((s) => s.childId === child.id);
  const totalExercises = childSessions.reduce(
    (sum, s) => sum + s.exercisesCompleted,
    0
  );
  const avgScore =
    childSessions.length > 0
      ? Math.round(
          childSessions.reduce((sum, s) => sum + s.totalScore, 0) /
            childSessions.length
        )
      : 0;

  // Calculate streak (consecutive days with sessions)
  const uniqueDays = [
    ...new Set(
      childSessions.map((s) =>
        new Date(s.startedAt).toISOString().split("T")[0]
      )
    ),
  ].sort();
  let streakDays = 0;
  const today = new Date().toISOString().split("T")[0];
  for (let i = uniqueDays.length - 1; i >= 0; i--) {
    const expected = new Date(
      Date.now() - (uniqueDays.length - 1 - i) * 86400000
    )
      .toISOString()
      .split("T")[0];
    if (uniqueDays[i] === expected || uniqueDays[i] === today) {
      streakDays++;
    } else {
      break;
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          &larr; Home
        </Link>

        {/* Profile header */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-3xl">
              🧒
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                {child.name}
              </h1>
              <p className="text-sm text-gray-500">
                {child.age} years old &middot; Working on{" "}
                {child.targetSounds.join(", ")}
              </p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-100">
            <p className="text-3xl font-black text-indigo-600">
              {childSessions.length}
            </p>
            <p className="text-xs font-semibold text-gray-400">Sessions</p>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-100">
            <p className="text-3xl font-black text-green-600">
              {totalExercises}
            </p>
            <p className="text-xs font-semibold text-gray-400">Exercises</p>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-100">
            <p className="text-3xl font-black text-amber-600">{avgScore}</p>
            <p className="text-xs font-semibold text-gray-400">Avg Score</p>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-100">
            <p className="text-3xl font-black text-pink-600">{streakDays}</p>
            <p className="text-xs font-semibold text-gray-400">Day Streak</p>
          </div>
        </div>

        {/* Recent sessions */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            Recent Sessions
          </h2>
          {childSessions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-400">No sessions yet. Time to practice!</p>
              <Link
                href="/practice"
                className="mt-4 inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700"
              >
                Start Practicing
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {childSessions
                .slice(-10)
                .reverse()
                .map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {session.packId}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(session.startedAt).toLocaleDateString()} &middot;{" "}
                        {session.exercisesCompleted} exercises
                      </p>
                    </div>
                    <div
                      className={`rounded-lg px-3 py-1 text-sm font-bold ${
                        session.totalScore >= 90
                          ? "bg-green-100 text-green-700"
                          : session.totalScore >= 75
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {Math.round(session.totalScore)}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            Practice Now
          </Link>
        </div>
      </div>
    </div>
  );
}
