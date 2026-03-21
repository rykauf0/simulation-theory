import Link from "next/link";
import { exercisePacks } from "@/data/packs";

export function LandingPricing() {
  const freePacks = exercisePacks.filter((p) => p.isFree);
  const paidPacks = exercisePacks.filter((p) => !p.isFree);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8" id="pricing">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-black text-gray-900">
            Simple, Fair Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            No subscriptions. Buy only the exercise packs your child needs —
            like buying workbooks, but powered by AI.
          </p>
        </div>

        {/* Free tier */}
        <div className="mb-12 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 p-1">
          <div className="rounded-[calc(1.5rem-4px)] bg-white p-8 sm:p-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700">
                  FREE FOREVER
                </div>
                <h3 className="mb-3 text-3xl font-black text-gray-900">
                  2 Free Starter Packs
                </h3>
                <p className="mb-4 max-w-lg text-gray-600">
                  Get started immediately with our R Sound and S Sound starter
                  packs — 30 exercises total, completely free. No credit card
                  required.
                </p>
                <div className="flex flex-wrap gap-3">
                  {freePacks.map((pack) => (
                    <span
                      key={pack.id}
                      className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700"
                    >
                      {pack.icon} {pack.name} ({pack.exerciseCount} exercises)
                    </span>
                  ))}
                </div>
              </div>
              <Link
                href="/practice"
                className="shrink-0 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>

        {/* Paid packs grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paidPacks.slice(0, 5).map((pack) => (
            <div
              key={pack.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-3 text-4xl">{pack.icon}</div>
              <h3 className="mb-1 text-xl font-bold text-gray-900">
                {pack.name}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-500">
                {pack.description}
              </p>
              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-gray-900">
                  ${(pack.price / 100).toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">one-time</span>
              </div>
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
                href={`/packs`}
                className="block w-full rounded-xl bg-gray-900 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-gray-800"
              >
                Get Pack
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
