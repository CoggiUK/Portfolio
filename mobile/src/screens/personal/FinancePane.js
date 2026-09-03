import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Card, FAB, Empty, Row, Field, Btn, Sheet, Chip, SectionTitle, Segmented } from '../../components/ui';
import { colors, space, radius, font, tint } from '../../theme';
import { useApp } from '../../contexts/AppContext';
import { toDate, fmtDate, money, startOfMonth, addMonths, MONTHS } from '../../utils/date';

export const CATEGORIES = {
  expense: [
    { key: 'food', label: 'Ăn uống', icon: 'restaurant-outline', color: '#FB7185' },
    { key: 'transport', label: 'Di chuyển', icon: 'car-outline', color: '#60A5FA' },
    { key: 'study', label: 'Học tập', icon: 'school-outline', color: '#8B5CF6' },
    { key: 'bill', label: 'Hoá đơn', icon: 'receipt-outline', color: '#FBBF24' },
    { key: 'fun', label: 'Giải trí', icon: 'game-controller-outline', color: '#00F0FF' },
    { key: 'other', label: 'Khác', icon: 'ellipsis-horizontal', color: '#9CA3AF' },
  ],
  income: [
    { key: 'salary', label: 'Lương', icon: 'briefcase-outline', color: '#00FF88' },
    { key: 'freelance', label: 'Freelance', icon: 'color-palette-outline', color: '#00F0FF' },
    { key: 'bonus', label: 'Thưởng', icon: 'gift-outline', color: '#FBBF24' },
    { key: 'other', label: 'Khác', icon: 'ellipsis-horizontal', color: '#9CA3AF' },
  ],
};

const catOf = (t) =>
  (CATEGORIES[t.type] || CATEGORIES.expense).find((c) => c.key === t.category) ||
  CATEGORIES.expense.at(-1);

const emptyForm = { type: 'expense', amount: '', category: 'food', note: '', date: new Date() };

export default function FinancePane() {
  const { transactions, create, update, remove } = useApp();
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [sheet, setSheet] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showPicker, setShowPicker] = useState(false);

  const monthTx = useMemo(() => {
    const from = month.getTime();
    const to = addMonths(month, 1).getTime();
    return transactions.filter((t) => {
      const d = toDate(t.date)?.getTime();
      return d && d >= from && d < to;
    });
  }, [transactions, month]);

  const { income, expense } = useMemo(
    () =>
      monthTx.reduce(
        (acc, t) => {
          const v = Number(t.amount || 0);
          if (t.type === 'income') acc.income += v;
          else acc.expense += v;
          return acc;
        },
        { income: 0, expense: 0 }
      ),
    [monthTx]
  );

  // Xếp hạng danh mục chi để vẽ thanh tỉ trọng.
  const byCategory = useMemo(() => {
    const map = {};
    monthTx.filter((t) => t.type === 'expense').forEach((t) => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount || 0);
    });
    return Object.entries(map)
      .map(([key, total]) => ({
        key, total,
        meta: CATEGORIES.expense.find((c) => c.key === key) || CATEGORIES.expense.at(-1),
      }))
      .sort((a, b) => b.total - a.total);
  }, [monthTx]);

  const openNew = () => { setEditing(null); setForm({ ...emptyForm, date: new Date() }); setSheet(true); };
  const openEdit = (t) => {
    setEditing(t);
    setForm({
      type: t.type, amount: String(t.amount || ''), category: t.category,
      note: t.note || '', date: toDate(t.date) || new Date(),
    });
    setSheet(true);
  };

  const save = async () => {
    const amount = Number(String(form.amount).replace(/[^\d]/g, ''));
    if (!amount) return;
    const payload = {
      type: form.type, amount, category: form.category,
      note: form.note.trim(), date: form.date,
    };
    if (editing) await update('transactions', editing.id, payload);
    else await create('transactions', payload);
    setSheet(false);
  };

  const confirmDelete = (t) =>
    Alert.alert('Xoá giao dịch?', `${money(t.amount)} · ${catOf(t).label}`, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => remove('transactions', t.id) },
    ]);

  const balance = income - expense;
  const categoriesForType = CATEGORIES[form.type];

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={monthTx}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Row style={s.monthBar}>
              <Pressable onPress={() => setMonth(addMonths(month, -1))} hitSlop={10}>
                <Ionicons name="chevron-back" size={20} color={colors.textSub} />
              </Pressable>
              <Text style={[font.h3, { color: colors.text }]}>
                {MONTHS[month.getMonth()]} {month.getFullYear()}
              </Text>
              <Pressable onPress={() => setMonth(addMonths(month, 1))} hitSlop={10}>
                <Ionicons name="chevron-forward" size={20} color={colors.textSub} />
              </Pressable>
            </Row>

            <Card style={{ marginBottom: space[3] }}>
              <Text style={[font.tiny, { color: colors.textMuted }]}>SỐ DƯ THÁNG</Text>
              <Text style={[font.h1, { color: balance >= 0 ? colors.primary : colors.danger, marginTop: space[1] }]}>
                {money(balance)}
              </Text>
              <Row style={{ marginTop: space[4] }} gap={space[4]}>
                <Row gap={space[2]} style={{ flex: 1 }}>
                  <View style={[s.miniIcon, { backgroundColor: colors.primaryDim }]}>
                    <Ionicons name="arrow-down" size={14} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={[font.tiny, { color: colors.textMuted }]}>THU</Text>
                    <Text style={[font.body, { color: colors.text }]}>{money(income)}</Text>
                  </View>
                </Row>
                <Row gap={space[2]} style={{ flex: 1 }}>
                  <View style={[s.miniIcon, { backgroundColor: colors.dangerDim }]}>
                    <Ionicons name="arrow-up" size={14} color={colors.danger} />
                  </View>
                  <View>
                    <Text style={[font.tiny, { color: colors.textMuted }]}>CHI</Text>
                    <Text style={[font.body, { color: colors.text }]}>{money(expense)}</Text>
                  </View>
                </Row>
              </Row>
            </Card>

            {byCategory.length ? (
              <>
                <SectionTitle>Chi theo danh mục</SectionTitle>
                <Card style={{ marginBottom: space[3], gap: space[3] }}>
                  {byCategory.map((c) => (
                    <View key={c.key}>
                      <Row style={{ justifyContent: 'space-between', marginBottom: space[1] }}>
                        <Row gap={space[2]}>
                          <Ionicons name={c.meta.icon} size={14} color={c.meta.color} />
                          <Text style={[font.small, { color: colors.textSub }]}>{c.meta.label}</Text>
                        </Row>
                        <Text style={[font.small, { color: colors.text }]}>{money(c.total)}</Text>
                      </Row>
                      <View style={s.barTrack}>
                        <View style={[s.barFill, {
                          width: `${expense ? Math.round((c.total / expense) * 100) : 0}%`,
                          backgroundColor: c.meta.color,
                        }]} />
                      </View>
                    </View>
                  ))}
                </Card>
              </>
            ) : null}

            {monthTx.length ? <SectionTitle>Giao dịch</SectionTitle> : null}
          </>
        }
        ListEmptyComponent={
          <Empty icon="wallet-outline" title="Tháng này chưa ghi giao dịch nào"
            hint="Bấm + để ghi nhanh một khoản thu hoặc chi." />
        }
        renderItem={({ item: t }) => {
          const c = catOf(t);
          const isIncome = t.type === 'income';
          return (
            <Card style={s.txRow} onPress={() => openEdit(t)}>
              <View style={[s.txIcon, { backgroundColor: tint(c.color, 0.14) }]}>
                <Ionicons name={c.icon} size={16} color={c.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[font.body, { color: colors.text }]} numberOfLines={1}>{t.note || c.label}</Text>
                <Text style={[font.tiny, { color: colors.textMuted, marginTop: 2 }]}>
                  {c.label} · {fmtDate(toDate(t.date))}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[font.body, { color: isIncome ? colors.primary : colors.text }]}>
                  {isIncome ? '+' : '−'}{money(t.amount)}
                </Text>
                <Pressable onPress={() => confirmDelete(t)} hitSlop={8}>
                  <Text style={[font.tiny, { color: colors.textMuted, marginTop: 2 }]}>Xoá</Text>
                </Pressable>
              </View>
            </Card>
          );
        }}
      />

      <FAB onPress={openNew} />

      <Sheet visible={sheet} onClose={() => setSheet(false)} title={editing ? 'Sửa giao dịch' : 'Ghi giao dịch'}>
        <Segmented
          value={form.type}
          onChange={(v) => setForm({ ...form, type: v, category: CATEGORIES[v][0].key })}
          items={[{ value: 'expense', label: 'Chi' }, { value: 'income', label: 'Thu' }]}
        />
        <View style={{ height: space[4] }} />
        <Field
          label="Số tiền"
          value={form.amount}
          onChangeText={(v) => setForm({ ...form, amount: v.replace(/[^\d]/g, '') })}
          keyboardType="number-pad"
          placeholder="150000"
          hint={form.amount ? money(form.amount) : undefined}
        />
        <Text style={[font.small, { color: colors.textSub, marginBottom: space[2] }]}>Danh mục</Text>
        <Row gap={space[2]} style={{ flexWrap: 'wrap', marginBottom: space[3] }}>
          {categoriesForType.map((c) => (
            <Chip key={c.key} label={c.label} icon={c.icon} color={c.color}
              active={form.category === c.key} onPress={() => setForm({ ...form, category: c.key })} />
          ))}
        </Row>
        <Text style={[font.small, { color: colors.textSub, marginBottom: space[2] }]}>Ngày</Text>
        <Pressable onPress={() => setShowPicker(true)} style={[s.pill, { marginBottom: space[3] }]}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSub} />
          <Text style={[font.small, { color: colors.text }]}>{fmtDate(form.date)}</Text>
        </Pressable>
        <Field label="Ghi chú" value={form.note} onChangeText={(v) => setForm({ ...form, note: v })}
          placeholder="Cà phê với khách hàng" />
        <Btn title={editing ? 'Lưu' : 'Ghi lại'} icon="checkmark" onPress={save} />
      </Sheet>

      {showPicker ? (
        <DateTimePicker
          value={form.date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          themeVariant="dark"
          onChange={(e, d) => {
            setShowPicker(false);
            if (e.type !== 'dismissed' && d) setForm((f) => ({ ...f, date: d }));
          }}
        />
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  monthBar: { justifyContent: 'space-between', paddingVertical: space[2], marginBottom: space[2] },
  miniIcon: { width: 30, height: 30, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  barTrack: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[3], marginBottom: space[2] },
  txIcon: { width: 36, height: 36, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: space[2], alignSelf: 'flex-start',
    paddingHorizontal: space[3], paddingVertical: space[2],
    borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
});
