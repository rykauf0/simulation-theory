"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

const SOUND_OPTIONS = [
  { phoneme: "/r/", label: "R sound", icon: "🐰" },
  { phoneme: "/s/", label: "S sound", icon: "🐍" },
  { phoneme: "/l/", label: "L sound", icon: "🦁" },
  { phoneme: "/th/", label: "TH sound", icon: "👅" },
  { phoneme: "/sh/", label: "SH sound", icon: "🚢" },
];

export function ChildSetup() {
  const { addChild } = useAppStore();
  const [name, setName] = useState("");
  const [age, setAge] = useState(5);
  const [selectedSounds, setSelectedSounds] = useState<string[]>([]);

  const toggleSound = (phoneme: string) => {
    setSelectedSounds((prev) =>
      prev.includes(phoneme)
        ? prev.filter((s) => s !== phoneme)
        : [...prev, phoneme]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedSounds.length === 0) return;

    addChild({
      id: crypto.randomUUID(),
      name: name.trim(),
      age,
      targetSounds: selectedSounds,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          &larr; Home
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-100 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mb-3 text-5xl">👋</div>
            <h1 className="text-3xl font-black text-gray-900">
              Let&apos;s get started!
            </h1>
            <p className="mt-2 text-gray-500">
              Tell us a bit about your child so we can personalize their
              practice.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Child&apos;s first name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Emma"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg font-semibold text-gray-900 placeholder-gray-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            {/* Age */}
            <div>
              <label
                htmlFor="age"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Age: {age} years old
              </label>
              <input
                id="age"
                type="range"
                min={3}
                max={12}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>3</span>
                <span>12</span>
              </div>
            </div>

            {/* Target Sounds */}
            <div>
              <label className="mb-3 block text-sm font-bold text-gray-700">
                What sounds are they working on?
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {SOUND_OPTIONS.map((sound) => {
                  const isSelected = selectedSounds.includes(sound.phoneme);
                  return (
                    <button
                      key={sound.phoneme}
                      type="button"
                      onClick={() => toggleSound(sound.phoneme)}
                      className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-left font-semibold transition-all ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-xl">{sound.icon}</span>
                      <span className="text-sm">{sound.label}</span>
                    </button>
                  );
                })}
              </div>
              {selectedSounds.length === 0 && (
                <p className="mt-2 text-xs text-gray-400">
                  Select at least one sound. Not sure? Ask your SLP!
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!name.trim() || selectedSounds.length === 0}
              className="w-full rounded-xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-700 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Let&apos;s Practice!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
