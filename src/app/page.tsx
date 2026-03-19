'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBootComplete(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setIsLoading(true);

    const fullContext = [
      industry && `Industry: ${industry}`,
      context,
    ].filter(Boolean).join('\n\n');

    try {
      const res = await fetch('/api/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, context: fullContext }),
      });

      const data = await res.json();
      router.push(`/simulation/${data.simulationId}`);
    } catch {
      setIsLoading(false);
    }
  };

  if (!bootComplete) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <pre className="text-[var(--matrix-green)] text-glow text-xs sm:text-sm mb-4 leading-tight overflow-hidden max-w-full">{`
 ███████╗██╗███╗   ███╗
 ██╔════╝██║████╗ ████║
 ███████╗██║██╔████╔██║
 ╚════██║██║██║╚██╔╝██║
 ███████║██║██║ ╚═╝ ██║
 ╚══════╝╚═╝╚═╝     ╚═╝`}</pre>
          <p className="text-[var(--matrix-green)] text-glow text-xs tracking-[0.3em] uppercase">
            Simulation Theory
          </p>
          <div className="mt-8 text-[var(--text-dim)] text-xs">
            <span className="cursor-blink">█</span> Initializing neural network...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-[var(--matrix-green)] text-glow tracking-wider">
            SIMULATION THEORY
          </h1>
          <p className="text-xs text-[var(--text-dim)] mt-2 tracking-[0.2em] uppercase">
            AI-Powered Organizational Health Analysis
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-[var(--border-color)] p-6 bg-[var(--bg-panel)] border-glow">
            {/* Title bar */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-dim)] text-xs tracking-wider">┌─ SIMULATION PARAMETERS ─┐</span>
              <span className="text-[var(--text-muted)] text-xs">v0.1.0</span>
            </div>

            {/* Company Name */}
            <div className="mb-4">
              <label className="block text-[var(--text-dim)] text-xs mb-1 uppercase tracking-wider">
                Target Organization
              </label>
              <div className="flex items-center bg-black border-b border-[var(--border-color)]">
                <span className="text-[var(--matrix-green)] text-sm px-2">&gt;</span>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name..."
                  className="w-full bg-transparent text-[var(--matrix-green)] text-sm py-2 px-1 outline-none placeholder:text-[var(--text-muted)] caret-[var(--matrix-green)]"
                  autoFocus
                />
              </div>
            </div>

            {/* Industry */}
            <div className="mb-4">
              <label className="block text-[var(--text-dim)] text-xs mb-1 uppercase tracking-wider">
                Industry Sector
              </label>
              <div className="flex items-center bg-black border-b border-[var(--border-color)]">
                <span className="text-[var(--matrix-green)] text-sm px-2">&gt;</span>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., Technology, Healthcare, Finance..."
                  className="w-full bg-transparent text-[var(--matrix-green)] text-sm py-2 px-1 outline-none placeholder:text-[var(--text-muted)] caret-[var(--matrix-green)]"
                />
              </div>
            </div>

            {/* Context */}
            <div className="mb-6">
              <label className="block text-[var(--text-dim)] text-xs mb-1 uppercase tracking-wider">
                Additional Context
              </label>
              <div className="bg-black border border-[var(--border-color)] p-2">
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Provide any relevant context... recent news, market position, challenges, strategic direction..."
                  rows={5}
                  className="w-full bg-transparent text-[var(--matrix-green)] text-sm outline-none placeholder:text-[var(--text-muted)] caret-[var(--matrix-green)] resize-none"
                />
              </div>
              <p className="text-[var(--text-muted)] text-xs mt-1">
                The more context you provide, the more accurate the simulation.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!companyName.trim() || isLoading}
              className="w-full py-3 border border-[var(--matrix-green)] text-[var(--matrix-green)] text-sm tracking-wider uppercase hover:bg-[var(--matrix-green)] hover:text-black transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-glow cursor-pointer"
            >
              {isLoading ? (
                <span>
                  <span className="cursor-blink">█</span> INITIALIZING AGENTS...
                </span>
              ) : (
                '[ LAUNCH SIMULATION ]'
              )}
            </button>
          </div>

          {/* Agent info */}
          <div className="text-center text-[var(--text-muted)] text-xs space-y-1">
            <p>6 specialized AI agents will analyze your organization simultaneously</p>
            <p>Market · Financial · Geopolitical · Supply Chain · Talent · Technology</p>
          </div>
        </form>
      </div>
    </div>
  );
}
