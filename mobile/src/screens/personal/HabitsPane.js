import React, { useMemo, useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card, FAB, Empty, Row, Field, Btn, Sheet, SectionTitle, Badge } from '../../components/ui';
import { colors, space, radius, font, palette, hexOf, tint, shadows } from '../../theme';
import { useApp } from '../../contexts/AppContext';
import * as db from '../../services/db';
import { dayKey, addDays, startOfWeek } from '../../utils/date';

const emptyForm = { name: '', color: 'green', target: 7 };
const WEEK_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/** Số ngày liên tiếp tính lùi từ hôm nay */
const streakOf = (history = {}) => {
  let n = 0;
  const today = new Date();
  if (!history[dayKey(today)] && !history[dayKey(addDays(today, -1))]) return 0;
  let cursor = history[dayKey(today)] ? today : addDays(today, -1);
  while (history[dayKey(cursor)]) {
    n += 1;
    cursor = addDays(cursor, -1);
  }
  return n;
};

// Component thẻ thói quen được memo hóa
const HabitCard = memo(function HabitCard({ habit, week, last30, onToggleDay, onEdit, onDelete }) {
  const hex = hexOf(habit.color);
  const streak = streakOf(habit.history);
  const done30 = useMemo(
    () => last30.filter((d) => habit.history?.[dayKey(d)]).length,
    [last30, habit.history]
  );
  const now = new Date();

  return (
    <Card style={s.habitCard} accent={hex}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Pressable onPress={() => onEdit(habit)} style={{ flex: 1 }}>
          <Row gap={space[2]}>
            <View style={[s.dot, { backgroundColor: hex }]} />
            <Text style={[font.h3, { color: colors.text, flex: 1, fontWeight: '700' }]} numberOfLines={1}>
              {habit.name}
            </Text>
          </Row>

          <Row style={{ marginTop: space[1] + 2 }} gap={space[3]}>
            {streak > 0 ? (
              <View style={[s.streakBadge, shadows.glow(colors.amber, 0.25, 8)]}>
                <Ionicons name="flame" size={13} color={colors.amber} />
                <Text style={[font.tiny, { color: colors.amber, fontWeight: '700' }]}>
                  {streak} NGÀY LIÊN TIẾP
                </Text>
              </View>
            ) : (
              <Row gap={3}>
                <Ionicons name="flame-outline" size={13} color={colors.textMuted} />
                <Text style={[font.tiny, { color: colors.textMuted }]}>Chưa có chuỗi</Text>
              </Row>
            )}
            <Text style={[font.tiny, { color: colors.textSub }]}>
              {done30}/30 ngày qua ({Math.round((done30 / 30) * 100)}%)
            </Text>
          </Row>
        </Pressable>

        <Pressable
          onPress={() => onDelete(habit)}
          hitSlop={12}
          style={({ pressed }) => [s.trashBtn, pressed && { opacity: 0.5 }]}
        >
          <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
        </Pressable>
      </Row>

      {/* Dải 7 ngày trong tuần */}
      <Row style={{ marginTop: space[3], justifyContent: 'space-between' }} gap={space[1]}>
        {week.map((d, i) => {
          const key = dayKey(d);
          const on = !!habit.history?.[key];
          const future = d > now;

          return (
            <Pressable
              key={key}
              disabled={future}
              onPress={() => onToggleDay(habit, key)}
              style={({ pressed }) => [
                s.day,
                on && { backgroundColor: tint(hex, 0.22), borderColor: hex },
                future && { opacity: 0.25 },
                pressed && !future && { transform: [{ scale: 0.92 }] },
              ]}
            >
              <Text style={[font.tiny, { color: on ? hex : colors.textMuted, fontWeight: '600' }]}>
                {WEEK_LABELS[i]}
              </Text>
              <Text style={[font.small, { color: on ? hex : colors.textSub, fontWeight: '800' }]}>
                {d.getDate()}
              </Text>
              {on ? (
                <View style={[s.checkMicroDot, { backgroundColor: hex }]} />
              ) : null}
            </Pressable>
          );
        })}
      </Row>

      {/* Heatmap 30 ngày */}
      <View style={s.heat}>
        {last30.map((d) => {
          const on = !!habit.history?.[dayKey(d)];
          return (
            <View
              key={dayKey(d)}
              style={[
                s.heatCell,
                { backgroundColor: on ? hex : 'rgba(255,255,255,0.06)' },
              ]}
            />
          );
        })}
      </View>
    </Card>
  );
});

export default function HabitsPane() {
  const { uid, habits, create, update, remove } = useApp();
  const [sheet, setSheet] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const week = useMemo(() => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, []);

  const today = dayKey(new Date());
  const last30 = useMemo(() => Array.from({ length: 30 }, (_, i) => addDays(new Date(), -(29 - i))), []);

  const openNew = useCallback(() => {
    setEditing(null);
    setForm(emptyForm);
    setSheet(true);
  }, []);

  const openEdit = useCallback((h) => {
    setEditing(h);
    setForm({ name: h.name, color: h.color || 'green', target: h.target || 7 });
    setSheet(true);
  }, []);

  const toggleDay = useCallback((h, key) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    db.toggleHabitDay(uid, h, key);
  }, [uid]);

  const save = async () => {
    if (!form.name.trim()) return;
    const payload = { name: form.name.trim(), color: form.color, target: Number(form.target) || 7 };
    if (editing) await update('habits', editing.id, payload);
    else await create('habits', { ...payload, history: {} });
    setSheet(false);
  };

  const confirmDelete = useCallback((h) => {
    Alert.alert('Xoá thói quen?', `"${h.name}" và toàn bộ lịch sử duy trì sẽ bị xoá.`, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => remove('habits', h.id) },
    ]);
  }, [remove]);

  const doneToday = habits.filter((h) => h.history?.[today]).length;
  const pct = habits.length ? Math.round((doneToday / habits.length) * 100) : 0;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {habits.length ? (
          <Card style={s.summaryCard}>
            <Row style={{ justifyContent: 'space-between' }}>
              <View>
                <Text style={[font.num, { color: colors.text }]}>{doneToday}/{habits.length}</Text>
                <Text style={[font.tiny, { color: colors.textMuted, letterSpacing: 0.5 }]}>
                  THÓI QUEN HOÀN THÀNH HÔM NAY
                </Text>
                {pct === 100 ? (
                  <Row gap={4} style={{ marginTop: 4 }}>
                    <Ionicons name="sparkles" size={13} color={colors.primary} />
                    <Text style={[font.tiny, { color: colors.primary, fontWeight: '700' }]}>Xuất sắc! Đã hoàn thành 100%</Text>
                  </Row>
                ) : null}
              </View>
              <View style={[s.ring, { borderColor: pct === 100 ? colors.primary : tint(colors.primary, 0.3) }]}>
                <Text style={[font.h2, { color: colors.primary, fontWeight: '800' }]}>
                  {pct}%
                </Text>
              </View>
            </Row>
          </Card>
        ) : null}

        {habits.length ? <SectionTitle>Tiến độ tuần & chuỗi ngày</SectionTitle> : null}

        {habits.map((h) => (
          <HabitCard
            key={h.id}
            habit={h}
            week={week}
            last30={last30}
            onToggleDay={toggleDay}
            onEdit={openEdit}
            onDelete={confirmDelete}
          />
        ))}

        {!habits.length ? (
          <Empty
            icon="leaf-outline"
            title="Chưa theo dõi thói quen nào"
            hint="Thêm các thói quen nhỏ như đọc sách, chạy bộ để tích lũy chuỗi hàng ngày."
          />
        ) : null}
      </ScrollView>

      <FAB onPress={openNew} />

      <Sheet visible={sheet} onClose={() => setSheet(false)} title={editing ? 'Sửa thói quen' : 'Thói quen mới'}>
        <Field
          label="Tên thói quen"
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
          placeholder="Ví dụ: Đọc sách 20 phút mỗi ngày"
        />
        <Text style={[font.small, { color: colors.textSub, marginBottom: space[2] }]}>Màu đại diện</Text>
        <Row gap={space[2]} style={{ marginBottom: space[4], flexWrap: 'wrap' }}>
          {palette.map((p) => (
            <Pressable
              key={p.key}
              onPress={() => setForm({ ...form, color: p.key })}
              style={[
                s.swatch,
                {
                  backgroundColor: tint(p.hex, 0.18),
                  borderColor: form.color === p.key ? p.hex : 'transparent',
                },
              ]}
            >
              <View style={[s.dot, { backgroundColor: p.hex }]} />
            </Pressable>
          ))}
        </Row>
        <Btn title={editing ? 'Lưu thay đổi' : 'Tạo thói quen'} icon="checkmark" onPress={save} />
      </Sheet>
    </View>
  );
}

const s = StyleSheet.create({
  summaryCard: {
    marginBottom: space[3],
    padding: space[4],
  },
  habitCard: {
    marginBottom: space[3],
    padding: space[3] + 2,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  ring: {
    width: 62,
    height: 62,
    borderRadius: radius.pill,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 136, 0.06)',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: tint(colors.amber, 0.14),
  },
  trashBtn: {
    padding: 4,
  },
  day: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: space[2],
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  checkMicroDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 1,
  },
  heat: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginTop: space[3],
    paddingTop: space[2],
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  heatCell: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  swatch: {
    width: 44,
    height: 38,
    borderRadius: radius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
