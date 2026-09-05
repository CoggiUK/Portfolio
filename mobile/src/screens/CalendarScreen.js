import React, { useMemo, useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen, BrandHeader, Card, FAB, Empty, Row, Badge } from '../components/ui';
import {
  colors, space, radius, font, fontFamily, layout, listBottomPad, hexOf, tint,
} from '../theme';
import { useApp } from '../contexts/AppContext';
import {
  monthGrid, dayKey, isSameDay, startOfMonth, startOfWeek, addMonths, addDays,
  fmtTime, fmtDate, fmtDayFull, MONTHS, toDate,
} from '../utils/date';

const WEEK_HEAD = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/* ── Ô ngày dùng chung cho cả dải tuần và lưới tháng ─────────────── */

const DayCell = memo(function DayCell({ date, selected, today, outside, dotColor, week, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={fmtDayFull(date)}
      onPress={onPress}
      style={s.cellWrap}
    >
      <View style={[week ? s.cellWeek : s.cellMonth, selected && s.cellSel, !selected && today && s.cellToday]}>
        {week ? (
          <Text
            style={[
              font.badge,
              { color: selected ? colors.onPrimary : colors.textMuted, marginBottom: 2 },
            ]}
          >
            {WEEK_HEAD[(date.getDay() + 6) % 7]}
          </Text>
        ) : null}
        <Text
          style={[
            font.label,
            {
              color: selected ? colors.onPrimary : outside ? colors.textDisabled : colors.text,
              fontFamily: selected || today ? fontFamily.semibold : fontFamily.medium,
            },
          ]}
        >
          {date.getDate()}
        </Text>
        <View style={s.dotSlot}>
          {dotColor ? (
            <View style={[s.dot, { backgroundColor: selected ? colors.onPrimary : dotColor }]} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
});

/* ── Thẻ sự kiện trên dòng thời gian ─────────────────────────────── */

const EventRow = memo(function EventRow({ event, state, onPress }) {
  const hex = hexOf(event.color);
  const start = toDate(event.start);
  const end = toDate(event.end);
  const meta = {
    done: { label: 'ĐÃ XONG', color: colors.textMuted },
    live: { label: 'ĐANG DIỄN RA', color: colors.primary },
    next: { label: 'SẮP TỚI', color: colors.cyan },
  }[state];

  return (
    <View style={s.timeRow}>
      <View style={s.rail}>
        <View style={s.railLine} />
        <View style={[s.railDot, { backgroundColor: state === 'done' ? colors.borderStrong : hex }]} />
      </View>

      <Card style={{ flex: 1, minWidth: 0, marginBottom: space[3] }} onPress={onPress}>
        <Row style={{ justifyContent: 'space-between' }} gap={space[2]}>
          <Text style={[font.h3, { color: colors.text, flex: 1, minWidth: 0 }]} numberOfLines={1}>
            {event.title}
          </Text>
          <Badge label={meta.label} color={meta.color} dot={state === 'live'} />
        </Row>

        <Row style={{ justifyContent: 'space-between', marginTop: space[2] }} gap={space[2]}>
          <Text style={[font.body, { color: colors.textSub, flexShrink: 0 }]}>
            {event.allDay ? 'Cả ngày' : `${fmtTime(start)} → ${end ? fmtTime(end) : '…'}`}
          </Text>
          <Text style={[font.small, { color: colors.textMuted, flexShrink: 1 }]} numberOfLines={1}>
            {event.location || (event.googleEventId ? 'Google Calendar' : 'Lịch cá nhân')}
          </Text>
        </Row>
      </Card>
    </View>
  );
});

/* ── Màn hình ────────────────────────────────────────────────────── */

export default function CalendarScreen({ navigation, route }) {
  const { events, googleConnected, syncing, syncGoogle, notify } = useApp();
  // false = dải tuần · true = lưới tháng
  const [expanded, setExpanded] = useState(!!route?.params?.expanded);
  const [selected, setSelected] = useState(new Date());
  const [reloading, setReloading] = useState(false);

  const today = new Date();

  const handleReload = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (googleConnected) {
      await syncGoogle();
    } else {
      setReloading(true);
      await new Promise((r) => setTimeout(r, 600));
      setReloading(false);
      notify('Đã làm mới lịch làm việc', 'success');
    }
  }, [googleConnected, syncGoogle, notify]);

  // Gom sự kiện theo ngày một lần, dùng cho cả chấm đánh dấu lẫn danh sách.
  const byDay = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      const d = toDate(e.start);
      if (!d) return;
      (map[dayKey(d)] ||= []).push(e);
    });
    Object.values(map).forEach((list) =>
      list.sort((a, b) => (toDate(a.start)?.getTime() || 0) - (toDate(b.start)?.getTime() || 0))
    );
    return map;
  }, [events]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(selected);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selected]);

  const monthDays = useMemo(() => monthGrid(startOfMonth(selected)), [selected]);
  const days = expanded ? monthDays : weekDays;

  const dayEvents = byDay[dayKey(selected)] || [];

  // Phân loại theo mốc hiện tại để hiện dòng tổng kết như bản thiết kế.
  const stats = useMemo(() => {
    const now = Date.now();
    let done = 0;
    let live = 0;
    let next = 0;
    dayEvents.forEach((e) => {
      const st = toDate(e.start)?.getTime() || 0;
      const en = toDate(e.end)?.getTime() || st + 3600000;
      if (en < now) done += 1;
      else if (st <= now) live += 1;
      else next += 1;
    });
    return { done, live, next };
  }, [dayEvents]);

  const stateOf = useCallback((e) => {
    const now = Date.now();
    const st = toDate(e.start)?.getTime() || 0;
    const en = toDate(e.end)?.getTime() || st + 3600000;
    if (en < now) return 'done';
    if (st <= now) return 'live';
    return 'next';
  }, []);

  const shift = useCallback(
    (dir) => {
      Haptics.selectionAsync().catch(() => {});
      setSelected((cur) => (expanded ? addMonths(cur, dir) : addDays(cur, dir * 7)));
    },
    [expanded]
  );

  const selectDate = useCallback((d) => {
    Haptics.selectionAsync().catch(() => {});
    setSelected(d);
  }, []);

  const toggleExpanded = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setExpanded((v) => !v);
  }, []);

  const rangeLabel = expanded
    ? `Tháng ${String(selected.getMonth() + 1).padStart(2, '0')}/${selected.getFullYear()}`
    : `${fmtDate(weekDays[0])} – ${fmtDate(weekDays[6])}`;

  const keyExtractor = useCallback((e) => e.id, []);
  const renderItem = useCallback(
    ({ item }) => (
      <EventRow
        event={item}
        state={stateOf(item)}
        onPress={() => navigation.navigate('EventForm', { id: item.id })}
      />
    ),
    [navigation, stateOf]
  );

  return (
    <Screen edges={[]}>
      <BrandHeader
        icon="calendar"
        title="Lịch làm việc"
        subtitle={googleConnected ? 'Đồng bộ 2 chiều' : 'Lưu trữ đám mây an toàn'}
        badge={googleConnected ? 'GOOGLE' : undefined}
        actions={[
          {
            icon: syncing || reloading ? 'sync' : 'sync-outline',
            label: 'Đồng bộ Google Calendar',
            onPress: handleReload,
          },
        ]}
      />

      <FlatList
        data={dayEvents}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: listBottomPad() }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
        ListHeaderComponent={
          <View>
            {/* Thanh điều hướng khoảng thời gian */}
            <View style={s.rangeBar}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={expanded ? 'Tháng trước' : 'Tuần trước'}
                hitSlop={10}
                onPress={() => shift(-1)}
                style={({ pressed }) => [s.rangeBtn, pressed && { opacity: 0.6 }]}
              >
                <Ionicons name="chevron-back" size={18} color={colors.textSub} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Về hôm nay"
                onPress={() => selectDate(new Date())}
                style={{ flex: 1, alignItems: 'center' }}
              >
                <Text style={[font.h3, { color: colors.text }]}>{rangeLabel}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={expanded ? 'Tháng sau' : 'Tuần sau'}
                hitSlop={10}
                onPress={() => shift(1)}
                style={({ pressed }) => [s.rangeBtn, pressed && { opacity: 0.6 }]}
              >
                <Ionicons name="chevron-forward" size={18} color={colors.textSub} />
              </Pressable>
            </View>

            {/* Khung lịch: dải tuần hoặc lưới tháng */}
            <View style={s.calCard}>
              {expanded ? (
                <View style={s.weekHead}>
                  {WEEK_HEAD.map((w) => (
                    <Text key={w} style={[font.badge, s.weekHeadCell]}>
                      {w}
                    </Text>
                  ))}
                </View>
              ) : null}

              <View style={s.grid}>
                {days.map((d) => {
                  const list = byDay[dayKey(d)];
                  return (
                    <DayCell
                      key={dayKey(d)}
                      date={d}
                      week={!expanded}
                      selected={isSameDay(d, selected)}
                      today={isSameDay(d, today)}
                      outside={expanded && d.getMonth() !== selected.getMonth()}
                      dotColor={list?.length ? hexOf(list[0].color) : null}
                      onPress={() => selectDate(d)}
                    />
                  );
                })}
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={expanded ? 'Thu gọn về tuần' : 'Mở rộng thành tháng'}
                accessibilityState={{ expanded }}
                onPress={toggleExpanded}
                hitSlop={10}
                style={({ pressed }) => [s.toggle, pressed && { opacity: 0.6 }]}
              >
                <Ionicons
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>

            {/* Tổng kết ngày đang chọn */}
            <View style={s.agendaHead}>
              <Row style={{ justifyContent: 'space-between' }} gap={space[2]}>
                <Text style={[font.h3, { color: colors.text, flex: 1 }]} numberOfLines={1}>
                  {fmtDayFull(selected)}
                </Text>
                <Text style={[font.item, { color: colors.primary }]}>
                  {dayEvents.length} lịch trình
                </Text>
              </Row>
              <Text style={[font.small, { color: colors.textMuted, marginTop: 2 }]}>
                {dayEvents.length
                  ? `${stats.done} đã xong · ${stats.live} đang diễn ra · ${stats.next} sắp tới`
                  : 'Chưa có lịch nào trong ngày'}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Empty
            icon="calendar-clear-outline"
            title="Không có lịch trong ngày này"
            hint="Nhấn nút + bên dưới để tạo sự kiện mới và đồng bộ ngay."
          />
        }
      />

      <FAB onPress={() => navigation.navigate('EventForm', { date: selected.toISOString() })} />
    </Screen>
  );
}

const s = StyleSheet.create({
  rangeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: space[4],
    marginBottom: space[3],
    paddingHorizontal: space[2],
    paddingVertical: space[1] + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rangeBtn: {
    width: 34, height: 34, borderRadius: radius.pill,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.bgSurface,
  },

  calCard: {
    backgroundColor: colors.card,
    borderRadius: layout.CARD_RADIUS,
    borderWidth: 1,
    borderColor: colors.border,
    paddingTop: space[3],
    paddingHorizontal: space[1],
  },
  weekHead: { flexDirection: 'row', paddingHorizontal: space[1], marginBottom: 2 },
  weekHeadCell: { flex: 1, textAlign: 'center', color: colors.textMuted, paddingVertical: space[1] },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cellWrap: { width: `${100 / 7}%`, paddingHorizontal: 2, paddingVertical: 2 },
  cellWeek: {
    height: 62, borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'transparent',
  },
  cellMonth: {
    height: 44, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'transparent',
  },
  cellSel: { backgroundColor: colors.primary, borderColor: colors.primary },
  cellToday: { borderColor: colors.primaryBorder, backgroundColor: colors.primarySurface },
  dotSlot: { height: 8, justifyContent: 'center' },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
  toggle: { alignItems: 'center', paddingVertical: space[2] },

  agendaHead: { paddingTop: space[5], paddingBottom: space[3] },

  timeRow: { flexDirection: 'row', gap: space[3] },
  rail: { width: 12, alignItems: 'center' },
  railLine: { position: 'absolute', top: 0, bottom: 0, width: 1.5, backgroundColor: colors.border },
  railDot: { width: 10, height: 10, borderRadius: 5, marginTop: 20 },
});
