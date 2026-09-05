// Tiện ích ngày giờ thuần JS (không thêm thư viện) — toàn bộ dùng giờ máy.

export const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
export const MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

const p2 = (n) => String(n).padStart(2, '0');

/** Khoá ngày `YYYY-MM-DD` theo giờ địa phương (không dùng toISOString vì lệch UTC). */
export const dayKey = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;

export const parseDayKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
export const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
export const isSameDay = (a, b) => dayKey(a) === dayKey(b);

/** Tuần bắt đầu từ Thứ 2 (chuẩn VN). */
export const startOfWeek = (d) => {
  const s = startOfDay(d);
  const shift = (s.getDay() + 6) % 7;
  return addDays(s, -shift);
};

/** Lưới 6x7 ô cho khung tháng, bù ngày của tháng trước/sau. */
export const monthGrid = (anchor) => {
  const first = startOfMonth(anchor);
  const start = startOfWeek(first);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
};

export const fmtTime = (d) => `${p2(d.getHours())}:${p2(d.getMinutes())}`;
export const fmtDate = (d) => `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()}`;
export const fmtDateTime = (d) => `${fmtDate(d)} · ${fmtTime(d)}`;
export const WEEKDAYS_FULL = [
  'Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy',
];

/** "Thứ Sáu, 22/08/2026" — dùng cho dòng ngày trên brand header. */
export const fmtDayFull = (d) => `${WEEKDAYS_FULL[d.getDay()]}, ${fmtDate(d)}`;

export const fmtDayLabel = (d) => `${WEEKDAYS[d.getDay()]}, ${p2(d.getDate())}/${p2(d.getMonth() + 1)}`;

/** Nhãn tương đối kiểu "3 phút trước" / "Hôm qua". */
export const fmtRelative = (d) => {
  const diff = Date.now() - d.getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'Vừa xong';
  if (min < 60) return `${min} phút trước`;
  const hr = Math.round(min / 60);
  if (hr < 24 && isSameDay(d, new Date())) return `${hr} giờ trước`;
  if (isSameDay(d, addDays(new Date(), -1))) return `Hôm qua · ${fmtTime(d)}`;
  return fmtDateTime(d);
};

/** Đếm ngược tới thời điểm bắt đầu, dùng cho thẻ "Sắp diễn ra". */
export const fmtCountdown = (d) => {
  const ms = d.getTime() - Date.now();
  if (ms <= 0) return 'Đang diễn ra';
  const min = Math.floor(ms / 60000);
  if (min < 60) return `còn ${min} phút`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `còn ${hr}h${min % 60 ? ` ${min % 60}p` : ''}`;
  return `còn ${Math.floor(hr / 24)} ngày`;
};

/** RFC3339 kèm offset địa phương — định dạng Google Calendar yêu cầu. */
export const toRFC3339 = (d) => {
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? '+' : '-';
  const a = Math.abs(off);
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:${p2(
    d.getMinutes()
  )}:${p2(d.getSeconds())}${sign}${p2(Math.floor(a / 60))}:${p2(a % 60)}`;
};

export const timeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ho_Chi_Minh';
  } catch {
    return 'Asia/Ho_Chi_Minh';
  }
};

/** Firestore Timestamp | Date | number | string → Date (an toàn với dữ liệu cũ). */
export const toDate = (v) => {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof v?.toDate === 'function') return v.toDate();
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const money = (n) =>
  `${Number(n || 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} ₫`;

/** Số tiền rút gọn cho thẻ chỉ số: 1.250.000 → "1,3tr". Tránh cắt chữ trong ô hẹp. */
export const moneyShort = (n) => {
  const v = Number(n || 0);
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  const fmt = (x) => String(Number(x.toFixed(1))).replace('.', ',');
  if (abs >= 1e9) return `${sign}${fmt(abs / 1e9)} tỷ`;
  if (abs >= 1e6) return `${sign}${fmt(abs / 1e6)} tr`;
  if (abs >= 1e3) return `${sign}${Math.round(abs / 1e3)}K`;
  return `${sign}${abs}`;
};
