"use client";

import Link from "next/link";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-indigo-200 opacity-30 blur-3xl" />
        <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-pink-200 opacity-30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-200 opacity-20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-100">
          <span className="text-lg">🎙️</span>
          AI-Powered Speech Practice
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-5xl font-black tracking-tight text-gray-900 sm:text-7xl">
          Your child says it.
          <br />
          <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
            AI listens & helps.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-600">
          Fun, gamified speech therapy practice at home. SpeakBuddy uses AI to
          give your child{" "}
          <strong className="text-gray-900">real-time pronunciation feedback</strong>{" "}
          — like having a friendly speech coach on demand.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl"
          >
            <span className="text-2xl">🚀</span>
            Start Practicing Free
          </Link>
          <Link
            href="/packs"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-gray-700 shadow-md ring-1 ring-gray-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Browse Exercise Packs
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="flex -space-x-2">
            {["🧒", "👧", "👦", "👶", "🧒"].map((emoji, i) => (
              <div
                key={i}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg ring-2 ring-white shadow-sm"
              >
                {emoji}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            <strong className="text-gray-700">2 free packs</strong> — no credit card needed.
            Start in 30 seconds.
          </p>
        </div>
      </div>
    </section>
  );
}
