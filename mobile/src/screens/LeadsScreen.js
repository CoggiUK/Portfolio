import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Linking, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen, Header, Card, Empty, Row, Chip, Badge, Btn, Sheet, IconBtn, SectionTitle,
} from '../components/ui';
import { colors, space, radius, font, tint } from '../theme';
import { useApp } from '../contexts/AppContext';
import * as db from '../services/db';
import { toDate, fmtRelative, fmtDateTime } from '../utils/date';

const STATUSES = [
  { value: 'new', label: 'Mới', color: colors.primary },
  { value: 'contacted', label: 'Đã liên hệ', color: colors.cyan },
  { value: 'won', label: 'Chốt', color: colors.secondary },
  { value: 'archived', label: 'Lưu trữ', color: colors.textMuted },
];

const FILTERS = [{ value: 'all', label: 'Tất cả' }, { value: 'unread', label: 'Chưa đọc' }, ...STATUSES];

const statusMeta = (s) => STATUSES.find((x) => x.value === s) || STATUSES[0];

export default function LeadsScreen({ navigation }) {
  const { leads, unreadLeads, create } = useApp();
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [active, setActive] = useState(null);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads
      .filter((l) => {
        if (filter === 'unread') return !l.read;
        if (filter === 'all') return true;
        return (l.status || 'new') === filter;
      })
      .filter((l) =>
        !needle || `${l.name || ''} ${l.email || ''} ${l.message || ''} ${l.phone || ''}`.toLowerCase().includes(needle)
      );
  }, [leads, filter, q]);

  const open = async (lead) => {
    setActive(lead);
    if (!lead.read) await db.updateLead(lead.id, { read: true }).catch(() => {});
  };

  const setStatus = async (status) => {
    if (!active) return;
    await db.updateLead(active.id, { status });
    setActive({ ...active, status });
  };

  const confirmDelete = (lead) =>
    Alert.alert('Xoá liên hệ?', `Tin nhắn của ${lead.name || 'khách'} sẽ bị xoá vĩnh viễn.`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          await db.removeLead(lead.id);
          setActive(null);
        },
      },
    ]);

  /** Biến một liên hệ thành việc cần làm để không quên phản hồi. */
  const toTask = async (lead) => {
    await create('tasks', {
      title: `Phản hồi ${lead.name || lead.email || 'khách'}`,
      notes: `${lead.email || ''}${lead.phone ? ` · ${lead.phone}` : ''}\n\n${lead.message || ''}`,
      priority: 'high',
      due: new Date(),
      done: false,
      doneAt: null,
      leadId: lead.id,
    });
    setActive(null);
    Alert.alert('Đã tạo việc', 'Nhắc phản hồi đã nằm trong danh sách công việc hôm nay.');
  };

  return (
    <Screen>
      <Header
        title="Hộp thư liên hệ"
        subtitle={unreadLeads ? `${unreadLeads} tin chưa đọc` : 'Tất cả đã đọc'}
        right={
          unreadLeads ? (
            <IconBtn icon="checkmark-done-outline" color={colors.primary} onPress={() => db.markLeadsRead(leads)} />
          ) : null
        }
      />

      <View style={{ paddingHorizontal: space[4] }}>
        <View style={s.search}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Tìm theo tên, email, nội dung…"
            placeholderTextColor={colors.textMuted}
            style={s.searchInput}
          />
        </View>
        <Row style={{ flexWrap: 'wrap', marginBottom: space[3] }} gap={space[2]}>
          {FILTERS.map((f) => (
            <Chip
              key={f.value}
              label={f.label}
              color={f.color || colors.primary}
              active={filter === f.value}
              onPress={() => setFilter(f.value)}
            />
          ))}
        </Row>
      </View>

      <FlatList
        data={list}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: space[8] }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Empty
            icon="mail-outline"
            title="Chưa có liên hệ nào"
            hint="Khi ai đó gửi form trên website, tin sẽ hiện ở đây và máy sẽ rung thông báo ngay."
          />
        }
        renderItem={({ item: l }) => {
          const st = statusMeta(l.status);
          return (
            <Card style={[s.item, !l.read && { borderColor: tint(colors.primary, 0.3) }]} onPress={() => open(l)}>
              <View style={[s.avatar, !l.read && { backgroundColor: colors.primaryDim }]}>
                <Text style={[font.h3, { color: !l.read ? colors.primary : colors.textSub }]}>
                  {(l.name || '?').trim().charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text style={[font.body, { color: colors.text, flex: 1, fontWeight: l.read ? '500' : '700' }]} numberOfLines={1}>
                    {l.name || 'Khách ẩn danh'}
                  </Text>
                  <Text style={[font.tiny, { color: colors.textMuted }]}>
                    {l.createdAt ? fmtRelative(toDate(l.createdAt)) : ''}
                  </Text>
                </Row>
                <Text style={[font.small, { color: colors.textSub, marginTop: 2 }]} numberOfLines={2}>
                  {l.message || l.email}
                </Text>
                <Row style={{ marginTop: space[2] }} gap={space[2]}>
                  <Badge label={st.label} color={st.color} />
                  {!l.read ? <View style={s.dot} /> : null}
                </Row>
              </View>
            </Card>
          );
        }}
      />

      <Sheet visible={!!active} onClose={() => setActive(null)} title={active?.name || 'Liên hệ'}>
        {active ? (
          <>
            <Row style={{ flexWrap: 'wrap' }} gap={space[2]}>
              {STATUSES.map((st) => (
                <Chip
                  key={st.value}
                  label={st.label}
                  color={st.color}
                  active={(active.status || 'new') === st.value}
                  onPress={() => setStatus(st.value)}
                />
              ))}
            </Row>

            <SectionTitle>Nội dung</SectionTitle>
            <Card>
              <Text style={[font.body, { color: colors.text, lineHeight: 22 }]}>
                {active.message || '(Không có nội dung)'}
              </Text>
            </Card>

            <SectionTitle>Thông tin</SectionTitle>
            <Card style={{ gap: space[3] }}>
              <InfoLine icon="mail-outline" label="Email" value={active.email}
                onPress={active.email ? () => Linking.openURL(`mailto:${active.email}`) : null} />
              {active.phone ? (
                <InfoLine icon="call-outline" label="Điện thoại" value={active.phone}
                  onPress={() => Linking.openURL(`tel:${active.phone.replace(/\s/g, '')}`)} />
              ) : null}
              <InfoLine icon="time-outline" label="Thời điểm"
                value={active.createdAt ? fmtDateTime(toDate(active.createdAt)) : '—'} />
              <InfoLine icon="globe-outline" label="Nguồn" value={active.source || 'Website portfolio'} />
            </Card>

            <Row style={{ marginTop: space[5] }} gap={space[2]}>
              {active.email ? (
                <Btn title="Trả lời email" icon="send-outline" style={{ flex: 1 }}
                  onPress={() => Linking.openURL(
                    `mailto:${active.email}?subject=${encodeURIComponent('Phản hồi từ Tùng Lâm')}`
                  )} />
              ) : null}
              <Btn title="Tạo việc" icon="add-circle-outline" variant="secondary" style={{ flex: 1 }}
                onPress={() => toTask(active)} />
            </Row>
            <Btn title="Xoá liên hệ" icon="trash-outline" variant="danger"
              style={{ marginTop: space[2] }} onPress={() => confirmDelete(active)} />
          </>
        ) : null}
      </Sheet>
    </Screen>
  );
}

function InfoLine({ icon, label, value, onPress }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Row gap={space[3]}>
        <Ionicons name={icon} size={16} color={colors.textMuted} />
        <View style={{ flex: 1 }}>
          <Text style={[font.tiny, { color: colors.textMuted }]}>{label.toUpperCase()}</Text>
          <Text style={[font.body, { color: onPress ? colors.primary : colors.text }]} numberOfLines={1}>
            {value || '—'}
          </Text>
        </View>
        {onPress ? <Ionicons name="open-outline" size={15} color={colors.textMuted} /> : null}
      </Row>
    </Pressable>
  );
}

const s = StyleSheet.create({
  search: {
    flexDirection: 'row', alignItems: 'center', gap: space[2],
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, paddingHorizontal: space[3], marginBottom: space[3],
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: space[3] },
  item: { flexDirection: 'row', gap: space[3], padding: space[3], marginBottom: space[2] },
  avatar: {
    width: 42, height: 42, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
});
