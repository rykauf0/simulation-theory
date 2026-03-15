'use client';

import { useState } from 'react';

interface EventInjectorProps {
  onInject: (event: string) => void;
  disabled?: boolean;
}

export function EventInjector({ onInject, disabled }: EventInjectorProps) {
  const [event, setEvent] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (event.trim()) {
      onInject(event.trim());
      setEvent('');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="w-full py-1.5 border border-[var(--border-color)] text-[var(--text-dim)] text-xs hover:border-[var(--amber-warning)] hover:text-[var(--amber-warning)] transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
      >
        [ INJECT EVENT ]
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        value={event}
        onChange={(e) => setEvent(e.target.value)}
        placeholder="Describe a geopolitical event, market shift, or scenario..."
        rows={3}
        className="w-full bg-black border border-[var(--amber-warning)] text-[var(--matrix-green)] text-xs p-2 outline-none placeholder:text-[var(--text-muted)] caret-[var(--matrix-green)] resize-none"
        autoFocus
      />
      <div className="flex gap-1">
        <button
          onClick={handleSubmit}
          disabled={!event.trim()}
          className="flex-1 py-1 border border-[var(--amber-warning)] text-[var(--amber-warning)] text-xs hover:bg-[var(--amber-warning)] hover:text-black transition-colors disabled:opacity-30 cursor-pointer"
        >
          INJECT
        </button>
        <button
          onClick={() => { setIsOpen(false); setEvent(''); }}
          className="px-3 py-1 border border-[var(--border-color)] text-[var(--text-dim)] text-xs hover:text-[var(--critical-red)] transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
