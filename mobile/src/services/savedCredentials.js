import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EMAIL_KEY = 'saved_login_email';
const PASSWORD_KEY = 'saved_login_password';

export async function getSavedCredentials() {
  try {
    // 1. Thử đọc từ SecureStore trước
    let email = null;
    let password = null;
    try {
      [email, password] = await Promise.all([
        SecureStore.getItemAsync(EMAIL_KEY),
        SecureStore.getItemAsync(PASSWORD_KEY),
      ]);
    } catch {
      // SecureStore có thể không sẵn sàng trên một số máy ảo
    }

    // 2. Fallback sang AsyncStorage nếu SecureStore không có
    if (!email || !password) {
      const [aEmail, aPassword] = await Promise.all([
        AsyncStorage.getItem(EMAIL_KEY),
        AsyncStorage.getItem(PASSWORD_KEY),
      ]);
      if (aEmail && aPassword) {
        email = aEmail;
        password = aPassword;
      }
    }

    if (!email || !password) return null;
    return { email, password };
  } catch (err) {
    console.warn('[savedCredentials] getSavedCredentials error:', err);
    return null;
  }
}

export async function saveCredentials(email, password) {
  try {
    // Lưu vào cả SecureStore và AsyncStorage để đảm bảo luôn phục hồi được
    try {
      await Promise.all([
        SecureStore.setItemAsync(EMAIL_KEY, email),
        SecureStore.setItemAsync(PASSWORD_KEY, password),
      ]);
    } catch {
      // Bỏ qua lỗi SecureStore
    }
    await Promise.all([
      AsyncStorage.setItem(EMAIL_KEY, email),
      AsyncStorage.setItem(PASSWORD_KEY, password),
    ]);
  } catch (err) {
    console.warn('[savedCredentials] saveCredentials error:', err);
  }
}

export async function clearSavedCredentials() {
  try {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(EMAIL_KEY),
        SecureStore.deleteItemAsync(PASSWORD_KEY),
      ]);
    } catch {
      // Bỏ qua lỗi SecureStore
    }
    await Promise.all([
      AsyncStorage.removeItem(EMAIL_KEY),
      AsyncStorage.removeItem(PASSWORD_KEY),
    ]);
  } catch (err) {
    console.warn('[savedCredentials] clearSavedCredentials error:', err);
  }
}
