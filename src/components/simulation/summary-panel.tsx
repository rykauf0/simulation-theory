'use client';

import { useSimulationStore } from '@/stores/simulation-store';

export function SummaryPanel() {
  const { summaryText, toggleSummary } = useSimulationStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-3xl max-h-[80vh] border border-[var(--border-color)] bg-[var(--bg-panel)] border-glow flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-color)]">
          <span className="text-[var(--cyan-info)] text-xs tracking-wider text-glow-cyan">
            ┌─ EXECUTIVE BRIEFING ─┐
          </span>
          <button
            onClick={toggleSummary}
            className="text-[var(--text-dim)] hover:text-[var(--critical-red)] text-xs transition-colors cursor-pointer"
          >
            [ CLOSE ]
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {summaryText ? (
            <pre className="text-[var(--matrix-green)] text-xs whitespace-pre-wrap leading-relaxed font-[inherit]">
              {summaryText}
            </pre>
          ) : (
            <div className="text-[var(--text-dim)] text-xs text-center py-8">
              <span className="cursor-blink">█</span> Generating executive briefing...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
