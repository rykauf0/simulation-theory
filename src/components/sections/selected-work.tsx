import Link from "next/link";

const CASE_STUDIES = [
  {
    client: "Meridian Wellness",
    industry: "Health & Wellness",
    result: "3.8x return on ad spend within 60 days",
    services: ["Brand Identity", "Performance Marketing", "Web Design"],
    color: "bg-emerald-50",
    accent: "text-emerald-700",
  },
  {
    client: "Atlas Ventures",
    industry: "Fintech",
    result: "42 media placements in first quarter",
    services: ["PR Strategy", "Thought Leadership", "Content"],
    color: "bg-blue-50",
    accent: "text-blue-700",
  },
  {
    client: "Bloom Commerce",
    industry: "E-commerce",
    result: "Revenue grew 215% in 6 months",
    services: ["Full Rebrand", "Social Media", "Paid Campaigns"],
    color: "bg-amber-50",
    accent: "text-amber-700",
  },
];

export function SelectedWork() {
  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-16 flex items-end justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#c8a55a]">
              Selected Work
            </p>
            <h2
              className="text-4xl tracking-tight text-[#1a1a1a] sm:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Results that speak.
            </h2>
          </div>
          <Link
            href="/work"
            className="hidden text-sm font-medium text-[#6b6560] transition-colors hover:text-[#1a1a1a] md:block"
          >
            View all work &rarr;
          </Link>
        </div>

        {/* Case study cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {CASE_STUDIES.map((study) => (
            <Link
              key={study.client}
              href="/work"
              className={`group rounded-2xl ${study.color} p-8 transition-all hover:-translate-y-1 hover:shadow-lg`}
            >
              <p className={`mb-1 text-xs font-semibold uppercase tracking-wider ${study.accent}`}>
                {study.industry}
              </p>
              <h3 className="mb-4 text-2xl font-semibold text-[#1a1a1a]">
                {study.client}
              </h3>
              <p className="mb-6 text-lg font-medium text-[#1a1a1a]/80">
                {study.result}
              </p>
              <div className="flex flex-wrap gap-2">
                {study.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-[#1a1a1a]/70"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/work"
            className="text-sm font-medium text-[#6b6560] hover:text-[#1a1a1a]"
          >
            View all work &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
