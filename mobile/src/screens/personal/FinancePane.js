import React, { useMemo, useState, useEffect, useCallback, memo } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card, FAB, Empty, Row, Field, Btn, Sheet, Chip, SectionTitle, Segmented } from '../../components/ui';
import { colors, space, radius, font, tint, shadows } from '../../theme';
import { useApp } from '../../contexts/AppContext';
import { toDate, fmtDate, money, startOfMonth, addMonths, MONTHS } from '../../utils/date';

export const CATEGORIES = {
  expense: [
    { key: 'food', label: 'Ăn uống', icon: 'restaurant-outline', color: colors.danger },
    { key: 'transport', label: 'Di chuyển', icon: 'car-outline', color: colors.cyan },
    { key: 'study', label: 'Học tập', icon: 'school-outline', color: colors.secondary },
    { key: 'bill', label: 'Hoá đơn', icon: 'receipt-outline', color: colors.amber },
    { key: 'fun', label: 'Giải trí', icon: 'game-controller-outline', color: colors.info },
    { key: 'other', label: 'Khác', icon: 'ellipsis-horizontal', color: colors.textSub },
  ],
  income: [
    { key: 'salary', label: 'Lương', icon: 'briefcase-outline', color: colors.primary },
    { key: 'freelance', label: 'Freelance', icon: 'color-palette-outline', color: colors.info },
    { key: 'bonus', label: 'Thưởng', icon: 'gift-outline', color: colors.amber },
    { key: 'other', label: 'Khác', icon: 'ellipsis-horizontal', color: colors.textSub },
  ],
};

const catOf = (t) =>
  (CATEGORIES[t.type] || CATEGORIES.expense).find((c) => c.key === t.category) ||
  CATEGORIES.expense.at(-1);

const emptyForm = { type: 'expense', amount: '', category: 'food', note: '', date: new Date() };

// Transaction item được memo hóa
const TransactionItem = memo(function TransactionItem({ item, onEdit, onDelete }) {
  const c = catOf(item);
  const isIncome = item.type === 'income';

  return (
    <Card style={s.txRow} onPress={() => onEdit(item)}>
      <View style={[s.txIcon, { backgroundColor: tint(c.color, 0.16), borderColor: tint(c.color, 0.3) }]}>
        <Ionicons name={c.icon} size={17} color={c.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[font.body, { color: colors.text, fontWeight: '600' }]} numberOfLines={1}>
          {item.note || c.label}
        </Text>
        <Text style={[font.tiny, { color: colors.textMuted, marginTop: 2 }]}>
          {c.label} · {fmtDate(toDate(item.date))}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text
          style={[
            font.body,
            {
              color: isIncome ? colors.primary : colors.text,
              fontWeight: '800',
            },
          ]}
        >
          {isIncome ? '+' : '−'}{money(item.amount)}
        </Text>
        <Pressable
          onPress={() => onDelete(item)}
          hitSlop={10}
          style={({ pressed }) => [pressed && { opacity: 0.5 }]}
        >
          <Text style={[font.tiny, { color: colors.textMuted, marginTop: 3 }]}>Xoá</Text>
        </Pressable>
      </View>
    </Card>
  );
});

export default function FinancePane({ initialCreate }) {
  const { transactions, create, update, remove } = useApp();
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [sheet, setSheet] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (initialCreate) {
      setEditing(null);
      setForm({ ...emptyForm, date: new Date() });
      setSheet(true);
    }
  }, [initialCreate]);

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

  // Xếp hạng danh mục chi để vẽ thanh tỉ trọng
  const byCategory = useMemo(() => {
    const map = {};
    monthTx.filter((t) => t.type === 'expense').forEach((t) => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount || 0);
    });
    return Object.entries(map)
      .map(([key, total]) => ({
        key,
        total,
        meta: CATEGORIES.expense.find((c) => c.key === key) || CATEGORIES.expense.at(-1),
      }))
      .sort((a, b) => b.total - a.total);
  }, [monthTx]);

  const openNew = useCallback(() => {
    setEditing(null);
    setForm({ ...emptyForm, date: new Date() });
    setSheet(true);
  }, []);

  const openEdit = useCallback((t) => {
    setEditing(t);
    setForm({
      type: t.type,
      amount: String(t.amount || ''),
      category: t.category,
      note: t.note || '',
      date: toDate(t.date) || new Date(),
    });
    setSheet(true);
  }, []);

  const save = async () => {
    const amount = Number(String(form.amount).replace(/[^\d]/g, ''));
    if (!amount) return;
    const payload = {
      type: form.type,
      amount,
      category: form.category,
      note: form.note.trim(),
      date: form.date,
    };
    if (editing) await update('transactions', editing.id, payload);
    else await create('transactions', payload);
    setSheet(false);
  };

  const confirmDelete = useCallback((t) => {
    Alert.alert('Xoá giao dịch?', `${money(t.amount)} · ${catOf(t).label}`, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => remove('transactions', t.id) },
    ]);
  }, [remove]);

  const keyExtractor = useCallback((t) => t.id, []);

  const renderItem = useCallback(
    ({ item }) => (
      <TransactionItem
        item={item}
        onEdit={openEdit}
        onDelete={confirmDelete}
      />
    ),
    [openEdit, confirmDelete]
  );

  const balance = income - expense;
  const categoriesForType = CATEGORIES[form.type];

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={monthTx}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
        ListHeaderComponent={
          <>
            {/* Thanh chọn tháng */}
            <Row style={s.monthBar}>
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setMonth(addMonths(month, -1));
                }}
                hitSlop={10}
                style={s.monthArrow}
              >
                <Ionicons name="chevron-back" size={18} color={colors.textSub} />
              </Pressable>
              <View style={s.monthTitlePill}>
                <Ionicons name="calendar-outline" size={14} color={colors.primary} />
                <Text style={[font.h3, { color: colors.text, fontWeight: '800' }]}>
                  {MONTHS[month.getMonth()]} {month.getFullYear()}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setMonth(addMonths(month, 1));
                }}
                hitSlop={10}
                style={s.monthArrow}
              >
                <Ionicons name="chevron-forward" size={18} color={colors.textSub} />
              </Pressable>
            </Row>

            {/* Thẻ tổng kết số dư tháng */}
            <Card style={s.summaryCard}>
              <Text style={[font.tiny, { color: colors.textMuted, letterSpacing: 0.5 }]}>
                TỔNG SỐ DƯ THÁNG NÀY
              </Text>
              <Text
                style={[
                  font.h1,
                  {
                    color: balance >= 0 ? colors.primary : colors.danger,
                    marginTop: space[1],
                    fontSize: 28,
                    fontWeight: '800',
                  },
                ]}
              >
                {money(balance)}
              </Text>

              <Row style={{ marginTop: space[4] }} gap={space[3]}>
                <View style={[s.metricBox, { borderColor: colors.border }]}>
                  <View style={[s.miniIcon, { backgroundColor: colors.primarySurface }]}>
                    <Ionicons name="arrow-down" size={15} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[font.tiny, { color: colors.textMuted }]}>TỔNG THU</Text>
                    <Text style={[font.body, { color: colors.text, fontWeight: '700' }]} numberOfLines={1}>
                      {money(income)}
                    </Text>
                  </View>
                </View>

                <View style={[s.metricBox, { borderColor: colors.border }]}>
                  <View style={[s.miniIcon, { backgroundColor: colors.dangerSurface }]}>
                    <Ionicons name="arrow-up" size={15} color={colors.danger} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[font.tiny, { color: colors.textMuted }]}>TỔNG CHI</Text>
                    <Text style={[font.body, { color: colors.text, fontWeight: '700' }]} numberOfLines={1}>
                      {money(expense)}
                    </Text>
                  </View>
                </View>
              </Row>
            </Card>

            {/* Cơ cấu chi theo danh mục */}
            {byCategory.length ? (
              <>
                <SectionTitle>Tỉ trọng chi tiêu</SectionTitle>
                <Card style={s.breakdownCard}>
                  {byCategory.map((c) => {
                    const pct = expense ? Math.round((c.total / expense) * 100) : 0;
                    return (
                      <View key={c.key} style={{ marginBottom: space[2] }}>
                        <Row style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                          <Row gap={space[2]}>
                            <Ionicons name={c.meta.icon} size={14} color={c.meta.color} />
                            <Text style={[font.small, { color: colors.textSub, fontWeight: '600' }]}>
                              {c.meta.label}
                            </Text>
                          </Row>
                          <Row gap={space[2]}>
                            <Text style={[font.small, { color: colors.text, fontWeight: '700' }]}>
                              {money(c.total)}
                            </Text>
                            <Text style={[font.tiny, { color: colors.textMuted }]}>({pct}%)</Text>
                          </Row>
                        </Row>
                        <View style={s.barTrack}>
                          <View
                            style={[
                              s.barFill,
                              {
                                width: `${pct}%`,
                                backgroundColor: c.meta.color,
                              },
                            ]}
                          />
                        </View>
                      </View>
                    );
                  })}
                </Card>
              </>
            ) : null}

            {monthTx.length ? <SectionTitle>Lịch sử giao dịch</SectionTitle> : null}
          </>
        }
        ListEmptyComponent={
          <Empty
            icon="wallet-outline"
            title="Tháng này chưa có giao dịch nào"
            hint="Nhấn nút + bên dưới để ghi nhanh một khoản thu hoặc chi tiêu."
          />
        }
      />

      <FAB onPress={openNew} />

      <Sheet visible={sheet} onClose={() => setSheet(false)} title={editing ? 'Sửa giao dịch' : 'Ghi giao dịch mới'}>
        <Segmented
          value={form.type}
          onChange={(v) => setForm({ ...form, type: v, category: CATEGORIES[v][0].key })}
          items={[{ value: 'expense', label: 'Khoản Chi' }, { value: 'income', label: 'Khoản Thu' }]}
        />
        <View style={{ height: space[4] }} />
        <Field
          label="Số tiền (VNĐ)"
          value={form.amount}
          onChangeText={(v) => setForm({ ...form, amount: v.replace(/[^\d]/g, '') })}
          keyboardType="number-pad"
          placeholder="150000"
          hint={form.amount ? `Tương đương: ${money(form.amount)}` : undefined}
        />
        <Text style={[font.small, { color: colors.textSub, marginBottom: space[2] }]}>Danh mục</Text>
        <Row gap={space[2]} style={{ flexWrap: 'wrap', marginBottom: space[3] }}>
          {categoriesForType.map((c) => (
            <Chip
              key={c.key}
              label={c.label}
              icon={c.icon}
              color={c.color}
              active={form.category === c.key}
              onPress={() => setForm({ ...form, category: c.key })}
            />
          ))}
        </Row>
        <Text style={[font.small, { color: colors.textSub, marginBottom: space[2] }]}>Ngày giao dịch</Text>
        <Pressable onPress={() => setShowPicker(true)} style={[s.pill, { marginBottom: space[3] }]}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSub} />
          <Text style={[font.small, { color: colors.text }]}>{fmtDate(form.date)}</Text>
        </Pressable>
        <Field
          label="Ghi chú thêm"
          value={form.note}
          onChangeText={(v) => setForm({ ...form, note: v })}
          placeholder="Ví dụ: Cà phê gặp gỡ đối tác…"
        />
        <Btn title={editing ? 'Lưu thay đổi' : 'Ghi nhận giao dịch'} icon="checkmark" onPress={save} />
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
  monthBar: {
    justifyContent: 'space-between',
    paddingVertical: space[2],
    marginBottom: space[2],
  },
  monthArrow: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthTitlePill: {
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
  summaryCard: {
    marginBottom: space[3],
    padding: space[4],
  },
  metricBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    padding: space[2] + 2,
    borderRadius: radius.sm,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
  },
  miniIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownCard: {
    marginBottom: space[3],
    padding: space[3] + 2,
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    padding: space[3] + 2,
    marginBottom: space[2],
  },
  txIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    alignSelf: 'flex-start',
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
});
