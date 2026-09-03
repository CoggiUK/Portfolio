// Design tokens — Cyber-Obsidian Glassmorphism Theme
// Đồng bộ chặt chẽ với nhận diện thương hiệu của Portfolio (Deep Obsidian Dark Mode)

export const colors = {
  bg: '#08080C',
  bgElevated: '#0F0F18',
  bgSurface: 'rgba(255, 255, 255, 0.03)',
  card: 'rgba(18, 18, 29, 0.78)',
  cardSolid: '#131320',
  cardHover: 'rgba(26, 26, 42, 0.88)',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',
  borderGlow: 'rgba(0, 255, 136, 0.25)',

  primary: '#00FF88',
  primaryDark: '#00CC6A',
  primaryGlow: 'rgba(0, 255, 136, 0.28)',
  primaryDim: 'rgba(0, 255, 136, 0.12)',

  secondary: '#8B5CF6',
  secondaryGlow: 'rgba(139, 92, 246, 0.25)',
  secondaryDim: 'rgba(139, 92, 246, 0.12)',

  cyan: '#00F0FF',
  cyanGlow: 'rgba(0, 240, 255, 0.25)',
  cyanDim: 'rgba(0, 240, 255, 0.12)',

  amber: '#FBBF24',
  amberGlow: 'rgba(251, 191, 36, 0.22)',
  amberDim: 'rgba(251, 191, 36, 0.12)',

  danger: '#F87171',
  dangerDim: 'rgba(248, 113, 113, 0.14)',

  emerald: '#10B981',
  emeraldDim: 'rgba(16, 185, 129, 0.14)',

  text: '#F9FAFB',
  textSub: '#9CA3AF',
  textMuted: '#6B7280',
  onPrimary: '#04120A',
};

// Thang khoảng cách 4pt — đồng bộ với --space-*
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64 };

export const radius = { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 };

export const font = {
  h1: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, lineHeight: 32 },
  h2: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3, lineHeight: 26 },
  h3: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '500', lineHeight: 22 },
  small: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  tiny: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3, lineHeight: 15 },
  num: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
};

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  glow: (color = colors.primary, opacity = 0.35, radiusVal = 14) => ({
    shadowColor: color,
    shadowOpacity: opacity,
    shadowRadius: radiusVal,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  }),
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

// Nền mờ cùng tông với màu nhấn
export const tint = (hex, alpha = 0.14) => {
  const clean = hex.replace('#', '');
  const n = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export default { colors, space, radius, font, shadows, palette, hexOf, tint };
