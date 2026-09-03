import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Field, Btn, Banner } from '../components/ui';
import { colors, space, font } from '../theme';
import { useAuth, authMessage } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email || !password) return setError('Nhập đủ email và mật khẩu.');
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
          colors={['rgba(0,255,136,0.10)', 'rgba(139,92,246,0.06)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />

        <Image source={require('../../assets/logo-mark.png')} style={s.logo} resizeMode="contain" />
        <Text style={[font.h1, { color: colors.text }]}>Workspace</Text>
        <Text style={[font.small, { color: colors.textSub, marginTop: space[2], marginBottom: space[6] }]}>
          Quản lý cá nhân & điều hành portfolio của Tùng Lâm
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

        <Btn title="Đăng nhập" onPress={submit} loading={busy} icon="log-in-outline" />

        <Pressable onPress={forgot} style={{ marginTop: space[4], alignSelf: 'center' }}>
          <Text style={[font.small, { color: colors.textMuted }]}>Quên mật khẩu?</Text>
        </Pressable>

        <Text style={[font.tiny, s.footer]}>
          Dùng chung tài khoản Firebase với trang quản trị web /portal-admin
        </Text>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: space[5] },
  logo: { width: 72, height: 72, marginBottom: space[4] },
  eye: { position: 'absolute', right: space[3], top: 38 },
  footer: { color: colors.textMuted, textAlign: 'center', marginTop: space[6] },
});
