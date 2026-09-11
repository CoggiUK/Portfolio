import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';

const LOCK_ENABLED_KEY = 'app_lock_enabled';
const PIN_HASH_KEY = 'app_pin_hash';
const PIN_SALT = 'tunglam_ws_salt_2026';

/**
 * Kiểm tra xem người dùng có bật tính năng khóa ứng dụng không.
 */
export async function isLockEnabled() {
  try {
    const val = await SecureStore.getItemAsync(LOCK_ENABLED_KEY);
    return val === 'true';
  } catch (err) {
    console.warn('[appLock] isLockEnabled error:', err);
    return false;
  }
}

/**
 * Bật hoặc tắt tính năng khóa ứng dụng.
 */
export async function setLockEnabled(enabled) {
  try {
    if (enabled) {
      await SecureStore.setItemAsync(LOCK_ENABLED_KEY, 'true');
    } else {
      await SecureStore.deleteItemAsync(LOCK_ENABLED_KEY);
    }
  } catch (err) {
    console.warn('[appLock] setLockEnabled error:', err);
  }
}

/**
 * Kiểm tra xem đã thiết lập mã PIN chưa.
 */
export async function hasPin() {
  try {
    const val = await SecureStore.getItemAsync(PIN_HASH_KEY);
    return !!val;
  } catch (err) {
    console.warn('[appLock] hasPin error:', err);
    return false;
  }
}

/**
 * Băm mã PIN với SHA-256 + salt và lưu vào SecureStore.
 */
export async function setPin(pin) {
  try {
    if (!pin || pin.length < 4) {
      throw new Error('Mã PIN phải có ít nhất 4 chữ số.');
    }
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      pin + PIN_SALT
    );
    await SecureStore.setItemAsync(PIN_HASH_KEY, hash);
    return true;
  } catch (err) {
    console.warn('[appLock] setPin error:', err);
    throw err;
  }
}

/**
 * Kiểm tra mã PIN người dùng nhập vào.
 */
export async function verifyPin(pin) {
  try {
    const storedHash = await SecureStore.getItemAsync(PIN_HASH_KEY);
    if (!storedHash) return false;
    const inputHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      pin + PIN_SALT
    );
    return storedHash === inputHash;
  } catch (err) {
    console.warn('[appLock] verifyPin error:', err);
    return false;
  }
}

/**
 * Xoá mã PIN đã lưu.
 */
export async function removePin() {
  try {
    await SecureStore.deleteItemAsync(PIN_HASH_KEY);
    await setLockEnabled(false);
  } catch (err) {
    console.warn('[appLock] removePin error:', err);
  }
}

/**
 * Kiểm tra thiết bị có phần cứng sinh trắc học và người dùng đã đăng ký vân tay/khuôn mặt chưa.
 */
export async function hasBiometricHardware() {
  try {
    const hasHw = await LocalAuthentication.hasHardwareAsync();
    if (!hasHw) return false;
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return isEnrolled;
  } catch (err) {
    console.warn('[appLock] hasBiometricHardware error:', err);
    return false;
  }
}

/**
 * Lấy loại sinh trắc học được hỗ trợ (Face ID, Touch ID, Vân tay).
 */
export async function getBiometricTypeLabel() {
  try {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Vân tay / Touch ID';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Mống mắt';
    }
    return 'Sinh trắc học';
  } catch {
    return 'Sinh trắc học';
  }
}

/**
 * Gọi xác thực sinh trắc học của hệ điều hành.
 */
export async function authenticateBiometric() {
  try {
    const enrolled = await hasBiometricHardware();
    if (!enrolled) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Xác thực để mở khóa Tùng Lâm Workspace',
      cancelLabel: 'Hủy',
      fallbackLabel: 'Nhập mã PIN',
      disableDeviceFallback: true,
    });
    return !!result.success;
  } catch (err) {
    console.warn('[appLock] authenticateBiometric error:', err);
    return false;
  }
}
