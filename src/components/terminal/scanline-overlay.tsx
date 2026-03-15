'use client';

import React from 'react';

export function ScanlineOverlay() {
  return (
    <>
      {/* Scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-[9998]"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0px, rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 3px)',
        }}
      />
      {/* CRT vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
    </>
  );
}
