import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, FAB, Empty, Row, Field, Btn, Sheet, SectionTitle } from '../../components/ui';
import { colors, space, radius, font, palette, hexOf, tint } from '../../theme';
import { useApp } from '../../contexts/AppContext';
import * as db from '../../services/db';
import { dayKey, addDays, startOfWeek } from '../../utils/date';

const emptyForm = { name: '', color: 'green', target: 7 };
const WEEK_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/** Số ngày liên tiếp tính lùi từ hôm nay (hôm nay chưa tick vẫn tính từ hôm qua). */
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

  const openNew = () => { setEditing(null); setForm(emptyForm); setSheet(true); };
  const openEdit = (h) => {
    setEditing(h);
    setForm({ name: h.name, color: h.color || 'green', target: h.target || 7 });
    setSheet(true);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    const payload = { name: form.name.trim(), color: form.color, target: Number(form.target) || 7 };
    if (editing) await update('habits', editing.id, payload);
    else await create('habits', { ...payload, history: {} });
    setSheet(false);
  };

  const confirmDelete = (h) =>
    Alert.alert('Xoá thói quen?', `"${h.name}" và toàn bộ lịch sử sẽ mất.`, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => remove('habits', h.id) },
    ]);

  const doneToday = habits.filter((h) => h.history?.[today]).length;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        {habits.length ? (
          <Card style={{ marginBottom: space[3] }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <View>
                <Text style={[font.h2, { color: colors.text }]}>{doneToday}/{habits.length}</Text>
                <Text style={[font.tiny, { color: colors.textMuted }]}>HOÀN THÀNH HÔM NAY</Text>
              </View>
              <View style={s.ring}>
                <Text style={[font.h3, { color: colors.primary }]}>
                  {habits.length ? Math.round((doneToday / habits.length) * 100) : 0}%
                </Text>
              </View>
            </Row>
          </Card>
        ) : null}

        {habits.length ? <SectionTitle>Tuần này</SectionTitle> : null}

        {habits.map((h) => {
          const hex = hexOf(h.color);
          const streak = streakOf(h.history);
          const done30 = last30.filter((d) => h.history?.[dayKey(d)]).length;
          return (
            <Card key={h.id} style={{ marginBottom: space[3] }} accent={hex}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Pressable onPress={() => openEdit(h)} style={{ flex: 1 }}>
                  <Row>
                    <View style={[s.dot, { backgroundColor: hex }]} />
                    <Text style={[font.h3, { color: colors.text, flex: 1 }]} numberOfLines={1}>{h.name}</Text>
                  </Row>
                  <Row style={{ marginTop: space[1] }} gap={space[3]}>
                    <Row gap={3}>
                      <Ionicons name="flame-outline" size={13} color={streak ? colors.amber : colors.textMuted} />
                      <Text style={[font.tiny, { color: streak ? colors.amber : colors.textMuted }]}>
                        {streak} ngày liên tiếp
                      </Text>
                    </Row>
                    <Text style={[font.tiny, { color: colors.textMuted }]}>{done30}/30 ngày qua</Text>
                  </Row>
                </Pressable>
                <Pressable onPress={() => confirmDelete(h)} hitSlop={10}>
                  <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
                </Pressable>
              </Row>

              <Row style={{ marginTop: space[3], justifyContent: 'space-between' }} gap={space[1]}>
                {week.map((d, i) => {
                  const key = dayKey(d);
                  const on = !!h.history?.[key];
                  const future = d > new Date();
                  return (
                    <Pressable
                      key={key}
                      disabled={future}
                      onPress={() => db.toggleHabitDay(uid, h, key)}
                      style={[
                        s.day,
                        on && { backgroundColor: tint(hex, 0.22), borderColor: hex },
                        future && { opacity: 0.3 },
                      ]}
                    >
                      <Text style={[font.tiny, { color: on ? hex : colors.textMuted }]}>{WEEK_LABELS[i]}</Text>
                      <Text style={[font.small, { color: on ? hex : colors.textSub, fontWeight: '700' }]}>
                        {d.getDate()}
                      </Text>
                    </Pressable>
                  );
                })}
              </Row>

              <View style={s.heat}>
                {last30.map((d) => {
                  const on = !!h.history?.[dayKey(d)];
                  return <View key={dayKey(d)} style={[s.heatCell, { backgroundColor: on ? hex : 'rgba(255,255,255,0.06)' }]} />;
                })}
              </View>
            </Card>
          );
        })}

        {!habits.length ? (
          <Empty icon="leaf-outline" title="Chưa theo dõi thói quen nào"
            hint="Thêm 2–3 thói quen nhỏ và giữ chuỗi mỗi ngày." />
        ) : null}
      </ScrollView>

      <FAB onPress={openNew} />

      <Sheet visible={sheet} onClose={() => setSheet(false)} title={editing ? 'Sửa thói quen' : 'Thói quen mới'}>
        <Field label="Tên thói quen" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })}
          placeholder="Đọc 20 trang sách" />
        <Text style={[font.small, { color: colors.textSub, marginBottom: space[2] }]}>Màu</Text>
        <Row gap={space[2]} style={{ marginBottom: space[4], flexWrap: 'wrap' }}>
          {palette.map((p) => (
            <Pressable key={p.key} onPress={() => setForm({ ...form, color: p.key })}
              style={[s.swatch, { backgroundColor: tint(p.hex, 0.2), borderColor: form.color === p.key ? p.hex : 'transparent' }]}>
              <View style={[s.dot, { backgroundColor: p.hex }]} />
            </Pressable>
          ))}
        </Row>
        <Btn title={editing ? 'Lưu' : 'Thêm thói quen'} icon="checkmark" onPress={save} />
      </Sheet>
    </View>
  );
}

const s = StyleSheet.create({
  dot: { width: 10, height: 10, borderRadius: 5 },
  ring: {
    width: 58, height: 58, borderRadius: radius.pill, borderWidth: 3, borderColor: colors.primaryDim,
    alignItems: 'center', justifyContent: 'center',
  },
  day: {
    flex: 1, alignItems: 'center', gap: 2, paddingVertical: space[2],
    borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border,
  },
  heat: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginTop: space[3] },
  heatCell: { width: 8, height: 8, borderRadius: 2 },
  swatch: { width: 44, height: 36, borderRadius: radius.sm, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
