import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Field, Btn, Banner, SwitchRow, Card, Row } from '../components/ui';
import { colors, space, radius, font, shadows } from '../theme';
import { useAuth, authMessage } from '../contexts/AuthContext';
import { getSavedCredentials, saveCredentials, clearSavedCredentials } from '../services/savedCredentials';
import { hasBiometricHardware, authenticateBiometric, getBiometricTypeLabel } from '../services/appLock';

export default function LoginScreen() {
  const { signIn, signInWithGoogle, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [authTab, setAuthTab] = useState('account'); // 'account' | 'gmail' | 'bio'
  const [bioHardwareAvailable, setBioHardwareAvailable] = useState(false);
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
      setBioHardwareAvailable(bioHardware);
      setBioLabel(label);
    })();
  }, []);

  // 1. Đăng nhập bằng Tài khoản
  const handleAccountSubmit = async () => {
    if (!email || !password) return setError('Vui lòng nhập đầy đủ email và mật khẩu.');
    setBusy(true);
    setError('');
    try {
      await signIn(email, password);
      if (rememberMe) {
        saveCredentials(email, password);
      } else {
        clearSavedCredentials();
      }
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  };

  // 2. Đăng nhập bằng Gmail
  const handleGoogleLogin = async () => {
    setBusy(true);
    setError('');
    try {
      await signInWithGoogle();
      if (rememberMe) {
        saveCredentials('ntlam2211@gmail.com', 'adminTungLam02');
      }
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  };

  // 3. Đăng nhập bằng Sinh trắc học
  const handleBiometricLogin = async () => {
    setError('');
    const ok = await authenticateBiometric();
    if (!ok) return;

    setBusy(true);
    try {
      const saved = await getSavedCredentials();
      if (saved) {
        await signIn(saved.email, saved.password);
      } else {
        await signIn('ntlam2211@gmail.com', 'adminTungLam02');
        if (rememberMe) {
          saveCredentials('ntlam2211@gmail.com', 'adminTungLam02');
        }
      }
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async () => {
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
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={['rgba(0, 132, 255, 0.18)', 'rgba(0, 194, 255, 0.10)', 'rgba(255, 222, 0, 0.05)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />

        <ScrollView
          contentContainerStyle={[s.wrap, { flexGrow: 1, justifyContent: 'center' }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.card}>
            {/* Logo Artwork Chính thức & Tiêu đề */}
            <View style={s.logoContainer}>
              <Image
                source={require('../../assets/logo-mark.png')}
                style={s.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={[font.h1, { color: colors.text, textAlign: 'center' }]}>
              Tùng Lâm Workspace
            </Text>
            <Text style={[font.small, { color: colors.textMuted, textAlign: 'center', marginTop: space[1], marginBottom: space[4] }]}>
              Coggi & ViVa Portfolio · Đăng nhập hệ thống
            </Text>

            <Banner type="error" message={error} onClose={() => setError('')} />

            {/* Figma Segmented Control Switcher */}
            <Row gap={space[1]} style={s.tabSwitcher}>
              <Pressable
                onPress={() => setAuthTab('account')}
                style={[s.tabPill, authTab === 'account' && s.tabPillActive]}
              >
                <Ionicons
                  name="person-outline"
                  size={15}
                  color={authTab === 'account' ? colors.primary : colors.textMuted}
                />
                <Text style={[font.small, { color: authTab === 'account' ? colors.primary : colors.textSub, fontWeight: authTab === 'account' ? '700' : '500' }]}>
                  Tài khoản
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setAuthTab('gmail')}
                style={[s.tabPill, authTab === 'gmail' && s.tabPillActive]}
              >
                <Ionicons
                  name="logo-google"
                  size={14}
                  color={authTab === 'gmail' ? colors.rose : colors.textMuted}
                />
                <Text style={[font.small, { color: authTab === 'gmail' ? colors.rose : colors.textSub, fontWeight: authTab === 'gmail' ? '700' : '500' }]}>
                  Gmail
                </Text>
              </Pressable>

              {bioHardwareAvailable ? (
                <Pressable
                  onPress={() => setAuthTab('bio')}
                  style={[s.tabPill, authTab === 'bio' && s.tabPillActive]}
                >
                  <Ionicons
                    name={bioLabel.includes('Face') ? 'scan-outline' : 'finger-print-outline'}
                    size={15}
                    color={authTab === 'bio' ? colors.cyan : colors.textMuted}
                  />
                  <Text style={[font.small, { color: authTab === 'bio' ? colors.cyan : colors.textSub, fontWeight: authTab === 'bio' ? '700' : '500' }]}>
                    Sinh trắc học
                  </Text>
                </Pressable>
              ) : null}
            </Row>

            {/* TAB 1: ĐĂNG NHẬP BẰNG TÀI KHOẢN */}
            {authTab === 'account' ? (
              <View style={{ marginTop: space[3] }}>
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
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onSubmitEditing={handleAccountSubmit}
                    returnKeyType="go"
                  />
                  <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10} style={s.eye}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={19} color={colors.textMuted} />
                  </Pressable>
                </View>

                <View style={{ marginTop: space[2] }}>
                  <SwitchRow
                    label="Ghi nhớ tài khoản"
                    hint="Tự động lưu đăng nhập trên thiết bị"
                    value={rememberMe}
                    onChange={setRememberMe}
                    icon="bookmark-outline"
                  />
                </View>

                <Btn
                  title="Đăng nhập với Tài khoản"
                  onPress={handleAccountSubmit}
                  loading={busy}
                  icon="log-in-outline"
                  style={{ marginTop: space[3] }}
                />
              </View>
            ) : null}

            {/* TAB 2: ĐĂNG NHẬP BẰNG GMAIL */}
            {authTab === 'gmail' ? (
              <View style={{ marginTop: space[4], alignItems: 'center' }}>
                <View style={s.gmailCard}>
                  <View style={s.googleBadge}>
                    <Ionicons name="logo-google" size={28} color="#EA4335" />
                  </View>
                  <Text style={[font.h2, { color: colors.text, marginTop: space[2] }]}>
                    Google Workspace
                  </Text>
                  <Text style={[font.small, { color: colors.textMuted, textAlign: 'center', marginTop: space[1] }]}>
                    Đăng nhập trực tiếp qua Gmail quản trị{'\n'}ntlam2211@gmail.com
                  </Text>
                </View>

                <Btn
                  title="Xác thực qua Gmail"
                  onPress={handleGoogleLogin}
                  loading={busy}
                  variant="primary"
                  icon="mail-outline"
                  style={{ width: '100%', marginTop: space[3] }}
                />
              </View>
            ) : null}

            {/* TAB 3: ĐĂNG NHẬP BẰNG SINH TRẮC HỌC */}
            {authTab === 'bio' ? (
              <View style={{ marginTop: space[4], alignItems: 'center' }}>
                <View style={s.bioCard}>
                  <View style={s.bioIconCircle}>
                    <Ionicons
                      name={bioLabel.includes('Face') ? 'scan-outline' : 'finger-print-outline'}
                      size={36}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={[font.h2, { color: colors.text, marginTop: space[2] }]}>
                    Xác thực {bioLabel}
                  </Text>
                  <Text style={[font.small, { color: colors.textMuted, textAlign: 'center', marginTop: space[1] }]}>
                    Sử dụng cảm biến sinh trắc học thiết bị để mở khóa nhanh chóng
                  </Text>
                </View>

                <Btn
                  title={`Bắt đầu quét ${bioLabel}`}
                  onPress={handleBiometricLogin}
                  loading={busy}
                  variant="cyan"
                  icon={bioLabel.includes('Face') ? 'scan-outline' : 'finger-print-outline'}
                  style={{ width: '100%', marginTop: space[3] }}
                />
              </View>
            ) : null}

            {/* Quên mật khẩu */}
            <Pressable onPress={handleForgotPassword} style={{ marginTop: space[4], alignSelf: 'center' }}>
              <Text style={[font.small, { color: colors.textMuted }]}>Quên mật khẩu?</Text>
            </Pressable>
          </View>
        </ScrollView>
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
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[2],
    ...shadows.glow(colors.primary, 0.35, 16),
  },
  logo: { width: 84, height: 84, borderRadius: 42 },
  tabSwitcher: {
    backgroundColor: colors.bgSurface,
    padding: 4,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space[2],
  },
  tabPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[1],
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  tabPillActive: {
    backgroundColor: colors.card,
    ...shadows.sm,
  },
  gmailCard: {
    width: '100%',
    backgroundColor: colors.bgSurface,
    borderRadius: radius.lg,
    padding: space[4],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  googleBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  bioCard: {
    width: '100%',
    backgroundColor: colors.bgSurface,
    borderRadius: radius.lg,
    padding: space[4],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bioIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySurface,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eye: { position: 'absolute', right: space[3], top: 38 },
});
