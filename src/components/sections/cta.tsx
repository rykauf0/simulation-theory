import Link from "next/link";

export function CTA() {
  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl bg-[#1a1a1a] px-8 py-20 text-center text-white sm:px-16">
          {/* Gold accent line */}
          <div className="mx-auto mb-8 h-px w-16 bg-[#c8a55a]" />

          <h2
            className="mb-6 text-4xl tracking-tight sm:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to illuminate
            <br />
            <em className="text-white/60">your brand?</em>
          </h2>

          <p className="mx-auto mb-10 max-w-lg text-lg text-white/50">
            Book a free discovery call. We&apos;ll discuss your goals, audit
            your current presence, and outline a clear path forward. No
            obligation.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-[#c8a55a] px-8 py-4 text-sm font-semibold text-[#0f0f0f] transition-all hover:bg-[#e8d5a0]"
            >
              Book Discovery Call
            </Link>
            <a
              href="mailto:hello@heliograph.agency"
              className="inline-flex rounded-full border border-white/20 px-8 py-4 text-sm font-medium text-white transition-all hover:border-white/40"
            >
              hello@heliograph.agency
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
