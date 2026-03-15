'use client';

import React, { forwardRef } from 'react';

type TerminalInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div className={`flex items-center gap-2 font-mono ${className}`}>
        <span className="select-none text-[#00ff41]">&gt;</span>
        <input
          ref={ref}
          {...props}
          className="w-full border-0 border-b border-[#00ff41] bg-black py-1 font-mono text-[#00ff41] caret-[#00ff41] outline-none placeholder:text-[#00ff4180]"
        />
      </div>
    );
  }
);

TerminalInput.displayName = 'TerminalInput';
