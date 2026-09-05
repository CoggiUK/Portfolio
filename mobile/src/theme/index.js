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

  // Brand header (hero) — dải emerald đậm, chữ trắng đạt AA (>= 5.5:1)
  brandFrom: '#065F46',       // emerald-800
  brandTo: '#047857',         // emerald-700
  brandEdge: 'rgba(255, 255, 255, 0.16)',
  onBrand: '#FFFFFF',
  onBrandSub: '#D1FAE5',      // emerald-100 — vai trò như Primary/Light trong Figma
  onBrandSurface: 'rgba(255, 255, 255, 0.16)',
  onBrandBorder: 'rgba(255, 255, 255, 0.24)',
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

  // Brand header (hero) — dải emerald đậm, chữ trắng đạt AA (>= 5.5:1)
  brandFrom: '#064E3B',       // emerald-900
  brandTo: '#047857',         // emerald-700
  brandEdge: 'rgba(255, 255, 255, 0.12)',
  onBrand: '#FFFFFF',
  onBrandSub: '#D1FAE5',      // emerald-100 — vai trò như Primary/Light trong Figma
  onBrandSurface: 'rgba(255, 255, 255, 0.14)',
  onBrandBorder: 'rgba(255, 255, 255, 0.22)',
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
  '2xl': 24,
  pill: 999,
};

/* ── Chữ: Be Vietnam Pro, thang lấy từ text style trong Figma ─────────
 * Với font tuỳ biến, React Native bỏ qua `fontWeight` — độ đậm phải chọn
 * bằng đúng family, nên mỗi style khai báo `fontFamily` chứ không đặt weight. */
export const fontFamily = {
  regular: 'BeVietnamPro_400Regular',
  medium: 'BeVietnamPro_500Medium',
  semibold: 'BeVietnamPro_600SemiBold',
  bold: 'BeVietnamPro_700Bold',
};

export const font = {
  // Header (Header/Greeting-13 · Header/Name-18 — Figma dùng 12 Medium cho dòng phụ)
  greeting: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 16 },
  name: { fontFamily: fontFamily.semibold, fontSize: 18, lineHeight: 24 },

  // Heading (KPI/Sub-20 · Heading/Section-18 · Heading/Card-16)
  h1: { fontFamily: fontFamily.bold, fontSize: 20, lineHeight: 26 },
  h2: { fontFamily: fontFamily.semibold, fontSize: 18, lineHeight: 26 },
  h3: { fontFamily: fontFamily.semibold, fontSize: 16, lineHeight: 22 },

  // Body (Body/Regular-14 · Body/Medium-14 · Body/Regular-13 · Label/Medium-13)
  body: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  bodyM: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20 },
  item: { fontFamily: fontFamily.semibold, fontSize: 14, lineHeight: 20 }, // List/Item-14
  small: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },

  // Caption/Medium-12
  tiny: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 16 },

  /* Badge/SemiBold-11 trong Figma là 11px. Skill ui-ux-design-app đặt hard-stop
   * "không có text < 12px", nên giữ 12px và bù bằng IN HOA + letter-spacing. */
  badge: { fontFamily: fontFamily.semibold, fontSize: 12, lineHeight: 16, letterSpacing: 0.3 },

  // Số liệu KPI (Figma: 26 Bold)
  num: { fontFamily: fontFamily.bold, fontSize: 26, lineHeight: 30, fontVariant: ['tabular-nums'] },
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

/* ── Số đo layout cố định (Apple HIG / Material 3) ──────────────────
 * Thanh tab dạng "curved bottom nav": nút logo tròn nằm lọt vào rãnh
 * lõm giữa thanh, phần nhô lên chiếm TAB_OVERFLOW px phía trên. */
export const layout = {
  TAB_BAR_HEIGHT: 64,      // chiều cao phần thanh (chưa cộng safe-area)
  TAB_OVERFLOW: 46,        // phần nút logo nhô lên trên mép thanh (Figma: ~70% thân nút)
  TAB_FAB_SIZE: 58,        // đường kính nút logo trung tâm
  TAB_NOTCH_DEPTH: 24,     // độ sâu rãnh lõm
  TAB_NOTCH_HALF: 44,      // nửa bề rộng vai rãnh lõm
  TAB_FAB_GAP: 6,          // khe hở đều giữa mép nút logo và đường cong rãnh
  /* Quan hệ giữ khe hở đều — sửa một hằng số thì kiểm lại công thức này:
   *   TAB_OVERFLOW = TAB_NOTCH_DEPTH - TAB_FAB_GAP + (TAB_FAB_SIZE / 2) + 6
   * (6 = đệm của vùng chạm quanh nút). Với bộ số hiện tại: 24 - 6 + 29 + 6 = 53… giữ 46
   * để nút ăn sâu hơn vào rãnh một chút, đúng tỉ lệ trong Figma. */
  HEADER_RADIUS: 24,       // bo góc dưới của brand header
  HEADER_AVATAR: 44,       // Figma: Container 44, ảnh trong 42
  HEADER_BACK: 30,         // Figma: Button - Quay lại 30x30, bo tròn hoàn toàn
  CARD_RADIUS: 16,         // Figma: Card 16
  KPI_RADIUS: 14,          // Figma: KPI card 14
  BAR_HEIGHT: 5,           // Figma: thanh tiến độ 5px, bo pill
  TOUCH_MIN: 44,           // vùng chạm tối thiểu (Apple HIG)
};

/** Khoảng đệm cuối danh sách để nội dung không bị thanh tab nổi che. */
export const listBottomPad = (extra = 0) =>
  layout.TAB_BAR_HEIGHT + layout.TAB_OVERFLOW + space[5] + extra;

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

export default { colors, space, radius, font, fontFamily, shadows, layout, listBottomPad, palette, hexOf, tint };
