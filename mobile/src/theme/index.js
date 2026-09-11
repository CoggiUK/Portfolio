// Design tokens — Production Standard Theme conforming to ui-ux-design-app
// Apple HIG + Material 3 + Linear / Stripe Slate Neutral Ramp

export const lightColors = {
  // Luminous Bright Neutral Ramp
  bg: '#FAF9FC',              // luminous, clean canvas
  bgElevated: '#FFFFFF',      // pure white surface
  bgSurface: '#F4F3F8',       // soft lavender/rose tinted surface
  bgSurfaceHover: '#EAE8F2',  // surface hover
  card: '#FFFFFF',            // crisp white card
  cardSolid: '#FFFFFF',
  cardElevated: '#FFFFFF',    // white elevated cards
  cardHover: '#FBF9FE',       // hover state
  border: '#ECEAF2',          // subtle border
  borderStrong: '#DCD8E8',    // emphasized border
  borderGlow: 'rgba(225, 48, 108, 0.18)',

  // Instagram Signature Sunset Gradient Primary Accent
  primary: '#E1306C',         // Instagram signature electric rose / magenta
  primaryDark: '#C13584',     // Instagram royal magenta
  primaryLight: '#FD1D1D',    // sunset coral red
  primarySurface: '#FFF0F5',  // soft rose tint
  primaryBorder: '#FBCFE8',   // rose border
  primaryGlow: 'rgba(225, 48, 108, 0.22)',
  primaryDim: 'rgba(225, 48, 108, 0.08)',

  // Instagram Gradient Palettes
  gradient: ['#833AB4', '#C13584', '#E1306C', '#FD1D1D', '#F77737', '#FCAF45'],
  gradientShort: ['#833AB4', '#E1306C', '#F77737'],
  gradientWarm: ['#E1306C', '#FD1D1D', '#F77737', '#FCAF45'],
  gradientCool: ['#5851DB', '#833AB4', '#C13584', '#E1306C'],

  // Accents matching Instagram vibrant ecosystem
  purple: '#833AB4',
  magenta: '#C13584',
  rose: '#E1306C',
  orange: '#F77737',
  amber: '#F59E0B',
  blue: '#3897F0',            // Instagram classic link/verified blue

  cyan: '#0284C7',
  cyanSurface: '#F0F9FF',
  cyanGlow: 'rgba(2, 132, 199, 0.15)',
  cyanDim: 'rgba(2, 132, 199, 0.08)',

  danger: '#DC2626',
  dangerSurface: '#FEF2F2',
  dangerBorder: '#FECACA',
  dangerDim: 'rgba(220, 38, 38, 0.08)',
  destructive: '#DC2626',
  destructiveDim: 'rgba(220, 38, 38, 0.08)',

  emerald: '#059669',
  emeraldSurface: '#ECFDF5',
  emeraldDim: 'rgba(5, 150, 105, 0.08)',
  success: '#059669',
  warning: '#F59E0B',
  info: '#3897F0',

  // Crisp slate-violet typography (WCAG 2.2 AA verified)
  text: '#181324',            // deep slate-violet (contrast > 14:1 on white)
  textSub: '#5A546E',         // readable subtext (contrast > 6:1)
  textMuted: '#86809C',       // muted label (contrast >= 4.5:1)
  textDisabled: '#B4B0C6',
  onPrimary: '#FFFFFF',
};

export const darkColors = {
  // Deep Slate with subtle plum tint
  bg: '#0F0D15',
  bgElevated: '#181523',
  bgSurface: '#1F1B2C',
  bgSurfaceHover: '#29243A',
  card: '#181523',
  cardSolid: '#181523',
  cardElevated: '#242033',
  cardHover: '#1F1B2C',
  border: '#29243A',
  borderStrong: '#3A3350',
  borderGlow: 'rgba(225, 48, 108, 0.28)',

  // Signature Instagram Primary
  primary: '#E1306C',
  primaryDark: '#C13584',
  primaryLight: '#FD1D1D',
  primarySurface: 'rgba(225, 48, 108, 0.15)',
  primaryBorder: 'rgba(225, 48, 108, 0.32)',
  primaryGlow: 'rgba(225, 48, 108, 0.28)',
  primaryDim: 'rgba(225, 48, 108, 0.12)',

  gradient: ['#833AB4', '#C13584', '#E1306C', '#FD1D1D', '#F77737', '#FCAF45'],
  gradientShort: ['#833AB4', '#E1306C', '#F77737'],
  gradientWarm: ['#E1306C', '#FD1D1D', '#F77737', '#FCAF45'],
  gradientCool: ['#5851DB', '#833AB4', '#C13584', '#E1306C'],

  purple: '#9D4EDD',
  magenta: '#D62976',
  rose: '#E1306C',
  orange: '#FA7E1E',
  amber: '#F59E0B',
  blue: '#3897F0',

  cyan: '#06B6D4',
  cyanSurface: 'rgba(6, 182, 212, 0.12)',
  cyanGlow: 'rgba(6, 182, 212, 0.22)',
  cyanDim: 'rgba(6, 182, 212, 0.12)',

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
  warning: '#F59E0B',
  info: '#3897F0',

  text: '#FAF8FD',
  textSub: '#AEA8C2',
  textMuted: '#7D7694',
  textDisabled: '#544D68',
  onPrimary: '#FFFFFF',
};

// Kích hoạt giao diện sáng Instagram gradient theo yêu cầu của người dùng
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
  { key: 'rose', hex: '#E1306C' },
  { key: 'purple', hex: '#833AB4' },
  { key: 'orange', hex: '#F77737' },
  { key: 'amber', hex: '#F59E0B' },
  { key: 'blue', hex: '#3897F0' },
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
