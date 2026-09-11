import * as SecureStore from 'expo-secure-store';

const EMAIL_KEY = 'saved_login_email';
const PASSWORD_KEY = 'saved_login_password';

export async function getSavedCredentials() {
  try {
    const [email, password] = await Promise.all([
      SecureStore.getItemAsync(EMAIL_KEY),
      SecureStore.getItemAsync(PASSWORD_KEY),
    ]);
    if (!email || !password) return null;
    return { email, password };
  } catch (err) {
    console.warn('[savedCredentials] getSavedCredentials error:', err);
    return null;
  }
}

export async function saveCredentials(email, password) {
  try {
    await SecureStore.setItemAsync(EMAIL_KEY, email);
    await SecureStore.setItemAsync(PASSWORD_KEY, password);
  } catch (err) {
    console.warn('[savedCredentials] saveCredentials error:', err);
  }
}

export async function clearSavedCredentials() {
  try {
    await SecureStore.deleteItemAsync(EMAIL_KEY);
    await SecureStore.deleteItemAsync(PASSWORD_KEY);
  } catch (err) {
    console.warn('[savedCredentials] clearSavedCredentials error:', err);
  }
}
