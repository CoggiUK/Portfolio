import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, RefreshControl, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Screen, Header, Card, SectionTitle, Empty, IconBtn, Badge, Row, Banner, StatCard } from '../components/ui';
import { colors, space, radius, font, hexOf, tint, shadows } from '../theme';
import { useApp } from '../contexts/AppContext';
import * as db from '../services/db';
import {
  toDate, dayKey, isSameDay, fmtTime, fmtCountdown, fmtDayLabel, money, startOfMonth,
} from '../utils/date';

export default function HomeScreen({ navigation }) {
  const {
    uid, events, tasks, habits, transactions, leads, site, unreadLeads,
    googleConnected, syncing, syncGoogle, toast, notify,
  } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const now = new Date();
  const today = dayKey(now);

  const todayEvents = useMemo(
    () => events.filter((e) => { const d = toDate(e.start); return d && isSameDay(d, now); }),
    [events]
  );

  const upcoming = useMemo(() => {
    const t = Date.now();
    return events
      .filter((e) => {
        const s = toDate(e.start)?.getTime();
        if (!s) return false;
        const end = toDate(e.end)?.getTime() || (s + 3600000);
        return end > t;
      })
      .sort((a, b) => (toDate(a.start)?.getTime() || 0) - (toDate(b.start)?.getTime() || 0))
      .slice(0, 5);
  }, [events]);

  const openTasks = useMemo(() => tasks.filter((t) => !t.done), [tasks]);
  const dueToday = useMemo(
    () => openTasks.filter((t) => {
      const d = toDate(t.due);
      return d && d <= new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    }),
    [openTasks]
  );

  const monthBalance = useMemo(() => {
    const from = startOfMonth(now).getTime();
    return transactions.reduce((sum, t) => {
      const d = toDate(t.date);
      if (!d || d.getTime() < from) return sum;
      return sum + (t.type === 'income' ? Number(t.amount || 0) : -Number(t.amount || 0));
    }, 0);
  }, [transactions]);

  const habitsDone = useMemo(
    () => habits.filter((h) => h.history?.[today]).length,
    [habits, today]
  );

  const greeting = now.getHours() < 12 ? 'Chào buổi sáng' : now.getHours() < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  const rawName = site.profile?.name || '';
  const cleanName = rawName.replace(/\(.*?\)/g, '').trim();
  const firstName = cleanName.includes('Tùng Lâm')
    ? 'Lâm'
    : (cleanName.split(/\s+/).pop() || 'Lâm');

  const handleReload = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (googleConnected) {
      await syncGoogle();
    } else {
      setRefreshing(true);
      await new Promise((r) => setTimeout(r, 600));
      setRefreshing(false);
      notify('Đã làm mới dữ liệu đám mây', 'success');
    }
  }, [googleConnected, syncGoogle, notify]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (googleConnected) {
      await syncGoogle();
    } else {
      await new Promise((r) => setTimeout(r, 600));
      notify('Đã làm mới dữ liệu đám mây', 'success');
    }
    setRefreshing(false);
  }, [googleConnected, syncGoogle, notify]);

  const toggleHabit = useCallback((h) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    db.toggleHabitDay(uid, h, today).catch(() => {});
  }, [uid, today]);

  const toggleTask = useCallback((t) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    db.toggleTask(uid, t).catch(() => {});
  }, [uid]);

  const nextEvent = upcoming[0];
  const isOngoing = nextEvent && (toDate(nextEvent.start)?.getTime() || 0) <= Date.now();
  const nextColor = nextEvent ? hexOf(nextEvent.color) : colors.primary;

  return (
    <Screen
      scroll
      refreshControl={<RefreshControl refreshing={refreshing || syncing} onRefresh={onRefresh} tintColor={colors.primary} />}
      style={{ padding: 0, paddingBottom: space[8] }}
    >
      {/* Top Header */}
      <View style={{ paddingHorizontal: space[4] }}>
        <Header
          title={`${greeting}, ${firstName}`}
          subtitle={`${fmtDayLabel(now)} · Workspace`}
          badge={googleConnected ? 'GOOGLE' : undefined}
          right={
            <Row gap={space[2]}>
              <IconBtn
                icon={syncing || refreshing ? 'sync' : 'sync-outline'}
                color={googleConnected ? colors.primary : colors.textMuted}
                onPress={handleReload}
              />
              <IconBtn icon="settings-outline" onPress={() => navigation.navigate('Settings')} />
            </Row>
          }
        />
        {toast ? <Banner type={toast.type} message={toast.message} /> : null}
      </View>

      {/* Hero Banner: Sự kiện kế tiếp */}
      <View style={{ paddingHorizontal: space[4], marginTop: space[2] }}>
        {nextEvent ? (
          <Pressable
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              navigation.navigate('Lịch');
            }}
            style={({ pressed }) => [pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }]}
          >
            <LinearGradient
              colors={[tint(nextColor, 0.26), 'rgba(18, 18, 29, 0.92)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[s.nextCard, { borderColor: tint(nextColor, 0.45) }, shadows.glow(nextColor, 0.25, 20)]}
            >
              <Row style={{ justifyContent: 'space-between' }}>
                <Badge label={isOngoing ? 'ĐANG DIỄN RA' : 'SỰ KIỆN KẾ TIẾP'} color={nextColor} dot />
                <View style={[s.countdownPill, { backgroundColor: tint(nextColor, 0.16) }]}>
                  <Ionicons name={isOngoing ? 'radio-button-on' : 'time'} size={12} color={nextColor} />
                  <Text style={[font.tiny, { color: nextColor, fontWeight: '700' }]}>
                    {fmtCountdown(toDate(nextEvent.start))}
                  </Text>
                </View>
              </Row>
              <Text style={[font.h2, { color: colors.text, marginTop: space[3] }]} numberOfLines={2}>
                {nextEvent.title}
              </Text>
              <Row style={{ marginTop: space[2] + 2, flexWrap: 'wrap' }} gap={space[3]}>
                <Row gap={4}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textSub} />
                  <Text style={[font.small, { color: colors.textSub }]}>
                    {fmtDayLabel(toDate(nextEvent.start))} · {fmtTime(toDate(nextEvent.start))}
                  </Text>
                </Row>
                {nextEvent.location ? (
                  <Row gap={4}>
                    <Ionicons name="location-outline" size={14} color={colors.textSub} />
                    <Text style={[font.small, { color: colors.textSub }]} numberOfLines={1}>
                      {nextEvent.location}
                    </Text>
                  </Row>
                ) : null}
              </Row>
            </LinearGradient>
          </Pressable>
        ) : (
          <LinearGradient
            colors={['rgba(255,255,255,0.04)', 'rgba(18, 18, 29, 0.7)']}
            style={s.emptyNextCard}
          >
            <Row gap={space[3]}>
              <View style={s.sparkleBox}>
                <Ionicons name="sparkles" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[font.h3, { color: colors.text }]}>Lịch trình hôm nay thảnh thơi</Text>
                <Text style={[font.small, { color: colors.textMuted, marginTop: 2 }]}>
                  Chưa có sự kiện nào sắp diễn ra.
                </Text>
              </View>
            </Row>
          </LinearGradient>
        )}
      </View>

      {/* Lối tắt tạo nhanh (Quick Actions) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.quickActions}
      >
        <Pressable
          style={s.quickActionBtn}
          onPress={() => navigation.navigate('EventForm')}
        >
          <Ionicons name="add-circle" size={15} color={colors.primary} />
          <Text style={[font.tiny, { color: colors.text }]}>+ Lịch mới</Text>
        </Pressable>
        <Pressable
          style={s.quickActionBtn}
          onPress={() => navigation.navigate('Cá nhân', { tab: 'tasks', create: true })}
        >
          <Ionicons name="checkbox" size={15} color={colors.cyan} />
          <Text style={[font.tiny, { color: colors.text }]}>+ Thêm việc</Text>
        </Pressable>
        <Pressable
          style={s.quickActionBtn}
          onPress={() => navigation.navigate('Cá nhân', { tab: 'habits', create: true })}
        >
          <Ionicons name="flame" size={15} color={colors.amber} />
          <Text style={[font.tiny, { color: colors.text }]}>+ Thói quen</Text>
        </Pressable>
        <Pressable
          style={s.quickActionBtn}
          onPress={() => navigation.navigate('Cá nhân', { tab: 'finance', create: true })}
        >
          <Ionicons name="wallet" size={15} color={colors.secondary} />
          <Text style={[font.tiny, { color: colors.text }]}>+ Chi tiêu</Text>
        </Pressable>
      </ScrollView>

      {/* 4 Chỉ số nhanh (Stat Cards Grid) */}
      <View style={s.statsGrid}>
        <Row gap={space[3]}>
          <StatCard
            icon="calendar"
            color={colors.primary}
            value={todayEvents.length}
            label="Lịch hôm nay"
            sub={todayEvents.length ? 'Bận rộn' : 'Trống'}
            onPress={() => navigation.navigate('Lịch')}
          />
          <StatCard
            icon="checkbox"
            color={colors.cyan}
            value={dueToday.length}
            label="Việc đến hạn"
            sub={`/${openTasks.length} việc`}
            onPress={() => navigation.navigate('Cá nhân', { tab: 'tasks' })}
          />
        </Row>
        <Row gap={space[3]} style={{ marginTop: space[3] }}>
          <StatCard
            icon="chatbubbles"
            color={colors.secondary}
            value={unreadLeads}
            label="Liên hệ công việc"
            sub={unreadLeads > 0 ? 'Có tin mới' : 'Đã xem hết'}
            onPress={() => navigation.navigate('Liên hệ')}
          />
          <StatCard
            icon="wallet"
            color={monthBalance >= 0 ? colors.emerald : colors.danger}
            value={money(monthBalance)}
            label="Số dư tháng này"
            sub={monthBalance >= 0 ? '+Dương' : '-Âm'}
            onPress={() => navigation.navigate('Cá nhân', { tab: 'finance' })}
          />
        </Row>
      </View>

      {/* Thân trang: Các danh sách chi tiết */}
      <View style={{ paddingHorizontal: space[4] }}>
        {/* Lịch hôm nay */}
        <SectionTitle
          right={
            <Pressable onPress={() => navigation.navigate('Lịch')} hitSlop={8}>
              <Row gap={2}>
                <Text style={[font.tiny, { color: colors.primary, fontWeight: '700' }]}>XEM TẤT CẢ</Text>
                <Ionicons name="chevron-forward" size={12} color={colors.primary} />
              </Row>
            </Pressable>
          }
        >
          Lịch trình hôm nay
        </SectionTitle>
        {todayEvents.length ? (
          todayEvents.map((e) => {
            const hex = hexOf(e.color);
            return (
              <Card
                key={e.id}
                style={[s.rowCard, { borderLeftColor: hex, borderLeftWidth: 3 }]}
                onPress={() => navigation.navigate('EventForm', { id: e.id })}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[font.body, { color: colors.text, fontWeight: '600' }]} numberOfLines={1}>
                    {e.title}
                  </Text>
                  <Text style={[font.tiny, { color: colors.textMuted, marginTop: 2 }]}>
                    {e.allDay ? 'Cả ngày' : `${fmtTime(toDate(e.start))}${e.end ? ` – ${fmtTime(toDate(e.end))}` : ''}`}
                    {e.location ? ` · ${e.location}` : ''}
                  </Text>
                </View>
                {e.googleEventId ? (
                  <View style={s.googlePill}>
                    <Ionicons name="logo-google" size={11} color={colors.textMuted} />
                  </View>
                ) : null}
              </Card>
            );
          })
        ) : (
          <Empty icon="cafe-outline" title="Hôm nay trống lịch" hint="Một ngày tuyệt vời để tập trung sáng tạo." />
        )}

        {/* Việc cần làm */}
        {openTasks.length ? (
          <>
            <SectionTitle
              right={
                <Pressable onPress={() => navigation.navigate('Cá nhân', { tab: 'tasks' })} hitSlop={8}>
                  <Row gap={2}>
                    <Text style={[font.tiny, { color: colors.cyan, fontWeight: '700' }]}>XEM TOÀN BỘ ({openTasks.length})</Text>
                    <Ionicons name="chevron-forward" size={12} color={colors.cyan} />
                  </Row>
                </Pressable>
              }
            >
              Việc ưu tiên
            </SectionTitle>
            {openTasks.slice(0, 4).map((t) => (
              <Card key={t.id} style={s.rowCard} onPress={() => toggleTask(t)}>
                <View style={s.checkCircle}>
                  <Ionicons name="ellipse-outline" size={20} color={colors.textMuted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[font.body, { color: colors.text }]} numberOfLines={1}>
                    {t.title}
                  </Text>
                  {t.due ? (
                    <Text style={[font.tiny, { color: colors.textMuted, marginTop: 2 }]}>
                      Hạn: {fmtDayLabel(toDate(t.due))}
                    </Text>
                  ) : null}
                </View>
                {t.priority === 'high' ? (
                  <Badge label="GẤP" color={colors.danger} dot />
                ) : t.priority === 'normal' ? (
                  <Badge label="BÌNH THƯỜNG" color={colors.cyan} />
                ) : null}
              </Card>
            ))}
          </>
        ) : null}

        {/* Thói quen hàng ngày */}
        {habits.length ? (
          <>
            <SectionTitle
              right={
                <Text style={[font.tiny, { color: colors.amber, fontWeight: '700' }]}>
                  {habitsDone}/{habits.length} HOÀN THÀNH
                </Text>
              }
            >
              Duy trì thói quen
            </SectionTitle>
            <View style={s.habitRow}>
              {habits.map((h) => {
                const on = !!h.history?.[today];
                const hex = hexOf(h.color);
                return (
                  <Pressable
                    key={h.id}
                    onPress={() => toggleHabit(h)}
                    style={({ pressed }) => [
                      s.habitPill,
                      on
                        ? { backgroundColor: tint(hex, 0.16), borderColor: tint(hex, 0.5) }
                        : { borderColor: colors.border },
                      pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
                    ]}
                  >
                    <Ionicons
                      name={on ? 'checkmark-circle' : 'ellipse-outline'}
                      size={17}
                      color={on ? hex : colors.textMuted}
                    />
                    <Text
                      style={[
                        font.small,
                        { color: on ? hex : colors.textSub, fontWeight: on ? '700' : '500' },
                      ]}
                      numberOfLines={1}
                    >
                      {h.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : null}

        {/* Liên hệ công việc gần đây */}
        {leads.length ? (
          <>
            <SectionTitle
              right={
                <Pressable onPress={() => navigation.navigate('Liên hệ')} hitSlop={8}>
                  <Row gap={2}>
                    <Text style={[font.tiny, { color: colors.secondary, fontWeight: '700' }]}>HỘP THƯ</Text>
                    <Ionicons name="chevron-forward" size={12} color={colors.secondary} />
                  </Row>
                </Pressable>
              }
            >
              Lời nhắn công việc mới
            </SectionTitle>
            {leads.slice(0, 3).map((l) => (
              <Card key={l.id} style={s.rowCard} onPress={() => navigation.navigate('Liên hệ')}>
                <View style={[s.avatar, !l.read && s.avatarUnread]}>
                  <Text style={[font.small, { color: !l.read ? colors.primary : colors.textSub, fontWeight: '700' }]}>
                    {(l.name || '?').trim().charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[font.body, { color: colors.text, fontWeight: '600' }]} numberOfLines={1}>
                    {l.name || 'Khách truy cập website'}
                  </Text>
                  <Text style={[font.tiny, { color: colors.textMuted, marginTop: 2 }]} numberOfLines={1}>
                    {l.message || l.phone || l.email}
                  </Text>
                </View>
                {!l.read ? (
                  <View style={s.unreadDotWrap}>
                    <View style={s.unreadDot} />
                  </View>
                ) : null}
              </Card>
            ))}
          </>
        ) : null}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  nextCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: space[4],
    marginBottom: space[3],
  },
  countdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  emptyNextCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space[4],
    marginBottom: space[3],
  },
  sparkleBox: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: tint(colors.primary, 0.3),
  },
  quickActions: {
    paddingHorizontal: space[4],
    gap: space[2],
    paddingVertical: space[2],
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsGrid: {
    paddingHorizontal: space[4],
    marginTop: space[2],
    marginBottom: space[2],
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    marginBottom: space[2],
    padding: space[3] + 2,
  },
  googlePill: {
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  checkCircle: {
    padding: 2,
  },
  habitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  habitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    borderRadius: radius.pill,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarUnread: {
    backgroundColor: colors.primaryDim,
    borderColor: tint(colors.primary, 0.4),
  },
  unreadDotWrap: {
    padding: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
