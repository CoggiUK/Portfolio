// Design tokens — bám theo `frontend/src/index.css` (Deep Obsidian Dark Mode)
// để app mobile và website là một hệ thống thị giác duy nhất.

export const colors = {
  bg: '#07070A',
  bgElevated: '#0D0D14',
  card: 'rgba(17, 17, 27, 0.72)',
  cardSolid: '#11111B',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',

  primary: '#00FF88',
  primaryGlow: 'rgba(0, 255, 136, 0.18)',
  primaryDim: 'rgba(0, 255, 136, 0.10)',
  secondary: '#8B5CF6',
  secondaryDim: 'rgba(139, 92, 246, 0.12)',
  cyan: '#00F0FF',
  cyanDim: 'rgba(0, 240, 255, 0.12)',
  amber: '#FBBF24',
  amberDim: 'rgba(251, 191, 36, 0.12)',
  danger: '#F87171',
  dangerDim: 'rgba(248, 113, 113, 0.12)',

  text: '#F3F4F6',
  textSub: '#9CA3AF',
  textMuted: '#6B7280',
  onPrimary: '#04120A',
};

// Thang 4pt — trùng với --space-* của web
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64 };

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 };

export const font = {
  h1: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6 },
  h2: { fontSize: 21, fontWeight: '700', letterSpacing: -0.3 },
  h3: { fontSize: 17, fontWeight: '700' },
  body: { fontSize: 15, fontWeight: '500' },
  small: { fontSize: 13, fontWeight: '500' },
  tiny: { fontSize: 11, fontWeight: '600', letterSpacing: 0.4 },
};

// Bảng màu gán cho sự kiện / danh mục — dùng chung ở lịch, task, chi tiêu
export const palette = [
  { key: 'green', hex: '#00FF88' },
  { key: 'cyan', hex: '#00F0FF' },
  { key: 'violet', hex: '#8B5CF6' },
  { key: 'amber', hex: '#FBBF24' },
  { key: 'rose', hex: '#FB7185' },
  { key: 'blue', hex: '#60A5FA' },
];

export const hexOf = (key) => (palette.find((p) => p.key === key) || palette[0]).hex;

// Nền mờ cùng tông với màu nhấn (RN không có color-mix)
export const tint = (hex, alpha = 0.14) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export default { colors, space, radius, font, palette, hexOf, tint };
