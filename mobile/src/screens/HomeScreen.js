import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen, Header, Card, SectionTitle, Empty, IconBtn, Badge, Row, Banner } from '../components/ui';
import { colors, space, radius, font, hexOf, tint } from '../theme';
import { useApp } from '../contexts/AppContext';
import * as db from '../services/db';
import {
  toDate, dayKey, isSameDay, fmtTime, fmtCountdown, fmtDayLabel, money, startOfMonth,
} from '../utils/date';

export default function HomeScreen({ navigation }) {
  const {
    uid, events, tasks, habits, transactions, leads, site, unreadLeads,
    googleConnected, syncing, syncGoogle, toast,
  } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const now = new Date();
  const today = dayKey(now);

  const todayEvents = useMemo(
    () => events.filter((e) => { const d = toDate(e.start); return d && isSameDay(d, now); }),
    [events] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const upcoming = useMemo(
    () => events.filter((e) => (toDate(e.start)?.getTime() || 0) > Date.now()).slice(0, 5),
    [events]
  );

  const openTasks = useMemo(() => tasks.filter((t) => !t.done), [tasks]);
  const dueToday = useMemo(
    () => openTasks.filter((t) => { const d = toDate(t.due); return d && d <= new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59); }),
    [openTasks] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const monthBalance = useMemo(() => {
    const from = startOfMonth(now).getTime();
    return transactions.reduce((sum, t) => {
      const d = toDate(t.date);
      if (!d || d.getTime() < from) return sum;
      return sum + (t.type === 'income' ? Number(t.amount || 0) : -Number(t.amount || 0));
    }, 0);
  }, [transactions]); // eslint-disable-line react-hooks/exhaustive-deps

  const habitsDone = habits.filter((h) => h.history?.[today]).length;

  const greeting = now.getHours() < 11 ? 'Chào buổi sáng' : now.getHours() < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  const firstName = (site.profile?.name || '').split(' ').slice(-1)[0] || 'bạn';

  const onRefresh = async () => {
    setRefreshing(true);
    if (googleConnected) await syncGoogle();
    setRefreshing(false);
  };

  const toggleHabit = (h) => db.toggleHabitDay(uid, h, today).catch(() => {});

  return (
    <Screen
      scroll
      refreshControl={<RefreshControl refreshing={refreshing || syncing} onRefresh={onRefresh} tintColor={colors.primary} />}
      style={{ padding: 0, paddingBottom: space[8] }}
    >
      <View style={{ paddingHorizontal: space[4] }}>
        <Header
          title={`${greeting}, ${firstName}`}
          subtitle={fmtDayLabel(now)}
          right={<IconBtn icon="settings-outline" onPress={() => navigation.navigate('Settings')} />}
        />
        {toast ? <Banner type={toast.type} message={toast.message} /> : null}
      </View>

      {/* Sự kiện kế tiếp */}
      <View style={{ paddingHorizontal: space[4] }}>
        {upcoming[0] ? (
          <Pressable onPress={() => navigation.navigate('Lịch')}>
            <LinearGradient
              colors={[tint(hexOf(upcoming[0].color), 0.22), 'rgba(255,255,255,0.02)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[s.next, { borderColor: tint(hexOf(upcoming[0].color), 0.35) }]}
            >
              <Row>
                <Badge label="SẮP DIỄN RA" color={hexOf(upcoming[0].color)} />
                <Text style={[font.tiny, { color: colors.textSub }]}>
                  {fmtCountdown(toDate(upcoming[0].start))}
                </Text>
              </Row>
              <Text style={[font.h2, { color: colors.text, marginTop: space[3] }]} numberOfLines={2}>
                {upcoming[0].title}
              </Text>
              <Row style={{ marginTop: space[2] }}>
                <Ionicons name="time-outline" size={14} color={colors.textSub} />
                <Text style={[font.small, { color: colors.textSub }]}>
                  {fmtDayLabel(toDate(upcoming[0].start))} · {fmtTime(toDate(upcoming[0].start))}
                </Text>
                {upcoming[0].location ? (
                  <>
                    <Ionicons name="location-outline" size={14} color={colors.textSub} style={{ marginLeft: space[2] }} />
                    <Text style={[font.small, { color: colors.textSub }]} numberOfLines={1}>
                      {upcoming[0].location}
                    </Text>
                  </>
                ) : null}
              </Row>
            </LinearGradient>
          </Pressable>
        ) : (
          <Card>
            <Text style={[font.body, { color: colors.textSub }]}>Không có lịch nào phía trước.</Text>
            <Text style={[font.small, { color: colors.textMuted, marginTop: space[1] }]}>
              Thêm lịch ở tab Lịch để được nhắc trước giờ.
            </Text>
          </Card>
        )}
      </View>

      {/* Chỉ số nhanh */}
      <View style={s.stats}>
        <Stat icon="calendar-outline" color={colors.primary} value={todayEvents.length} label="Lịch hôm nay"
          onPress={() => navigation.navigate('Lịch')} />
        <Stat icon="checkbox-outline" color={colors.cyan} value={dueToday.length} sub={`/${openTasks.length}`} label="Việc đến hạn"
          onPress={() => navigation.navigate('Cá nhân', { tab: 'tasks' })} />
        <Stat icon="chatbubble-ellipses-outline" color={colors.secondary} value={unreadLeads} label="Liên hệ mới"
          onPress={() => navigation.navigate('Liên hệ')} />
        <Stat icon="wallet-outline" color={monthBalance >= 0 ? colors.primary : colors.danger}
          value={money(monthBalance)} small label="Số dư tháng"
          onPress={() => navigation.navigate('Cá nhân', { tab: 'finance' })} />
      </View>

      <View style={{ paddingHorizontal: space[4] }}>
        {/* Lịch hôm nay */}
        <SectionTitle right={<Pressable onPress={() => navigation.navigate('Lịch')}>
          <Text style={[font.tiny, { color: colors.primary }]}>XEM LỊCH</Text></Pressable>}>
          Hôm nay
        </SectionTitle>
        {todayEvents.length ? (
          todayEvents.map((e) => (
            <Card key={e.id} style={s.rowCard} onPress={() => navigation.navigate('EventForm', { id: e.id })}>
              <View style={[s.dot, { backgroundColor: hexOf(e.color) }]} />
              <View style={{ flex: 1 }}>
                <Text style={[font.body, { color: colors.text }]} numberOfLines={1}>{e.title}</Text>
                <Text style={[font.tiny, { color: colors.textMuted, marginTop: 2 }]}>
                  {e.allDay ? 'Cả ngày' : `${fmtTime(toDate(e.start))}${e.end ? ` – ${fmtTime(toDate(e.end))}` : ''}`}
                </Text>
              </View>
              {e.googleEventId ? <Ionicons name="cloud-done-outline" size={16} color={colors.textMuted} /> : null}
            </Card>
          ))
        ) : (
          <Empty icon="cafe-outline" title="Hôm nay trống lịch" hint="Một ngày để làm việc sâu." />
        )}

        {/* Việc cần làm */}
        {openTasks.length ? (
          <>
            <SectionTitle right={<Pressable onPress={() => navigation.navigate('Cá nhân', { tab: 'tasks' })}>
              <Text style={[font.tiny, { color: colors.primary }]}>TẤT CẢ</Text></Pressable>}>
              Việc cần làm
            </SectionTitle>
            {openTasks.slice(0, 4).map((t) => (
              <Card key={t.id} style={s.rowCard} onPress={() => db.toggleTask(uid, t)}>
                <Ionicons name="ellipse-outline" size={20} color={colors.textMuted} />
                <Text style={[font.body, { color: colors.text, flex: 1 }]} numberOfLines={1}>{t.title}</Text>
                {t.priority === 'high' ? <Badge label="GẤP" color={colors.danger} /> : null}
              </Card>
            ))}
          </>
        ) : null}

        {/* Thói quen */}
        {habits.length ? (
          <>
            <SectionTitle right={<Text style={[font.tiny, { color: colors.textMuted }]}>
              {habitsDone}/{habits.length}</Text>}>
              Thói quen hôm nay
            </SectionTitle>
            <View style={s.habitRow}>
              {habits.map((h) => {
                const on = !!h.history?.[today];
                const hex = hexOf(h.color);
                return (
                  <Pressable key={h.id} onPress={() => toggleHabit(h)}
                    style={[s.habitPill, on && { backgroundColor: tint(hex, 0.16), borderColor: tint(hex, 0.45) }]}>
                    <Ionicons name={on ? 'checkmark-circle' : 'ellipse-outline'} size={16}
                      color={on ? hex : colors.textMuted} />
                    <Text style={[font.small, { color: on ? hex : colors.textSub }]} numberOfLines={1}>{h.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : null}

        {/* Liên hệ mới nhất */}
        {leads.length ? (
          <>
            <SectionTitle right={<Pressable onPress={() => navigation.navigate('Liên hệ')}>
              <Text style={[font.tiny, { color: colors.primary }]}>HỘP THƯ</Text></Pressable>}>
              Liên hệ gần đây
            </SectionTitle>
            {leads.slice(0, 3).map((l) => (
              <Card key={l.id} style={s.rowCard} onPress={() => navigation.navigate('Liên hệ')}>
                <View style={[s.avatar, !l.read && { borderColor: colors.primary }]}>
                  <Text style={[font.small, { color: colors.primary }]}>
                    {(l.name || '?').trim().charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[font.body, { color: colors.text }]} numberOfLines={1}>{l.name || 'Khách ẩn danh'}</Text>
                  <Text style={[font.tiny, { color: colors.textMuted }]} numberOfLines={1}>{l.message || l.email}</Text>
                </View>
                {!l.read ? <View style={s.unreadDot} /> : null}
              </Card>
            ))}
          </>
        ) : null}
      </View>
    </Screen>
  );
}

function Stat({ icon, color, value, sub, label, small, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.stat, pressed && { opacity: 0.7 }]}>
      <View style={[s.statIcon, { backgroundColor: tint(color, 0.12) }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Row gap={2} style={{ marginTop: space[2] }}>
        <Text style={[small ? font.h3 : font.h2, { color: colors.text }]} numberOfLines={1}>{value}</Text>
        {sub ? <Text style={[font.small, { color: colors.textMuted }]}>{sub}</Text> : null}
      </Row>
      <Text style={[font.tiny, { color: colors.textMuted, marginTop: 2 }]} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  next: { borderRadius: radius.lg, borderWidth: 1, padding: space[4], marginBottom: space[4] },
  stats: {
    flexDirection: 'row', flexWrap: 'wrap', gap: space[3],
    paddingHorizontal: space[4], marginBottom: space[2],
  },
  stat: {
    flexGrow: 1, flexBasis: '45%',
    backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1,
    borderColor: colors.border, padding: space[3],
  },
  statIcon: { width: 30, height: 30, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  rowCard: { flexDirection: 'row', alignItems: 'center', gap: space[3], marginBottom: space[2], padding: space[3] },
  dot: { width: 8, height: 8, borderRadius: 4 },
  habitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  habitPill: {
    flexDirection: 'row', alignItems: 'center', gap: space[1],
    paddingHorizontal: space[3], paddingVertical: space[2],
    borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
  },
  avatar: {
    width: 34, height: 34, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primaryDim, borderWidth: 1, borderColor: 'transparent',
  },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
});
