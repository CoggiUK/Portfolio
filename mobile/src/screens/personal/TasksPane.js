import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Card, FAB, Empty, Chip, Row, Field, Btn, Sheet, Badge } from '../../components/ui';
import { colors, space, radius, font, tint } from '../../theme';
import { useApp } from '../../contexts/AppContext';
import * as db from '../../services/db';
import { toDate, fmtDate, startOfDay } from '../../utils/date';

const PRIORITIES = [
  { value: 'low', label: 'Thấp', color: colors.textSub },
  { value: 'normal', label: 'Bình thường', color: colors.cyan },
  { value: 'high', label: 'Gấp', color: colors.danger },
];

const FILTERS = [
  { value: 'open', label: 'Đang mở' },
  { value: 'today', label: 'Hôm nay' },
  { value: 'done', label: 'Đã xong' },
  { value: 'all', label: 'Tất cả' },
];

const emptyForm = { title: '', notes: '', priority: 'normal', due: null };

export default function TasksPane() {
  const { uid, tasks, create, update, remove } = useApp();
  const [filter, setFilter] = useState('open');
  const [sheet, setSheet] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showPicker, setShowPicker] = useState(false);

  const list = useMemo(() => {
    const endToday = new Date(); endToday.setHours(23, 59, 59, 999);
    return tasks.filter((t) => {
      if (filter === 'open') return !t.done;
      if (filter === 'done') return t.done;
      if (filter === 'today') {
        const d = toDate(t.due);
        return !t.done && d && d <= endToday;
      }
      return true;
    });
  }, [tasks, filter]);

  const openNew = () => { setEditing(null); setForm(emptyForm); setSheet(true); };
  const openEdit = (t) => {
    setEditing(t);
    setForm({ title: t.title, notes: t.notes || '', priority: t.priority || 'normal', due: toDate(t.due) });
    setSheet(true);
  };

  const save = async () => {
    if (!form.title.trim()) return;
    const payload = {
      title: form.title.trim(),
      notes: form.notes.trim(),
      priority: form.priority,
      due: form.due || null,
    };
    if (editing) await update('tasks', editing.id, payload);
    else await create('tasks', { ...payload, done: false, doneAt: null });
    setSheet(false);
  };

  const confirmDelete = (t) =>
    Alert.alert('Xoá việc?', t.title, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => remove('tasks', t.id) },
    ]);

  const openCount = tasks.filter((t) => !t.done).length;

  return (
    <View style={{ flex: 1 }}>
      <Row style={s.filters} gap={space[2]}>
        {FILTERS.map((f) => (
          <Chip key={f.value} label={f.label} active={filter === f.value} onPress={() => setFilter(f.value)} />
        ))}
      </Row>

      <FlatList
        data={list}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          openCount ? (
            <Text style={[font.tiny, { color: colors.textMuted, marginBottom: space[3] }]}>
              CÒN {openCount} VIỆC CHƯA XONG
            </Text>
          ) : null
        }
        ListEmptyComponent={<Empty icon="checkmark-done-outline" title="Không có việc nào" hint="Bấm + để thêm việc cần làm." />}
        renderItem={({ item: t }) => {
          const pri = PRIORITIES.find((p) => p.value === t.priority) || PRIORITIES[1];
          const due = toDate(t.due);
          const overdue = due && !t.done && due < startOfDay(new Date());
          return (
            <Card style={s.item} onPress={() => openEdit(t)}>
              <Pressable onPress={() => db.toggleTask(uid, t)} hitSlop={10}>
                <Ionicons
                  name={t.done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={t.done ? colors.primary : colors.textMuted}
                />
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text
                  style={[font.body, { color: t.done ? colors.textMuted : colors.text },
                    t.done && { textDecorationLine: 'line-through' }]}
                  numberOfLines={2}
                >
                  {t.title}
                </Text>
                <Row style={{ marginTop: space[1], flexWrap: 'wrap' }} gap={space[2]}>
                  {t.priority !== 'normal' ? <Badge label={pri.label.toUpperCase()} color={pri.color} /> : null}
                  {due ? (
                    <Row gap={3}>
                      <Ionicons name="flag-outline" size={12} color={overdue ? colors.danger : colors.textMuted} />
                      <Text style={[font.tiny, { color: overdue ? colors.danger : colors.textMuted }]}>
                        {overdue ? 'Quá hạn · ' : ''}{fmtDate(due)}
                      </Text>
                    </Row>
                  ) : null}
                  {t.notes ? <Ionicons name="document-text-outline" size={12} color={colors.textMuted} /> : null}
                </Row>
              </View>
              <Pressable onPress={() => confirmDelete(t)} hitSlop={10}>
                <Ionicons name="trash-outline" size={17} color={colors.textMuted} />
              </Pressable>
            </Card>
          );
        }}
      />

      <FAB onPress={openNew} />

      <Sheet visible={sheet} onClose={() => setSheet(false)} title={editing ? 'Sửa việc' : 'Việc mới'}>
        <Field
          label="Tên việc"
          value={form.title}
          onChangeText={(v) => setForm({ ...form, title: v })}
          placeholder="Hoàn thiện wireframe màn Dashboard"
        />
        <Text style={[font.small, { color: colors.textSub, marginBottom: space[2] }]}>Mức ưu tiên</Text>
        <Row gap={space[2]} style={{ marginBottom: space[3] }}>
          {PRIORITIES.map((p) => (
            <Chip
              key={p.value}
              label={p.label}
              color={p.color}
              active={form.priority === p.value}
              onPress={() => setForm({ ...form, priority: p.value })}
            />
          ))}
        </Row>
        <Text style={[font.small, { color: colors.textSub, marginBottom: space[2] }]}>Hạn chót</Text>
        <Row gap={space[2]} style={{ marginBottom: space[3] }}>
          <Pressable onPress={() => setShowPicker(true)} style={s.pill}>
            <Ionicons name="calendar-outline" size={14} color={colors.textSub} />
            <Text style={[font.small, { color: colors.text }]}>
              {form.due ? fmtDate(form.due) : 'Chọn ngày'}
            </Text>
          </Pressable>
          {form.due ? (
            <Pressable onPress={() => setForm({ ...form, due: null })} style={s.pill}>
              <Text style={[font.small, { color: colors.textMuted }]}>Bỏ hạn</Text>
            </Pressable>
          ) : null}
        </Row>
        <Field
          label="Ghi chú"
          value={form.notes}
          onChangeText={(v) => setForm({ ...form, notes: v })}
          multiline
          placeholder="Chi tiết, link tham chiếu…"
        />
        <Btn title={editing ? 'Lưu' : 'Thêm việc'} icon="checkmark" onPress={save} />
      </Sheet>

      {showPicker ? (
        <DateTimePicker
          value={form.due || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          themeVariant="dark"
          onChange={(e, d) => {
            setShowPicker(false);
            if (e.type !== 'dismissed' && d) setForm((f) => ({ ...f, due: d }));
          }}
        />
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  filters: { paddingHorizontal: space[4], paddingBottom: space[3], flexWrap: 'wrap' },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3], padding: space[3], marginBottom: space[2] },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: space[2],
    paddingHorizontal: space[3], paddingVertical: space[2],
    borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
});
