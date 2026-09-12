import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Field, Btn, Banner, SwitchRow } from '../components/ui';
import { colors, space, radius, font, shadows } from '../theme';
import { useAuth, authMessage } from '../contexts/AuthContext';
import { getSavedCredentials, saveCredentials, clearSavedCredentials } from '../services/savedCredentials';
import { hasBiometricHardware, authenticateBiometric, getBiometricTypeLabel } from '../services/appLock';

export default function LoginScreen() {
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [bioLoginAvailable, setBioLoginAvailable] = useState(false);
  const [bioLabel, setBioLabel] = useState('Sinh trắc học');

  useEffect(() => {
    (async () => {
      const [saved, bioHardware, label] = await Promise.all([
        getSavedCredentials(),
        hasBiometricHardware(),
        getBiometricTypeLabel(),
      ]);
      if (saved) {
        setEmail(saved.email);
        setPassword(saved.password);
      } else {
        setEmail('ntlam2211@gmail.com');
        setPassword('adminTungLam02');
      }
      setBioLoginAvailable(!!saved && bioHardware);
      setBioLabel(label);
    })();
  }, []);

  const submit = async () => {
    if (!email || !password) return setError('Vui lòng nhập đầy đủ email và mật khẩu.');
    setBusy(true);
    setError('');
    try {
      await signIn(email, password);
      if (rememberMe) {
        saveCredentials(email, password);
        setBioLoginAvailable(await hasBiometricHardware());
      } else {
        clearSavedCredentials();
        setBioLoginAvailable(false);
      }
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const loginWithBiometric = async () => {
    setError('');
    const ok = await authenticateBiometric();
    if (!ok) return;
    const saved = await getSavedCredentials();
    if (!saved) {
      setBioLoginAvailable(false);
      return;
    }
    setBusy(true);
    try {
      await signIn(saved.email, saved.password);
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  };

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
          colors={['rgba(0, 132, 255, 0.18)', 'rgba(0, 194, 255, 0.10)', 'rgba(255, 222, 0, 0.05)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />

        <View style={s.card}>
          <View style={s.logoContainer}>
            <Image source={require('../../assets/logo-mark.png')} style={s.logo} resizeMode="contain" />
          </View>
          <Text style={[font.h1, { color: colors.text, textAlign: 'center', marginBottom: space[4] }]}>
            Xin chào Tùng Lâm
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

          <View style={{ marginTop: space[3] }}>
            <SwitchRow
              label="Lưu tài khoản"
              hint="Tự động điền lại email và mật khẩu ở lần mở sau"
              value={rememberMe}
              onChange={setRememberMe}
              icon="bookmark-outline"
            />
          </View>

          <Btn title="Đăng nhập" onPress={submit} loading={busy} icon="log-in-outline" style={{ marginTop: space[3] }} />

          {bioLoginAvailable ? (
            <Btn
              title={`Đăng nhập bằng ${bioLabel}`}
              onPress={loginWithBiometric}
              disabled={busy}
              variant="secondary"
              icon={bioLabel.includes('Face') ? 'scan-outline' : 'finger-print-outline'}
              style={{ marginTop: space[2] }}
            />
          ) : null}

          <Pressable onPress={forgot} style={{ marginTop: space[3], alignSelf: 'center' }}>
            <Text style={[font.small, { color: colors.textMuted }]}>Quên mật khẩu?</Text>
          </Pressable>
        </View>
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
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[3],
    ...shadows.glow(colors.primary, 0.35, 16),
  },
  logo: { width: 96, height: 96, borderRadius: 48 },
  eye: { position: 'absolute', right: space[3], top: 38 },
});
