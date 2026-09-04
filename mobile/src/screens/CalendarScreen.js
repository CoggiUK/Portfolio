import React, { useMemo, useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen, Header, Card, FAB, Empty, IconBtn, Row, Badge } from '../components/ui';
import { colors, space, radius, font, hexOf, tint, shadows } from '../theme';
import { useApp } from '../contexts/AppContext';
import {
  monthGrid, dayKey, isSameDay, startOfMonth, addMonths, fmtTime, fmtDayLabel,
  MONTHS, toDate,
} from '../utils/date';

const WEEK_HEAD = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

// Component item được memo hóa để tối ưu render FlatList
const EventItem = memo(function EventItem({ event, onPress }) {
  const hex = hexOf(event.color);
  const start = toDate(event.start);
  const end = toDate(event.end);

  return (
    <Card
      accent={hex}
      style={[s.eventCard, { borderLeftColor: hex, borderLeftWidth: 4 }]}
      onPress={onPress}
    >
      <View style={{ flex: 1 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text style={[font.body, { color: colors.text, fontWeight: '700', flex: 1 }]} numberOfLines={1}>
            {event.title}
          </Text>
          {event.googleEventId ? (
            <View style={s.googleSyncBadge}>
              <Ionicons name="logo-google" size={11} color={colors.textSub} />
            </View>
          ) : null}
        </Row>
        <Row style={{ marginTop: space[1] + 2 }} gap={4}>
          <Ionicons name="time-outline" size={13} color={colors.textSub} />
          <Text style={[font.small, { color: colors.textSub }]}>
            {event.allDay ? 'Cả ngày' : `${fmtTime(start)}${end ? ` – ${fmtTime(end)}` : ''}`}
          </Text>
        </Row>
        {event.location ? (
          <Row style={{ marginTop: 3 }} gap={4}>
            <Ionicons name="location-outline" size={13} color={colors.textMuted} />
            <Text style={[font.tiny, { color: colors.textMuted, flex: 1 }]} numberOfLines={1}>
              {event.location}
            </Text>
          </Row>
        ) : null}
        {event.reminders?.length ? (
          <Row style={{ marginTop: space[2] }} gap={4}>
            <Ionicons name="notifications-outline" size={12} color={colors.primary} />
            <Text style={[font.tiny, { color: colors.primary }]}>
              Nhắc trước {event.reminders.map((m) => (m >= 60 ? `${m / 60}h` : `${m}p`)).join(', ')}
            </Text>
          </Row>
        ) : null}
      </View>
    </Card>
  );
});

export default function CalendarScreen({ navigation }) {
  const { events, googleConnected, syncing, syncGoogle, notify } = useApp();
  const [anchor, setAnchor] = useState(startOfMonth(new Date()));
  const [selected, setSelected] = useState(new Date());
  const [reloading, setReloading] = useState(false);

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

  // Gom sự kiện theo ngày tối ưu qua useMemo
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

  const grid = useMemo(() => monthGrid(anchor), [anchor]);
  const dayEvents = byDay[dayKey(selected)] || [];
  const today = new Date();

  const jumpToday = useCallback(() => {
    Haptics.selectionAsync().catch(() => {});
    setAnchor(startOfMonth(today));
    setSelected(today);
  }, []);

  const selectDate = useCallback((d) => {
    Haptics.selectionAsync().catch(() => {});
    setSelected(d);
  }, []);

  const keyExtractor = useCallback((e) => e.id, []);

  const renderItem = useCallback(
    ({ item }) => (
      <EventItem
        event={item}
        onPress={() => navigation.navigate('EventForm', { id: item.id })}
      />
    ),
    [navigation]
  );

  return (
    <Screen>
      <Header
        title="Lịch làm việc"
        subtitle={googleConnected ? 'Đồng bộ hai chiều Google Calendar' : 'Lưu trữ đám mây an toàn'}
        badge={googleConnected ? 'GOOGLE' : undefined}
        right={
          <Row gap={space[2]}>
            <IconBtn
              icon={syncing || reloading ? 'sync' : 'sync-outline'}
              color={googleConnected ? colors.primary : colors.textMuted}
              onPress={handleReload}
            />
            <IconBtn icon="today-outline" onPress={jumpToday} />
          </Row>
        }
      />

      {/* Month Selector Bar */}
      <View style={s.monthBar}>
        <IconBtn icon="chevron-back" onPress={() => setAnchor(addMonths(anchor, -1))} />
        <View style={s.monthPill}>
          <Ionicons name="calendar-outline" size={14} color={colors.primary} />
          <Text style={[font.h3, { color: colors.text, fontWeight: '800' }]}>
            {MONTHS[anchor.getMonth()]} {anchor.getFullYear()}
          </Text>
        </View>
        <IconBtn icon="chevron-forward" onPress={() => setAnchor(addMonths(anchor, 1))} />
      </View>

      {/* Week Header */}
      <View style={s.weekHead}>
        {WEEK_HEAD.map((w, idx) => (
          <Text
            key={w}
            style={[
              font.tiny,
              s.weekHeadCell,
              idx >= 5 && { color: colors.cyan },
            ]}
          >
            {w}
          </Text>
        ))}
      </View>

      {/* Calendar Month Grid */}
      <View style={s.grid}>
        {grid.map((d) => {
          const key = dayKey(d);
          const list = byDay[key] || [];
          const outside = d.getMonth() !== anchor.getMonth();
          const isSel = isSameDay(d, selected);
          const isToday = isSameDay(d, today);

          return (
            <Pressable
              key={key}
              onPress={() => selectDate(d)}
              style={s.cellWrap}
            >
              <View
                style={[
                  s.cell,
                  isToday && !isSel && s.cellToday,
                  isSel && s.cellSel,
                ]}
              >
                <Text
                  style={[
                    font.small,
                    {
                      color: outside ? colors.textMuted : colors.text,
                      opacity: outside ? 0.35 : 1,
                      fontWeight: isSel || isToday ? '800' : '500',
                    },
                    isSel && { color: colors.onPrimary },
                  ]}
                >
                  {d.getDate()}
                </Text>
                <View style={s.cellDots}>
                  {list.slice(0, 3).map((e) => (
                    <View
                      key={e.id}
                      style={[
                        s.cellDot,
                        { backgroundColor: isSel ? colors.onPrimary : colors.primary },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Agenda Header */}
      <View style={s.agendaHead}>
        <Row gap={space[2]}>
          <Text style={[font.h3, { color: colors.text }]}>{fmtDayLabel(selected)}</Text>
          {isSameDay(selected, today) ? (
            <Badge label="HÔM NAY" color={colors.primary} />
          ) : null}
        </Row>
        <Text style={[font.tiny, { color: colors.textMuted, fontWeight: '600' }]}>
          {dayEvents.length ? `${dayEvents.length} lịch trình` : 'Trống lịch'}
        </Text>
      </View>

      {/* Agenda Event List */}
      <FlatList
        data={dayEvents}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
        ListEmptyComponent={
          <Empty
            icon="calendar-clear-outline"
            title="Không có lịch trong ngày này"
            hint="Nhấn vào nút + bên dưới để tạo sự kiện mới và đồng bộ ngay."
          />
        }
      />

      <FAB onPress={() => navigation.navigate('EventForm', { date: selected.toISOString() })} />
    </Screen>
  );
}

const s = StyleSheet.create({
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[4],
    marginBottom: space[2],
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[3],
    paddingVertical: space[1] + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weekHead: {
    flexDirection: 'row',
    paddingHorizontal: space[3],
    marginBottom: 4,
  },
  weekHeadCell: {
    flex: 1,
    textAlign: 'center',
    color: colors.textMuted,
    paddingVertical: space[1],
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: space[3],
  },
  cellWrap: {
    width: `${100 / 7}%`,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  cell: {
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  cellSel: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cellToday: {
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primarySurface,
  },
  cellDots: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 2,
    height: 5,
    alignItems: 'center',
  },
  cellDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  agendaHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[4],
    paddingTop: space[4],
    paddingBottom: space[3],
    marginTop: space[2],
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  eventCard: {
    flexDirection: 'row',
    gap: space[3],
    marginBottom: space[2],
    padding: space[3] + 2,
    overflow: 'hidden',
  },
  googleSyncBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSurface,
  },
});
