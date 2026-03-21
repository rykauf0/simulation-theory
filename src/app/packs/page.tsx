"use client";

import { useEffect } from "react";
import { exercisePacks } from "@/data/packs";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

export default function PacksPage() {
  const { hydrated, hydrate, purchasedPacks, purchasePack } = useAppStore();

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

  const freePacks = exercisePacks.filter((p) => p.isFree);
  const paidPacks = exercisePacks.filter((p) => !p.isFree);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-2 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            &larr; Home
          </Link>
          <h1 className="text-3xl font-black text-gray-900">Exercise Packs</h1>
          <p className="mt-1 text-gray-500">
            Buy only the packs your child needs. No subscriptions.
          </p>
        </div>

        {/* Free packs */}
        <div className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-gray-700">
            Free Starter Packs
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {freePacks.map((pack) => (
              <div
                key={pack.id}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="text-4xl">{pack.icon}</div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    FREE
                  </span>
                </div>
                <h3 className="mb-1 text-lg font-bold text-gray-900">
                  {pack.name}
                </h3>
                <p className="mb-4 text-sm text-gray-500">{pack.description}</p>
                <div className="mb-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-600">
                    {pack.exerciseCount} exercises
                  </span>
                  {pack.levels.map((l) => (
                    <span
                      key={l}
                      className="rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-600"
                    >
                      {l}
                    </span>
                  ))}
                </div>
                <Link
                  href="/practice"
                  className="block w-full rounded-xl bg-green-600 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-green-700"
                >
                  Start Practicing
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Paid packs */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-gray-700">
            Exercise Packs
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paidPacks.map((pack) => {
              const owned = purchasedPacks.includes(pack.id);
              return (
                <div
                  key={pack.id}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
                >
                  <div className="mb-3 text-4xl">{pack.icon}</div>
                  <h3 className="mb-1 text-lg font-bold text-gray-900">
                    {pack.name}
                  </h3>
                  <p className="mb-4 text-sm text-gray-500">
                    {pack.description}
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-600">
                      {pack.exerciseCount} exercises
                    </span>
                    {pack.levels.map((l) => (
                      <span
                        key={l}
                        className="rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-600"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                  {owned ? (
                    <Link
                      href="/practice"
                      className="block w-full rounded-xl bg-indigo-600 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-indigo-700"
                    >
                      Practice Now
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        // In production: redirect to Stripe Checkout
                        // For demo: just unlock the pack
                        purchasePack(pack.id);
                      }}
                      className="block w-full rounded-xl bg-gray-900 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-gray-800"
                    >
                      Buy for ${(pack.price / 100).toFixed(2)}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
