import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, Card, FAB, Empty, IconBtn, Row } from '../components/ui';
import { colors, space, radius, font, hexOf, tint } from '../theme';
import { useApp } from '../contexts/AppContext';
import {
  monthGrid, dayKey, isSameDay, startOfMonth, addMonths, fmtTime, fmtDayLabel,
  MONTHS, toDate,
} from '../utils/date';

const WEEK_HEAD = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export default function CalendarScreen({ navigation }) {
  const { events, googleConnected, syncing, syncGoogle } = useApp();
  const [anchor, setAnchor] = useState(startOfMonth(new Date()));
  const [selected, setSelected] = useState(new Date());

  // Gom sự kiện theo ngày một lần cho cả lưới tháng lẫn danh sách bên dưới.
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

  const jumpToday = () => {
    setAnchor(startOfMonth(today));
    setSelected(today);
  };

  return (
    <Screen>
      <Header
        title="Lịch làm việc"
        subtitle={googleConnected ? 'Đã nối Google Calendar' : 'Chưa nối Google Calendar'}
        right={
          <Row>
            <IconBtn
              icon={syncing ? 'sync' : 'sync-outline'}
              color={googleConnected ? colors.primary : colors.textMuted}
              onPress={() => (googleConnected ? syncGoogle() : navigation.navigate('Settings'))}
            />
            <IconBtn icon="today-outline" onPress={jumpToday} />
          </Row>
        }
      />

      <View style={s.monthBar}>
        <IconBtn icon="chevron-back" onPress={() => setAnchor(addMonths(anchor, -1))} />
        <Text style={[font.h3, { color: colors.text }]}>
          {MONTHS[anchor.getMonth()]} {anchor.getFullYear()}
        </Text>
        <IconBtn icon="chevron-forward" onPress={() => setAnchor(addMonths(anchor, 1))} />
      </View>

      <View style={s.weekHead}>
        {WEEK_HEAD.map((w) => (
          <Text key={w} style={[font.tiny, s.weekHeadCell]}>{w}</Text>
        ))}
      </View>

      <View style={s.grid}>
        {grid.map((d) => {
          const key = dayKey(d);
          const list = byDay[key] || [];
          const outside = d.getMonth() !== anchor.getMonth();
          const isSel = isSameDay(d, selected);
          const isToday = isSameDay(d, today);
          return (
            <Pressable key={key} onPress={() => setSelected(d)} style={s.cellWrap}>
              <View style={[s.cell, isSel && s.cellSel, isToday && !isSel && s.cellToday]}>
                <Text
                  style={[
                    font.small,
                    { color: outside ? colors.textMuted : colors.text, opacity: outside ? 0.45 : 1 },
                    isSel && { color: colors.primary, fontWeight: '800' },
                  ]}
                >
                  {d.getDate()}
                </Text>
                <View style={s.cellDots}>
                  {list.slice(0, 3).map((e) => (
                    <View key={e.id} style={[s.cellDot, { backgroundColor: hexOf(e.color) }]} />
                  ))}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={s.agendaHead}>
        <Text style={[font.h3, { color: colors.text }]}>{fmtDayLabel(selected)}</Text>
        <Text style={[font.tiny, { color: colors.textMuted }]}>
          {dayEvents.length ? `${dayEvents.length} lịch` : 'trống'}
        </Text>
      </View>

      <FlatList
        data={dayEvents}
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Empty
            icon="calendar-clear-outline"
            title="Ngày này chưa có lịch"
            hint="Bấm nút + để tạo lịch — app sẽ nhắc trước giờ và đẩy lên Google Calendar."
          />
        }
        renderItem={({ item: e }) => {
          const hex = hexOf(e.color);
          const start = toDate(e.start);
          const end = toDate(e.end);
          return (
            <Card
              accent={hex}
              style={s.eventCard}
              onPress={() => navigation.navigate('EventForm', { id: e.id })}
            >
              <View style={[s.stripe, { backgroundColor: hex }]} />
              <View style={{ flex: 1 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text style={[font.body, { color: colors.text, flex: 1 }]} numberOfLines={1}>{e.title}</Text>
                  {e.googleEventId ? (
                    <Ionicons name="logo-google" size={13} color={colors.textMuted} />
                  ) : null}
                </Row>
                <Row style={{ marginTop: space[1] }}>
                  <Ionicons name="time-outline" size={13} color={colors.textSub} />
                  <Text style={[font.small, { color: colors.textSub }]}>
                    {e.allDay ? 'Cả ngày' : `${fmtTime(start)}${end ? ` – ${fmtTime(end)}` : ''}`}
                  </Text>
                </Row>
                {e.location ? (
                  <Row style={{ marginTop: space[1] }}>
                    <Ionicons name="location-outline" size={13} color={colors.textMuted} />
                    <Text style={[font.tiny, { color: colors.textMuted, flex: 1 }]} numberOfLines={1}>{e.location}</Text>
                  </Row>
                ) : null}
                {e.reminders?.length ? (
                  <Row style={{ marginTop: space[2] }}>
                    <Ionicons name="notifications-outline" size={12} color={colors.textMuted} />
                    <Text style={[font.tiny, { color: colors.textMuted }]}>
                      Nhắc trước {e.reminders.map((m) => (m >= 60 ? `${m / 60}h` : `${m}p`)).join(', ')}
                    </Text>
                  </Row>
                ) : null}
              </View>
            </Card>
          );
        }}
      />

      <FAB onPress={() => navigation.navigate('EventForm', { date: selected.toISOString() })} />
    </Screen>
  );
}

const s = StyleSheet.create({
  monthBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: space[4], marginBottom: space[2],
  },
  weekHead: { flexDirection: 'row', paddingHorizontal: space[3] },
  weekHeadCell: { flex: 1, textAlign: 'center', color: colors.textMuted, paddingBottom: space[2] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: space[3] },
  cellWrap: { width: `${100 / 7}%`, paddingHorizontal: 2, paddingVertical: 2 },
  cell: {
    height: 46, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'transparent',
  },
  cellSel: { backgroundColor: colors.primaryDim, borderColor: tint(colors.primary, 0.4) },
  cellToday: { borderColor: colors.borderStrong },
  cellDots: { flexDirection: 'row', gap: 3, marginTop: 3, height: 5 },
  cellDot: { width: 4, height: 4, borderRadius: 2 },
  agendaHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: space[4], paddingTop: space[4], paddingBottom: space[3],
    marginTop: space[2], borderTopWidth: 1, borderTopColor: colors.border,
  },
  eventCard: { flexDirection: 'row', gap: space[3], marginBottom: space[2], padding: space[3], overflow: 'hidden' },
  stripe: { width: 3, borderRadius: 2 },
});
