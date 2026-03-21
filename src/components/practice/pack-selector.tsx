"use client";

import type { ExercisePack } from "@/types";

interface PackSelectorProps {
  packs: ExercisePack[];
  onSelect: (pack: ExercisePack) => void;
}

export function PackSelector({ packs, onSelect }: PackSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {packs.map((pack) => (
        <button
          key={pack.id}
          onClick={() => onSelect(pack)}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          {pack.isFree && (
            <div className="absolute top-3 right-3 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
              FREE
            </div>
          )}
          <div className="mb-3 text-4xl transition-transform group-hover:scale-110">
            {pack.icon}
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-900">{pack.name}</h3>
          <p className="mb-3 text-sm leading-relaxed text-gray-500">
            {pack.description}
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
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
        </button>
      ))}
    </div>
  );
}
