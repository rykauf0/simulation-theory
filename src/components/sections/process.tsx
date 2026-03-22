const STEPS = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We start with a deep-dive into your business, market, and goals. No generic questionnaires — a real conversation about where you are and where you want to be.",
    duration: "Week 1",
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "We develop a clear, actionable strategy that connects your brand positioning to market opportunity. Every recommendation is grounded in data and competitive analysis.",
    duration: "Week 2-3",
  },
  {
    number: "03",
    title: "Creation",
    description:
      "Our team produces everything in-house — brand assets, content, campaigns, websites. We move fast without sacrificing craft, leveraging intelligent tools to accelerate production.",
    duration: "Week 3-6",
  },
  {
    number: "04",
    title: "Launch & Optimize",
    description:
      "We don't just launch and walk away. We monitor performance, optimize in real-time, and iterate based on data. Your retainer includes ongoing optimization and reporting.",
    duration: "Ongoing",
  },
];

export function Process() {
  return (
    <section className="bg-[#0f0f0f] px-6 py-24 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-20 max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#c8a55a]">
            Process
          </p>
          <h2
            className="text-4xl tracking-tight sm:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How we work.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/50">
            A clear, efficient process designed to get you from brief to results
            in weeks, not months.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.number} className="relative">
              <span className="mb-4 block text-4xl font-bold text-[#c8a55a]/20">
                {step.number}
              </span>
              <h3 className="mb-3 text-lg font-semibold">{step.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-white/50">
                {step.description}
              </p>
              <span className="text-xs font-medium text-[#c8a55a]">
                {step.duration}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
