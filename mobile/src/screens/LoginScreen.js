import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen, Field, Btn, Banner, Row } from '../components/ui';
import { colors, space, radius, font, tint, shadows } from '../theme';
import { useAuth, authMessage } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email || !password) return setError('Vui lòng nhập đầy đủ email và mật khẩu.');
    setBusy(true);
    setError('');
    try {
      await signIn(email, password);
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const quickLogin = async () => {
    Haptics.selectionAsync().catch(() => {});
    const adminEmail = 'ntlam2211@gmail.com';
    const adminPassword = 'adminTungLam02';
    setEmail(adminEmail);
    setPassword(adminPassword);
    setError('');
    setBusy(true);
    try {
      await signIn(adminEmail, adminPassword);
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const fillDemo = quickLogin;

  const forgot = async () => {
    if (!email) return setError('Nhập email trước rồi bấm quên mật khẩu.');
    try {
      await resetPassword(email);
      Alert.alert('Đã gửi', `Link đặt lại mật khẩu đã gửi tới ${email}.`);
    } catch (err) {
      setError(authMessage(err));
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.wrap}
      >
        <LinearGradient
          colors={['rgba(0,255,136,0.12)', 'rgba(139,92,246,0.08)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />

        <View style={s.card}>
          <View style={s.logoContainer}>
            <Image source={require('../../assets/logo-mark.png')} style={s.logo} resizeMode="contain" />
          </View>
          <Text style={[font.h1, { color: colors.text, textAlign: 'center' }]}>Tùng Lâm Workspace</Text>
          <Text style={[font.small, { color: colors.textSub, marginTop: space[1], marginBottom: space[4], textAlign: 'center' }]}>
            Hệ thống điều hành cá nhân & quản trị Portfolio
          </Text>

          <Banner type="error" message={error} onClose={() => setError('')} />

          <Field
            label="Email quản trị"
            value={email}
            onChangeText={setEmail}
            placeholder="ban@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <View>
            <Field
              label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!show}
              autoCapitalize="none"
              onSubmitEditing={submit}
              returnKeyType="go"
            />
            <Pressable onPress={() => setShow((v) => !v)} hitSlop={10} style={s.eye}>
              <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={19} color={colors.textMuted} />
            </Pressable>
          </View>

          <Btn title="Đăng nhập Workspace" onPress={submit} loading={busy} icon="log-in-outline" />

          {/* Quick Admin Login Button */}
          <Pressable
            onPress={quickLogin}
            disabled={busy}
            style={({ pressed }) => [s.demoBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="flash-outline" size={14} color={colors.primary} />
            <Text style={[font.tiny, { color: colors.primary, fontWeight: '700' }]}>
              Đăng nhập nhanh với tài khoản Admin
            </Text>
          </Pressable>

          <Pressable onPress={forgot} style={{ marginTop: space[3], alignSelf: 'center' }}>
            <Text style={[font.small, { color: colors.textMuted }]}>Quên mật khẩu?</Text>
          </Pressable>
        </View>

        <Text style={[font.tiny, s.footer]}>
          Đồng bộ và bảo mật qua Firebase Authentication
        </Text>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: space[4] },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: space[5],
    ...shadows.card,
  },
  logoContainer: {
    alignSelf: 'center',
    width: 68,
    height: 68,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: tint(colors.primary, 0.35),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[3],
  },
  logo: { width: 44, height: 44 },
  eye: { position: 'absolute', right: space[3], top: 38 },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: space[3],
    paddingVertical: space[2],
    backgroundColor: tint(colors.primary, 0.1),
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: tint(colors.primary, 0.25),
  },
  footer: { color: colors.textMuted, textAlign: 'center', marginTop: space[4] },
});
