import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen, Header, Card, Field, Btn, Chip, Row, SwitchRow, SectionTitle, IconBtn, Banner,
} from '../components/ui';
import { colors, space, radius, font, palette, tint } from '../theme';
import { useApp } from '../contexts/AppContext';
import { REMINDER_CHOICES, DEFAULT_REMINDERS } from '../services/notifications';
import { toDate, fmtDate, fmtTime } from '../utils/date';

/** Làm tròn lên mốc 15 phút gần nhất cho gợi ý giờ bắt đầu. */
const nextSlot = (base) => {
  const d = new Date(base);
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  return d;
};

export default function EventFormScreen({ navigation, route }) {
  const { id, date } = route.params || {};
  const { events, saveEvent, deleteEvent, googleConnected, prefs } = useApp();
  const existing = useMemo(() => events.find((e) => e.id === id), [events, id]);

  const initialStart = existing
    ? toDate(existing.start)
    : nextSlot(date ? new Date(date) : new Date());
  const initialEnd = existing
    ? toDate(existing.end) || new Date(initialStart.getTime() + 3600000)
    : new Date(initialStart.getTime() + 3600000);

  const [title, setTitle] = useState(existing?.title || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [location, setLocation] = useState(existing?.location || '');
  const [allDay, setAllDay] = useState(!!existing?.allDay);
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [color, setColor] = useState(existing?.color || 'green');
  const [reminders, setReminders] = useState(existing?.reminders || DEFAULT_REMINDERS);
  const [picker, setPicker] = useState(null); // { field: 'start'|'end', mode: 'date'|'time' }
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onPicked = (event, picked) => {
    const field = picker?.field;
    setPicker(Platform.OS === 'ios' ? picker : null);
    if (event.type === 'dismissed' || !picked || !field) {
      if (Platform.OS !== 'ios') setPicker(null);
      return;
    }
    const current = field === 'start' ? start : end;
    const next = new Date(current);
    if (picker.mode === 'date') {
      next.setFullYear(picked.getFullYear(), picked.getMonth(), picked.getDate());
    } else {
      next.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
    }
    if (field === 'start') {
      setStart(next);
      // Giữ nguyên thời lượng khi dời giờ bắt đầu.
      const dur = Math.max(end.getTime() - current.getTime(), 15 * 60000);
      setEnd(new Date(next.getTime() + dur));
    } else {
      setEnd(next < start ? new Date(start.getTime() + 15 * 60000) : next);
    }
    if (Platform.OS === 'ios') setPicker(null);
  };

  const toggleReminder = (m) =>
    setReminders((r) => (r.includes(m) ? r.filter((x) => x !== m) : [...r, m].sort((a, b) => a - b)));

  const submit = async () => {
    if (!title.trim()) return setError('Nhập tiêu đề cho lịch.');
    setBusy(true);
    setError('');
    try {
      await saveEvent(
        {
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          allDay,
          start,
          end,
          color,
          reminders,
          ...(existing
            ? { googleEventId: existing.googleEventId || null, googleCalendarId: existing.googleCalendarId || null }
            : {}),
        },
        id
      );
      navigation.goBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = () =>
    Alert.alert('Xoá lịch?', `"${existing?.title}" sẽ bị xoá khỏi app${existing?.googleEventId ? ' và Google Calendar' : ''}.`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          await deleteEvent(existing);
          navigation.goBack();
        },
      },
    ]);

  return (
    <Screen>
      <Header
        title={id ? 'Sửa lịch' : 'Lịch mới'}
        onBack={() => navigation.goBack()}
        right={id ? <IconBtn icon="trash-outline" color={colors.danger} onPress={confirmDelete} /> : null}
      />
      <ScrollView
        contentContainerStyle={{ padding: space[4], paddingBottom: space[8] }}
        keyboardShouldPersistTaps="handled"
      >
        <Banner type="error" message={error} onClose={() => setError('')} />

        <Field label="Tiêu đề" value={title} onChangeText={setTitle} placeholder="Họp review Design System" />
        <Field label="Địa điểm" value={location} onChangeText={setLocation} placeholder="Google Meet / Văn phòng tầng 5" />

        <Card style={{ padding: space[3], marginBottom: space[3] }}>
          <SwitchRow label="Cả ngày" icon="sunny-outline" value={allDay} onChange={setAllDay} />
          <View style={s.divider} />
          <TimeRow
            label="Bắt đầu"
            date={start}
            allDay={allDay}
            onDate={() => setPicker({ field: 'start', mode: 'date' })}
            onTime={() => setPicker({ field: 'start', mode: 'time' })}
          />
          <View style={s.divider} />
          <TimeRow
            label="Kết thúc"
            date={end}
            allDay={allDay}
            onDate={() => setPicker({ field: 'end', mode: 'date' })}
            onTime={() => setPicker({ field: 'end', mode: 'time' })}
          />
        </Card>

        <SectionTitle>Màu nhãn</SectionTitle>
        <Row style={{ flexWrap: 'wrap' }} gap={space[2]}>
          {palette.map((p) => (
            <Pressable
              key={p.key}
              onPress={() => setColor(p.key)}
              style={[
                s.swatch,
                { backgroundColor: tint(p.hex, 0.2), borderColor: color === p.key ? p.hex : 'transparent' },
              ]}
            >
              <View style={[s.swatchDot, { backgroundColor: p.hex }]} />
            </Pressable>
          ))}
        </Row>

        <SectionTitle>Nhắc trước</SectionTitle>
        <Row style={{ flexWrap: 'wrap' }} gap={space[2]}>
          {REMINDER_CHOICES.map((c) => (
            <Chip
              key={c.value}
              label={c.label}
              active={reminders.includes(c.value)}
              onPress={() => toggleReminder(c.value)}
              color={colors.cyan}
            />
          ))}
        </Row>
        <Text style={[font.tiny, { color: colors.textMuted, marginTop: space[2] }]}>
          Thông báo chạy ngay trên máy nên vẫn nhắc đúng giờ kể cả khi offline.
        </Text>

        <SectionTitle>Ghi chú</SectionTitle>
        <Field value={description} onChangeText={setDescription} multiline placeholder="Nội dung cần chuẩn bị…" />

        <Card style={s.syncNote}>
          <Ionicons
            name={googleConnected ? 'cloud-done-outline' : 'cloud-offline-outline'}
            size={17}
            color={googleConnected ? colors.primary : colors.textMuted}
          />
          <Text style={[font.small, { color: colors.textSub, flex: 1 }]}>
            {googleConnected
              ? prefs.autoSyncGoogle === false
                ? 'Đã nối Google Calendar nhưng tự động đồng bộ đang tắt.'
                : 'Lưu xong sẽ tự đẩy lên Google Calendar.'
              : 'Chưa nối Google Calendar — vào Cài đặt để kết nối.'}
          </Text>
        </Card>

        <Btn
          title={id ? 'Lưu thay đổi' : 'Tạo lịch'}
          icon="checkmark"
          onPress={submit}
          loading={busy}
          style={{ marginTop: space[4] }}
        />
      </ScrollView>

      {picker ? (
        <DateTimePicker
          value={picker.field === 'start' ? start : end}
          mode={picker.mode}
          is24Hour
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onPicked}
          themeVariant="dark"
        />
      ) : null}
    </Screen>
  );
}

function TimeRow({ label, date, allDay, onDate, onTime }) {
  return (
    <Row style={{ paddingVertical: space[2] }}>
      <Text style={[font.body, { color: colors.textSub, flex: 1 }]}>{label}</Text>
      <Pressable onPress={onDate} style={s.pill}>
        <Text style={[font.small, { color: colors.text }]}>{fmtDate(date)}</Text>
      </Pressable>
      {!allDay ? (
        <Pressable onPress={onTime} style={s.pill}>
          <Text style={[font.small, { color: colors.text }]}>{fmtTime(date)}</Text>
        </Pressable>
      ) : null}
    </Row>
  );
}

const s = StyleSheet.create({
  divider: { height: 1, backgroundColor: colors.border },
  pill: {
    paddingHorizontal: space[3], paddingVertical: space[2],
    borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  swatch: {
    width: 44, height: 36, borderRadius: radius.sm, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  swatchDot: { width: 14, height: 14, borderRadius: 7 },
  syncNote: { flexDirection: 'row', alignItems: 'center', gap: space[2], padding: space[3], marginTop: space[5] },
});
