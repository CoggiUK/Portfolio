// Design tokens — Production Standard Theme conforming to ui-ux-design-app
// Apple HIG + Material 3 + Linear / Stripe Slate Neutral Ramp

export const lightColors = {
  // Luminous Clean Canvas
  bg: '#F6F9FD',              // clean high-tech ice-white canvas
  bgElevated: '#FFFFFF',      // pure white surface
  bgSurface: '#EDF3FA',       // subtle ice-blue tinted surface
  bgSurfaceHover: '#E2ECF7',  // surface hover
  card: '#FFFFFF',            // crisp white card
  cardSolid: '#FFFFFF',
  cardElevated: '#FFFFFF',    // white elevated cards
  cardHover: '#F8FAFE',       // hover state
  border: '#E2ECF7',          // subtle ice-blue border
  borderStrong: '#CADDF0',    // emphasized border
  borderGlow: 'rgba(0, 132, 255, 0.20)',

  // Signature Primary Accent: Electric Cyber Blue (From Logo Nguyễn Tùng Lâm & ViVa Coggi)
  primary: '#0084FF',         // Electric Blue from logo
  primaryDark: '#0058CC',     // Deep Royal Blue
  primaryLight: '#00C2FF',    // Neon Cyan
  primarySurface: '#EDF6FF',  // soft ice blue surface
  primaryBorder: '#BAE0FF',   // ice blue border
  primaryGlow: 'rgba(0, 132, 255, 0.28)',
  primaryDim: 'rgba(0, 132, 255, 0.08)',

  // Logo Signature Gradient Palettes (Electric Blue to Cyber Cyan & Yellow Accent)
  gradient: ['#0052D4', '#0072FF', '#00C6FF'],
  gradientShort: ['#0062FF', '#0099FF', '#00D2FF'],
  gradientAccent: ['#0072FF', '#FFD000'],
  gradientCool: ['#0A1128', '#0052D4', '#00C6FF'],

  // Accents matching Logo Ecosystem
  blue: '#0084FF',            // Electric Blue
  cyan: '#00C2FF',            // Neon Cyan (Turn ideas into reality)
  yellow: '#FFD000',          // Crown & Sticky note Yellow
  amber: '#F59E0B',           // Warm amber
  purple: '#6366F1',          // Indigo purple
  rose: '#F43F5E',

  cyanSurface: '#F0F9FF',
  cyanGlow: 'rgba(0, 194, 255, 0.22)',
  cyanDim: 'rgba(0, 194, 255, 0.08)',

  danger: '#DC2626',
  dangerSurface: '#FEF2F2',
  dangerBorder: '#FECACA',
  dangerDim: 'rgba(220, 38, 38, 0.08)',
  destructive: '#DC2626',
  destructiveDim: 'rgba(220, 38, 38, 0.08)',

  emerald: '#10B981',
  emeraldSurface: '#ECFDF5',
  emeraldDim: 'rgba(16, 185, 129, 0.08)',
  success: '#10B981',
  warning: '#FFD000',
  info: '#0084FF',

  // Crisp midnight slate typography (WCAG 2.2 AA verified)
  text: '#0A1128',            // deep midnight slate (contrast > 15:1 on white)
  textSub: '#475569',         // readable subtext (contrast > 7:1)
  textMuted: '#64748B',       // muted label (contrast >= 4.5:1)
  textDisabled: '#94A3B8',
  onPrimary: '#FFFFFF',
};

export const darkColors = {
  // Deep Cyber Midnight Slate
  bg: '#080C16',
  bgElevated: '#0F1626',
  bgSurface: '#162035',
  bgSurfaceHover: '#1E2B47',
  card: '#0F1626',
  cardSolid: '#0F1626',
  cardElevated: '#162035',
  cardHover: '#141D30',
  border: '#1A2740',
  borderStrong: '#253759',
  borderGlow: 'rgba(0, 132, 255, 0.32)',

  // Signature Logo Primary
  primary: '#0084FF',
  primaryDark: '#0058CC',
  primaryLight: '#00C2FF',
  primarySurface: 'rgba(0, 132, 255, 0.16)',
  primaryBorder: 'rgba(0, 132, 255, 0.35)',
  primaryGlow: 'rgba(0, 132, 255, 0.32)',
  primaryDim: 'rgba(0, 132, 255, 0.12)',

  gradient: ['#0052D4', '#0072FF', '#00C6FF'],
  gradientShort: ['#0062FF', '#0099FF', '#00D2FF'],
  gradientAccent: ['#0072FF', '#FFD000'],
  gradientCool: ['#0A1128', '#0052D4', '#00C6FF'],

  blue: '#0084FF',
  cyan: '#00C2FF',
  yellow: '#FFD000',
  amber: '#F59E0B',
  purple: '#818CF8',
  rose: '#F43F5E',

  cyanSurface: 'rgba(0, 194, 255, 0.15)',
  cyanGlow: 'rgba(0, 194, 255, 0.25)',
  cyanDim: 'rgba(0, 194, 255, 0.12)',

  danger: '#EF4444',
  dangerSurface: 'rgba(239, 68, 68, 0.12)',
  dangerBorder: 'rgba(239, 68, 68, 0.28)',
  dangerDim: 'rgba(239, 68, 68, 0.12)',
  destructive: '#EF4444',
  destructiveDim: 'rgba(239, 68, 68, 0.12)',

  emerald: '#10B981',
  emeraldSurface: 'rgba(16, 185, 129, 0.12)',
  emeraldDim: 'rgba(16, 185, 129, 0.12)',
  success: '#10B981',
  warning: '#FFD000',
  info: '#0084FF',

  text: '#F8FAFC',
  textSub: '#94A3B8',
  textMuted: '#64748B',
  textDisabled: '#475569',
  onPrimary: '#FFFFFF',
};

// Kích hoạt giao diện sáng chuẩn theo tông màu logo Nguyễn Tùng Lâm & ViVa Coggi
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
  { key: 'blue', hex: '#0084FF' },
  { key: 'cyan', hex: '#00C2FF' },
  { key: 'yellow', hex: '#FFD000' },
  { key: 'purple', hex: '#6366F1' },
  { key: 'amber', hex: '#F59E0B' },
  { key: 'green', hex: '#10B981' },
];

export const hexOf = (key) => (palette.find((p) => p.key === key) || palette[0]).hex;

// Nền mờ cùng tông với màu nhấn
export const tint = (hex, alpha = 0.12) => {
  const clean = hex.replace('#', '');
  const n = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export default { colors, space, radius, font, shadows, palette, hexOf, tint };
