'use client';

import { useEffect, useRef } from 'react';
import { useSimulationStore, type LogEntry } from '@/stores/simulation-store';

const TYPE_COLORS: Record<LogEntry['type'], string> = {
  info: 'var(--cyan-info)',
  success: 'var(--matrix-green)',
  warning: 'var(--amber-warning)',
  error: 'var(--critical-red)',
  system: 'var(--text-dim)',
};

const TYPE_PREFIXES: Record<LogEntry['type'], string> = {
  info: '→',
  success: '✓',
  warning: '⚠',
  error: '✗',
  system: '■',
};

export function AgentFeed() {
  const logEntries = useSimulationStore((s) => s.logEntries);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logEntries]);

  return (
    <div className="h-full flex flex-col bg-[var(--bg-panel)]">
      {/* Header */}
      <div className="px-3 py-1.5 border-b border-[var(--border-color)] flex items-center justify-between">
        <span className="text-[var(--text-muted)] text-xs tracking-wider">
          ┌─ AGENT FEED ─┐
        </span>
        <span className="text-[var(--text-muted)] text-xs">
          {logEntries.length} entries
        </span>
      </div>

      {/* Log entries */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {logEntries.length === 0 ? (
          <div className="text-[var(--text-muted)] text-xs">
            Waiting for simulation data...
            <span className="cursor-blink ml-1">█</span>
          </div>
        ) : (
          logEntries.map((entry) => (
            <div key={entry.id} className="text-xs flex gap-2 leading-relaxed">
              <span className="text-[var(--text-muted)] shrink-0 w-[72px]">
                {formatTime(entry.timestamp)}
              </span>
              <span style={{ color: TYPE_COLORS[entry.type] }} className="shrink-0">
                {TYPE_PREFIXES[entry.type]}
              </span>
              <span
                style={{ color: TYPE_COLORS[entry.type] }}
                className={entry.type === 'system' ? '' : ''}
              >
                {entry.text}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
