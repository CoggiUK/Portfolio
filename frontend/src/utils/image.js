// Tiện ích xử lý ảnh phía client: đọc file → thu nhỏ → nén về data URL.
// Ảnh được lưu thẳng trong Firestore nên phải giữ dung lượng thật gọn.

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Không đọc được tệp ảnh.'));
    reader.readAsDataURL(file);
  });
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Tệp không phải ảnh hợp lệ.'));
    img.src = src;
  });
}

// Thu nhỏ ảnh sao cho cạnh dài nhất không vượt maxSize rồi nén JPEG.
export async function compressImage(source, { maxSize = 1600, quality = 0.78 } = {}) {
  const src = typeof source === 'string' ? source : await readFileAsDataUrl(source);
  const img = await loadImage(src);
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0c0c16';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', quality);
}

// Kích thước xấp xỉ (byte) của một chuỗi data URL base64.
export const dataUrlBytes = (dataUrl) => Math.ceil(((dataUrl || '').length * 3) / 4);

export const formatBytes = (bytes) => {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};
