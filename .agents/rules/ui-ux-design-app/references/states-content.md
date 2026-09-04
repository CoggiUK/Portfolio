# Trạng thái màn, Data Visualization & Microcopy

## 1. Sáu trạng thái bắt buộc của mọi màn

Thiếu bất kỳ trạng thái nào = màn chưa hoàn thành.

### 1.1 Loading

- **Skeleton mô phỏng đúng layout thật** — cùng số cột, cùng chiều cao row, cùng vị trí
- Không dùng spinner toàn màn cho danh sách/bảng
- Xuất hiện **sau 200ms** để tránh nháy khi API trả nhanh
- Tác vụ > 3s: progress bar + text mô tả bước đang chạy ("Đang xử lý 240/1000 dòng…")
- Skeleton dùng `bg-muted animate-pulse rounded-md`, không dùng shimmer gradient loè loẹt
- Nút đang submit: giữ nguyên kích thước, spinner thay icon, `disabled`

### 1.2 Empty — lần đầu (chưa có dữ liệu)

```
[ Icon/illustration 40–64px, màu muted ]
Tiêu đề         text-base/600  — "Chưa có đơn hàng nào"
Mô tả 1 câu     text-sm muted  — nêu giá trị: "Tạo đơn hàng đầu tiên để theo dõi doanh thu."
[ CTA chính ]   1 nút primary  — "+ Tạo đơn hàng"
```

Căn giữa, `py-12`, `max-w-sm mx-auto`. **Không chỉ ghi "Không có dữ liệu".**

### 1.3 Empty — do bộ lọc

- Nêu rõ điều kiện hiện tại: "Không có đơn hàng nào khớp *Trạng thái: Chờ duyệt* trong 30 ngày qua"
- Nút **"Xoá bộ lọc"** — bắt buộc
- Không hiện CTA "Tạo mới" ở đây (gây nhầm là chưa có dữ liệu)

### 1.4 Partial (dữ liệu thiếu field)

- Field trống hiện `—` màu `muted-foreground`
- **Không bao giờ** hiện `null`, `undefined`, `NaN`, `Invalid Date`, `[object Object]`
- Ảnh thiếu → placeholder có initials hoặc icon, không phải ô vỡ

### 1.5 Error

Ba loại lỗi khác nhau, xử lý khác nhau:

| Loại | Thông điệp | Hành động |
|------|-----------|-----------|
| Lỗi mạng | "Không kết nối được máy chủ." | Nút "Thử lại" + tự retry |
| Lỗi quyền (403) | "Bạn không có quyền xem mục này." | Nêu cần quyền gì, liên hệ ai |
| Lỗi server (5xx) | "Máy chủ gặp sự cố khi tải đơn hàng." | Nút "Thử lại" + mã lỗi để báo support |
| Không tìm thấy (404) | "Đơn hàng không tồn tại hoặc đã bị xoá." | Link quay lại danh sách |

Lỗi cục bộ (1 widget) → hiện trong widget đó, **không** làm sập cả trang.
Bọc `ErrorBoundary` ở cấp route và cấp widget lớn.

### 1.6 No permission

- Nói rõ **cần quyền gì** và **liên hệ ai**: "Cần quyền *Xem báo cáo tài chính*. Liên hệ quản trị viên phòng ban."
- Không hiện màn trắng, không redirect im lặng
- Nếu chỉ một phần bị chặn: ẩn nút thay vì disable, hoặc disable + tooltip giải thích

---

## 2. Bảy trạng thái của phần tử tương tác

Mọi thứ click/focus được phải có đủ:

`default` · `hover` · `active/pressed` · `focus-visible` · `disabled` · `loading` · `selected`

- `hover` chỉ thay đổi nền/màu chữ, **không** thay đổi kích thước gây layout shift
- `active` giảm nhẹ độ sáng hoặc `scale-[0.98]`, duration 100ms
- `disabled`: `opacity-50 pointer-events-none`, **và** giải thích tại sao (tooltip) nếu không hiển nhiên

---

## 3. Data Visualization

### Palette

Dùng **categorical palette riêng**, không tái dùng màu semantic. Tối đa 6 series:

```
#2563EB · #14B8A6 · #F59E0B · #A855F7 · #EC4899 · #64748B
```

### Luật biểu đồ

- Trục Y **bắt đầu từ 0** với biểu đồ cột. Line chart được cắt trục nhưng phải ghi rõ
- Pie chart tối đa 5 lát; > 5 → bar chart ngang
- Luôn có: tiêu đề, đơn vị, khoảng thời gian, legend, tooltip khi hover, trạng thái empty
- Không dùng 3D, không dùng hiệu ứng bóng đổ trên chart
- Grid line màu `border`, mảnh, chỉ theo trục giá trị
- Nhãn trục xoay tối đa 45°; nếu vẫn chật → giảm số nhãn, không thu nhỏ font < 11px

### KPI card

```
Label       text-sm muted        — "Doanh thu tháng này"
Giá trị     text-3xl/700 tabular-nums — "1.248.000.000 ₫"
Delta       ↑ 12,4% + màu        — kèm mũi tên cho người mù màu
So sánh     text-xs muted        — "so với tháng trước"
```

Màu tăng/giảm: xanh = tăng, đỏ = giảm — **nhưng kiểm tra ngữ nghĩa** (chi phí tăng không phải tin tốt).
Luôn kèm mũi tên, không chỉ dựa vào màu.

---

## 4. Microcopy

### Giọng văn

- Ngôi thứ 2 ("Bạn"), giọng trực tiếp, thể chủ động
- Không dùng "hệ thống", "vui lòng liên hệ quản trị viên" khi có cách nói cụ thể hơn
- Tiêu đề trang = **danh từ** ("Đơn hàng"). Nút = **động từ** ("Tạo đơn hàng")
- Ngắn gọn: nhãn nút ≤ 3 từ, tiêu đề ≤ 6 từ, mô tả ≤ 1 câu

### Thông báo lỗi — công thức 3 phần

**Chuyện gì xảy ra** + **vì sao** + **làm gì tiếp**

| ❌ | ✅ |
|---|---|
| "Đã xảy ra lỗi." | "Không lưu được đơn hàng vì mã SKU đã tồn tại. Đổi mã hoặc mở đơn hàng hiện có." |
| "Không hợp lệ." | "Số điện thoại cần 10 chữ số, bắt đầu bằng 0." |
| "Thất bại." | "Không tải được danh sách do mất kết nối. Kiểm tra mạng rồi thử lại." |

### Xác nhận hành động phá huỷ

- Tiêu đề nêu đối tượng: "Xoá 3 đơn hàng?"
- Mô tả nêu **hậu quả không hồi phục**: "Hành động này không thể hoàn tác."
- Nút xác nhận nhắc lại hành động: "Xoá 3 đơn hàng" — không phải "OK"
- Với hành động **có thể phục hồi** → bỏ dialog, dùng toast + "Hoàn tác" (nhanh hơn, ít ma sát hơn)
- Chỉ yêu cầu gõ tên để xác nhận với hành động cực nghiêm trọng (xoá workspace, xoá vĩnh viễn)

### Định dạng dữ liệu

| Loại | Chuẩn |
|------|-------|
| Số | `Intl.NumberFormat` theo locale — `1.248.000` |
| Tiền | Có ký hiệu, `tabular-nums`, căn phải — `1.248.000 ₫` |
| Ngày | `dd/MM/yyyy` cho VN |
| Ngày giờ | `dd/MM/yyyy HH:mm` |
| Thời gian tương đối | "2 giờ trước" + `title` là timestamp đầy đủ |
| Phần trăm | 1 chữ số thập phân — `12,4%` |
| Tên file/mã dài | Truncate **ở giữa** để giữ đuôi: `bao-cao-quy…-final.xlsx` |
| Danh sách | "Nguyễn A, Trần B và 3 người khác" |

### Nhãn thường dùng

| Ngữ cảnh | Nhãn chuẩn |
|----------|-----------|
| Tạo mới | "+ Tạo <đối tượng>" |
| Lưu | "Lưu thay đổi" |
| Huỷ | "Huỷ" |
| Xoá | "Xoá <đối tượng>" |
| Đóng | "Đóng" |
| Tải lại | "Thử lại" |
| Không có dữ liệu | "Chưa có <đối tượng> nào" |
| Đang tải | "Đang tải…" |
| Đang lưu | "Đang lưu…" |
