import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center px-6 pt-16 lg:px-8">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-[#c8a55a]/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#c8a55a]">
            Brand &middot; PR &middot; Marketing
          </p>

          {/* Headline */}
          <h1
            className="mb-8 text-5xl leading-[1.1] tracking-tight text-[#1a1a1a] sm:text-7xl lg:text-8xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            We illuminate
            <br />
            <em className="text-[#6b6560]">brands that matter.</em>
          </h1>

          {/* Subline */}
          <p className="mb-12 max-w-xl text-lg leading-relaxed text-[#6b6560]">
            Heliograph is a full-suite brand, PR & marketing agency that
            combines strategic depth with modern execution. We help ambitious
            companies build brands people remember, earn press that drives
            growth, and run campaigns that convert.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-8 py-4 text-sm font-medium text-white transition-all hover:bg-[#333]"
            >
              Start a Project
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center justify-center rounded-full border border-[#1a1a1a]/15 px-8 py-4 text-sm font-medium text-[#1a1a1a] transition-all hover:bg-[#1a1a1a]/5"
            >
              View Our Work
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-24 grid grid-cols-2 gap-8 border-t border-black/10 pt-8 sm:grid-cols-4">
          {[
            { value: "50+", label: "Campaigns launched" },
            { value: "3.2x", label: "Average ROI" },
            { value: "12", label: "Industries served" },
            { value: "48hr", label: "Average turnaround" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold tracking-tight text-[#1a1a1a]">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-[#6b6560]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
