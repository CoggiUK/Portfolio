import React, { useMemo, useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Linking, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  Screen, BrandHeader, Card, Empty, Row, Chip, Badge, Btn, Sheet, SectionTitle,
} from '../components/ui';
import { colors, space, radius, font, fontFamily, listBottomPad, tint, shadows } from '../theme';
import { useApp } from '../contexts/AppContext';
import * as db from '../services/db';
import { toDate, fmtRelative, fmtDateTime } from '../utils/date';

const STATUSES = [
  { value: 'new', label: 'Mới', color: colors.primary },
  { value: 'contacted', label: 'Đã liên hệ', color: colors.cyan },
  { value: 'won', label: 'Đã chốt', color: colors.secondary },
  { value: 'archived', label: 'Lưu trữ', color: colors.textMuted },
];

const FILTERS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'unread', label: 'Chưa đọc' },
  ...STATUSES,
];

const statusMeta = (s) => STATUSES.find((x) => x.value === s) || STATUSES[0];

// Lead item memoized để tối ưu danh sách
const LeadItem = memo(function LeadItem({ item, onOpen, onQuickCall, onQuickMail }) {
  const st = statusMeta(item.status);
  const initials = (item.name || '?').trim().charAt(0).toUpperCase();

  return (
    <Card
      style={[
        s.item,
        !item.read && {
          borderLeftWidth: 3,
          borderLeftColor: colors.primary,
        },
      ]}
      onPress={() => onOpen(item)}
    >
      <View style={[s.avatar, !item.read && s.avatarUnread]}>
        <Text style={[font.h3, { color: !item.read ? colors.primary : colors.textSub, fontFamily: fontFamily.bold }]}>
          {initials}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text
            style={[
              font.body,
              { color: colors.text, flex: 1, fontFamily: !item.read ? fontFamily.bold : fontFamily.semibold },
            ]}
            numberOfLines={1}
          >
            {item.name || 'Khách truy cập website'}
          </Text>
          <Text style={[font.tiny, { color: colors.textMuted }]}>
            {item.createdAt ? fmtRelative(toDate(item.createdAt)) : ''}
          </Text>
        </Row>

        <Text
          style={[
            font.small,
            { color: colors.textSub, marginTop: 2, lineHeight: 18 },
          ]}
          numberOfLines={2}
        >
          {item.message || item.email || '(Không có nội dung)'}
        </Text>

        <Row style={{ marginTop: space[2], justifyContent: 'space-between' }}>
          <Row gap={space[2]}>
            <Badge label={st.label.toUpperCase()} color={st.color} dot />
            {!item.read ? (
              <Badge label="CHƯA ĐỌC" color={colors.primary} />
            ) : null}
          </Row>

          <Row gap={space[2]}>
            {item.phone ? (
              <Pressable
                onPress={() => onQuickCall(item.phone)}
                hitSlop={8}
                style={s.quickCallBtn}
              >
                <Ionicons name="call" size={13} color={colors.primary} />
              </Pressable>
            ) : null}
            {item.email ? (
              <Pressable
                onPress={() => onQuickMail(item.email)}
                hitSlop={8}
                style={s.quickCallBtn}
              >
                <Ionicons name="mail" size={13} color={colors.primary} />
              </Pressable>
            ) : null}
          </Row>
        </Row>
      </View>
    </Card>
  );
});

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
        !needle ||
        `${l.name || ''} ${l.email || ''} ${l.message || ''} ${l.phone || ''}`.toLowerCase().includes(needle)
      );
  }, [leads, filter, q]);

  const openLead = useCallback(async (lead) => {
    Haptics.selectionAsync().catch(() => {});
    setActive(lead);
    if (!lead.read) await db.updateLead(lead.id, { read: true }).catch(() => {});
  }, []);

  const quickCall = useCallback((phone) => {
    Haptics.selectionAsync().catch(() => {});
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  }, []);

  const quickMail = useCallback((email) => {
    Haptics.selectionAsync().catch(() => {});
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent('Phản hồi từ Tùng Lâm Workspace')}`);
  }, []);

  const setStatus = async (status) => {
    if (!active) return;
    await db.updateLead(active.id, { status });
    setActive({ ...active, status });
  };

  const confirmDelete = (lead) =>
    Alert.alert('Xoá liên hệ?', `Tin nhắn của ${lead.name || 'người liên hệ này'} sẽ bị xoá vĩnh viễn.`, [
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

  const toTask = async (lead) => {
    await create('tasks', {
      title: `Phản hồi ${lead.name || lead.email || 'liên hệ công việc'}`,
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

  const keyExtractor = useCallback((l) => l.id, []);

  const renderItem = useCallback(
    ({ item }) => (
      <LeadItem
        item={item}
        onOpen={openLead}
        onQuickCall={quickCall}
        onQuickMail={quickMail}
      />
    ),
    [openLead, quickCall, quickMail]
  );

  return (
    <Screen edges={[]}>
      <BrandHeader
        icon="chatbubbles"
        title="Hộp thư liên hệ"
        subtitle={unreadLeads ? `${unreadLeads} tin nhắn mới chưa đọc` : 'Toàn bộ liên hệ đã xem'}
        badge={unreadLeads ? `${unreadLeads} MỚI` : undefined}
        actions={
          unreadLeads
            ? [{
                icon: 'checkmark-done-outline',
                label: 'Đánh dấu đã đọc tất cả',
                onPress: () => {
                  Haptics.selectionAsync().catch(() => {});
                  db.markLeadsRead(leads);
                },
              }]
            : []
        }
      />

      <View style={{ paddingHorizontal: space[4], paddingTop: space[4] }}>
        {/* Tìm kiếm */}
        <View style={s.search}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Tìm theo tên, email, điện thoại…"
            placeholderTextColor={colors.textMuted}
            style={s.searchInput}
          />
          {q ? (
            <Pressable onPress={() => setQ('')} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {/* Bộ lọc Chips */}
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
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: listBottomPad() }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
        ListEmptyComponent={
          <Empty
            icon="mail-outline"
            title="Chưa có thông tin liên hệ nào"
            hint="Khi có người gửi form liên hệ công việc trên website portfolio, thông tin sẽ hiển thị tức thì tại đây kèm thông báo."
          />
        }
      />

      {/* Sheet chi tiết liên hệ */}
      <Sheet visible={!!active} onClose={() => setActive(null)} title={active?.name || 'Chi tiết liên hệ'}>
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

            <SectionTitle>Nội dung tin nhắn</SectionTitle>
            <Card style={s.messageCard}>
              <Text style={[font.body, { color: colors.text, lineHeight: 22 }]}>
                {active.message || '(Không có nội dung lời nhắn)'}
              </Text>
            </Card>

            <SectionTitle>Thông tin người liên hệ</SectionTitle>
            <Card style={{ gap: space[3] }}>
              <InfoLine
                icon="mail-outline"
                label="Email"
                value={active.email}
                onPress={active.email ? () => quickMail(active.email) : null}
              />
              {active.phone ? (
                <InfoLine
                  icon="call-outline"
                  label="Số điện thoại"
                  value={active.phone}
                  onPress={() => quickCall(active.phone)}
                />
              ) : null}
              <InfoLine
                icon="time-outline"
                label="Thời gian nhận"
                value={active.createdAt ? fmtDateTime(toDate(active.createdAt)) : '—'}
              />
              <InfoLine
                icon="globe-outline"
                label="Nguồn tiếp nhận"
                value={active.source || 'Website Portfolio'}
              />
            </Card>

            <Row style={{ marginTop: space[5] }} gap={space[2]}>
              {active.email ? (
                <Btn
                  title="Gửi phản hồi email"
                  icon="send-outline"
                  style={{ flex: 1 }}
                  onPress={() => quickMail(active.email)}
                />
              ) : null}
              <Btn
                title="Tạo việc nhắc"
                icon="add-circle-outline"
                variant="secondary"
                style={{ flex: 1 }}
                onPress={() => toTask(active)}
              />
            </Row>

            <Btn
              title="Xoá thông tin liên hệ này"
              icon="trash-outline"
              variant="danger"
              style={{ marginTop: space[2] }}
              onPress={() => confirmDelete(active)}
            />
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
        <View style={s.infoIconWrap}>
          <Ionicons name={icon} size={16} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[font.tiny, { color: colors.textMuted }]}>{label.toUpperCase()}</Text>
          <Text style={[font.body, { color: onPress ? colors.primary : colors.text, fontFamily: fontFamily.semibold }]} numberOfLines={1}>
            {value || '—'}
          </Text>
        </View>
        {onPress ? <Ionicons name="open-outline" size={15} color={colors.textSub} /> : null}
      </Row>
    </Pressable>
  );
}

const s = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space[3],
    marginBottom: space[3],
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: space[2] + 2,
  },
  item: {
    flexDirection: 'row',
    gap: space[3],
    padding: space[3] + 2,
    marginBottom: space[2],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarUnread: {
    backgroundColor: colors.primaryDim,
    borderColor: tint(colors.primary, 0.5),
  },
  quickCallBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageCard: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: tint(colors.primary, 0.12),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
