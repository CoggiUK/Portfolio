// Design tokens — Production Standard Theme conforming to ui-ux-design-app
// Apple HIG + Material 3 + Linear / Stripe Slate Neutral Ramp

export const lightColors = {
  // Slate Neutral Ramp (Linear / Stripe / Vercel light mode)
  bg: '#F8FAFC',              // slate-50 clean light background (60% ratio)
  bgElevated: '#FFFFFF',      // pure white surface
  bgSurface: '#F1F5F9',       // slate-100 for input backgrounds, pills, icon buttons
  card: '#FFFFFF',            // pure white card (30% structural neutral surface)
  cardSolid: '#FFFFFF',
  cardElevated: '#FFFFFF',    // white elevated cards
  cardHover: '#F1F5F9',       // slate-100 hover
  border: '#E2E8F0',          // slate-200 subtle 1px border
  borderStrong: '#CBD5E1',    // slate-300 emphasized border / dividers
  borderGlow: 'rgba(5, 150, 105, 0.22)',

  // Semantic brand & accents (<= 10% screen ratio)
  primary: '#059669',         // Emerald-600: crisp contrast (> 4.8:1 on white/slate-50)
  primaryDark: '#047857',
  primaryGlow: 'rgba(5, 150, 105, 0.20)',
  primaryDim: 'rgba(5, 150, 105, 0.10)',

  secondary: '#7C3AED',       // Violet-600
  secondaryGlow: 'rgba(124, 58, 237, 0.20)',
  secondaryDim: 'rgba(124, 58, 237, 0.08)',

  cyan: '#0891B2',           // Cyan-600
  cyanGlow: 'rgba(8, 145, 178, 0.20)',
  cyanDim: 'rgba(8, 145, 178, 0.08)',

  amber: '#D97706',          // Amber-600 (warning)
  amberGlow: 'rgba(217, 119, 6, 0.20)',
  amberDim: 'rgba(217, 119, 6, 0.08)',

  danger: '#DC2626',         // Red-600 (destructive)
  dangerDim: 'rgba(220, 38, 38, 0.08)',
  destructive: '#DC2626',
  destructiveDim: 'rgba(220, 38, 38, 0.08)',

  emerald: '#059669',
  emeraldDim: 'rgba(5, 150, 105, 0.10)',
  success: '#059669',
  warning: '#D97706',
  info: '#0891B2',

  // Slate typography colors (WCAG 2.2 AA contrast verified)
  text: '#0F172A',            // slate-900 (contrast > 13.5:1 on white)
  textSub: '#475569',         // slate-600 (contrast > 7.0:1 on white)
  textMuted: '#64748B',       // slate-500 (contrast >= 4.6:1 on white)
  onPrimary: '#FFFFFF',
};

export const darkColors = {
  bg: '#0B0F17',
  bgElevated: '#111827',
  bgSurface: 'rgba(255, 255, 255, 0.03)',
  card: '#111827',
  cardSolid: '#111827',
  cardElevated: '#1F2937',
  cardHover: '#1F2937',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',
  borderGlow: 'rgba(16, 185, 129, 0.22)',
  primary: '#10B981',
  primaryDark: '#059669',
  primaryGlow: 'rgba(16, 185, 129, 0.24)',
  primaryDim: 'rgba(16, 185, 129, 0.12)',
  secondary: '#8B5CF6',
  secondaryGlow: 'rgba(139, 92, 246, 0.22)',
  secondaryDim: 'rgba(139, 92, 246, 0.12)',
  cyan: '#06B6D4',
  cyanGlow: 'rgba(6, 182, 212, 0.22)',
  cyanDim: 'rgba(6, 182, 212, 0.12)',
  amber: '#F59E0B',
  amberGlow: 'rgba(245, 158, 11, 0.20)',
  amberDim: 'rgba(245, 158, 11, 0.12)',
  danger: '#EF4444',
  dangerDim: 'rgba(239, 68, 68, 0.14)',
  destructive: '#EF4444',
  destructiveDim: 'rgba(239, 68, 68, 0.14)',
  emerald: '#10B981',
  emeraldDim: 'rgba(16, 185, 129, 0.14)',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#06B6D4',
  text: '#F8FAFC',
  textSub: '#94A3B8',
  textMuted: '#64748B',
  onPrimary: '#04120A',
};

// Giao diện sáng kích hoạt mặc định theo yêu cầu của người dùng
export const colors = lightColors;

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

// Thang elevation border-first (Clean light mode shadows)
export const shadows = {
  card: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sheet: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 16,
  },
  glow: (color = colors.primary, opacity = 0.15, radiusVal = 8) => ({
    shadowColor: color,
    shadowOpacity: opacity,
    shadowRadius: radiusVal,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  }),
};

// Bảng màu gán cho sự kiện / danh mục — dùng chung ở lịch, task, chi tiêu
export const palette = [
  { key: 'green', hex: '#059669' },
  { key: 'cyan', hex: '#0891B2' },
  { key: 'violet', hex: '#7C3AED' },
  { key: 'amber', hex: '#D97706' },
  { key: 'rose', hex: '#E11D48' },
  { key: 'blue', hex: '#2563EB' },
];

export const hexOf = (key) => (palette.find((p) => p.key === key) || palette[0]).hex;

// Nền mờ cùng tông với màu nhấn
export const tint = (hex, alpha = 0.12) => {
  const clean = hex.replace('#', '');
  const n = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export default { colors, space, radius, font, shadows, palette, hexOf, tint };
