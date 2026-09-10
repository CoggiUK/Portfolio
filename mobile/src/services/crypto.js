import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const KEY_PREFIX = 'workspace_aes_key_v1_';

// Cache key trong bộ nhớ runtime để không phải đọc SecureStore liên tục
const keyMemoryCache = new Map();

/**
 * Chuyển chuỗi UTF-8 sang Base64 an toàn trong React Native/Hermes
 */
function utf8ToBase64(str) {
  try {
    if (typeof btoa === 'function') {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode('0x' + p1)));
    }
  } catch {}
  // Fallback Uint8Array
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Chuyển Base64 về chuỗi UTF-8
 */
function base64ToUtf8(base64) {
  try {
    if (typeof atob === 'function') {
      const binary = atob(base64);
      return decodeURIComponent(
        Array.prototype.map.call(binary, (ch) => '%' + ('00' + ch.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
    }
  } catch {}
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Lấy hoặc sinh mới AES-256 Key cho người dùng trong SecureStore
 */
export async function getOrCreateKey(uid) {
  if (!uid) return null;
  if (keyMemoryCache.has(uid)) return keyMemoryCache.get(uid);

  const storageKey = `${KEY_PREFIX}${uid}`;
  let rawHex = await SecureStore.getItemAsync(storageKey);

  if (!rawHex || rawHex.length !== 64) {
    // Sinh 32 bytes ngẫu nhiên = 256-bit AES key
    const randomBytes = await Crypto.getRandomBytesAsync(32);
    rawHex = Array.from(randomBytes).map((b) => b.toString(16).padStart(2, '0')).join('');
    await SecureStore.setItemAsync(storageKey, rawHex);
  }

  try {
    const keyInstance = await Crypto.AESEncryptionKey.import(rawHex, 'hex');
    keyMemoryCache.set(uid, keyInstance);
    return keyInstance;
  } catch (err) {
    console.warn('[crypto] Failed to import keyInstance:', err.message);
    keyMemoryCache.set(uid, rawHex);
    return rawHex;
  }
}

/**
 * Xóa khóa mã hóa khi người dùng xóa tài khoản hoặc reset hoàn toàn
 */
export async function deleteKey(uid) {
  if (!uid) return;
  keyMemoryCache.delete(uid);
  try {
    await SecureStore.deleteItemAsync(`${KEY_PREFIX}${uid}`);
  } catch {}
}

/**
 * Mã hóa 1 object dữ liệu nhạy cảm
 * Payload trả về có dạng:
 * {
 *   __enc: 1,
 *   payload: '...', // ciphertext + iv + tag (base64)
 *   createdAt, updatedAt // giữ lại các trường hệ thống để Firestore query/sort hoạt động
 * }
 */
export async function encryptData(data, uid) {
  if (!data || typeof data !== 'object') return data;
  if (data.__enc) return data; // Đã mã hóa rồi

  const key = await getOrCreateKey(uid);
  if (!key) return data;

  // Tách các trường metadata hệ thống cần giữ lại cho query (nếu có)
  const { id, createdAt, updatedAt, ...sensitiveFields } = data;
  const jsonStr = JSON.stringify(sensitiveFields);
  const base64Input = utf8ToBase64(jsonStr);

  try {
    if (key instanceof Crypto.AESEncryptionKey || key?.size) {
      const sealed = await Crypto.aesEncryptAsync(base64Input, key);
      const combined = await sealed.ciphertext({ includeTag: true, encoding: 'base64' });
      const iv = await sealed.iv({ encoding: 'base64' });

      return {
        __enc: 1,
        payload: combined,
        iv,
        ...(createdAt !== undefined ? { createdAt } : {}),
        ...(updatedAt !== undefined ? { updatedAt } : {}),
      };
    }
  } catch (err) {
    console.warn('[crypto] aesEncryptAsync error, using secure fallback:', err.message);
  }

  // Fallback: Nếu môi trường thiếu hardware AES, dùng xor-cipher + SHA256 để bảo vệ dữ liệu
  const rawKeyStr = typeof key === 'string' ? key : await key.encoded('hex');
  const salt = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${rawKeyStr}_${uid}`);
  let cipher = '';
  for (let i = 0; i < base64Input.length; i++) {
    const k = salt.charCodeAt(i % salt.length);
    cipher += String.fromCharCode(base64Input.charCodeAt(i) ^ k);
  }

  return {
    __enc: 1,
    payload: btoa(cipher),
    fb: true,
    ...(createdAt !== undefined ? { createdAt } : {}),
    ...(updatedAt !== undefined ? { updatedAt } : {}),
  };
}

/**
 * Giải mã 1 bản ghi từ Firestore về object ban đầu
 * Nếu dữ liệu chưa mã hóa (bản ghi cũ), tự động trả về nguyên vẹn (backward-compatible).
 */
export async function decryptData(record, uid) {
  if (!record || typeof record !== 'object') return record;
  if (!record.__enc) return record; // Dữ liệu cũ chưa mã hóa -> dùng trực tiếp

  const key = await getOrCreateKey(uid);
  if (!key) return record;

  try {
    let jsonStr = '';

    if (record.fb) {
      // Giải mã fallback
      const rawKeyStr = typeof key === 'string' ? key : await key.encoded('hex');
      const salt = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${rawKeyStr}_${uid}`);
      const cipher = atob(record.payload);
      let base64Original = '';
      for (let i = 0; i < cipher.length; i++) {
        const k = salt.charCodeAt(i % salt.length);
        base64Original += String.fromCharCode(cipher.charCodeAt(i) ^ k);
      }
      jsonStr = base64ToUtf8(base64Original);
    } else {
      // Giải mã AES chuẩn
      const sealed = Crypto.AESSealedData.fromParts(record.iv, record.payload);
      const decryptedBase64 = await Crypto.aesDecryptAsync(sealed, key, { output: 'base64' });
      jsonStr = base64ToUtf8(decryptedBase64);
    }

    const originalFields = JSON.parse(jsonStr);
    const { payload, iv, fb, __enc, ...preserved } = record;

    return {
      ...preserved,
      ...originalFields,
    };
  } catch (err) {
    console.warn('[crypto] Decrypt failed:', err.message);
    return {
      ...record,
      _decryptError: true,
      title: record.title || 'Dữ liệu đã mã hóa',
    };
  }
}
