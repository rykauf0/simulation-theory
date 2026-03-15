'use client';

import React from 'react';

interface TerminalPanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function TerminalPanel({ title, children, className = '' }: TerminalPanelProps) {
  return (
    <div
      className={`relative border border-[#00ff41] bg-black font-mono text-[#00ff41] ${className}`}
    >
      {title && (
        <div className="flex items-center border-b border-[#00ff41] px-3 py-1">
          <span className="text-xs tracking-widest text-[#00ff4180]">
            ┤
          </span>
          <span className="mx-2 text-sm font-bold uppercase tracking-wider">
            {title}
          </span>
          <span className="text-xs tracking-widest text-[#00ff4180]">
            ├
          </span>
          <span className="ml-2 flex-1 overflow-hidden text-xs text-[#00ff4180]">
            {'─'.repeat(120)}
          </span>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
