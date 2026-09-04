# Chuẩn Component

## 1. Button

| Variant | Dùng khi | Style |
|---------|----------|-------|
| `primary` | Hành động chính — **1 cái/vùng** | nền `primary`, chữ trắng |
| `secondary` | Hành động phụ song song | nền `secondary`, viền `border` |
| `outline` | Trung tính, hay dùng trong toolbar | trong suốt, viền `border` |
| `ghost` | Icon button, hành động trong bảng | không nền, hover `accent` |
| `link` | Điều hướng dạng chữ | màu `primary`, underline khi hover |
| `destructive` | Xoá / huỷ không hoàn tác | nền `destructive` |

### Kích thước

| Size | Height | Padding-x | Font | Icon |
|------|--------|-----------|------|------|
| `sm` | 32px | 12px | 13–14px / 500 | 14px |
| `md` (mặc định) | 36px (app) / 40px (web) | 16px | 14px / 500 | 16px |
| `lg` | 44px | 24px | 16px / 600 | 20px |
| `icon` | vuông theo height | – | – | 16–20px |

### Bắt buộc

- Gap icon–text: **8px**. Icon **trái** cho hành động, **phải** cho điều hướng (`→`) và dropdown (`⌄`)
- Loading: spinner thay icon trái, **giữ nguyên chiều rộng**, `disabled`, text đổi sang thể tiếp diễn ("Đang lưu…")
- Focus: `outline-none ring-2 ring-ring ring-offset-2` — không bao giờ xoá mà không thay thế
- Nhãn = **động từ + danh từ**: "Lưu thay đổi", "Tạo đơn hàng". Cấm "OK", "Submit", "Yes"
- Thứ tự trong footer: `[Huỷ] [Hành động chính]` — chính **bên phải** (chuẩn web/Windows)
- Nút destructive nêu rõ đối tượng: "Xoá 3 đơn hàng", không phải "Xoá"

```tsx
<Button disabled={isPending} className="min-w-[120px]">
  {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
  {isPending ? "Đang lưu…" : "Lưu thay đổi"}
</Button>
```

---

## 2. Input & Form

### Cấu trúc bắt buộc của một field

```
Label            14px/500, mb-1.5, dấu * đỏ nếu bắt buộc
[ Input ]        h 36/40px · px-12 · border · radius-md · text-sm
Helper text      12px muted — LUÔN hiện, không dùng placeholder thay label
Error text       12px destructive + icon AlertCircle — thay chỗ helper khi lỗi
```

### Luật form

- **Label luôn ở trên input**, căn trái. Không floating label cho form nhiều field. Không label bên trái
- **Placeholder không phải label** — chỉ gợi ý định dạng (`VD: 0901234567`)
- Đánh dấu trường bắt buộc bằng `*`. Nếu đa số bắt buộc → đánh dấu ngược "(không bắt buộc)"
- Validate khi **blur**, không validate khi đang gõ lần đầu. Sau khi đã lỗi thì re-validate on-change
- Lỗi phải **nói cách sửa**:
  ✅ "Mật khẩu cần ≥ 8 ký tự và có 1 chữ số" — ❌ "Không hợp lệ"
- Submit lỗi: cuộn tới field lỗi đầu tiên + `focus()` + tóm tắt lỗi đầu form (`role="alert"`)
- **Chiều rộng input phản ánh độ dài dữ liệu** — mã bưu điện ngắn, email dài. Không full-width tất cả
- Nhóm field bằng `<fieldset>` + section title, cách nhau 32px
- `disabled` = không liên quan. `readonly` = có giá trị nhưng không sửa (vẫn copy được)
- Không auto-submit khi Enter trong form nhiều bước
- Luôn set đúng `type`, `inputMode`, `autoComplete`

### Chọn control theo số lựa chọn

| Số option | Control |
|-----------|---------|
| 2 (bật/tắt tức thì) | Switch — áp dụng ngay, không cần Save |
| 2–3 loại trừ | Radio group |
| 2–5 nhiều lựa chọn | Checkbox group |
| 5–15 | Select |
| > 15 | Combobox có search |
| > 50 / dữ liệu server | Async combobox, phân trang |

---

## 3. Table (trọng tâm ERP)

| Thuộc tính | Chuẩn |
|-----------|-------|
| Row height | compact 36px · **default 44px** · comfortable 56px |
| Header | `text-xs/600 uppercase tracking-wide text-muted`, nền `muted/50`, **sticky top-0 z-10** |
| Cell padding | 12px ngang, `text-sm` |
| Border | chỉ đường ngang giữa row (`border-b`), **không kẻ dọc** |
| Zebra | mặc định **tắt**; bật khi > 8 cột |
| Hover row | nền `muted/60`, `cursor-pointer` nếu row click được |
| Selected row | nền `primary/5` + border trái 2px `primary` |

### Thứ tự cột (chuẩn Shopify / Salesforce / Airtable)

1. Checkbox (40px, **sticky trái**)
2. Cột định danh chính (link, `font-medium`, **sticky trái**)
3. Cột thuộc tính
4. Cột trạng thái (badge)
5. Số liệu
6. Ngày
7. **Actions (sticky phải, 64–96px)**

### Căn lề

- Text → **trái**
- Số + tiền → **phải**, `tabular-nums`
- Badge trạng thái → trái hoặc giữa (nhất quán toàn app)
- Ngày → trái
- Header căn **cùng phía** với nội dung cột

### Bắt buộc có

- Loading: **skeleton rows** đúng số cột — không phải spinner giữa màn
- Empty: phân biệt "chưa có dữ liệu" (kèm CTA tạo mới) vs "không khớp bộ lọc" (kèm nút Xoá bộ lọc)
- Số cột mặc định **≤ 7**; còn lại đưa vào column picker hoặc drawer chi tiết
- Truncate bằng `truncate` + `title`/tooltip — **không** wrap 3 dòng làm vỡ nhịp row
- Sort: click header, hiện mũi tên; chỉ 1 cột sort mặc định
- Phân trang 20/50/100 dòng. > 10k dòng → virtualization (`@tanstack/react-virtual`)
- Sticky header khi cuộn dọc; sticky cột định danh khi cuộn ngang
- Nút hành động trong row **luôn hiện** hoặc gom vào menu `⋯` — không chỉ hiện khi hover

---

## 4. Badge / Status

Luôn là **chấm màu hoặc icon + chữ**, không phải chỉ khối màu.

| Trạng thái | Style |
|-----------|-------|
| Nháp / Mới | `bg-muted text-muted-foreground` |
| Đang xử lý | `bg-info/10 text-info border-info/20` |
| Chờ duyệt | `bg-warning/10 text-warning border-warning/20` |
| Hoàn tất / Đã duyệt | `bg-success/10 text-success border-success/20` |
| Từ chối / Lỗi | `bg-destructive/10 text-destructive border-destructive/20` |

Size: height 20–24px, `text-xs/500`, padding-x 8px, radius `full` hoặc `sm` — chọn 1 kiểu và nhất quán toàn app.

---

## 5. Modal / Dialog / Drawer

| Loại | Khi nào | Max-width |
|------|---------|-----------|
| Alert dialog | Xác nhận hành động phá huỷ | 400–440px |
| Dialog | Form ngắn ≤ 6 field | 520–640px |
| Drawer (phải) | Xem/sửa chi tiết, giữ ngữ cảnh danh sách | 480–640px |
| Full page | Quy trình nhiều bước, form dài | – |

### Luật

- Backdrop `bg-black/50 backdrop-blur-sm` z-40; dialog z-50
- Padding 24px; header `text-lg/600`; mô tả `text-sm text-muted`
- Footer căn **phải**: `[Huỷ] [Xác nhận]`. Alert phá huỷ dùng nút `destructive`, nhãn nêu rõ hành động
- Bắt buộc: **focus trap**, `Esc` đóng, click backdrop đóng (*trừ* khi form có dữ liệu chưa lưu → hỏi xác nhận),
  **trả focus về trigger** khi đóng, khoá scroll nền
- **Không lồng modal trong modal**. Không dùng modal cho nội dung phải cuộn > 60vh
- Animation: `opacity 0→1` + `scale 0.96→1` + `translateY 8px→0`, 200ms ease-out

---

## 6. Toast / Notification

- Vị trí: **top-right** (desktop) · **top-center hoặc bottom** (mobile, tránh vùng ngón cái)
- Thời lượng: success 4s · info 5s · **error không tự tắt** (phải bấm đóng)
- Tối đa **3 toast** xếp chồng, cái mới ở trên
- Có action inline khi hợp lý: "Đã xoá đơn hàng — **Hoàn tác**"
  (undo tốt hơn confirm dialog cho hành động có thể phục hồi)
- `role="status"` cho info/success, `role="alert"` cho error
- **Không dùng toast cho lỗi validate form** → hiển thị tại field

---

## 7. Navigation

- Menu cấp 1 tối đa **7 ± 2** mục. Nhiều hơn → nhóm theo section có label
- Item active: nền `accent` + chữ `foreground` + **thanh 2px màu primary bên trái**
  (hoặc dưới, với tab ngang)
- Menu con: indent 12px, **chỉ 1 cấp lồng**. Cấp 3 trở đi → chuyển thành tab trong trang
- Breadcrumb: `Trang chủ / Danh mục / Chi tiết`, cấp cuối không phải link, phân cách `/` hoặc `›`
- Tab: dùng khi đổi view **cùng một đối tượng**; không dùng tab thay điều hướng trang
- Icon-only trong nav thu gọn phải có tooltip
- Luôn cho biết **người dùng đang ở đâu**: active nav + breadcrumb + page title đồng bộ

---

## 8. Card

- Trong app-shell: `border rounded-lg bg-card p-6`, **không shadow**
- Card có thể click: thêm `hover:shadow-xs transition-shadow cursor-pointer`, toàn card là target
- Cấu trúc: header (title `text-base/600` + action phải) → divider tuỳ chọn → body → footer
- Không center text trong card (trừ empty state)
- Card trong grid phải **cùng chiều cao** (`items-stretch`), nội dung ngắn thì đẩy footer xuống bằng `mt-auto`

---

## 9. Tooltip & Popover

- Tooltip: chỉ text ngắn ≤ 60 ký tự, delay 300ms, `text-xs`, nền `foreground` chữ `background`
- Tooltip **không được chứa** nội dung quan trọng hoặc phần tử tương tác → dùng popover
- Popover: có thể chứa form/nút, đóng khi click ngoài + `Esc`, `shadow-md rounded-lg`
- Cả hai phải tự lật hướng khi gần mép màn hình (Radix `collisionPadding`)
