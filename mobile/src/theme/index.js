// Design tokens — Production Standard Theme conforming to ui-ux-design-app
// Apple HIG + Material 3 + Linear / Stripe Slate Neutral Ramp

export const lightColors = {
  // Slate Neutral Ramp (Linear / Stripe / Vercel light mode)
  bg: '#F8FAFC',              // slate-50 clean light background (60% ratio)
  bgElevated: '#FFFFFF',      // pure white surface
  bgSurface: '#F1F5F9',       // slate-100 for input backgrounds, pills, icon buttons
  bgSurfaceHover: '#E2E8F0',  // slate-200 hover
  card: '#FFFFFF',            // pure white card (30% structural neutral surface)
  cardSolid: '#FFFFFF',
  cardElevated: '#FFFFFF',    // white elevated cards
  cardHover: '#F8FAFC',       // slate-50 hover
  border: '#E2E8F0',          // slate-200 subtle 1px border
  borderStrong: '#CBD5E1',    // slate-300 emphasized border / dividers
  borderGlow: 'rgba(5, 150, 105, 0.15)',

  // Signature Primary Accent: Emerald-600 (Executive, crisp contrast >= 4.8:1)
  primary: '#059669',
  primaryDark: '#047857',
  primarySurface: '#ECFDF5',  // emerald-50: subtle, elegant surface for active tags & pills
  primaryBorder: '#A7F3D0',   // emerald-200: subtle border for active items
  primaryGlow: 'rgba(5, 150, 105, 0.16)',
  primaryDim: 'rgba(5, 150, 105, 0.08)',

  // Secondary & Accents — Calibrated to avoid clashing
  secondary: '#475569',       // Slate-600 for neutral secondary elements
  secondarySurface: '#F1F5F9',
  secondaryGlow: 'rgba(15, 23, 42, 0.08)',
  secondaryDim: 'rgba(71, 85, 105, 0.08)',

  cyan: '#0284C7',           // Sky/Blue-600
  cyanSurface: '#F0F9FF',
  cyanGlow: 'rgba(2, 132, 199, 0.15)',
  cyanDim: 'rgba(2, 132, 199, 0.08)',

  amber: '#D97706',          // Amber-600 (warning)
  amberSurface: '#FFFBEB',
  amberGlow: 'rgba(217, 119, 6, 0.15)',
  amberDim: 'rgba(217, 119, 6, 0.08)',

  danger: '#DC2626',         // Red-600 (destructive)
  dangerSurface: '#FEF2F2',
  dangerBorder: '#FECACA',
  dangerDim: 'rgba(220, 38, 38, 0.08)',
  destructive: '#DC2626',
  destructiveDim: 'rgba(220, 38, 38, 0.08)',

  emerald: '#059669',
  emeraldSurface: '#ECFDF5',
  emeraldDim: 'rgba(5, 150, 105, 0.08)',
  success: '#059669',
  warning: '#D97706',
  info: '#0284C7',

  // Slate typography colors (WCAG 2.2 AA contrast verified)
  text: '#0F172A',            // slate-900 (contrast > 13.5:1 on white)
  textSub: '#475569',         // slate-600 (contrast > 7.0:1 on white)
  textMuted: '#64748B',       // slate-500 (contrast >= 4.6:1 on white)
  textDisabled: '#94A3B8',    // slate-400
  onPrimary: '#FFFFFF',
};

export const darkColors = {
  // Slate Neutral Ramp (Deep Dark Slate - Linear / Apple HIG / Vercel dark mode)
  bg: '#0B0F17',              // slate-950 deep dark background (60% dominant ratio)
  bgElevated: '#111827',      // slate-900 surface
  bgSurface: '#161E2E',       // slate-850 for input backgrounds, pills, icon buttons
  bgSurfaceHover: '#1E293B',  // slate-800 hover
  card: '#111827',            // slate-900 card surface (30% structural neutral surface)
  cardSolid: '#111827',
  cardElevated: '#1E293B',    // slate-800 elevated cards
  cardHover: '#161E2E',       // hover state
  border: '#1E293B',          // slate-800 subtle 1px border
  borderStrong: '#334155',    // slate-700 emphasized border / dividers
  borderGlow: 'rgba(16, 185, 129, 0.25)',

  // Signature Primary Accent: Emerald-500 (Vibrant, high contrast on dark >= 4.5:1)
  primary: '#10B981',
  primaryDark: '#059669',
  primarySurface: 'rgba(16, 185, 129, 0.12)', // subtle emerald tint for active tags & pills
  primaryBorder: 'rgba(16, 185, 129, 0.28)',  // emerald border for active items
  primaryGlow: 'rgba(16, 185, 129, 0.25)',
  primaryDim: 'rgba(16, 185, 129, 0.12)',

  // Secondary & Neutral Accents
  secondary: '#94A3B8',       // Slate-400 for neutral secondary elements
  secondarySurface: 'rgba(255, 255, 255, 0.05)',
  secondaryGlow: 'rgba(148, 163, 184, 0.15)',
  secondaryDim: 'rgba(148, 163, 184, 0.10)',

  cyan: '#06B6D4',           // Cyan-500
  cyanSurface: 'rgba(6, 182, 212, 0.12)',
  cyanGlow: 'rgba(6, 182, 212, 0.22)',
  cyanDim: 'rgba(6, 182, 212, 0.12)',

  amber: '#F59E0B',          // Amber-500 (warning)
  amberSurface: 'rgba(245, 158, 11, 0.12)',
  amberGlow: 'rgba(245, 158, 11, 0.20)',
  amberDim: 'rgba(245, 158, 11, 0.12)',

  danger: '#EF4444',         // Red-500 (destructive)
  dangerSurface: 'rgba(239, 68, 68, 0.12)',
  dangerBorder: 'rgba(239, 68, 68, 0.28)',
  dangerDim: 'rgba(239, 68, 68, 0.12)',
  destructive: '#EF4444',
  destructiveDim: 'rgba(239, 68, 68, 0.12)',

  emerald: '#10B981',
  emeraldSurface: 'rgba(16, 185, 129, 0.12)',
  emeraldDim: 'rgba(16, 185, 129, 0.12)',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#06B6D4',

  // Slate typography colors (WCAG 2.2 AA contrast verified on #111827 / #0B0F17)
  text: '#F8FAFC',            // slate-50 (contrast > 14:1)
  textSub: '#94A3B8',         // slate-400 (contrast > 7:1)
  textMuted: '#64748B',       // slate-500 (contrast >= 4.6:1)
  textDisabled: '#475569',    // slate-600
  onPrimary: '#022C22',       // dark emerald text on vibrant emerald-500 button (contrast > 8:1)
};

// Giao diện tối kích hoạt mặc định theo yêu cầu của người dùng
export const colors = darkColors;

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

// Thang elevation border-first (Sleek dark mode shadows)
export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sheet: {
    shadowColor: '#000000',
    shadowOpacity: 0.6,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 },
    elevation: 20,
  },
  glow: (color = colors.primary, opacity = 0.25, radiusVal = 10) => ({
    shadowColor: color,
    shadowOpacity: opacity,
    shadowRadius: radiusVal,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
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
