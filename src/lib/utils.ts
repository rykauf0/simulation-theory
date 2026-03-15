import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Maps a health value (0-1) to a hex color.
 * 0.0 = red (#ff0040), 0.5 = yellow (#ffb700), 1.0 = green (#00ff41)
 */
export function healthToColor(health: number): string {
  const h = clamp(health, 0, 1);

  let r: number, g: number, b: number;

  if (h <= 0.5) {
    // Red to Yellow (0 -> 0.5)
    const t = h / 0.5;
    r = Math.round(lerp(0xff, 0xff, t));
    g = Math.round(lerp(0x00, 0xb7, t));
    b = Math.round(lerp(0x40, 0x00, t));
  } else {
    // Yellow to Green (0.5 -> 1)
    const t = (h - 0.5) / 0.5;
    r = Math.round(lerp(0xff, 0x00, t));
    g = Math.round(lerp(0xb7, 0xff, t));
    b = Math.round(lerp(0x00, 0x41, t));
  }

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
