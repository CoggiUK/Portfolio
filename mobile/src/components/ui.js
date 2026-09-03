import React from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, ScrollView, Modal, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, space, radius, font, shadows, tint } from '../theme';

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
          <Text style={[font.h1, { color: colors.text }]} numberOfLines={1}>{title}</Text>
          {badge ? <Badge label={badge} color={colors.primary} /> : null}
        </View>
        {subtitle ? <Text style={[font.small, { color: colors.textSub, marginTop: 2 }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export const SectionTitle = ({ children, right, style }) => (
  <View style={[s.sectionTitle, style]}>
    <Text style={[font.tiny, { color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 }]}>
      {children}
    </Text>
    {right}
  </View>
);

/* ── Thẻ kính mờ (Glass Card) ───────────────────────────────────── */

export function Card({ children, style, onPress, accent, glow }) {
  const body = (
    <View
      style={[
        s.card,
        accent ? { borderColor: tint(accent, 0.4), backgroundColor: tint(accent, 0.08) } : null,
        glow && accent ? shadows.glow(accent, 0.25, 16) : shadows.card,
        style,
      ]}
    >
      {children}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}
    >
      {body}
    </Pressable>
  );
}

/* ── Thẻ thống kê (Stat Card) ──────────────────────────────────── */

export function StatCard({ label, value, icon, color = colors.primary, sub, onPress }) {
  const content = (
    <View style={[s.statCard, { borderColor: tint(color, 0.28) }]}>
      <View style={s.statCardHead}>
        <View style={[s.statCardIcon, { backgroundColor: tint(color, 0.15), borderColor: tint(color, 0.3) }]}>
          <Ionicons name={icon} size={17} color={color} />
        </View>
        {sub ? (
          <View style={[s.statSubBadge, { backgroundColor: tint(color, 0.12) }]}>
            <Text style={[font.tiny, { color }]}>{sub}</Text>
          </View>
        ) : null}
      </View>
      <Text style={[font.num, { color: colors.text, marginTop: space[2] }]}>{value}</Text>
      <Text style={[font.tiny, { color: colors.textSub, marginTop: 2 }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );

  if (!onPress) return <View style={{ flex: 1 }}>{content}</View>;
  return (
    <Pressable
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

/* ── Nút (Buttons) ─────────────────────────────────────────────── */

export function Btn({ title, onPress, variant = 'primary', icon, loading, disabled, style, small }) {
  const v = {
    primary: {
      bg: colors.primary,
      fg: colors.onPrimary,
      border: 'transparent',
      glow: shadows.glow(colors.primary, 0.35, 12),
    },
    secondary: {
      bg: 'rgba(255,255,255,0.06)',
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
      glow: shadows.glow(colors.cyan, 0.35, 12),
    },
  }[variant] || {};

  const off = disabled || loading;
  return (
    <Pressable
      onPress={() => {
        if (off) return;
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [
        s.btn,
        small && { paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: radius.sm },
        { backgroundColor: v.bg, borderColor: v.border },
        v.glow,
        off && { opacity: 0.45 },
        pressed && !off && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.fg} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={small ? 14 : 17} color={v.fg} /> : null}
          <Text style={[small ? font.small : font.body, { color: v.fg, fontWeight: '700' }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

export const IconBtn = ({ icon, onPress, color = colors.textSub, size = 20, style }) => (
  <Pressable
    hitSlop={10}
    onPress={() => {
      Haptics.selectionAsync().catch(() => {});
      onPress?.();
    }}
    style={({ pressed }) => [
      s.iconBtn,
      pressed && { opacity: 0.6, transform: [{ scale: 0.92 }] },
      style,
    ]}
  >
    <Ionicons name={icon} size={size} color={color} />
  </Pressable>
);

export function FAB({ onPress, icon = 'add' }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [
        s.fab,
        shadows.glow(colors.primary, 0.45, 18),
        pressed && { transform: [{ scale: 0.92 }] },
      ]}
    >
      <Ionicons name={icon} size={26} color={colors.onPrimary} />
    </Pressable>
  );
}

/* ── Nhập liệu ──────────────────────────────────────────────────── */

export function Field({ label, hint, style, multiline, ...props }) {
  return (
    <View style={[{ marginBottom: space[3] }, style]}>
      {label ? <Text style={[font.small, { color: colors.textSub, marginBottom: space[2] }]}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[s.input, multiline && { minHeight: 100, textAlignVertical: 'top', paddingTop: space[3] }]}
        multiline={multiline}
        {...props}
      />
      {hint ? <Text style={[font.tiny, { color: colors.textMuted, marginTop: space[1] }]}>{hint}</Text> : null}
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
          ? { backgroundColor: tint(color, 0.16), borderColor: tint(color, 0.55) }
          : { borderColor: colors.border },
        pressed && { opacity: 0.8 },
      ]}
    >
      {icon ? <Ionicons name={icon} size={13} color={active ? color : colors.textMuted} /> : null}
      <Text style={[font.small, { color: active ? color : colors.textSub, fontWeight: '600' }]}>{label}</Text>
      {count !== undefined ? (
        <View style={[s.chipCount, { backgroundColor: active ? tint(color, 0.25) : 'rgba(255,255,255,0.06)' }]}>
          <Text style={[font.tiny, { color: active ? color : colors.textMuted }]}>{count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export function Segmented({ items, value, onChange }) {
  return (
    <View style={s.segmented}>
      {items.map((it) => {
        const active = it.value === value;
        return (
          <Pressable
            key={it.value}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onChange(it.value);
            }}
            style={[
              s.segItem,
              active && {
                backgroundColor: colors.primaryDim,
                borderColor: tint(colors.primary, 0.4),
                shadowColor: colors.primary,
                shadowOpacity: 0.2,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
              },
            ]}
          >
            <Text
              style={[
                font.small,
                { color: active ? colors.primary : colors.textSub, fontWeight: active ? '700' : '500' },
              ]}
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
        <View style={[s.switchIcon, { backgroundColor: tint(color, 0.12), borderColor: tint(color, 0.25) }]}>
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
  return (
    <View style={[s.badge, { backgroundColor: tint(color, 0.14), borderColor: tint(color, 0.35) }]}>
      {dot ? <View style={[s.badgeDot, { backgroundColor: color }]} /> : null}
      <Text style={[font.tiny, { color, fontWeight: '700' }]}>{label}</Text>
    </View>
  );
}

export function Empty({ icon = 'sparkles-outline', title, hint }) {
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
    </View>
  );
}

export const Loading = ({ label = 'Đang tải…' }) => (
  <View style={s.empty}>
    <ActivityIndicator color={colors.primary} size="large" />
    <Text style={[font.small, { color: colors.textMuted, marginTop: space[3] }]}>{label}</Text>
  </View>
);

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
      <Text style={[font.small, { color: c, flex: 1, fontWeight: '500' }]}>{message}</Text>
      {onClose ? <IconBtn icon="close" size={15} color={c} onPress={onClose} /> : null}
    </View>
  );
}

/** Bottom sheet mượt mà dùng cho form nhanh */
export function Sheet({ visible, onClose, title, children }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.sheetBackdrop} onPress={onClose} />
      <View style={s.sheet}>
        <View style={s.sheetGrip} />
        <View style={s.sheetHead}>
          <Text style={[font.h2, { color: colors.text, flex: 1 }]}>{title}</Text>
          <IconBtn icon="close" onPress={onClose} size={22} />
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
  header: {
    flexDirection: 'row', alignItems: 'center', gap: space[3],
    paddingHorizontal: space[4], paddingTop: space[3], paddingBottom: space[3],
  },
  backBtn: {
    width: 36, height: 36, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: colors.border,
  },
  sectionTitle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: space[5], marginBottom: space[3],
  },
  card: {
    backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1,
    borderColor: colors.border, padding: space[4],
  },
  statCard: {
    backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1,
    padding: space[3] + 2, minHeight: 92, justifyContent: 'space-between',
  },
  statCardHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  statCardIcon: {
    width: 32, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  statSubBadge: {
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.pill,
  },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space[2],
    paddingVertical: space[3], paddingHorizontal: space[4],
    borderRadius: radius.md, borderWidth: 1,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: radius.pill,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: colors.border,
  },
  fab: {
    position: 'absolute', right: space[4], bottom: space[5],
    width: 56, height: 56, borderRadius: radius.pill, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, paddingHorizontal: space[3], paddingVertical: space[3],
    color: colors.text, fontSize: 15,
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: space[1] + 2,
    paddingHorizontal: space[3], paddingVertical: space[2],
    borderRadius: radius.pill, borderWidth: 1,
  },
  chipCount: {
    paddingHorizontal: 5, paddingVertical: 1, borderRadius: radius.pill, marginLeft: 2,
  },
  segmented: {
    flexDirection: 'row', gap: space[1], padding: 3,
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: radius.sm + 2,
    borderWidth: 1, borderColor: colors.border,
  },
  segItem: {
    flex: 1, alignItems: 'center', paddingVertical: space[2],
    borderRadius: radius.sm, borderWidth: 1, borderColor: 'transparent',
  },
  switchRow: {
    flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3],
  },
  switchIcon: { width: 34, height: 34, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  track: {
    width: 46, height: 26, borderRadius: radius.pill, padding: 3,
    backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center',
  },
  knob: { width: 20, height: 20, borderRadius: radius.pill, backgroundColor: colors.textMuted },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: space[2], paddingVertical: 3, borderRadius: radius.pill, borderWidth: 1,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: space[7], paddingHorizontal: space[5] },
  emptyIcon: {
    width: 60, height: 60, borderRadius: radius.pill, marginBottom: space[4],
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: colors.border,
  },
  banner: {
    flexDirection: 'row', alignItems: 'center', gap: space[2],
    padding: space[3], borderRadius: radius.sm, borderWidth: 1, marginBottom: space[3],
  },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },
  sheet: {
    backgroundColor: colors.bgElevated, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    borderWidth: 1, borderBottomWidth: 0, borderColor: colors.borderStrong,
    paddingHorizontal: space[4], paddingBottom: space[5], maxHeight: '88%',
    shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 24, shadowOffset: { width: 0, height: -6 },
    elevation: 20,
  },
  sheetGrip: {
    width: 44, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong,
    alignSelf: 'center', marginTop: space[3],
  },
  sheetHead: { flexDirection: 'row', alignItems: 'center', paddingVertical: space[4] },
});

export { s as uiStyles };
