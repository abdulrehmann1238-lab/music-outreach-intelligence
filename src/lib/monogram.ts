export interface MonogramStyle {
  bg: string;
  text: string;
  initials: string;
}

const TINT_PALETTES = [
  { bg: 'var(--primary-tint)', text: 'var(--primary)' },
  { bg: 'var(--secondary-tint)', text: 'var(--secondary)' },
  { bg: 'var(--accent-tint)', text: 'var(--accent)' },
  { bg: 'var(--success-tint)', text: 'var(--success)' },
  { bg: 'var(--warning-tint)', text: 'var(--warning)' },
  { bg: 'var(--info-tint)', text: 'var(--info)' },
];

export function getMonogram(name: string): MonogramStyle {
  // Deterministic hash based on name characters
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % TINT_PALETTES.length;
  const palette = TINT_PALETTES[index];

  // Derive two initials cleanly
  const words = name.trim().split(/\s+/);
  let initials = '';
  if (words.length >= 2) {
    initials = (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1 && words[0].length >= 2) {
    initials = words[0].substring(0, 2).toUpperCase();
  } else {
    initials = (name[0] || 'C').toUpperCase();
  }

  return {
    bg: palette.bg,
    text: palette.text,
    initials,
  };
}
