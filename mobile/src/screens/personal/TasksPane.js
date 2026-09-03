import React, { useMemo, useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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

// Item memoized để tránh re-render danh sách khi nhập form hoặc switch tab
const TaskItem = memo(function TaskItem({ item, onToggle, onEdit, onDelete }) {
  const pri = PRIORITIES.find((p) => p.value === item.priority) || PRIORITIES[1];
  const due = toDate(item.due);
  const overdue = due && !item.done && due < startOfDay(new Date());

  return (
    <Card
      style={[s.item, item.done && s.itemDone]}
      onPress={() => onEdit(item)}
    >
      <Pressable
        onPress={() => onToggle(item)}
        hitSlop={12}
        style={({ pressed }) => [s.checkBtn, pressed && { transform: [{ scale: 0.88 }] }]}
      >
        <Ionicons
          name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
          size={22}
          color={item.done ? colors.primary : colors.textMuted}
        />
      </Pressable>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            font.body,
            { color: item.done ? colors.textMuted : colors.text, fontWeight: item.done ? '400' : '600' },
            item.done && { textDecorationLine: 'line-through' },
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <Row style={{ marginTop: space[1] + 2, flexWrap: 'wrap' }} gap={space[2]}>
          {item.priority !== 'normal' ? (
            <Badge label={pri.label.toUpperCase()} color={pri.color} dot />
          ) : null}

          {due ? (
            <Row gap={3} style={s.dueRow}>
              <Ionicons
                name="calendar-outline"
                size={12}
                color={overdue ? colors.danger : colors.textMuted}
              />
              <Text style={[font.tiny, { color: overdue ? colors.danger : colors.textMuted, fontWeight: '600' }]}>
                {overdue ? 'Quá hạn · ' : ''}{fmtDate(due)}
              </Text>
            </Row>
          ) : null}

          {item.notes ? (
            <Row gap={2}>
              <Ionicons name="document-text-outline" size={12} color={colors.textMuted} />
              <Text style={[font.tiny, { color: colors.textMuted }]} numberOfLines={1}>Chi tiết</Text>
            </Row>
          ) : null}
        </Row>
      </View>

      <Pressable
        onPress={() => onDelete(item)}
        hitSlop={12}
        style={({ pressed }) => [s.deleteBtn, pressed && { opacity: 0.5 }]}
      >
        <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
      </Pressable>
    </Card>
  );
});

export default function TasksPane() {
  const { uid, tasks, create, update, remove } = useApp();
  const [filter, setFilter] = useState('open');
  const [sheet, setSheet] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showPicker, setShowPicker] = useState(false);

  const counts = useMemo(() => {
    const endToday = new Date();
    endToday.setHours(23, 59, 59, 999);

    let open = 0;
    let today = 0;
    let done = 0;

    tasks.forEach((t) => {
      if (!t.done) {
        open++;
        const d = toDate(t.due);
        if (d && d <= endToday) today++;
      } else {
        done++;
      }
    });

    return { open, today, done, all: tasks.length };
  }, [tasks]);

  const list = useMemo(() => {
    const endToday = new Date();
    endToday.setHours(23, 59, 59, 999);

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

  const openNew = useCallback(() => {
    setEditing(null);
    setForm(emptyForm);
    setSheet(true);
  }, []);

  const openEdit = useCallback((t) => {
    setEditing(t);
    setForm({
      title: t.title,
      notes: t.notes || '',
      priority: t.priority || 'normal',
      due: toDate(t.due),
    });
    setSheet(true);
  }, []);

  const toggleTask = useCallback((t) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    db.toggleTask(uid, t);
  }, [uid]);

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

  const confirmDelete = useCallback((t) => {
    Alert.alert('Xoá công việc?', t.title, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => remove('tasks', t.id) },
    ]);
  }, [remove]);

  const keyExtractor = useCallback((t) => t.id, []);

  const renderItem = useCallback(
    ({ item }) => (
      <TaskItem
        item={item}
        onToggle={toggleTask}
        onEdit={openEdit}
        onDelete={confirmDelete}
      />
    ),
    [toggleTask, openEdit, confirmDelete]
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Bộ lọc với đếm số lượng */}
      <Row style={s.filters} gap={space[2]}>
        {FILTERS.map((f) => (
          <Chip
            key={f.value}
            label={f.label}
            count={counts[f.value]}
            active={filter === f.value}
            onPress={() => setFilter(f.value)}
          />
        ))}
      </Row>

      <FlatList
        data={list}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
        ListHeaderComponent={
          counts.open ? (
            <Text style={[font.tiny, { color: colors.textMuted, marginBottom: space[3], fontWeight: '700' }]}>
              {counts.open} CÔNG VIỆC CẦN GIẢI QUYẾT
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <Empty
            icon="checkmark-done-circle-outline"
            title="Tuyệt vời! Không còn việc nào"
            hint="Nhấn vào nút + bên dưới để tạo công việc mới."
          />
        }
      />

      <FAB onPress={openNew} />

      <Sheet visible={sheet} onClose={() => setSheet(false)} title={editing ? 'Sửa công việc' : 'Công việc mới'}>
        <Field
          label="Tên công việc"
          value={form.title}
          onChangeText={(v) => setForm({ ...form, title: v })}
          placeholder="Ví dụ: Hoàn thiện tính năng xác thực Firebase"
        />
        <Text style={[font.small, { color: colors.textSub, marginBottom: space[2] }]}>Mức độ ưu tiên</Text>
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
              <Text style={[font.small, { color: colors.textMuted }]}>Bỏ hạn chót</Text>
            </Pressable>
          ) : null}
        </Row>
        <Field
          label="Ghi chú chi tiết"
          value={form.notes}
          onChangeText={(v) => setForm({ ...form, notes: v })}
          multiline
          placeholder="Mô tả công việc, link tài liệu hoặc checklist…"
        />
        <Btn title={editing ? 'Lưu thay đổi' : 'Thêm công việc'} icon="checkmark" onPress={save} />
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
  filters: {
    paddingHorizontal: space[4],
    paddingBottom: space[3],
    flexWrap: 'wrap',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[3],
    padding: space[3] + 2,
    marginBottom: space[2],
  },
  itemDone: {
    opacity: 0.65,
    backgroundColor: 'rgba(18, 18, 29, 0.4)',
  },
  checkBtn: {
    paddingTop: 1,
  },
  dueRow: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  deleteBtn: {
    padding: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
});
