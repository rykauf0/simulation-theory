const CAPABILITIES = [
  {
    number: "01",
    title: "Brand Strategy & Identity",
    description:
      "From positioning and naming to visual identity systems and brand guidelines. We build brands that are distinctive, coherent, and built to last.",
    services: [
      "Brand Positioning",
      "Visual Identity",
      "Brand Guidelines",
      "Naming & Verbal Identity",
      "Brand Architecture",
    ],
  },
  {
    number: "02",
    title: "Public Relations",
    description:
      "Earned media that moves the needle. We craft narratives that journalists want to tell, and build relationships that compound over time.",
    services: [
      "Media Relations",
      "Press Strategy",
      "Crisis Communications",
      "Thought Leadership",
      "Launch Campaigns",
    ],
  },
  {
    number: "03",
    title: "Content & Creative",
    description:
      "High-impact content at the speed of culture. From campaign concepts to always-on social, we produce work that earns attention.",
    services: [
      "Campaign Creative",
      "Content Strategy",
      "Copywriting",
      "Social Media",
      "Video & Motion",
    ],
  },
  {
    number: "04",
    title: "Performance Marketing",
    description:
      "Data-driven campaigns that deliver measurable ROI. We optimize every dollar across paid channels to drive growth efficiently.",
    services: [
      "Paid Social",
      "Search & SEM",
      "Analytics & Reporting",
      "Conversion Optimization",
      "Email Marketing",
    ],
  },
  {
    number: "05",
    title: "Digital & Web",
    description:
      "Websites and digital experiences that convert. Clean design, fast performance, and strategic architecture that supports your brand.",
    services: [
      "Web Design & Development",
      "Landing Pages",
      "SEO Strategy",
      "UX/UI Design",
      "Digital Experiences",
    ],
  },
];

export function Capabilities() {
  return (
    <section className="px-6 py-24 lg:px-8" id="capabilities">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-20 max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#c8a55a]">
            Capabilities
          </p>
          <h2
            className="text-4xl tracking-tight text-[#1a1a1a] sm:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Full-suite, not full of it.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[#6b6560]">
            Everything you need to build and grow a world-class brand — strategy
            through execution — under one roof.
          </p>
        </div>

        {/* Capability list */}
        <div className="divide-y divide-black/10">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.number}
              className="group grid gap-6 py-10 md:grid-cols-12 md:gap-8"
            >
              <div className="md:col-span-1">
                <span className="text-xs font-semibold text-[#c8a55a]">
                  {cap.number}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3 className="text-xl font-semibold text-[#1a1a1a]">
                  {cap.title}
                </h3>
              </div>
              <div className="md:col-span-4">
                <p className="text-sm leading-relaxed text-[#6b6560]">
                  {cap.description}
                </p>
              </div>
              <div className="md:col-span-3">
                <ul className="space-y-1.5">
                  {cap.services.map((service) => (
                    <li
                      key={service}
                      className="text-sm text-[#6b6560]"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
