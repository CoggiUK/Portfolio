import React, { useMemo, useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen, FAB, Empty, Sheet } from '../components/ui';
import { colors, space, font, hexOf, shadows } from '../theme';
import { useApp } from '../contexts/AppContext';
import {
  monthGrid, dayKey, isSameDay, startOfMonth, startOfWeek, addMonths, addDays, fmtTime,
  MONTHS, toDate,
} from '../utils/date';

const WEEK_HEAD = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const VI_DAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

const p2 = (n) => String(n).padStart(2, '0');

const fmtWeekRange = (selectedDate) => {
  const start = startOfWeek(selectedDate);
  const end = addDays(start, 6);
  return `${p2(start.getDate())}/${p2(start.getMonth() + 1)}/${start.getFullYear()} – ${p2(end.getDate())}/${p2(end.getMonth() + 1)}/${end.getFullYear()}`;
};

const fmtMonthHeader = (anchorDate) => {
  return `Tháng ${p2(anchorDate.getMonth() + 1)}/${anchorDate.getFullYear()}`;
};

const fmtFullDateVi = (d) => {
  return `${VI_DAYS[d.getDay()]}, ${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const TimelineEventItem = memo(function TimelineEventItem({ event, onPress }) {
  const start = toDate(event.start);
  const end = toDate(event.end);
  const timeStr = event.allDay
    ? 'Cả ngày'
    : `${start ? fmtTime(start) : '00:00'} → ${end ? fmtTime(end) : '23:59'}`;

  let statusLabel = 'CHƯA BẮT ĐẦU';
  let statusBg = '#F1F5F9';
  let statusColor = '#475569';
  let dotColor = '#94A3B8';

  if (event.status === 'doing' || event.doing) {
    statusLabel = 'ĐANG XỬ LÝ';
    statusBg = '#FFF7ED';
    statusColor = '#EA580C';
    dotColor = '#F97316';
  } else if (event.status === 'done' || event.done) {
    statusLabel = 'HOÀN THÀNH';
    statusBg = '#ECFDF5';
    statusColor = '#10B981';
    dotColor = '#10B981';
  } else if (event.status === 'overdue' || event.overdue) {
    statusLabel = 'QUÁ HẠN';
    statusBg = '#FEF2F2';
    statusColor = '#EF4444';
    dotColor = '#EF4444';
  }

  const category = event.category || (event.location ? event.location : 'Việc cá nhân');

  return (
    <View style={s.timelineRow}>
      {/* Timeline left dot and line */}
      <View style={s.timelineTrack}>
        <View style={[s.timelineDot, { backgroundColor: dotColor }]} />
        <View style={s.timelineLine} />
      </View>

      {/* Card Content */}
      <Pressable
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          onPress();
        }}
        style={({ pressed }) => [s.timelineCard, pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] }]}
      >
        <View style={s.timelineCardHead}>
          <Text style={[font.h3, { color: '#0F172A', fontWeight: '700', flex: 1 }]} numberOfLines={1}>
            {event.title}
          </Text>
          <View style={[s.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[font.tiny, { color: statusColor, fontWeight: '700' }]}>
              {statusLabel}
            </Text>
          </View>
        </View>

        <View style={s.timelineCardSub}>
          <Text style={[font.small, { color: '#64748B' }]}>{timeStr}</Text>
          <Text style={[font.small, { color: '#64748B' }]}>{category}</Text>
        </View>
      </Pressable>
    </View>
  );
});

export default function CalendarScreen({ navigation }) {
  const { events } = useApp();
  const [anchor, setAnchor] = useState(startOfMonth(new Date()));
  const [selected, setSelected] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' | 'month'
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerYear, setPickerYear] = useState(anchor.getFullYear());

  // Gom sự kiện theo ngày
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

  const grid = useMemo(
    () => (viewMode === 'week' ? Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(selected), i)) : monthGrid(anchor)),
    [viewMode, anchor, selected]
  );

  const dayEvents = byDay[dayKey(selected)] || [];
  const today = new Date();

  // Thống kê trạng thái cho ngày đã chọn
  const statusCounts = useMemo(() => {
    let done = 0, doing = 0, overdue = 0, todo = 0;
    dayEvents.forEach((e) => {
      if (e.status === 'done' || e.done) done++;
      else if (e.status === 'doing') doing++;
      else if (e.status === 'overdue') overdue++;
      else todo++;
    });
    return { done, doing, overdue, todo };
  }, [dayEvents]);

  const selectDate = useCallback((d) => {
    Haptics.selectionAsync().catch(() => {});
    setSelected(d);
    setAnchor(startOfMonth(d));
  }, []);

  const goPrev = useCallback(() => {
    Haptics.selectionAsync().catch(() => {});
    if (viewMode === 'week') {
      const d = addDays(selected, -7);
      setSelected(d);
      setAnchor(startOfMonth(d));
    } else {
      setAnchor((a) => addMonths(a, -1));
    }
  }, [viewMode, selected]);

  const goNext = useCallback(() => {
    Haptics.selectionAsync().catch(() => {});
    if (viewMode === 'week') {
      const d = addDays(selected, 7);
      setSelected(d);
      setAnchor(startOfMonth(d));
    } else {
      setAnchor((a) => addMonths(a, 1));
    }
  }, [viewMode, selected]);

  const toggleViewMode = useCallback(() => {
    Haptics.selectionAsync().catch(() => {});
    setViewMode((v) => (v === 'month' ? 'week' : 'month'));
  }, []);

  const keyExtractor = useCallback((e) => e.id, []);

  const renderItem = useCallback(
    ({ item }) => (
      <TimelineEventItem
        event={item}
        onPress={() => navigation.navigate('EventForm', { id: item.id })}
      />
    ),
    [navigation]
  );

  return (
    <Screen style={{ paddingBottom: space[8] }}>
      {/* Top Navigation Bar with Rounded Chevrons */}
      <View style={s.topNavRow}>
        <Pressable onPress={goPrev} style={({ pressed }) => [s.navCircleBtn, pressed && s.navCirclePressed]}>
          <Ionicons name="chevron-back" size={18} color="#0F172A" />
        </Pressable>

        <Pressable
          onPress={() => setPickerVisible(true)}
          style={({ pressed }) => [s.titlePill, pressed && { opacity: 0.8 }]}
        >
          <Text style={s.titlePillText}>
            {viewMode === 'week' ? fmtWeekRange(selected) : fmtMonthHeader(anchor)}
          </Text>
        </Pressable>

        <Pressable onPress={goNext} style={({ pressed }) => [s.navCircleBtn, pressed && s.navCirclePressed]}>
          <Ionicons name="chevron-forward" size={18} color="#0F172A" />
        </Pressable>
      </View>

      {/* Calendar Grid Card */}
      <View style={s.calendarCard}>
        {/* Weekday Row Header */}
        <View style={s.weekHeadRow}>
          {WEEK_HEAD.map((w) => (
            <Text key={w} style={s.weekHeadCell}>
              {w}
            </Text>
          ))}
        </View>

        {/* Days Grid */}
        <View style={s.gridRow}>
          {grid.map((d) => {
            const key = dayKey(d);
            const list = byDay[key] || [];
            const hasEvents = list.length > 0;
            const outside = viewMode === 'month' && d.getMonth() !== anchor.getMonth();
            const isSel = isSameDay(d, selected);
            const isTodayDate = isSameDay(d, today);

            return (
              <Pressable
                key={key}
                onPress={() => selectDate(d)}
                style={s.cellSlot}
              >
                <View
                  style={[
                    s.cellPill,
                    isSel && s.cellPillSelected,
                    isTodayDate && !isSel && s.cellPillToday,
                  ]}
                >
                  <Text
                    style={[
                      s.cellNum,
                      outside && s.cellNumOutside,
                      isSel && s.cellNumSelected,
                    ]}
                  >
                    {d.getDate()}
                  </Text>
                  {/* Indicator Dot */}
                  <View
                    style={[
                      s.dot,
                      hasEvents && s.dotVisible,
                      isSel && hasEvents && s.dotSelected,
                    ]}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Bottom Expand / Collapse Toggle Chevron */}
        <Pressable onPress={toggleViewMode} style={s.expandToggleRow} hitSlop={12}>
          <Ionicons
            name={viewMode === 'week' ? 'chevron-down' : 'chevron-up'}
            size={18}
            color="#64748B"
          />
        </Pressable>
      </View>

      {/* Selected Date Agenda Header */}
      <View style={s.agendaHeader}>
        <View style={s.agendaTitleRow}>
          <Text style={s.selectedDateTitle}>{fmtFullDateVi(selected)}</Text>
          <Text style={s.taskCountOrange}>
            {dayEvents.length} công việc
          </Text>
        </View>
        <Text style={s.statusSummarySubtitle}>
          {`${statusCounts.done} hoàn thành · ${statusCounts.doing} đang xử lý · ${statusCounts.overdue} quá hạn · ${statusCounts.todo} chưa bắt đầu`}
        </Text>
      </View>

      {/* Timeline Event List */}
      <FlatList
        data={dayEvents}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={12}
        removeClippedSubviews={Platform.OS !== 'web'}
        ListEmptyComponent={
          <Empty
            icon="calendar-clear-outline"
            title="Không có lịch trong ngày này"
            hint="Nhấn nút + bên dưới để thêm lịch trình mới."
          />
        }
      />

      <FAB onPress={() => navigation.navigate('EventForm', { date: selected.toISOString() })} />

      {/* Month/Year Picker Sheet */}
      <Sheet visible={pickerVisible} onClose={() => setPickerVisible(false)} title="Chọn tháng / năm">
        <View style={s.pickerYearRow}>
          <Pressable onPress={() => setPickerYear((y) => y - 1)} style={s.navCircleBtn}>
            <Ionicons name="chevron-back" size={18} color="#0F172A" />
          </Pressable>
          <Text style={[font.h1, { color: colors.text }]}>{pickerYear}</Text>
          <Pressable onPress={() => setPickerYear((y) => y + 1)} style={s.navCircleBtn}>
            <Ionicons name="chevron-forward" size={18} color="#0F172A" />
          </Pressable>
        </View>
        <View style={s.monthPickerGrid}>
          {MONTHS.map((m, idx) => {
            const isCurrent = idx === anchor.getMonth() && pickerYear === anchor.getFullYear();
            return (
              <Pressable
                key={m}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  const d = new Date(pickerYear, idx, 1);
                  setAnchor(d);
                  setSelected(d);
                  setPickerVisible(false);
                }}
                style={[s.monthOption, isCurrent && s.monthOptionActive]}
              >
                <Text style={[font.small, { color: isCurrent ? '#FFFFFF' : colors.text, fontWeight: '700' }]}>
                  {m}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Sheet>
    </Screen>
  );
}

const s = StyleSheet.create({
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[4],
    marginVertical: space[3],
  },
  navCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  navCirclePressed: {
    backgroundColor: '#F1F5F9',
  },
  titlePill: {
    paddingHorizontal: space[3],
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  titlePillText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: space[3] + 2,
    marginHorizontal: space[4],
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: space[4],
    ...shadows.card,
  },
  weekHeadRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekHeadCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cellSlot: {
    width: '14.28%',
    alignItems: 'center',
    marginVertical: 3,
  },
  cellPill: {
    width: 38,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  cellPillToday: {
    borderWidth: 1.5,
    borderColor: '#F97316',
  },
  cellPillSelected: {
    backgroundColor: '#F97316',
    ...shadows.sm,
  },
  cellNum: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  cellNumOutside: {
    color: '#CBD5E1',
  },
  cellNumSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginTop: 2,
  },
  dotVisible: {
    backgroundColor: '#F97316',
  },
  dotSelected: {
    backgroundColor: '#FFFFFF',
  },
  expandToggleRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  agendaHeader: {
    paddingHorizontal: space[4],
    marginBottom: space[3],
  },
  agendaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  taskCountOrange: {
    fontSize: 15,
    fontWeight: '800',
    color: '#EA580C',
  },
  statusSummarySubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '500',
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: space[3],
  },
  timelineTrack: {
    width: 24,
    alignItems: 'center',
    marginRight: space[2],
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F97316',
    marginTop: 16,
    zIndex: 2,
  },
  timelineLine: {
    position: 'absolute',
    top: 20,
    bottom: -20,
    width: 2,
    backgroundColor: '#E2E8F0',
  },
  timelineCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: space[3] + 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...shadows.card,
  },
  timelineCardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  timelineCardSub: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space[2],
  },
  pickerYearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: space[3],
  },
  monthPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
    justifyContent: 'center',
  },
  monthOption: {
    width: '30%',
    paddingVertical: space[3],
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthOptionActive: {
    backgroundColor: '#F97316',
    borderColor: '#EA580C',
  },
});
