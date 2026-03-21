"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { exercisePacks, getPackExercises } from "@/data/packs";
import { PackSelector } from "@/components/practice/pack-selector";
import { PracticeSession } from "@/components/practice/practice-session";
import { ChildSetup } from "@/components/practice/child-setup";
import type { ExercisePack } from "@/types";
import Link from "next/link";

export default function PracticePage() {
  const { hydrated, hydrate, children, activeChildId, purchasedPacks } =
    useAppStore();
  const [selectedPack, setSelectedPack] = useState<ExercisePack | null>(null);

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

  // Step 1: Set up child profile if none exists
  if (children.length === 0 || !activeChildId) {
    return <ChildSetup />;
  }

  const activeChild = children.find((c) => c.id === activeChildId);

  // Step 2: Select a pack
  if (!selectedPack) {
    const availablePacks = exercisePacks.filter(
      (p) => p.isFree || purchasedPacks.includes(p.id)
    );
    return (
      <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="mb-2 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                &larr; Home
              </Link>
              <h1 className="text-3xl font-black text-gray-900">
                Hi {activeChild?.name}! Ready to practice?
              </h1>
              <p className="mt-1 text-gray-500">
                Pick an exercise pack to get started.
              </p>
            </div>
          </div>
          <PackSelector
            packs={availablePacks}
            onSelect={setSelectedPack}
          />
          {exercisePacks.filter((p) => !p.isFree && !purchasedPacks.includes(p.id)).length > 0 && (
            <div className="mt-8 text-center">
              <Link
                href="/packs"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Want more? Browse all exercise packs &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 3: Practice!
  const packExercises = getPackExercises(selectedPack.id);
  return (
    <PracticeSession
      pack={selectedPack}
      exercises={packExercises}
      child={activeChild!}
      onExit={() => setSelectedPack(null)}
    />
  );
}
