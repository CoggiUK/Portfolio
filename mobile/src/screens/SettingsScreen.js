import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import {
  Screen, Header, Card, Btn, SwitchRow, SectionTitle, Row, Field, Chip, Banner, IconBtn,
} from '../components/ui';
import { colors, space, radius, font, tint } from '../theme';
import { useApp } from '../contexts/AppContext';
import { useAuth, authMessage } from '../contexts/AuthContext';
import { useGoogleAuth, listCalendars, isConfigured } from '../services/googleCalendar';
import { fmtDateTime, toDate } from '../utils/date';

const HOURS = [6, 8, 12, 18, 20, 21, 22];

export default function SettingsScreen({ navigation }) {
  const { user, signOut, changePassword } = useAuth();
  const {
    prefs, savePrefs, googleConnected, refreshGoogleStatus, syncGoogle, syncing,
    pushToken, events, tasks, notes, habits, transactions, leads, notify,
  } = useApp();

  const [calendars, setCalendars] = useState([]);
  const [message, setMessage] = useState(null);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwBusy, setPwBusy] = useState(false);
  const [permission, setPermission] = useState(null);

  const google = useGoogleAuth(async (ok, err) => {
    await refreshGoogleStatus();
    setMessage(
      err
        ? { type: 'error', text: err }
        : { type: 'success', text: ok ? 'Đã kết nối Google Calendar.' : 'Đã ngắt kết nối Google Calendar.' }
    );
  });

  useEffect(() => {
    Notifications.getPermissionsAsync().then((p) => setPermission(p.status));
  }, []);

  useEffect(() => {
    if (!googleConnected) return setCalendars([]);
    listCalendars().then(setCalendars).catch(() => setCalendars([]));
  }, [googleConnected]);

  const doChangePassword = async () => {
    if (pw.next.length < 6) return setMessage({ type: 'error', text: 'Mật khẩu mới cần ít nhất 6 ký tự.' });
    if (pw.next !== pw.confirm) return setMessage({ type: 'error', text: 'Xác nhận mật khẩu không khớp.' });
    setPwBusy(true);
    try {
      await changePassword(pw.current, pw.next);
      setPw({ current: '', next: '', confirm: '' });
      setMessage({ type: 'success', text: 'Đã đổi mật khẩu — dùng cho cả app và /portal-admin.' });
    } catch (err) {
      setMessage({ type: 'error', text: authMessage(err) });
    } finally {
      setPwBusy(false);
    }
  };

  const confirmSignOut = () =>
    Alert.alert('Đăng xuất?', 'Bạn sẽ cần đăng nhập lại để xem dữ liệu.', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: signOut },
    ]);

  return (
    <Screen>
      <Header title="Cài đặt" subtitle={user?.email} onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={{ padding: space[4], paddingBottom: space[8] }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {message ? (
          <Banner type={message.type} message={message.text} onClose={() => setMessage(null)} />
        ) : null}

        {/* ── Google Calendar ── */}
        <SectionTitle>Google Calendar</SectionTitle>
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <Row gap={space[3]}>
              <View style={[s.icon, { backgroundColor: googleConnected ? colors.primaryDim : 'rgba(255,255,255,0.05)' }]}>
                <Ionicons name="logo-google" size={17} color={googleConnected ? colors.primary : colors.textMuted} />
              </View>
              <View>
                <Text style={[font.body, { color: colors.text }]}>
                  {googleConnected ? 'Đã kết nối' : 'Chưa kết nối'}
                </Text>
                <Text style={[font.tiny, { color: colors.textMuted }]}>
                  {prefs.lastGoogleSync
                    ? `Đồng bộ lần cuối ${fmtDateTime(new Date(prefs.lastGoogleSync))}`
                    : 'Lịch tạo trong app sẽ tự đẩy lên Google'}
                </Text>
              </View>
            </Row>
          </Row>

          {!isConfigured() ? (
            <Banner
              type="info"
              message="Chưa cấu hình Google OAuth Client ID. Xem hướng dẫn trong mobile/.env.example."
            />
          ) : null}

          <Row style={{ marginTop: space[4] }} gap={space[2]}>
            {googleConnected ? (
              <>
                <Btn title="Đồng bộ ngay" icon="sync-outline" onPress={syncGoogle} loading={syncing} style={{ flex: 1 }} />
                <Btn title="Ngắt" variant="secondary" onPress={google.disconnect} style={{ flex: 0.7 }} />
              </>
            ) : (
              <Btn
                title="Kết nối Google Calendar"
                icon="link-outline"
                onPress={google.connect}
                loading={google.busy}
                style={{ flex: 1 }}
              />
            )}
          </Row>

          {googleConnected ? (
            <>
              <View style={s.divider} />
              <SwitchRow
                label="Tự động đồng bộ"
                hint="Mỗi lịch tạo/sửa trong app đẩy ngay lên Google"
                icon="cloud-upload-outline"
                value={prefs.autoSyncGoogle !== false}
                onChange={(v) => savePrefs({ autoSyncGoogle: v })}
              />
              {calendars.length ? (
                <>
                  <Text style={[font.small, { color: colors.textSub, marginBottom: space[2], marginTop: space[2] }]}>
                    Lịch đích
                  </Text>
                  <Row style={{ flexWrap: 'wrap' }} gap={space[2]}>
                    {calendars.map((c) => (
                      <Chip
                        key={c.id}
                        label={c.primary ? `${c.name} (chính)` : c.name}
                        active={(prefs.googleCalendarId || 'primary') === (c.primary ? 'primary' : c.id)}
                        onPress={() => savePrefs({ googleCalendarId: c.primary ? 'primary' : c.id })}
                      />
                    ))}
                  </Row>
                </>
              ) : null}
            </>
          ) : null}
        </Card>

        {/* ── Thông báo ── */}
        <SectionTitle>Thông báo</SectionTitle>
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <Row gap={space[3]}>
              <View style={[s.icon, { backgroundColor: permission === 'granted' ? colors.primaryDim : colors.dangerDim }]}>
                <Ionicons
                  name={permission === 'granted' ? 'notifications' : 'notifications-off'}
                  size={17}
                  color={permission === 'granted' ? colors.primary : colors.danger}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[font.body, { color: colors.text }]}>
                  {permission === 'granted' ? 'Đã bật thông báo' : 'Chưa cấp quyền thông báo'}
                </Text>
                <Text style={[font.tiny, { color: colors.textMuted }]}>
                  {pushToken ? 'Push từ server đang hoạt động' : 'Chỉ nhắc cục bộ (chưa có push token)'}
                </Text>
              </View>
            </Row>
          </Row>
          {permission !== 'granted' ? (
            <Btn title="Mở cài đặt hệ thống" variant="secondary" icon="open-outline"
              style={{ marginTop: space[3] }} onPress={() => Linking.openSettings()} />
          ) : null}

          <View style={s.divider} />
          <SwitchRow
            label="Nhắc điểm danh thói quen"
            hint="Một lời nhắc mỗi tối để tổng kết ngày"
            icon="leaf-outline"
            color={colors.cyan}
            value={prefs.habitReminder !== false}
            onChange={(v) => savePrefs({ habitReminder: v })}
          />
          {prefs.habitReminder !== false ? (
            <Row style={{ flexWrap: 'wrap', marginTop: space[2] }} gap={space[2]}>
              {HOURS.map((h) => (
                <Chip
                  key={h}
                  label={`${h}:00`}
                  color={colors.cyan}
                  active={(prefs.habitReminderHour ?? 20) === h}
                  onPress={() => savePrefs({ habitReminderHour: h, habitReminderMinute: 0 })}
                />
              ))}
            </Row>
          ) : null}
        </Card>

        {/* ── Dữ liệu ── */}
        <SectionTitle>Dữ liệu của bạn</SectionTitle>
        <Card>
          <View style={s.statGrid}>
            <DataStat icon="calendar-outline" label="Lịch" value={events.length} color={colors.primary} />
            <DataStat icon="checkbox-outline" label="Việc" value={tasks.length} color={colors.cyan} />
            <DataStat icon="reader-outline" label="Ghi chú" value={notes.length} color={colors.secondary} />
            <DataStat icon="leaf-outline" label="Thói quen" value={habits.length} color={colors.amber} />
            <DataStat icon="wallet-outline" label="Giao dịch" value={transactions.length} color={colors.primary} />
            <DataStat icon="mail-outline" label="Liên hệ" value={leads.length} color={colors.secondary} />
          </View>
          <Text style={[font.tiny, { color: colors.textMuted, marginTop: space[3] }]}>
            Toàn bộ dữ liệu nằm trong Cloud Firestore của chính bạn (project {`portfolio-42c34`}).
          </Text>
        </Card>

        {/* ── Bảo mật ── */}
        <SectionTitle>Đổi mật khẩu</SectionTitle>
        <Card>
          <Field label="Mật khẩu hiện tại" value={pw.current} secureTextEntry autoCapitalize="none"
            onChangeText={(v) => setPw({ ...pw, current: v })} />
          <Field label="Mật khẩu mới" value={pw.next} secureTextEntry autoCapitalize="none"
            onChangeText={(v) => setPw({ ...pw, next: v })} />
          <Field label="Xác nhận mật khẩu mới" value={pw.confirm} secureTextEntry autoCapitalize="none"
            onChangeText={(v) => setPw({ ...pw, confirm: v })} />
          <Btn title="Cập nhật mật khẩu" icon="key-outline" variant="secondary"
            onPress={doChangePassword} loading={pwBusy} />
        </Card>

        <Btn title="Đăng xuất" icon="log-out-outline" variant="danger"
          style={{ marginTop: space[6] }} onPress={confirmSignOut} />

        <Text style={[font.tiny, { color: colors.textMuted, textAlign: 'center', marginTop: space[5] }]}>
          Tùng Lâm Workspace · v1.0.0 · {Platform.OS}
        </Text>
      </ScrollView>
    </Screen>
  );
}

function DataStat({ icon, label, value, color }) {
  return (
    <View style={s.dataStat}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={[font.h3, { color: colors.text, marginTop: space[1] }]}>{value}</Text>
      <Text style={[font.tiny, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const s = {
  icon: { width: 36, height: 36, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: space[3] },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  dataStat: {
    flexGrow: 1, flexBasis: '30%', alignItems: 'center', paddingVertical: space[3],
    borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: colors.border,
  },
};
