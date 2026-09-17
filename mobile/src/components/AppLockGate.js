import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, Image, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLock } from '../contexts/LockContext';
import { useAuth } from '../contexts/AuthContext';
import { colors, space, radius, font, shadows, tint } from '../theme';

const KEYPAD_NUMS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['bio', '0', 'del'],
];

export default function AppLockGate({ children }) {
  const {
    locked, ready, biometricAvailable, biometricLabel,
    unlock, verifyPin, authenticateBiometric,
  } = useLock();

  const authCtx = useAuth();
  const signOut = authCtx?.signOut;

  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Tự động kích hoạt sinh trắc học khi màn hình khóa xuất hiện
  useEffect(() => {
    if (locked && biometricAvailable) {
      const timer = setTimeout(() => {
        handleBiometric();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [locked, biometricAvailable]);

  // Xóa PIN và lỗi khi mở khóa xong hoặc khi bị khóa lại
  useEffect(() => {
    setEnteredPin('');
    setErrorMsg('');
  }, [locked]);

  const handleBiometric = async () => {
    try {
      const ok = await authenticateBiometric();
      if (ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        unlock();
      }
    } catch {
      // Bỏ qua nếu người dùng bấm Hủy để nhập PIN
    }
  };

  const checkPin = useCallback(async (pinToCheck) => {
    const valid = await verifyPin(pinToCheck);
    if (valid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      unlock();
    } else {
      if (pinToCheck.length >= 6) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        setErrorMsg('Mã PIN không chính xác');
        setEnteredPin('');
      } else {
        setTimeout(async () => {
          const recheck = await verifyPin(pinToCheck);
          if (recheck) {
            unlock();
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
            setErrorMsg('Mã PIN không chính xác');
            setEnteredPin('');
          }
        }, 500);
      }
    }
  }, [verifyPin, unlock]);

  const handleKeyPress = useCallback(async (key) => {
    Haptics.selectionAsync().catch(() => {});
    setErrorMsg('');

    if (key === 'del') {
      setEnteredPin((prev) => prev.slice(0, -1));
      return;
    }

    if (key === 'bio') {
      handleBiometric();
      return;
    }

    setEnteredPin((prev) => {
      const next = prev + key;
      if (next.length >= 4) {
        checkPin(next);
      }
      return next;
    });
  }, [handleBiometric, checkPin]);

  if (!ready || !locked) {
    return children;
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <View style={s.logoContainer}>
          <Image
            source={require('../../assets/logo-mark.png')}
            style={s.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={[font.h2, { color: colors.text, marginTop: space[3] }]}>
          Tùng Lâm Workspace
        </Text>
        <Text style={[font.small, { color: colors.textMuted, marginTop: space[1] }]}>
          Ứng dụng được bảo vệ · Mở bằng PIN, Sinh trắc học hoặc Tài khoản
        </Text>
      </View>

      {/* Dấu chấm hiển thị số lượng ký tự PIN đã nhập */}
      <View style={s.pinDotsRow}>
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const filled = idx < enteredPin.length;
          return (
            <View
              key={idx}
              style={[
                s.pinDot,
                filled && s.pinDotFilled,
                errorMsg && s.pinDotError,
              ]}
            />
          );
        })}
      </View>

      {errorMsg ? (
        <Text style={[font.small, { color: colors.danger, textAlign: 'center', marginVertical: space[2] }]}>
          {errorMsg}
        </Text>
      ) : (
        <View style={{ height: 20, marginVertical: space[2] }} />
      )}

      {/* Bàn phím số */}
      <View style={s.keypad}>
        {KEYPAD_NUMS.map((row, rIdx) => (
          <View key={rIdx} style={s.keypadRow}>
            {row.map((item, cIdx) => {
              if (item === 'bio') {
                if (!biometricAvailable) {
                  return <View key={cIdx} style={s.keyEmpty} />;
                }
                return (
                  <Pressable
                    key={cIdx}
                    onPress={() => handleKeyPress('bio')}
                    style={({ pressed }) => [s.keyBtn, pressed && s.keyPressed]}
                  >
                    <Ionicons
                      name={biometricLabel.includes('Face') ? 'scan-outline' : 'finger-print-outline'}
                      size={26}
                      color={colors.primary}
                    />
                  </Pressable>
                );
              }

              if (item === 'del') {
                return (
                  <Pressable
                    key={cIdx}
                    onPress={() => handleKeyPress('del')}
                    style={({ pressed }) => [s.keyBtn, pressed && s.keyPressed]}
                  >
                    <Ionicons name="backspace-outline" size={24} color={colors.textSub} />
                  </Pressable>
                );
              }

              return (
                <Pressable
                  key={cIdx}
                  onPress={() => handleKeyPress(item)}
                  style={({ pressed }) => [s.keyBtn, pressed && s.keyPressed]}
                >
                  <Text style={[font.h1, { color: colors.text, fontWeight: '500' }]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Nút chuyển đổi phương thức đăng nhập */}
      <View style={s.altLoginContainer}>
        <Pressable
          onPress={() => {
            unlock();
            signOut?.();
          }}
          style={({ pressed }) => [s.altLoginBtn, pressed && { opacity: 0.75 }]}
        >
          <Ionicons name="log-in-outline" size={16} color={colors.primary} />
          <Text style={[font.small, { color: colors.primary, fontWeight: '600' }]}>
            Đăng nhập lại (Tài khoản / Gmail)
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space[6],
    paddingHorizontal: space[4],
  },
  header: {
    alignItems: 'center',
    marginTop: space[4],
  },
  logoContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  logo: {
    width: 44,
    height: 44,
  },
  pinDotsRow: {
    flexDirection: 'row',
    gap: space[3],
    justifyContent: 'center',
    marginVertical: space[3],
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    transform: [{ scale: 1.15 }],
  },
  pinDotError: {
    borderColor: colors.danger,
    backgroundColor: tint(colors.danger, 0.2),
  },
  keypad: {
    width: '100%',
    maxWidth: 320,
    gap: space[3],
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  keyBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  keyPressed: {
    backgroundColor: colors.bgSurface,
    transform: [{ scale: 0.94 }],
  },
  keyEmpty: {
    width: 72,
    height: 72,
  },
  altLoginContainer: {
    marginBottom: Platform.OS === 'ios' ? space[4] : space[2],
    alignItems: 'center',
  },
  altLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingVertical: space[2],
    paddingHorizontal: space[4],
    borderRadius: radius.pill,
    backgroundColor: colors.primarySurface,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
});
