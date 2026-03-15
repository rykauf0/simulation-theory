'use client';

import React, { useEffect, useRef } from 'react';

const typeColors: Record<LogEntry['type'], string> = {
  info: '#00d4ff',
  success: '#00ff41',
  warning: '#ffb700',
  error: '#ff0040',
  system: '#00ff4180',
};

export interface LogEntry {
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  timestamp?: number;
}

interface TerminalLogProps {
  entries: LogEntry[];
  maxHeight?: string;
  className?: string;
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function TerminalLog({
  entries,
  maxHeight = '400px',
  className = '',
}: TerminalLogProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [entries]);

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto bg-black font-mono text-sm ${className}`}
      style={{ maxHeight }}
    >
      {entries.map((entry, i) => (
        <div key={i} className="whitespace-pre-wrap py-0.5">
          {entry.timestamp != null && (
            <span className="text-[#00ff4180]">
              [{formatTimestamp(entry.timestamp)}]{' '}
            </span>
          )}
          <span style={{ color: typeColors[entry.type] }}>
            &gt; {entry.text}
          </span>
        </div>
      ))}
    </div>
  );
}
