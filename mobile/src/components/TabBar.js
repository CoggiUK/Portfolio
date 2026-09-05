import React, { useCallback, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, Image, useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, space, radius, font, fontFamily, layout, shadows } from '../theme';

const LOGO_MARK = require('../../assets/logo-mark.png');

/** Tên route được nâng lên thành nút logo trung tâm. */
export const CENTER_ROUTE = 'Trang chủ';

const ICONS = {
  'Trang chủ': ['home', 'home-outline'],
  'Lịch': ['calendar', 'calendar-outline'],
  'Cá nhân': ['grid', 'grid-outline'],
  'Liên hệ': ['chatbubbles', 'chatbubbles-outline'],
  'Web': ['globe', 'globe-outline'],
};

const { TAB_BAR_HEIGHT, TAB_OVERFLOW, TAB_FAB_SIZE, TAB_NOTCH_DEPTH, TAB_NOTCH_HALF } = layout;

/**
 * Đường viền thanh tab: hai góc trên bo tròn + rãnh lõm ở chính giữa
 * để nút logo nằm lọt vào (chuẩn "curved bottom navigation").
 */
function barPath(width, height) {
  const cx = width / 2;
  const r = radius['2xl'];
  const d = TAB_NOTCH_DEPTH;
  const hw = TAB_NOTCH_HALF;
  // Điểm điều khiển đặt ở nửa vai (hw/2) và giữ nguyên tung độ hai đầu — cho
  // đường cong "smoothstep" luôn mượt dù đổi độ sâu hay bề rộng rãnh.
  const notch =
    `C${cx - hw / 2},0 ${cx - hw / 2},${d} ${cx},${d} ` +
    `C${cx + hw / 2},${d} ${cx + hw / 2},0 ${cx + hw},0 `;
  const top = `M0,${r} Q0,0 ${r},0 H${cx - hw} ${notch}H${width - r} Q${width},0 ${width},${r}`;
  return {
    fill: `${top} V${height} H0 Z`,
    edge: top,
  };
}

function TabItem({ label, icon, focused, badge, onPress, onLongPress }) {
  const [on, off] = icon;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [s.item, pressed && { opacity: 0.7 }]}
    >
      <View style={s.iconWrap}>
        <Ionicons
          name={focused ? on : off}
          size={24}
          color={focused ? colors.primary : colors.textMuted}
        />
        {badge ? (
          <View style={s.badge}>
            <Text style={s.badgeText}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        ) : null}
      </View>
      <Text
        numberOfLines={1}
        style={[font.badge, s.label, { color: focused ? colors.primary : colors.textMuted }]}
      >
        {label.toUpperCase()}
      </Text>
    </Pressable>
  );
}

export default function TabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  // Đo bề rộng thật của thanh — đúng cả khi xoay ngang, tablet hay split-view.
  const [measured, setMeasured] = useState(0);
  const width = measured || window.width;

  const barHeight = TAB_BAR_HEIGHT + insets.bottom;
  const path = barPath(width, barHeight);

  const go = useCallback(
    (route, focused, impact = false) => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (focused || event.defaultPrevented) return;
      (impact
        ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        : Haptics.selectionAsync()
      ).catch(() => {});
      navigation.navigate(route.name);
    },
    [navigation]
  );

  const longPress = useCallback(
    (route) => navigation.emit({ type: 'tabLongPress', target: route.key }),
    [navigation]
  );

  const centerIndex = state.routes.findIndex((r) => r.name === CENTER_ROUTE);
  const centerRoute = state.routes[centerIndex];
  const centerFocused = state.index === centerIndex;
  const sideRoutes = state.routes.filter((r) => r.name !== CENTER_ROUTE);
  const half = Math.ceil(sideRoutes.length / 2);

  const renderSide = (routes) =>
    routes.map((route) => {
      const { options } = descriptors[route.key];
      const focused = state.routes[state.index]?.key === route.key;
      return (
        <TabItem
          key={route.key}
          label={options.tabBarLabel ?? options.title ?? route.name}
          icon={ICONS[route.name] || ICONS[CENTER_ROUTE]}
          focused={focused}
          badge={options.tabBarBadge}
          onPress={() => go(route, focused)}
          onLongPress={() => longPress(route)}
        />
      );
    });

  return (
    <View
      style={[s.wrap, { height: TAB_OVERFLOW + barHeight }]}
      onLayout={(e) => setMeasured(e.nativeEvent.layout.width)}
    >
      <View style={[s.bar, { height: barHeight, paddingBottom: insets.bottom }]}>
        <Svg width={width} height={barHeight} style={StyleSheet.absoluteFill}>
          <Path d={path.fill} fill={colors.cardElevated} />
          <Path d={path.edge} stroke={colors.borderStrong} strokeWidth={1} fill="none" />
        </Svg>
        <View style={s.items}>
          {renderSide(sideRoutes.slice(0, half))}
          <View style={{ width: TAB_FAB_SIZE + space[5] }} />
          {renderSide(sideRoutes.slice(half))}
        </View>
      </View>

      {centerRoute ? (
        <View pointerEvents="box-none" style={s.fabLayer}>
          <Pressable
            accessibilityRole="tab"
            accessibilityLabel={CENTER_ROUTE}
            accessibilityHint="Mở bảng điều khiển tổng quan"
            accessibilityState={{ selected: centerFocused }}
            onPress={() => go(centerRoute, centerFocused, true)}
            onLongPress={() => longPress(centerRoute)}
            style={({ pressed }) => [s.fabHit, pressed && { transform: [{ scale: 0.94 }] }]}
          >
            <View
              style={[
                s.fab,
                centerFocused
                  ? { borderColor: colors.primary }
                  : { borderColor: colors.borderStrong },
                shadows.glow(colors.primary, centerFocused ? 0.45 : 0.2, 14),
              ]}
            >
              <Image source={LOGO_MARK} style={s.fabLogo} resizeMode="contain" />
            </View>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { backgroundColor: 'transparent' },
  bar: { width: '100%', justifyContent: 'flex-start', marginTop: TAB_OVERFLOW },
  items: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: TAB_BAR_HEIGHT,
    paddingTop: space[2],
    paddingHorizontal: space[2],
  },
  item: {
    flex: 1,
    minHeight: layout.TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 2,
    paddingHorizontal: space[1],
  },
  iconWrap: { width: 30, height: 26, alignItems: 'center', justifyContent: 'center' },
  label: { textAlign: 'center', fontSize: 11.5 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.cardElevated,
  },
  badgeText: { color: '#FFFFFF', fontSize: 12, lineHeight: 14, fontFamily: fontFamily.bold },
  fabLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fabHit: {
    width: TAB_FAB_SIZE + 12,
    height: TAB_FAB_SIZE + 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: TAB_FAB_SIZE,
    height: TAB_FAB_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.bgElevated,
    borderWidth: 2,
  },
  fabLogo: { width: TAB_FAB_SIZE - 6, height: TAB_FAB_SIZE - 6 },
});
