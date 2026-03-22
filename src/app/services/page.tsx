import Link from "next/link";

const SERVICE_TIERS = [
  {
    name: "Launch",
    price: "5,000",
    period: "project",
    description:
      "For startups and new brands that need a strong foundation. We build your brand from scratch and set you up for growth.",
    includes: [
      "Brand Positioning Workshop",
      "Visual Identity (Logo, Colors, Typography)",
      "Brand Guidelines Document",
      "One-Page Website or Landing Page",
      "Social Media Profile Setup",
      "30-Day Content Calendar",
    ],
    ideal: "Startups, new products, founders building their first brand",
    cta: "Get Started",
  },
  {
    name: "Growth",
    price: "5,000",
    period: "month",
    description:
      "For established businesses ready to scale. Ongoing brand, PR, and marketing execution with dedicated attention.",
    includes: [
      "Everything in Launch, plus:",
      "Monthly Content Production (12-16 pieces)",
      "Social Media Management (3 platforms)",
      "PR Outreach & Media Relations",
      "Paid Ad Campaign Management",
      "Monthly Performance Reporting",
      "Bi-weekly Strategy Calls",
    ],
    ideal: "Growing companies, Series A-B startups, established SMBs",
    cta: "Book a Call",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description:
      "For brands that need a dedicated team across all channels. Full-service brand, PR, and performance marketing.",
    includes: [
      "Everything in Growth, plus:",
      "Dedicated Account Director",
      "Full Creative Production",
      "Crisis Communications",
      "Event Marketing",
      "Influencer Partnerships",
      "Executive Positioning",
      "Weekly Strategy Calls",
    ],
    ideal: "Enterprise, high-growth companies, brands in competitive markets",
    cta: "Let's Talk",
  },
];

const A_LA_CARTE = [
  { service: "Brand Identity Package", price: "From $3,500" },
  { service: "PR Campaign (3 months)", price: "From $4,500/mo" },
  { service: "Website Design & Development", price: "From $5,000" },
  { service: "Content Strategy & Calendar", price: "From $2,000" },
  { service: "Paid Ad Management", price: "From $1,500/mo + ad spend" },
  { service: "Social Media Management", price: "From $2,000/mo" },
];

export default function ServicesPage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#c8a55a]">
              Services & Pricing
            </p>
            <h1
              className="mb-6 text-5xl tracking-tight text-[#1a1a1a] sm:text-6xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Transparent pricing.
              <br />
              <em className="text-[#6b6560]">No surprises.</em>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-[#6b6560]">
              Whether you need a complete brand launch or ongoing marketing
              execution, we have a tier that fits. All pricing is transparent — no
              hidden fees, no scope creep.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {SERVICE_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-8 ${
                  tier.featured
                    ? "bg-[#1a1a1a] text-white ring-2 ring-[#c8a55a]"
                    : "bg-white ring-1 ring-black/10"
                }`}
              >
                {tier.featured && (
                  <span className="mb-4 inline-block rounded-full bg-[#c8a55a] px-3 py-1 text-xs font-semibold text-[#0f0f0f]">
                    Most Popular
                  </span>
                )}
                <h3
                  className="mb-2 text-2xl"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                >
                  {tier.name}
                </h3>
                <div className="mb-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  {tier.period && (
                    <span
                      className={`text-sm ${tier.featured ? "text-white/50" : "text-[#6b6560]"}`}
                    >
                      /{tier.period}
                    </span>
                  )}
                </div>
                <p
                  className={`mb-6 text-sm leading-relaxed ${
                    tier.featured ? "text-white/60" : "text-[#6b6560]"
                  }`}
                >
                  {tier.description}
                </p>
                <ul className="mb-8 space-y-2">
                  {tier.includes.map((item) => (
                    <li
                      key={item}
                      className={`flex items-start gap-2 text-sm ${
                        tier.featured ? "text-white/80" : "text-[#1a1a1a]"
                      }`}
                    >
                      <span className="mt-0.5 text-[#c8a55a]">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p
                  className={`mb-6 text-xs italic ${
                    tier.featured ? "text-white/40" : "text-[#6b6560]"
                  }`}
                >
                  Ideal for: {tier.ideal}
                </p>
                <Link
                  href="/contact"
                  className={`block w-full rounded-full py-3 text-center text-sm font-semibold transition-all ${
                    tier.featured
                      ? "bg-[#c8a55a] text-[#0f0f0f] hover:bg-[#e8d5a0]"
                      : "bg-[#1a1a1a] text-white hover:bg-[#333]"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A la carte */}
      <section className="border-t border-black/5 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <h2
              className="mb-4 text-3xl tracking-tight text-[#1a1a1a]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              A la carte services
            </h2>
            <p className="text-[#6b6560]">
              Need just one thing? We offer individual services too.
            </p>
          </div>
          <div className="divide-y divide-black/10">
            {A_LA_CARTE.map((item) => (
              <div
                key={item.service}
                className="flex items-center justify-between py-5"
              >
                <span className="font-medium text-[#1a1a1a]">
                  {item.service}
                </span>
                <span className="text-sm text-[#6b6560]">{item.price}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/contact"
              className="text-sm font-medium text-[#c8a55a] hover:underline"
            >
              Have a custom need? Let&apos;s talk &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
