import React from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, ScrollView, Modal, Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { colors, space, radius, font, fontFamily, shadows, layout, tint } from '../theme';

const LOGO_MARK = require('../../assets/logo-mark.png');

/* ── Khung màn hình ─────────────────────────────────────────────── */

export function Screen({ children, scroll = false, style, edges = ['top'], refreshControl }) {
  const Body = scroll ? ScrollView : View;
  const extra = scroll
    ? {
        contentContainerStyle: [{ padding: space[4], paddingBottom: space[8] }, style],
        refreshControl,
        showsVerticalScrollIndicator: false,
        keyboardShouldPersistTaps: 'handled',
      }
    : { style: [{ flex: 1 }, style] };
  return (
    <SafeAreaView style={s.screen} edges={edges}>
      <Body {...extra}>{children}</Body>
    </SafeAreaView>
  );
}

export function Header({ title, subtitle, right, onBack, badge }) {
  return (
    <View style={s.header}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={12}
          style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7, transform: [{ scale: 0.94 }] }]}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>
      ) : null}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[2] }}>
          <Text
            style={[font.h1, { color: colors.text, flexShrink: 1 }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {title}
          </Text>
          {badge ? <Badge label={badge} color={colors.primary} /> : null}
        </View>
        {subtitle ? <Text style={[font.small, { color: colors.textSub, marginTop: 2 }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

/* ── Brand header (hero) ────────────────────────────────────────────
 * Dải màu thương hiệu bo góc dưới, dùng chung cho 5 màn tab.
 *  · Chế độ hồ sơ  : truyền `greeting` + `name` (màn Trang chủ)
 *  · Chế độ tiêu đề: truyền `title` + `subtitle` (các tab còn lại)
 * Toàn bộ chữ/nút trên nền brand dùng token `onBrand*` để giữ contrast AA. */

export function BrandIconBtn({ icon, onPress, label, dot, count, tone = 'onBrand' }) {
  const fg = tone === 'onBrand' ? colors.onBrand : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={count ? `${label || icon} (${count} mới)` : label || icon}
      hitSlop={8}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [s.brandIconBtn, pressed && { opacity: 0.6 }]}
    >
      <Ionicons name={icon} size={20} color={fg} />
      {dot || count ? <View style={s.brandDot} /> : null}
    </Pressable>
  );
}

export function BrandHeader({
  greeting,
  name,
  meta,
  title,
  subtitle,
  avatarUri,
  icon,
  badge,
  actions = [],
  onAvatarPress,
  children,
  style,
}) {
  const insets = useSafeAreaInsets();
  const profileMode = !!greeting || !!name;

  const avatar = (
    <View style={s.brandAvatar}>
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={s.brandAvatarImg} resizeMode="cover" />
      ) : (
        <Image source={LOGO_MARK} style={s.brandAvatarLogo} resizeMode="contain" />
      )}
    </View>
  );

  return (
    <View style={[s.brandHeader, { paddingTop: insets.top + space[1] }, style]}>
      <View style={s.brandRow}>
        {profileMode || icon ? (
          onAvatarPress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mở hồ sơ và cài đặt"
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                onAvatarPress();
              }}
              style={({ pressed }) => [pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }]}
            >
              {avatar}
            </Pressable>
          ) : profileMode ? (
            avatar
          ) : (
            <View style={s.brandLeadIcon}>
              <Ionicons name={icon} size={20} color={colors.onBrand} />
            </View>
          )
        ) : null}

        <View style={{ flex: 1, minWidth: 0 }}>
          {profileMode ? (
            <>
              <Text style={[font.greeting, { color: colors.onBrandSub }]} numberOfLines={1}>
                {greeting}
              </Text>
              <Text style={[font.name, { color: colors.onBrand, marginTop: 2 }]} numberOfLines={1}>
                {name}
              </Text>
              {meta ? (
                <Text style={[font.greeting, { color: colors.onBrandSub, marginTop: 2 }]} numberOfLines={1}>
                  {meta}
                </Text>
              ) : null}
            </>
          ) : (
            <>
              <Text style={[font.name, { color: colors.onBrand }]} numberOfLines={1}>
                {title}
              </Text>
              {badge || subtitle ? (
                <View style={s.brandSubRow}>
                  {badge ? (
                    <View style={s.brandBadge}>
                      <Text style={[font.badge, { color: colors.onBrand }]}>{badge}</Text>
                    </View>
                  ) : null}
                  {subtitle ? (
                    <Text
                      style={[font.greeting, { color: colors.onBrandSub, flexShrink: 1 }]}
                      numberOfLines={1}
                    >
                      {subtitle}
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </>
          )}
        </View>

        {actions.length ? (
          <View style={s.brandActions}>
            {actions.map((a) => (
              <BrandIconBtn key={a.label || a.icon} {...a} />
            ))}
          </View>
        ) : null}
      </View>

      {children ? <View style={{ marginTop: space[3] }}>{children}</View> : null}
    </View>
  );
}

/** Header màn chi tiết: nút quay lại tròn 30px (Figma) + tiêu đề 2 cấp. */
export function DetailHeader({ title, subtitle, onBack, right, style }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.brandHeader, { paddingTop: insets.top + space[3], paddingBottom: space[3] }, style]}>
      <View style={s.brandRow}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            hitSlop={14}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onBack();
            }}
            style={({ pressed }) => [s.brandBackBtn, pressed && { opacity: 0.7, transform: [{ scale: 0.94 }] }]}
          >
            <Ionicons name="chevron-back" size={18} color={colors.text} />
          </Pressable>
        ) : null}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[font.name, { color: colors.onBrand }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[font.small, { color: colors.onBrandSub, marginTop: 2 }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right}
      </View>
    </View>
  );
}

export const SectionTitle = ({ children, right, style }) => (
  <View style={[s.sectionTitle, style]}>
    <Text style={[font.badge, { color: colors.textMuted, textTransform: 'uppercase' }]}>
      {children}
    </Text>
    {right}
  </View>
);

/* ── Thẻ kính mờ (Glass Card) ───────────────────────────────────── */

export function Card({ children, style, onPress, accent, glow }) {
  // Style phải nằm trên chính phần tử nhận sự kiện chạm, nếu không `flex`/
  // `minWidth` truyền vào sẽ bị Pressable bọc ngoài nuốt mất và thẻ tràn khung.
  const box = [
    s.card,
    accent ? { borderLeftWidth: 3, borderLeftColor: accent } : null,
    glow && accent ? shadows.glow(accent, 0.15, 12) : shadows.card,
    style,
  ];

  if (!onPress) return <View style={box}>{children}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [box, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}
    >
      {children}
    </Pressable>
  );
}

/* ── Thẻ thống kê (Stat Card — Đồng bộ chuẩn Neutral Card) ──────── */

export function StatCard({ label, value, icon, color = colors.primary, sub, progress, onPress }) {
  const isPos = sub && (sub.startsWith('+') || sub.toLowerCase().includes('dương'));
  const isNeg = sub && (sub.startsWith('-') || sub.toLowerCase().includes('âm'));
  const subColor = isPos ? colors.primary : isNeg ? colors.danger : colors.textMuted;

  const content = (
    <View style={s.statCard}>
      <View style={s.statCardHead}>
        <Text style={[font.item, { color: colors.text, flex: 1, minWidth: 0 }]} numberOfLines={1}>
          {label}
        </Text>
        {icon ? <Ionicons name={icon} size={16} color={color} /> : null}
      </View>

      <View style={s.statCardValueRow}>
        <Text
          style={[font.num, { color, flexShrink: 1 }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
        >
          {value}
        </Text>
        {sub ? (
          <Text style={[font.label, { color: subColor, flexShrink: 1 }]} numberOfLines={1}>
            {sub}
          </Text>
        ) : null}
      </View>

      {typeof progress === 'number' ? <Progress value={progress} color={color} /> : null}
    </View>
  );

  if (!onPress) return <View style={{ flex: 1 }}>{content}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [{ flex: 1 }, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
    >
      {content}
    </Pressable>
  );
}

/** Thanh tiến độ 5px bo pill — Figma dùng chung ở KPI và card thông tin. */
export function Progress({ value = 0, color = colors.primary, style }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
      style={[s.progressTrack, style]}
    >
      <View style={[s.progressFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

/** Hàng nhãn-trái / giá-trị-phải. Thiếu dữ liệu hiện "—" thay vì để trống. */
export function InfoRow({ label, value, color = colors.text, onPress, icon }) {
  const empty = value === undefined || value === null || value === '';
  const body = (
    <View style={s.infoRow}>
      <Text style={[font.body, { color: colors.textMuted, flexShrink: 1 }]} numberOfLines={1}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[1], flexShrink: 1 }}>
        <Text
          style={[font.bodyM, { color: empty ? colors.textDisabled : color, textAlign: 'right' }]}
          numberOfLines={1}
        >
          {empty ? '—' : value}
        </Text>
        {icon && !empty ? <Ionicons name={icon} size={15} color={color} /> : null}
      </View>
    </View>
  );
  if (!onPress || empty) return body;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
      {body}
    </Pressable>
  );
}

/* ── Nút (Buttons) ─────────────────────────────────────────────── */

export function Btn({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading,
  loadingTitle,
  disabled,
  style,
  small,
  ...props
}) {
  const v = {
    primary: {
      bg: colors.primary,
      fg: colors.onPrimary,
      border: 'transparent',
      glow: shadows.glow(colors.primary, 0.2, 10),
    },
    secondary: {
      bg: colors.cardElevated,
      fg: colors.text,
      border: colors.borderStrong,
      glow: null,
    },
    outline: {
      bg: 'transparent',
      fg: colors.text,
      border: colors.borderStrong,
      glow: null,
    },
    ghost: {
      bg: 'transparent',
      fg: colors.textSub,
      border: 'transparent',
      glow: null,
    },
    danger: {
      bg: colors.dangerDim,
      fg: colors.danger,
      border: tint(colors.danger, 0.35),
      glow: null,
    },
    cyan: {
      bg: colors.cyan,
      fg: colors.onPrimary,
      border: 'transparent',
      glow: shadows.glow(colors.cyan, 0.2, 10),
    },
  }[variant] || {
    bg: colors.primary,
    fg: colors.onPrimary,
    border: 'transparent',
    glow: null,
  };

  const off = disabled || loading;
  const displayTitle = loading
    ? loadingTitle || (title?.startsWith('Lưu') ? 'Đang lưu…' : title?.startsWith('Tạo') ? 'Đang tạo…' : 'Đang xử lý…')
    : title;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!off, busy: !!loading }}
      hitSlop={small ? 6 : 4}
      onPress={() => {
        if (off) return;
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [
        s.btn,
        small && s.btnSmall,
        { backgroundColor: v.bg, borderColor: v.border },
        v.glow,
        off && { opacity: 0.5 },
        pressed && !off && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.fg} style={{ marginRight: space[1] }} />
      ) : icon ? (
        <Ionicons name={icon} size={small ? 14 : 17} color={v.fg} />
      ) : null}
      <Text style={[small ? font.label : font.item, { color: v.fg }]}>{displayTitle}</Text>
    </Pressable>
  );
}

export const IconBtn = ({
  icon,
  onPress,
  color = colors.textSub,
  size = 20,
  style,
  hitSlop = 8,
  label,
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label || icon}
    hitSlop={hitSlop}
    onPress={() => {
      Haptics.selectionAsync().catch(() => {});
      onPress?.();
    }}
    style={({ pressed }) => [
      s.iconBtn,
      pressed && { opacity: 0.6, transform: [{ scale: 0.94 }] },
      style,
    ]}
  >
    <Ionicons name={icon} size={size} color={color} />
  </Pressable>
);

export function FAB({ onPress, icon = 'add' }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [
        s.fab,
        shadows.glow(colors.primary, 0.35, 14),
        pressed && { transform: [{ scale: 0.94 }] },
      ]}
    >
      <Ionicons name={icon} size={26} color={colors.onPrimary} />
    </Pressable>
  );
}

/* ── Nhập liệu (Field Anatomy: Label top, helper text, error state) ── */

export function Field({
  label,
  hint,
  error,
  required,
  style,
  multiline,
  inputStyle,
  ...props
}) {
  return (
    <View style={[{ marginBottom: space[4] }, style]}>
      {label ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: space[1] + 2 }}>
          <Text style={[font.small, { color: colors.textSub, fontFamily: fontFamily.medium }]}>{label}</Text>
          {required ? <Text style={{ color: colors.danger, marginLeft: 3 }}>*</Text> : null}
        </View>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          s.input,
          error && { borderColor: colors.danger },
          multiline && { minHeight: 100, textAlignVertical: 'top', paddingTop: space[3] },
          inputStyle,
        ]}
        multiline={multiline}
        {...props}
      />
      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: space[1] }}>
          <Ionicons name="alert-circle" size={14} color={colors.danger} />
          <Text style={[font.tiny, { color: colors.danger }]}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={[font.tiny, { color: colors.textMuted, marginTop: space[1] }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

export function Chip({ label, active, onPress, color = colors.primary, icon, count }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [
        s.chip,
        active
          ? { backgroundColor: color, borderColor: color }
          : { backgroundColor: colors.card, borderColor: colors.border },
        pressed && { opacity: 0.8 },
      ]}
    >
      {icon ? <Ionicons name={icon} size={14} color={active ? colors.onPrimary : colors.textMuted} /> : null}
      <Text
        style={[active ? font.item : font.label, { color: active ? colors.onPrimary : colors.textSub }]}
      >
        {label}
      </Text>
      {count !== undefined ? (
        <View
          style={[
            s.chipCount,
            { backgroundColor: active ? 'rgba(255,255,255,0.25)' : colors.bgSurface },
          ]}
        >
          <Text
            style={[
              font.tiny,
              { color: active ? colors.onPrimary : colors.textMuted, fontFamily: fontFamily.bold },
            ]}
          >
            {count}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

/**
 * Segmented dạng "tab khoét vai" — hình đặc trưng trong design system:
 * track màu thương hiệu, mục đang chọn là mảng nền card cắt vào track bằng
 * đường cong chữ S ở hai bên (rộng dần xuống đáy) thay vì cạnh dọc thẳng.
 */
/**
 * Segmented dạng "tab khoét vai" — hình đặc trưng trong design system:
 * track màu thương hiệu, mục đang chọn là mảng nền card cắt vào track bằng
 * đường cong chữ S, rộng dần lên phía trên (giống tab hồ sơ giấy).
 *
 * Hình vẽ trong hệ toạ độ chuẩn hoá (UNIT đơn vị cho mỗi mục) rồi để
 * `preserveAspectRatio="none"` kéo giãn — nhờ vậy vai khoét luôn khớp đúng
 * ranh giới các ô `flex: 1` mà không phụ thuộc phép đo bề rộng.
 */
const SEG_UNIT = 100;
const SEG_H = 40;
const SEG_SLANT = 14;

function segPath(index, count) {
  const first = index === 0;
  const last = index === count - 1;
  const x0 = index * SEG_UNIT;
  const x1 = x0 + SEG_UNIT;
  const h = SEG_H;
  const k = SEG_SLANT / 2;

  // Mục đang chọn rộng hơn ở mép trên, thu lại ở mép dưới.
  const topLeft = first ? 0 : x0 - k;
  const botLeft = first ? 0 : x0 + k;
  const topRight = last ? count * SEG_UNIT : x1 + k;
  const botRight = last ? count * SEG_UNIT : x1 - k;

  return (
    `M${topLeft},0 H${topRight} ` +
    (last ? `V${h} ` : `C${topRight - k},0 ${botRight + k},${h} ${botRight},${h} `) +
    `H${botLeft} ` +
    (first ? 'V0 ' : `C${botLeft - k},${h} ${topLeft + k},0 ${topLeft},0 `) +
    'Z'
  );
}

export function Segmented({ items, value, onChange }) {
  const n = items.length;
  const idx = Math.max(0, items.findIndex((it) => it.value === value));

  return (
    <View style={s.segmented}>
      <Svg
        width="100%"
        height={SEG_H}
        viewBox={`0 0 ${n * SEG_UNIT} ${SEG_H}`}
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}
      >
        <Path d={segPath(idx, n)} fill={colors.card} />
      </Svg>
      {items.map((it) => {
        const active = it.value === value;
        return (
          <Pressable
            key={it.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={it.label}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onChange(it.value);
            }}
            style={s.segItem}
          >
            <Text
              numberOfLines={1}
              style={[active ? font.item : font.label, { color: active ? colors.primary : colors.onBrand }]}
            >
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function SwitchRow({ label, hint, value, onChange, icon, color = colors.primary }) {
  return (
    <Pressable onPress={() => onChange(!value)} style={s.switchRow}>
      {icon ? (
        <View style={[s.switchIcon, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}>
          <Ionicons name={icon} size={17} color={color} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={[font.body, { color: colors.text }]}>{label}</Text>
        {hint ? <Text style={[font.tiny, { color: colors.textMuted, marginTop: 2 }]}>{hint}</Text> : null}
      </View>
      <View style={[s.track, value && { backgroundColor: tint(color, 0.35) }]}>
        <View style={[s.knob, value && { backgroundColor: color, alignSelf: 'flex-end' }]} />
      </View>
    </Pressable>
  );
}

export const Row = ({ children, style, gap = space[2] }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>
);

export function Badge({ label, color = colors.primary, dot = false }) {
  const isPrimary = color === colors.primary;
  const isDanger = color === colors.danger || color === colors.destructive;
  const isWarning = color === colors.warning;
  const bg = isPrimary
    ? colors.primarySurface
    : isDanger
    ? colors.dangerSurface
    : isWarning
    ? colors.amberSurface
    : colors.bgSurface;
  const bc = isPrimary
    ? colors.primaryBorder
    : isDanger
    ? colors.dangerBorder
    : isWarning
    ? colors.amberSurface
    : colors.border;
  const fg = isPrimary
    ? colors.primary
    : isDanger
    ? colors.danger
    : isWarning
    ? colors.warning
    : colors.textSub;

  return (
    <View style={[s.badge, { backgroundColor: bg, borderColor: bc }]}>
      {dot ? <View style={[s.badgeDot, { backgroundColor: fg }]} /> : null}
      <Text style={[font.badge, { color: fg }]}>{label}</Text>
    </View>
  );
}

export function Empty({ icon = 'sparkles-outline', title, hint, action }) {
  return (
    <View style={s.empty}>
      <View style={s.emptyIcon}>
        <Ionicons name={icon} size={28} color={colors.textMuted} />
      </View>
      <Text style={[font.h3, { color: colors.textSub, textAlign: 'center' }]}>{title}</Text>
      {hint ? (
        <Text style={[font.small, { color: colors.textMuted, textAlign: 'center', marginTop: space[2], maxWidth: 300 }]}>
          {hint}
        </Text>
      ) : null}
      {action ? <View style={{ marginTop: space[4] }}>{action}</View> : null}
    </View>
  );
}

export const Loading = ({ label = 'Đang tải…' }) => (
  <View style={s.empty}>
    <ActivityIndicator color={colors.primary} size="large" />
    <Text style={[font.small, { color: colors.textMuted, marginTop: space[3] }]}>{label}</Text>
  </View>
);

export function Skeleton({ width = '100%', height = 20, style, radiusVal = radius.sm }) {
  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: colors.bgSurface,
          borderRadius: radiusVal,
        },
        style,
      ]}
    />
  );
}

export function Banner({ type = 'info', message, onClose }) {
  if (!message) return null;
  const c = { info: colors.cyan, success: colors.primary, error: colors.danger }[type] || colors.cyan;
  return (
    <View style={[s.banner, { backgroundColor: tint(c, 0.12), borderColor: tint(c, 0.35) }]}>
      <Ionicons
        name={type === 'error' ? 'alert-circle' : type === 'success' ? 'checkmark-circle' : 'information-circle'}
        size={18}
        color={c}
      />
      <Text style={[font.small, { color: c, flex: 1, fontFamily: fontFamily.medium }]}>{message}</Text>
      {onClose ? <IconBtn icon="close" size={16} color={c} onPress={onClose} label="Đóng" /> : null}
    </View>
  );
}

/** Bottom sheet mượt mà dùng cho form nhanh (Chuẩn Apple HIG / Material 3) */
export function Sheet({ visible, onClose, title, children }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.sheetBackdrop} onPress={onClose} />
      <View style={s.sheet}>
        <View style={s.sheetGrip} />
        <View style={s.sheetHead}>
          <Text style={[font.h2, { color: colors.text, flex: 1 }]}>{title}</Text>
          <IconBtn icon="close" onPress={onClose} size={20} label="Đóng sheet" />
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: space[6] }}>
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  brandHeader: {
    backgroundColor: colors.brandTo,
    paddingHorizontal: space[4],
    paddingBottom: space[5],
    borderBottomLeftRadius: layout.HEADER_RADIUS,
    borderBottomRightRadius: layout.HEADER_RADIUS,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  brandAvatar: {
    width: layout.HEADER_AVATAR, height: layout.HEADER_AVATAR,
    borderRadius: radius.pill, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.onBrandBorder,
  },
  brandAvatarImg: { width: '100%', height: '100%' },
  brandAvatarLogo: { width: 30, height: 30 },
  brandLeadIcon: {
    width: layout.HEADER_AVATAR, height: layout.HEADER_AVATAR, borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.onBrandSurface, borderWidth: 1, borderColor: colors.onBrandBorder,
  },
  brandActions: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  brandSubRow: { flexDirection: 'row', alignItems: 'center', gap: space[2], marginTop: 3 },
  brandIconBtn: {
    width: layout.TOUCH_MIN, height: layout.TOUCH_MIN,
    alignItems: 'center', justifyContent: 'center',
  },
  brandDot: {
    position: 'absolute', top: 10, right: 10,
    width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger,
  },
  brandBackBtn: {
    width: layout.HEADER_BACK, height: layout.HEADER_BACK, borderRadius: radius.pill,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.bgElevated,
  },
  brandBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill,
    backgroundColor: colors.onBrandSurface,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: space[3],
    paddingHorizontal: space[4], paddingTop: space[3], paddingBottom: space[3],
  },
  backBtn: {
    width: 44, height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border,
  },
  sectionTitle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: space[5], marginBottom: space[3],
  },
  card: {
    backgroundColor: colors.card, borderRadius: layout.CARD_RADIUS, borderWidth: 1,
    borderColor: colors.border, paddingVertical: space[3], paddingHorizontal: space[4],
  },
  statCard: {
    backgroundColor: colors.card, borderRadius: layout.KPI_RADIUS, borderWidth: 1,
    borderColor: colors.border, padding: space[3], minHeight: 84, gap: space[1] + 2,
  },
  statCardHead: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  statCardValueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space[1] + 2 },
  progressTrack: {
    height: layout.BAR_HEIGHT, borderRadius: radius.pill,
    backgroundColor: colors.bgSurface, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: radius.pill },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    gap: space[3], minHeight: 32,
  },
  btn: {
    minHeight: 44,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space[2],
    paddingVertical: space[2] + 2, paddingHorizontal: space[4],
    borderRadius: radius.md, borderWidth: 1,
  },
  btnSmall: {
    minHeight: 36,
    paddingVertical: space[1] + 2,
    paddingHorizontal: space[3],
    borderRadius: radius.sm,
  },
  iconBtn: {
    minWidth: 44, minHeight: 44, borderRadius: radius.pill,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border,
  },
  fab: {
    position: 'absolute', right: space[4], bottom: space[5],
    width: 56, height: 56, borderRadius: radius.pill, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  input: {
    minHeight: 44,
    backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, paddingHorizontal: space[3], paddingVertical: space[2] + 2,
    color: colors.text, fontFamily: fontFamily.regular, fontSize: 14,
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: space[1] + 2,
    minHeight: 34, paddingHorizontal: 10, paddingVertical: space[1] + 2,
    borderRadius: radius.pill, borderWidth: 1,
  },
  chipCount: {
    paddingHorizontal: 5, paddingVertical: 1, borderRadius: radius.pill, marginLeft: 2,
  },
  segmented: {
    flexDirection: 'row', height: 40, borderRadius: radius.md,
    backgroundColor: colors.brandTo, overflow: 'hidden',
  },
  segItem: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: space[1],
  },
  switchRow: {
    flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3],
  },
  switchIcon: { width: 34, height: 34, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  track: {
    width: 46, height: 26, borderRadius: radius.pill, padding: 3,
    backgroundColor: colors.borderStrong, justifyContent: 'center',
  },
  knob: { width: 20, height: 20, borderRadius: radius.pill, backgroundColor: colors.card },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 0,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, borderWidth: 1,
    minHeight: 24,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: space[7], paddingHorizontal: space[5] },
  emptyIcon: {
    width: 56, height: 56, borderRadius: radius.pill, marginBottom: space[4],
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border,
  },
  banner: {
    flexDirection: 'row', alignItems: 'center', gap: space[2],
    padding: space[3], borderRadius: radius.sm, borderWidth: 1, marginBottom: space[3],
  },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(2, 6, 12, 0.62)' },
  sheet: {
    backgroundColor: colors.card, borderTopLeftRadius: radius['2xl'], borderTopRightRadius: radius['2xl'],
    borderWidth: 1, borderBottomWidth: 0, borderColor: colors.borderStrong,
    paddingHorizontal: space[4], paddingBottom: space[5], maxHeight: '88%',
    ...shadows.sheet,
  },
  sheetGrip: {
    width: 44, height: 5, borderRadius: radius.pill, backgroundColor: colors.borderStrong,
    alignSelf: 'center', marginTop: space[3],
  },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space[4] },
});

export { s as uiStyles };
