import Link from "next/link";

const PROJECTS = [
  {
    client: "Meridian Wellness",
    industry: "Health & Wellness",
    challenge: "A premium wellness brand launching in a saturated DTC market needed to stand out and acquire customers profitably.",
    approach: "Full brand identity, Shopify site, and performance marketing strategy. We positioned them as the premium alternative in their space and launched with a targeted paid social campaign.",
    results: [
      "3.8x ROAS in first 60 days",
      "12,000+ email subscribers pre-launch",
      "$340K revenue in first quarter",
    ],
    services: ["Brand Identity", "Web Design", "Performance Marketing", "Content Strategy"],
    color: "bg-emerald-50",
    accent: "text-emerald-700",
  },
  {
    client: "Atlas Ventures",
    industry: "Fintech",
    challenge: "A fintech startup needed to establish credibility fast before their Series B. No press coverage, no thought leadership, no brand recognition.",
    approach: "Developed a PR strategy centered on the founder's unique perspective on embedded finance. Pitched tier-1 and industry publications, secured podcast appearances, and ghostwrote LinkedIn content.",
    results: [
      "42 media placements in Q1",
      "TechCrunch, Forbes, and Fintech Times coverage",
      "CEO LinkedIn followers grew 8x",
    ],
    services: ["PR Strategy", "Thought Leadership", "Content Production", "Media Training"],
    color: "bg-blue-50",
    accent: "text-blue-700",
  },
  {
    client: "Bloom Commerce",
    industry: "E-commerce",
    challenge: "An established e-commerce brand had plateaued. Revenue was flat, brand felt dated, and paid acquisition costs were rising.",
    approach: "Complete rebrand including new visual identity, website redesign, and overhauled social presence. Rebuilt their paid strategy with creative-first testing and email automation.",
    results: [
      "Revenue grew 215% in 6 months",
      "CAC reduced by 38%",
      "Email revenue up 4.2x",
    ],
    services: ["Full Rebrand", "Web Redesign", "Social Media", "Paid Campaigns", "Email Marketing"],
    color: "bg-amber-50",
    accent: "text-amber-700",
  },
  {
    client: "Noctis Security",
    industry: "Cybersecurity",
    challenge: "A B2B cybersecurity firm needed to generate enterprise leads. Their website was technical jargon, and they had zero inbound pipeline.",
    approach: "Simplified their messaging, redesigned their site for conversion, and launched a content marketing engine targeting CISOs and IT directors.",
    results: [
      "340% increase in qualified leads",
      "22 enterprise demos booked in first month",
      "Organic traffic up 5x in 90 days",
    ],
    services: ["Messaging & Positioning", "Web Design", "SEO", "Content Marketing"],
    color: "bg-violet-50",
    accent: "text-violet-700",
  },
];

export default function WorkPage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#c8a55a]">
              Our Work
            </p>
            <h1
              className="mb-6 text-5xl tracking-tight text-[#1a1a1a] sm:text-6xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Case studies in
              <br />
              <em className="text-[#6b6560]">growth & craft.</em>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-[#6b6560]">
              A selection of projects that showcase how we think, work, and
              deliver results across industries.
            </p>
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {PROJECTS.map((project) => (
            <div
              key={project.client}
              className={`overflow-hidden rounded-2xl ${project.color} p-8 sm:p-12`}
            >
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <p
                    className={`mb-2 text-xs font-semibold uppercase tracking-wider ${project.accent}`}
                  >
                    {project.industry}
                  </p>
                  <h2 className="mb-4 text-3xl font-semibold text-[#1a1a1a]">
                    {project.client}
                  </h2>
                  <div className="mb-6 space-y-4">
                    <div>
                      <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/50">
                        Challenge
                      </h4>
                      <p className="text-sm leading-relaxed text-[#1a1a1a]/70">
                        {project.challenge}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/50">
                        Approach
                      </h4>
                      <p className="text-sm leading-relaxed text-[#1a1a1a]/70">
                        {project.approach}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-[#1a1a1a]/70"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/50">
                    Results
                  </h4>
                  <ul className="space-y-3">
                    {project.results.map((result) => (
                      <li
                        key={result}
                        className="flex items-start gap-3 text-lg font-semibold text-[#1a1a1a]"
                      >
                        <span className="mt-1 text-[#c8a55a]">&#10003;</span>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-4 text-[#6b6560]">
            Like what you see?
          </p>
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-[#1a1a1a] px-8 py-4 text-sm font-medium text-white transition-all hover:bg-[#333]"
          >
            Start Your Project
          </Link>
        </div>
      </section>
    </main>
  );
}
