"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In production: send to your email/CRM via API route
    setSubmitted(true);
  };

  return (
    <main className="pt-16">
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Left: Info */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#c8a55a]">
                Get in Touch
              </p>
              <h1
                className="mb-6 text-5xl tracking-tight text-[#1a1a1a] sm:text-6xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Let&apos;s build
                <br />
                <em className="text-[#6b6560]">something great.</em>
              </h1>
              <p className="mb-12 max-w-md text-lg leading-relaxed text-[#6b6560]">
                Tell us about your project. We&apos;ll respond within 24 hours
                to schedule a free discovery call.
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]/40">
                    Email
                  </h3>
                  <a
                    href="mailto:hello@heliograph.agency"
                    className="text-lg font-medium text-[#1a1a1a] hover:text-[#c8a55a]"
                  >
                    hello@heliograph.agency
                  </a>
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]/40">
                    Response Time
                  </h3>
                  <p className="text-[#6b6560]">
                    Within 24 hours on business days.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]/40">
                    What to Expect
                  </h3>
                  <ol className="space-y-2 text-sm text-[#6b6560]">
                    <li>1. Fill out the form</li>
                    <li>2. We&apos;ll review your brief</li>
                    <li>3. 30-minute discovery call (free)</li>
                    <li>4. Custom proposal within 48 hours</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              {submitted ? (
                <div className="flex h-full items-center justify-center rounded-2xl bg-white p-12 ring-1 ring-black/5">
                  <div className="text-center">
                    <div className="mb-4 text-5xl">&#10003;</div>
                    <h3 className="mb-2 text-2xl font-semibold text-[#1a1a1a]">
                      Message sent!
                    </h3>
                    <p className="text-[#6b6560]">
                      We&apos;ll be in touch within 24 hours.
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl bg-white p-8 ring-1 ring-black/5 sm:p-10"
                >
                  <div className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/50"
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="w-full border-b border-black/10 bg-transparent py-3 text-[#1a1a1a] outline-none placeholder:text-[#6b6560]/40 focus:border-[#c8a55a]"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/50"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="w-full border-b border-black/10 bg-transparent py-3 text-[#1a1a1a] outline-none placeholder:text-[#6b6560]/40 focus:border-[#c8a55a]"
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="company"
                        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/50"
                      >
                        Company
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        className="w-full border-b border-black/10 bg-transparent py-3 text-[#1a1a1a] outline-none placeholder:text-[#6b6560]/40 focus:border-[#c8a55a]"
                        placeholder="Company name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="service"
                        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/50"
                      >
                        What do you need?
                      </label>
                      <select
                        id="service"
                        name="service"
                        className="w-full border-b border-black/10 bg-transparent py-3 text-[#1a1a1a] outline-none focus:border-[#c8a55a]"
                      >
                        <option value="">Select a service</option>
                        <option value="brand">Brand Strategy & Identity</option>
                        <option value="pr">Public Relations</option>
                        <option value="content">Content & Creative</option>
                        <option value="performance">
                          Performance Marketing
                        </option>
                        <option value="web">Digital & Web</option>
                        <option value="full">Full-Suite (Growth Package)</option>
                        <option value="other">Something else</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="budget"
                        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/50"
                      >
                        Monthly Budget
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        className="w-full border-b border-black/10 bg-transparent py-3 text-[#1a1a1a] outline-none focus:border-[#c8a55a]"
                      >
                        <option value="">Select a range</option>
                        <option value="under-3k">Under $3,000</option>
                        <option value="3k-5k">$3,000 - $5,000</option>
                        <option value="5k-10k">$5,000 - $10,000</option>
                        <option value="10k-plus">$10,000+</option>
                        <option value="project">
                          One-time project (not monthly)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/50"
                      >
                        Tell us about your project
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        className="w-full resize-none border-b border-black/10 bg-transparent py-3 text-[#1a1a1a] outline-none placeholder:text-[#6b6560]/40 focus:border-[#c8a55a]"
                        placeholder="What are your goals? What challenges are you facing?"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#1a1a1a] py-4 text-sm font-semibold text-white transition-all hover:bg-[#333]"
                    >
                      Send Inquiry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
