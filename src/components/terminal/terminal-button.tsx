'use client';

import React from 'react';

const variantStyles = {
  primary: {
    color: '#00ff41',
    borderColor: '#00ff41',
    glowColor: '#00ff41',
  },
  danger: {
    color: '#ff0040',
    borderColor: '#ff0040',
    glowColor: '#ff0040',
  },
  info: {
    color: '#00d4ff',
    borderColor: '#00d4ff',
    glowColor: '#00d4ff',
  },
} as const;

interface TerminalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'info';
}

export function TerminalButton({
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}: TerminalButtonProps) {
  const styles = variantStyles[variant];

  return (
    <button
      {...props}
      disabled={disabled}
      className={`group border bg-black px-4 py-2 font-mono text-sm uppercase tracking-wider transition-all duration-150 hover:shadow-[0_0_10px_var(--btn-glow)] disabled:opacity-40 disabled:hover:shadow-none ${className}`}
      style={
        {
          color: styles.color,
          borderColor: styles.borderColor,
          '--btn-glow': styles.glowColor,
        } as React.CSSProperties
      }
    >
      <span className="text-[#00ff4180] group-hover:text-current">[ </span>
      {children}
      <span className="text-[#00ff4180] group-hover:text-current"> ]</span>
    </button>
  );
}
