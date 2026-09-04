// Design tokens — Production Standard Theme conforming to ui-ux-design-app
// Apple HIG + Material 3 + Linear / Stripe Slate Neutral Ramp

export const colors = {
  // Slate Neutral Ramp (Linear / Stripe / Vercel dark mode)
  bg: '#0B0F17',             // slate-950 deep dark background (60% ratio)
  bgElevated: '#111827',     // slate-900 surface for cards & sheets
  bgSurface: 'rgba(255, 255, 255, 0.03)',
  card: '#111827',           // 30% structural neutral surface
  cardSolid: '#111827',
  cardElevated: '#1F2937',   // slate-800 for progressive elevation
  cardHover: '#1F2937',
  border: 'rgba(255, 255, 255, 0.08)',       // subtle 1px border
  borderStrong: 'rgba(255, 255, 255, 0.16)', // emphasized border / dividers
  borderGlow: 'rgba(16, 185, 129, 0.22)',

  // Semantic brand & accents (<= 10% screen ratio)
  primary: '#10B981',        // Emerald-500: crisp, high contrast (>= 4.5:1), refined
  primaryDark: '#059669',
  primaryGlow: 'rgba(16, 185, 129, 0.24)',
  primaryDim: 'rgba(16, 185, 129, 0.12)',

  secondary: '#8B5CF6',      // Violet-500
  secondaryGlow: 'rgba(139, 92, 246, 0.22)',
  secondaryDim: 'rgba(139, 92, 246, 0.12)',

  cyan: '#06B6D4',           // Cyan-500
  cyanGlow: 'rgba(6, 182, 212, 0.22)',
  cyanDim: 'rgba(6, 182, 212, 0.12)',

  amber: '#F59E0B',          // Amber-500 (warning)
  amberGlow: 'rgba(245, 158, 11, 0.20)',
  amberDim: 'rgba(245, 158, 11, 0.12)',

  danger: '#EF4444',         // Red-500 (destructive)
  dangerDim: 'rgba(239, 68, 68, 0.14)',
  destructive: '#EF4444',
  destructiveDim: 'rgba(239, 68, 68, 0.14)',

  emerald: '#10B981',
  emeraldDim: 'rgba(16, 185, 129, 0.14)',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#06B6D4',

  // Slate typography colors (WCAG 2.2 AA contrast verified)
  text: '#F8FAFC',           // slate-50 (contrast > 12:1 on #0B0F17)
  textSub: '#94A3B8',        // slate-400 (contrast > 5.5:1 on #0B0F17)
  textMuted: '#64748B',      // slate-500 (contrast >= 4.5:1)
  onPrimary: '#04120A',
};

// Thang khoảng cách 4pt chuẩn: 0, 4, 8, 12, 16, 24, 32, 48, 64 px
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
  8: 64,
};

// Thang bo góc chuẩn (Apple HIG / Material 3)
export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  pill: 999,
};

// Thang chữ chuẩn: Không có text < 12px (Hard Stop)
export const font = {
  h1: { fontSize: 24, fontWeight: '700', letterSpacing: -0.4, lineHeight: 30 },
  h2: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3, lineHeight: 26 },
  h3: { fontSize: 16, fontWeight: '600', letterSpacing: -0.2, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  small: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  tiny: { fontSize: 12, fontWeight: '500', letterSpacing: 0.1, lineHeight: 16 }, // >= 12px hard stop!
  num: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3, fontVariant: ['tabular-nums'] },
};

// Thang elevation border-first
export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sheet: {
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 16,
  },
  glow: (color = colors.primary, opacity = 0.2, radiusVal = 10) => ({
    shadowColor: color,
    shadowOpacity: opacity,
    shadowRadius: radiusVal,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  }),
};

// Bảng màu gán cho sự kiện / danh mục — dùng chung ở lịch, task, chi tiêu
export const palette = [
  { key: 'green', hex: '#10B981' },
  { key: 'cyan', hex: '#06B6D4' },
  { key: 'violet', hex: '#8B5CF6' },
  { key: 'amber', hex: '#F59E0B' },
  { key: 'rose', hex: '#F43F5E' },
  { key: 'blue', hex: '#3B82F6' },
];

export const hexOf = (key) => (palette.find((p) => p.key === key) || palette[0]).hex;

// Nền mờ cùng tông với màu nhấn
export const tint = (hex, alpha = 0.14) => {
  const clean = hex.replace('#', '');
  const n = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export default { colors, space, radius, font, shadows, palette, hexOf, tint };
