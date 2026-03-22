import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[#0f0f0f] px-6 py-16 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3
              className="mb-4 text-2xl"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
              }}
            >
              Heliograph
            </h3>
            <p className="max-w-sm text-sm leading-relaxed text-white/50">
              A modern brand, PR & marketing agency. We combine strategic
              thinking with intelligent tools to illuminate your brand and
              amplify your message.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">
              Agency
            </h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li>
                <Link href="/services" className="transition-colors hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/work" className="transition-colors hover:text-white">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li>hello@heliograph.agency</li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Book a Discovery Call
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/30 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Heliograph. All rights reserved.</p>
          <p>Illuminating brands since 2026.</p>
        </div>
      </div>
    </footer>
  );
}
