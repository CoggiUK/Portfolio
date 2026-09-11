import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import {
  isLockEnabled, setLockEnabled, hasPin, setPin, verifyPin,
  hasBiometricHardware, authenticateBiometric, getBiometricTypeLabel,
} from '../services/appLock';

const LockCtx = createContext(null);

export function LockProvider({ children }) {
  const [locked, setLocked] = useState(false);
  const [lockEnabled, setLockEnabledState] = useState(false);
  const [hasPinSet, setHasPinSet] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState('Sinh trắc học');
  const [ready, setReady] = useState(false);

  const lockEnabledRef = useRef(false);
  const lockedRef = useRef(false);
  lockEnabledRef.current = lockEnabled;
  lockedRef.current = locked;

  const refreshLockStatus = useCallback(async () => {
    try {
      const [enabled, pinExists, bioAvailable, bioLabel] = await Promise.all([
        isLockEnabled(),
        hasPin(),
        hasBiometricHardware(),
        getBiometricTypeLabel(),
      ]);
      setLockEnabledState(enabled);
      setHasPinSet(pinExists);
      setBiometricAvailable(bioAvailable);
      setBiometricLabel(bioLabel);

      // Nếu đang bật khóa thì khi mở app khởi động sẽ ở trạng thái locked
      if (enabled && pinExists) {
        setLocked(true);
      }
    } catch (err) {
      console.warn('[LockContext] refreshLockStatus error:', err);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refreshLockStatus();
  }, [refreshLockStatus]);

  // Lắng nghe AppState chuyển sang background để khóa ứng dụng
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        if (lockEnabledRef.current) {
          setLocked(true);
        }
      }
    });
    return () => sub.remove();
  }, []);

  const unlock = useCallback(() => {
    setLocked(false);
  }, []);

  const lock = useCallback(() => {
    if (lockEnabledRef.current) {
      setLocked(true);
    }
  }, []);

  const enableLock = useCallback(async (pin) => {
    await setPin(pin);
    await setLockEnabled(true);
    setLockEnabledState(true);
    setHasPinSet(true);
  }, []);

  const setLock = useCallback(async (enabled) => {
    await setLockEnabled(enabled);
    setLockEnabledState(enabled);
    if (!enabled) setLocked(false);
  }, []);

  const changePin = useCallback(async (newPin) => {
    await setPin(newPin);
    setHasPinSet(true);
  }, []);

  const value = {
    locked,
    lockEnabled,
    hasPinSet,
    biometricAvailable,
    biometricLabel,
    ready,
    unlock,
    lock,
    enableLock,
    setLock,
    changePin,
    verifyPin,
    authenticateBiometric,
    refreshLockStatus,
  };

  return <LockCtx.Provider value={value}>{children}</LockCtx.Provider>;
}

export function useLock() {
  const ctx = useContext(LockCtx);
  if (!ctx) {
    throw new Error('useLock phải được sử dụng bên trong <LockProvider>');
  }
  return ctx;
}
