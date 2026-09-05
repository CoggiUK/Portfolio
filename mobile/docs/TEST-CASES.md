# Bộ Test Case — Tùng Lâm Workspace (mobile)

| Thông tin | Giá trị |
|---|---|
| Ứng dụng | Tùng Lâm Workspace · Expo / React Native `0.86` |
| Phiên bản | 1.0.0 · bundle `tunglam.workspace` |
| Phạm vi | Toàn bộ chức năng app + giao diện mới (brand header, thanh tab cong, nút logo trung tâm) |
| Tổng số case | **237** |
| Thiết bị tối thiểu | iPhone SE (375×667) · iPhone 15 Pro (393×852) · Android 6.7" · Android có nút điều hướng cứng |
| Tài khoản test | 1 tài khoản Firebase Auth hợp lệ + 1 tài khoản sai để test lỗi |

## Quy ước

- **Ưu tiên**: `P0` chặn phát hành · `P1` quan trọng · `P2` nên có.
- **Loại**: `F` chức năng · `UI` giao diện · `A11y` tiếp cận · `NEG` ca lỗi · `PERF` hiệu năng · `INT` tích hợp.
- Mọi case bắt đầu ở trạng thái đã đăng nhập, trừ nhóm A.
- "Thanh tab" = thanh điều hướng dưới cùng gồm 4 tab (Lịch · Cá nhân · Liên hệ · Web) và **nút logo tròn ở giữa dẫn về Trang chủ**.

---

## A. Xác thực (AUTH) — 16 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-AUTH-01 | Mở app lần đầu | Chưa đăng nhập | Mở app | Hiện màn Splash có logo + "Đang mở workspace…", sau đó vào màn Đăng nhập | P0 | F |
| TC-AUTH-02 | Đăng nhập đúng | Có tài khoản hợp lệ | Nhập email + mật khẩu → **"Đăng nhập"** | Vào thẳng Trang chủ, tab giữa (logo) đang được chọn | P0 | F |
| TC-AUTH-03 | Bỏ trống trường | Ở màn Đăng nhập | Để trống cả 2 ô → bấm Đăng nhập | Banner đỏ "Vui lòng nhập đầy đủ email và mật khẩu.", không gọi mạng | P0 | NEG |
| TC-AUTH-15 | Màn đăng nhập tối giản | Ở màn Đăng nhập | Quan sát toàn màn | Chỉ còn: logo, tiêu đề, 2 ô nhập, nút "Đăng nhập", link "Quên mật khẩu?". **Không** còn nút đăng nhập nhanh bằng tài khoản admin và **không** còn dòng chữ nhỏ dưới cùng | P0 | UI |
| TC-AUTH-16 | Không lộ thông tin đăng nhập | Đọc mã nguồn màn Đăng nhập | Tìm chuỗi email/mật khẩu | Không còn email và mật khẩu admin nào được ghi cứng trong mã | P0 | NEG |
| TC-AUTH-04 | Email sai định dạng | — | Nhập `abc` + mật khẩu bất kỳ → Đăng nhập | Banner "Email không hợp lệ." | P1 | NEG |
| TC-AUTH-05 | Sai mật khẩu | Email tồn tại | Nhập sai mật khẩu → Đăng nhập | Banner "Email hoặc mật khẩu không đúng." | P0 | NEG |
| TC-AUTH-06 | Tài khoản không tồn tại | — | Nhập email chưa đăng ký | Banner "Không tìm thấy tài khoản này." | P1 | NEG |
| TC-AUTH-07 | Sai quá nhiều lần | — | Nhập sai mật khẩu ≥ 6 lần liên tiếp | Banner "Sai quá nhiều lần. Thử lại sau ít phút." | P2 | NEG |
| TC-AUTH-08 | Mất mạng khi đăng nhập | Tắt Wi-Fi + 4G | Bấm Đăng nhập | Banner "Mất kết nối mạng.", nút thoát trạng thái loading | P0 | NEG |
| TC-AUTH-09 | Hiện/ẩn mật khẩu | Đã gõ mật khẩu | Bấm icon con mắt | Mật khẩu chuyển plain-text và ngược lại, icon đổi `eye`/`eye-off` | P1 | UI |
| TC-AUTH-10 | Trạng thái loading nút | — | Bấm Đăng nhập | Nút hiện spinner + "Đang xử lý…", bị vô hiệu, không bấm lặp được | P0 | UI |
| TC-AUTH-11 | Quên mật khẩu — có email | Đã nhập email | Bấm "Quên mật khẩu?" | Alert "Đã gửi" kèm địa chỉ email; hộp thư nhận được link reset | P1 | F |
| TC-AUTH-12 | Quên mật khẩu — trống email | Ô email trống | Bấm "Quên mật khẩu?" | Banner "Nhập email trước rồi bấm quên mật khẩu." | P1 | NEG |
| TC-AUTH-13 | Giữ phiên đăng nhập | Đã đăng nhập | Kill app → mở lại | Vào thẳng Trang chủ, không hỏi đăng nhập lại | P0 | F |
| TC-AUTH-14 | Đăng xuất | Đang ở Cài đặt | "Đăng xuất" → xác nhận | Quay về màn Đăng nhập; mở lại app vẫn ở màn Đăng nhập | P0 | F |

---

## B. Điều hướng & thanh tab (NAV) — 14 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-NAV-01 | Tab mặc định | Vừa đăng nhập | Quan sát | Trang chủ được chọn; nút logo giữa có viền emerald + hào quang | P0 | UI |
| TC-NAV-02 | Thứ tự tab | — | Quan sát thanh tab | Trái sang phải: Lịch · Cá nhân · **[logo]** · Liên hệ · Web | P0 | UI |
| TC-NAV-03 | Nút logo về Trang chủ | Đang ở tab Web | Bấm nút logo giữa | Chuyển sang Trang chủ, nút logo đổi sang trạng thái đang chọn | P0 | F |
| TC-NAV-04 | Bấm lại tab đang mở | Đang ở tab Lịch | Bấm lại "Lịch" | Không điều hướng lại, không nháy màn hình | P1 | F |
| TC-NAV-05 | Rãnh lõm ôm logo | — | Quan sát giữa thanh tab | Mép trên thanh cong lõm ôm quanh logo; nút nhô lên ~70% thân, khe hở đáy đều 6px, không có cạnh gãy | P1 | UI |
| TC-NAV-06 | Vùng chạm nút logo | — | Chạm rìa ngoài logo (~4px) | Vẫn nhận thao tác; vùng chạm ≥ 44×44px | P0 | A11y |
| TC-NAV-07 | Không che nội dung | Danh sách dài ở tab Liên hệ | Cuộn xuống cuối | Item cuối hiển thị trọn vẹn phía trên thanh tab, không bị logo che | P0 | UI |
| TC-NAV-08 | Badge tin chưa đọc | Có ≥ 1 lead chưa đọc | Quan sát tab Liên hệ | Badge đỏ hiển thị đúng số; > 99 hiển thị "99+" | P0 | UI |
| TC-NAV-09 | Badge biến mất | Đánh dấu đã đọc tất cả | Quay lại thanh tab | Badge biến mất ngay, không cần khởi động lại | P1 | F |
| TC-NAV-10 | Safe-area máy tai thỏ | iPhone có Home Indicator | Quan sát đáy thanh tab | Nhãn tab không đè lên gạch Home Indicator | P0 | UI |
| TC-NAV-11 | Safe-area Android nút cứng | Máy Android 3 nút | Quan sát | Thanh tab nằm trên hệ thống nút, không bị che | P0 | UI |
| TC-NAV-12 | Xoay ngang | Bật xoay màn hình | Xoay ngang | Nút logo vẫn nằm chính giữa thanh; rãnh lõm khớp vị trí | P2 | UI |
| TC-NAV-13 | Nút back vật lý Android | Đang ở Cài đặt | Bấm back hệ thống | Quay lại màn trước, không thoát app | P0 | F |
| TC-NAV-14 | Chuyển tab giữ trạng thái | Cá nhân → tab "Chi tiêu" | Sang Lịch rồi quay lại Cá nhân | Vẫn ở tab con "Chi tiêu", không reset về "Việc" | P1 | F |

---

## C. Hệ thống giao diện (UI) — 16 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-UI-01 | Brand header Trang chủ | — | Quan sát đầu màn Trang chủ | Nền emerald đặc bo góc dưới 24px; avatar 44px trái, lời chào 12px + họ tên 18px + ngày 12px, chuông và chevron bên phải (không có nền tròn) | P0 | UI |
| TC-UI-02 | Lời chào theo giờ | Đổi giờ máy | Mở Trang chủ lúc 08h / 14h / 21h | Lần lượt "Chào buổi sáng," / "Chào buổi chiều," / "Chào buổi tối," | P1 | F |
| TC-UI-03 | Dòng ngày đầy đủ | — | Quan sát dòng dưới tên | Dạng "Thứ Sáu, 05/09/2026", màu emerald-100, không bị cắt trên máy 375px | P1 | UI |
| TC-UI-04 | Tên dài không vỡ | Đặt họ tên rất dài trong Hồ sơ | Mở Trang chủ | Tên cắt bằng dấu "…" trên 1 dòng, không đẩy lệch nút bên phải | P1 | UI |
| TC-UI-05 | Avatar mặc định | Hồ sơ chưa có ảnh | Quan sát | Hiển thị logo thương hiệu trong khung tròn | P1 | UI |
| TC-UI-06 | Chạm avatar | — | Chạm avatar trên header | Mở màn Cài đặt | P1 | F |
| TC-UI-07 | Chuông + chấm đỏ | Có lead chưa đọc | Quan sát nút chuông | Chấm đỏ 8px góc trên phải (không hiện số); chạm → sang Hộp thư liên hệ. Hết tin chưa đọc thì chấm biến mất | P0 | F |
| TC-UI-08 | Nút chevron | — | Chạm nút mũi tên xuống | Mở màn Cài đặt | P1 | F |
| TC-UI-09 | Brand header các tab | Mở Lịch / Cá nhân / Liên hệ / Web | Quan sát | Cùng dải màu, icon dẫn trái, tiêu đề 1 dòng, badge + phụ đề ở dòng 2 | P0 | UI |
| TC-UI-10 | Tiêu đề không bị cắt | Tab Lịch đã kết nối Google | Quan sát | "Lịch làm việc" hiện đủ; badge "GOOGLE" nằm dòng phụ đề | P1 | UI |
| TC-UI-11 | Detail header | Mở "Lịch mới" | Quan sát | Nút quay lại tròn 30px nền trung tính + tiêu đề 18px + phụ đề 13px, nền emerald | P0 | UI |
| TC-UI-12 | Khoảng cách dưới header | Trang chủ có sự kiện kế tiếp | Quan sát | Thẻ sự kiện nằm gọn dưới header, cách 16px, bo góc đầy đủ, không bị header cắt | P1 | UI |
| TC-UI-13 | Bottom sheet | Mở "Công việc mới" | Quan sát | Bo góc trên 24px, có thanh grip, nền mờ tối phía sau | P1 | UI |
| TC-UI-14 | Đóng sheet bằng nền | Sheet đang mở | Chạm vùng tối phía trên sheet | Sheet đóng, dữ liệu đang nhập không được lưu | P1 | F |
| TC-UI-15 | Nhất quán màu | Duyệt toàn bộ màn | Quan sát | Chỉ dùng emerald làm màu nhấn; đỏ/hổ phách/xanh dương chỉ cho trạng thái | P1 | UI |
| TC-UI-16 | Không có chữ < 12px | Duyệt toàn bộ màn | Kiểm tra nhãn nhỏ nhất | Mọi text ≥ 12px, đọc được ở khoảng cách thường | P1 | A11y |

---

## D. Trang chủ (HOME) — 14 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-HOME-01 | Thẻ sự kiện kế tiếp | Có sự kiện tương lai | Mở Trang chủ | Thẻ hiện badge "SỰ KIỆN KẾ TIẾP", tên, ngày giờ, địa điểm, đếm ngược | P0 | F |
| TC-HOME-02 | Sự kiện đang diễn ra | Sự kiện đã bắt đầu chưa kết thúc | Mở Trang chủ | Badge đổi thành "ĐANG DIỄN RA" kèm icon chấm tròn | P1 | F |
| TC-HOME-03 | Không có sự kiện | Xoá hết sự kiện tương lai | Mở Trang chủ | Thẻ trống "Lịch trình hôm nay thảnh thơi" + gợi ý, không hiện `null` | P1 | UI |
| TC-HOME-04 | Chạm thẻ sự kiện | Có sự kiện kế tiếp | Chạm thẻ | Chuyển sang tab Lịch | P1 | F |
| TC-HOME-05 | Lối tắt Đồng bộ | Chưa kết nối Google | Chạm "Làm mới" | Hiện banner "Đã làm mới dữ liệu đám mây" | P1 | F |
| TC-HOME-06 | Lối tắt Đồng bộ Google | Đã kết nối Google | Chạm "Đồng bộ Google" | Icon chuyển trạng thái quay, kết thúc hiện "Đã đồng bộ: đẩy N · nhận M sự kiện" | P0 | INT |
| TC-HOME-07 | Lối tắt + Lịch mới | — | Chạm "+ Lịch mới" | Mở form "Lịch mới" trống | P0 | F |
| TC-HOME-08 | Lối tắt + Thêm việc | — | Chạm "+ Thêm việc" | Sang Cá nhân → tab Việc và tự mở sheet "Công việc mới" | P0 | F |
| TC-HOME-09 | Lối tắt + Thói quen | — | Chạm "+ Thói quen" | Sang Cá nhân → tab Thói quen và mở sheet tạo mới | P1 | F |
| TC-HOME-10 | Lối tắt + Chi tiêu | — | Chạm "+ Chi tiêu" | Sang Cá nhân → tab Chi tiêu và mở sheet ghi giao dịch | P1 | F |
| TC-HOME-11 | 4 thẻ chỉ số | Có dữ liệu đủ 4 nhóm | Quan sát | Lịch hôm nay / Việc đến hạn / Liên hệ / Số dư tháng đúng số thực tế | P0 | F |
| TC-HOME-12 | Số dư âm | Chi > thu trong tháng | Quan sát thẻ Số dư | Số hiển thị màu đỏ kèm nhãn "-Âm" | P1 | UI |
| TC-HOME-13 | Kéo để làm mới | — | Vuốt xuống ở đầu danh sách | Xuất hiện vòng quay, dữ liệu được đồng bộ / làm mới rồi ẩn đi | P1 | F |
| TC-HOME-14 | Tick nhanh thói quen | Có ≥ 1 thói quen | Chạm viên thói quen dưới cùng | Đổi sang trạng thái hoàn thành + rung nhẹ; bộ đếm "x/y HOÀN THÀNH" tăng | P1 | F |

---

## E. Lịch làm việc (CAL) — 22 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-CAL-01 | Mặc định dải tuần | — | Mở tab Lịch | Hiện **dải 7 ngày của tuần hiện tại** (T2→CN), mỗi ô có nhãn thứ + số ngày; ô hôm nay có viền nhấn | P0 | UI |
| TC-CAL-02 | Lùi / tiến khoảng | — | Chạm mũi tên trái / phải | Ở dải tuần: nhảy **1 tuần**, nhãn đổi thành khoảng ngày mới. Ở lưới tháng: nhảy **1 tháng**. Không tự nhảy về hôm nay | P0 | F |
| TC-CAL-03 | Về hôm nay | Đang xem tuần/tháng khác | Chạm vào **nhãn khoảng thời gian ở giữa thanh** | Quay về hôm nay và chọn ngày hôm nay | P1 | F |
| TC-CAL-04 | Ngày ngoài tháng | — | Quan sát ô đầu/cuối lưới | Số ngày mờ đi (opacity thấp), vẫn chạm chọn được | P2 | UI |
| TC-CAL-05 | Chấm sự kiện | Ngày có sự kiện | Quan sát ô ngày | Một chấm dưới số ngày, màu theo sự kiện đầu tiên; ngày đang chọn thì chấm chuyển sang màu chữ trên nền nhấn | P1 | UI |
| TC-CAL-06 | Chọn ngày | — | Chạm 1 ô ngày | Ô đổi nền emerald; danh sách phía dưới đổi theo ngày đã chọn | P0 | F |
| TC-CAL-07 | Nhãn ngày đã chọn | Chọn hôm nay | Quan sát tiêu đề danh sách | Hiện nhãn "HÔM NAY" bên cạnh ngày | P2 | UI |
| TC-CAL-08 | Tổng kết ngày | Ngày có 3 sự kiện | Quan sát dưới lịch | Bên phải hiện "3 lịch trình"; dòng dưới hiện "x đã xong · y đang diễn ra · z sắp tới". Ngày trống hiện "Chưa có lịch nào trong ngày" | P1 | UI |
| TC-CAL-09 | Ngày trống | Chọn ngày không có sự kiện | Quan sát | Empty state "Không có lịch trong ngày này" + hướng dẫn dùng nút + | P1 | UI |
| TC-CAL-10 | Thẻ sự kiện trên dòng thời gian | Ngày có sự kiện | Quan sát | Cột dọc bên trái có chấm mốc theo trạng thái; thẻ hiện tên, huy hiệu trạng thái, "08:00 → 09:30" và địa điểm. Tên dài bị cắt bằng "…", thẻ **không tràn** ra ngoài màn | P0 | UI |
| TC-CAL-11 | Sự kiện cả ngày | Có sự kiện allDay | Quan sát | Hiển thị "Cả ngày" thay cho khung giờ | P1 | F |
| TC-CAL-12 | Dấu Google | Sự kiện đã đồng bộ | Quan sát | Có huy hiệu logo Google ở góc phải thẻ | P1 | INT |
| TC-CAL-13 | Mở sửa sự kiện | — | Chạm 1 thẻ sự kiện | Mở form "Sửa lịch" nạp đúng dữ liệu | P0 | F |
| TC-CAL-14 | Nút + tạo nhanh | Đang chọn ngày 20/09 | Chạm FAB "+" | Mở form "Lịch mới" với ngày mặc định là 20/09 | P0 | F |
| TC-CAL-15 | Đồng bộ từ header | Đã kết nối Google | Chạm nút đồng bộ | Chạy đồng bộ 2 chiều, hiện banner kết quả | P0 | INT |
| TC-CAL-16 | Sắp xếp trong ngày | Ngày có nhiều sự kiện | Quan sát thứ tự | Sắp xếp tăng dần theo giờ bắt đầu | P1 | F |
| TC-CAL-17 | Mở rộng thành tháng | Đang ở dải tuần | Chạm chevron xuống ở đáy khung lịch | Khung mở thành lưới tháng đủ 6 hàng, có hàng nhãn thứ, chevron đổi thành hướng lên | P0 | F |
| TC-CAL-18 | Thu gọn về tuần | Đang ở lưới tháng | Chạm chevron lên | Trở lại dải 7 ngày của tuần chứa ngày đang chọn | P0 | F |
| TC-CAL-19 | Giữ ngày khi đổi chế độ | Chọn ngày 18 ở lưới tháng | Thu gọn về tuần | Vẫn chọn ngày 18, dải tuần hiển thị đúng tuần chứa ngày 18 | P0 | F |
| TC-CAL-20 | Ngày ngoài tháng | Ở lưới tháng | Quan sát ô đầu và cuối lưới | Số ngày mờ đi, vẫn chạm chọn được và tự chuyển sang tháng tương ứng | P1 | UI |
| TC-CAL-21 | Nhãn khoảng thời gian | Đổi qua lại 2 chế độ | Quan sát nhãn giữa thanh | Dải tuần: "31/08/2026 – 06/09/2026". Lưới tháng: "Tháng 09/2026" | P1 | UI |
| TC-CAL-22 | Nút thừa trên header | Tab Lịch | Đếm nút ở góc phải header | Chỉ còn **1 nút đồng bộ**; chức năng "về hôm nay" nằm ở nhãn giữa thanh | P2 | UI |


---

## F. Form sự kiện (EVT) — 15 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-EVT-01 | Tạo sự kiện tối thiểu | Mở "Lịch mới" | Nhập tiêu đề → Lưu | Lưu thành công, quay lại Lịch, sự kiện xuất hiện đúng ngày | P0 | F |
| TC-EVT-02 | Thiếu tiêu đề | Mở "Lịch mới" | Để trống tiêu đề → Lưu | Banner "Nhập tiêu đề cho lịch.", không tạo bản ghi | P0 | NEG |
| TC-EVT-03 | Giờ mặc định | Mở form từ FAB | Quan sát | Giờ bắt đầu là mốc tròn kế tiếp, kết thúc = bắt đầu + 1 giờ | P1 | F |
| TC-EVT-04 | Giữ thời lượng | Sự kiện 09:00–10:30 | Đổi giờ bắt đầu sang 14:00 | Giờ kết thúc tự thành 15:30 | P1 | F |
| TC-EVT-05 | Kết thúc trước bắt đầu | — | Chọn giờ kết thúc sớm hơn bắt đầu | Tự đẩy kết thúc thành bắt đầu + 15 phút | P0 | NEG |
| TC-EVT-06 | Bật "Cả ngày" | — | Bật công tắc Cả ngày → Lưu | Sự kiện hiển thị "Cả ngày" ở màn Lịch | P1 | F |
| TC-EVT-07 | Đổi màu sự kiện | — | Chọn màu tím → Lưu | Viền trái thẻ và chấm trên lưới đổi sang tím | P1 | UI |
| TC-EVT-08 | Chọn nhiều mốc nhắc | — | Chọn "15 phút" + "1 giờ" → Lưu | Thẻ hiện "Nhắc trước 15p, 1h"; nhận đủ 2 thông báo | P0 | F |
| TC-EVT-09 | Bỏ hết nhắc | — | Bỏ chọn mọi mốc nhắc → Lưu | Không còn dòng nhắc trên thẻ; không có thông báo nào được đặt | P1 | F |
| TC-EVT-10 | Huỷ picker | Mở bộ chọn ngày | Bấm huỷ / vuốt ra | Giá trị ngày giờ giữ nguyên như trước | P1 | NEG |
| TC-EVT-11 | Sửa sự kiện | Mở 1 sự kiện có sẵn | Đổi tiêu đề + địa điểm → Lưu | Thay đổi hiện ngay ở Lịch và Trang chủ | P0 | F |
| TC-EVT-12 | Xoá sự kiện | Đang sửa 1 sự kiện | Nút thùng rác → xác nhận "Xoá" | Sự kiện biến mất khỏi Lịch; nếu có bản Google thì bị xoá kèm | P0 | F |
| TC-EVT-13 | Huỷ xoá | Đang sửa | Nút thùng rác → "Huỷ" | Không xoá gì, ở nguyên form | P1 | NEG |
| TC-EVT-14 | Trạng thái nút Lưu | — | Bấm Lưu | Nút hiện spinner + "Đang lưu…", chống bấm 2 lần | P1 | UI |
| TC-EVT-15 | Không còn nút Huỷ thừa | Mở form Lịch mới / Dự án mới | Quan sát cuối form | Chỉ còn **1 nút chính** chiếm hết bề ngang; thoát form bằng nút quay lại trên header hoặc back hệ thống | P2 | UI |

---

## G. Công việc (TASK) — 12 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-TASK-01 | Tạo công việc | Tab Cá nhân → Việc | FAB + → nhập tên → Tạo | Việc xuất hiện đầu danh sách "Đang mở" | P0 | F |
| TC-TASK-02 | Tên rỗng | Sheet đang mở | Để trống tên → Tạo | Không tạo, sheet vẫn mở | P0 | NEG |
| TC-TASK-03 | Chọn mức ưu tiên | — | Chọn "Gấp" → Tạo | Thẻ hiện badge đỏ "GẤP" | P1 | F |
| TC-TASK-04 | Đặt hạn | — | Chọn ngày hạn → Tạo | Thẻ hiện "Hạn: <ngày>"; đếm vào bộ lọc "Hôm nay" nếu ≤ hôm nay | P0 | F |
| TC-TASK-05 | Đánh dấu hoàn thành | Có việc đang mở | Chạm ô tròn | Việc gạch ngang / chuyển sang nhóm Đã xong, có rung nhẹ | P0 | F |
| TC-TASK-06 | Bỏ hoàn thành | Có việc đã xong | Chạm lại ô tròn | Trở về nhóm Đang mở | P1 | F |
| TC-TASK-07 | Bộ lọc | Có đủ 3 nhóm | Lần lượt chọn Đang mở / Hôm nay / Đã xong / Tất cả | Danh sách và số đếm trên chip khớp thực tế | P0 | F |
| TC-TASK-08 | Sửa công việc | — | Chạm 1 việc → sửa tên, ghi chú → Lưu | Nội dung cập nhật ngay | P0 | F |
| TC-TASK-09 | Xoá công việc | — | Nút xoá → xác nhận | Việc biến mất; huỷ thì giữ nguyên | P0 | F |
| TC-TASK-10 | Danh sách rỗng | Xoá hết việc | Quan sát | Empty state có hướng dẫn, không phải màn trắng | P1 | UI |
| TC-TASK-11 | Đồng bộ với Trang chủ | Tạo việc hạn hôm nay | Về Trang chủ | Thẻ "Việc đến hạn" tăng đúng 1 | P1 | F |
| TC-TASK-12 | Tạo việc từ lối tắt | Trang chủ | "+ Thêm việc" | Sheet tạo mở sẵn ở đúng tab Việc | P1 | F |

---

## H. Ghi chú (NOTE) — 10 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-NOTE-01 | Tạo ghi chú | Tab Ghi chú | FAB + → nhập tiêu đề + nội dung → Lưu | Ghi chú xuất hiện trong danh sách | P0 | F |
| TC-NOTE-02 | Tự đặt tiêu đề | — | Chỉ nhập nội dung, bỏ trống tiêu đề → Lưu | Tiêu đề lấy dòng đầu nội dung (tối đa 60 ký tự) | P1 | F |
| TC-NOTE-03 | Rỗng hoàn toàn | — | Bỏ trống cả 2 → Lưu | Không tạo bản ghi | P1 | NEG |
| TC-NOTE-04 | Gắn thẻ | — | Nhập `công việc, ý tưởng` → Lưu | Hiện 2 chip thẻ; bộ lọc thẻ có thêm 2 mục | P1 | F |
| TC-NOTE-05 | Ghim ghi chú | Có ≥ 2 ghi chú | Ghim ghi chú thứ 2 | Ghi chú được ghim nhảy lên đầu danh sách | P1 | F |
| TC-NOTE-06 | Bỏ ghim | — | Bấm ghim lần nữa | Trở về vị trí theo thời gian cập nhật | P2 | F |
| TC-NOTE-07 | Tìm kiếm | Có ≥ 5 ghi chú | Gõ từ khoá trong nội dung | Chỉ còn ghi chú khớp tiêu đề / nội dung / thẻ | P0 | F |
| TC-NOTE-08 | Lọc theo thẻ | Có nhiều thẻ | Chọn 1 chip thẻ | Chỉ hiện ghi chú mang thẻ đó; bỏ chọn thì hiện lại tất cả | P1 | F |
| TC-NOTE-09 | Tìm không ra | — | Gõ chuỗi vô nghĩa | Empty state, không phải danh sách trắng | P1 | UI |
| TC-NOTE-10 | Sửa & xoá | — | Sửa nội dung → Lưu; sau đó xoá → xác nhận | Cập nhật đúng rồi biến mất khỏi danh sách | P0 | F |

---

## I. Thói quen (HAB) — 10 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-HAB-01 | Tạo thói quen | Tab Thói quen | FAB + → nhập tên → Tạo | Thói quen xuất hiện với lịch tuần trống | P0 | F |
| TC-HAB-02 | Tên rỗng | — | Bỏ trống tên → Tạo | Không tạo | P1 | NEG |
| TC-HAB-03 | Chọn màu | — | Chọn màu hổ phách → Tạo | Ô đã hoàn thành và viên trên Trang chủ dùng đúng màu | P1 | UI |
| TC-HAB-04 | Đặt mục tiêu tuần | — | Nhập mục tiêu 5 → Tạo | Hiển thị tiến độ theo mốc 5 ngày/tuần | P1 | F |
| TC-HAB-05 | Điểm danh hôm nay | — | Chạm ô hôm nay | Ô tô màu, có rung nhẹ, tỉ lệ % ở đầu màn tăng | P0 | F |
| TC-HAB-06 | Bỏ điểm danh | Đã tick hôm nay | Chạm lại ô đó | Ô trở về trạng thái trống, % giảm tương ứng | P0 | F |
| TC-HAB-07 | Điểm danh ngày cũ | — | Chạm ô của ngày trước trong tuần | Ghi nhận đúng ngày đó, không ghi vào hôm nay | P1 | F |
| TC-HAB-08 | Chuỗi ngày | Tick 3 ngày liên tiếp | Quan sát | Chuỗi hiện đúng số ngày liên tiếp | P2 | F |
| TC-HAB-09 | Xoá thói quen | — | Nút xoá → xác nhận | Cảnh báo mất toàn bộ lịch sử; xoá xong biến mất khỏi cả Trang chủ | P0 | F |
| TC-HAB-10 | Đồng bộ Trang chủ | Tick 1 thói quen | Về Trang chủ | Dòng "x/y HOÀN THÀNH" cập nhật khớp | P1 | F |

---

## J. Chi tiêu (FIN) — 12 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-FIN-01 | Ghi khoản chi | Tab Chi tiêu | FAB + → chọn Chi, nhập 250000, chọn danh mục → Lưu | Giao dịch xuất hiện, tổng Chi tháng tăng 250.000 | P0 | F |
| TC-FIN-02 | Ghi khoản thu | — | Chọn Thu, nhập số tiền → Lưu | Tổng Thu tăng, số dư tính lại đúng | P0 | F |
| TC-FIN-03 | Số tiền rỗng / bằng 0 | — | Để trống hoặc nhập 0 → Lưu | Không tạo giao dịch | P0 | NEG |
| TC-FIN-04 | Lọc ký tự lạ | — | Nhập `12a3.000đ` → Lưu | Chỉ giữ chữ số → lưu 123000 | P1 | NEG |
| TC-FIN-05 | Định dạng tiền | Có giao dịch | Quan sát | Hiển thị phân tách hàng nghìn theo chuẩn Việt Nam | P1 | UI |
| TC-FIN-06 | Chọn ngày giao dịch | — | Đổi ngày về tháng trước → Lưu | Giao dịch không còn ở tháng hiện tại; xem tháng trước thì thấy | P1 | F |
| TC-FIN-07 | Chuyển tháng | — | Chạm mũi tên đổi tháng | Danh sách, tổng thu/chi và biểu đồ danh mục đổi theo tháng | P0 | F |
| TC-FIN-08 | Tỉ trọng danh mục | Có ≥ 3 danh mục chi | Quan sát | Thanh tỉ trọng sắp xếp giảm dần theo số tiền | P1 | UI |
| TC-FIN-09 | Sửa giao dịch | — | Chạm 1 giao dịch → đổi số tiền → Lưu | Tổng tháng tính lại đúng ngay | P0 | F |
| TC-FIN-10 | Xoá giao dịch | — | Nút xoá → xác nhận | Hộp thoại nêu rõ số tiền + danh mục; xoá xong tổng giảm đúng | P0 | F |
| TC-FIN-11 | Tháng rỗng | Chọn tháng không giao dịch | Quan sát | Empty state, tổng hiển thị 0 chứ không phải `NaN` | P1 | NEG |
| TC-FIN-12 | Đồng bộ Trang chủ | Ghi 1 khoản chi lớn | Về Trang chủ | Thẻ "Số dư tháng này" cập nhật đúng, đổi màu nếu chuyển âm | P1 | F |

---

## K. Hộp thư liên hệ (LEAD) — 14 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-LEAD-01 | Danh sách liên hệ | Có lead trong Firestore | Mở tab Liên hệ | Danh sách sắp theo thời gian mới nhất, tin chưa đọc có viền trái nhấn | P0 | F |
| TC-LEAD-02 | Mở chi tiết | — | Chạm 1 liên hệ | Bottom sheet hiện nội dung, email, điện thoại, thời gian gửi | P0 | F |
| TC-LEAD-03 | Tự đánh dấu đã đọc | Lead chưa đọc | Mở lead đó rồi đóng | Mất badge "CHƯA ĐỌC", số trên tab giảm 1 | P0 | F |
| TC-LEAD-04 | Đánh dấu đã đọc tất cả | Có ≥ 2 lead chưa đọc | Chạm nút check-done trên header | Toàn bộ về trạng thái đã đọc, badge tab biến mất | P1 | F |
| TC-LEAD-05 | Đổi trạng thái | Sheet đang mở | Chọn "Đã liên hệ" | Chip đổi trạng thái, badge trên thẻ danh sách đổi theo | P0 | F |
| TC-LEAD-06 | Bộ lọc trạng thái | Có lead nhiều trạng thái | Chọn từng chip lọc | Danh sách chỉ còn lead đúng trạng thái | P0 | F |
| TC-LEAD-07 | Lọc chưa đọc | — | Chọn chip "Chưa đọc" | Chỉ hiện lead chưa đọc | P1 | F |
| TC-LEAD-08 | Tìm kiếm | Có ≥ 5 lead | Gõ tên / email / số điện thoại | Danh sách lọc đúng theo mọi trường trên | P0 | F |
| TC-LEAD-09 | Xoá từ khoá tìm | Đang có từ khoá | Chạm nút x trong ô tìm | Ô trống, danh sách trở lại đầy đủ | P2 | F |
| TC-LEAD-10 | Gọi nhanh | Lead có số điện thoại | Chạm icon điện thoại trên thẻ | Mở trình quay số với đúng số, không lỗi khoảng trắng | P1 | INT |
| TC-LEAD-11 | Gửi mail nhanh | Lead có email | Chạm icon thư | Mở app mail, tiêu đề điền sẵn | P1 | INT |
| TC-LEAD-12 | Tạo việc từ lead | Sheet đang mở | Chạm "Tạo việc" | Sang Việc có 1 task ưu tiên Gấp, hạn hôm nay, ghi kèm email/điện thoại | P0 | F |
| TC-LEAD-13 | Xoá liên hệ | — | Nút xoá → xác nhận | Hộp thoại nêu tên người gửi; xoá xong biến mất khỏi danh sách | P0 | F |
| TC-LEAD-14 | Hộp thư rỗng | Chưa có lead nào | Mở tab | Empty state giải thích form liên hệ trên website sẽ đổ về đây | P1 | UI |

---

## L. Quản trị website (WEB) — 12 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-WEB-01 | Hai tab con | Mở tab Web | Quan sát | Segmented "Hồ sơ / Dự án" hoạt động, mặc định Hồ sơ | P1 | UI |
| TC-WEB-02 | Sửa thông tin hồ sơ | Tab Hồ sơ | Đổi Chức danh → Lưu | Hiện thông báo lưu thành công; mở lại vẫn giữ giá trị mới | P0 | F |
| TC-WEB-03 | Không ghi đè khi đang gõ | Tab Hồ sơ | Gõ dở 1 trường, chờ dữ liệu realtime về | Nội dung đang gõ không bị ghi đè | P1 | F |
| TC-WEB-04 | Thêm học vấn | — | "+ Thêm" học vấn → nhập trường, ngành → Lưu | Mục học vấn mới hiển thị trong danh sách | P1 | F |
| TC-WEB-05 | Xoá học vấn | Có ≥ 2 mục | Xoá mục thứ 2 → Lưu | Chỉ còn 1 mục, không ảnh hưởng mục còn lại | P1 | F |
| TC-WEB-06 | Thêm kinh nghiệm | — | Nhập vị trí, công ty, thời gian, chi tiết → Lưu | Hiển thị đúng, mỗi dòng chi tiết là 1 ý | P1 | F |
| TC-WEB-07 | Nhóm kỹ năng | — | Thêm nhóm + danh sách kỹ năng → Lưu | Kỹ năng hiện dạng chip | P2 | F |
| TC-WEB-08 | Số dự án trên header | Có 4 dự án | Quan sát phụ đề header | "4 dự án đang hiển thị" | P2 | UI |
| TC-WEB-09 | Tạo dự án | Tab Dự án | FAB + → nhập tên, mô tả, link → Lưu | Dự án mới hiện trong danh sách | P0 | F |
| TC-WEB-10 | Sửa / xoá dự án | Có ≥ 1 dự án | Sửa tên → Lưu; sau đó xoá → xác nhận | Cập nhật rồi biến mất; số trên header giảm | P0 | F |
| TC-WEB-11 | Mở website | — | Chạm nút mở link trên header | Trình duyệt mở đúng địa chỉ portfolio | P1 | INT |
| TC-WEB-12 | Phản chiếu lên web | Sau khi lưu hồ sơ | Mở website portfolio trên trình duyệt | Nội dung mới hiển thị (có thể cần tải lại trang) | P0 | INT |

---

## M. Cài đặt & Google Calendar (SET) — 16 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-SET-01 | Mở Cài đặt | Trang chủ | Chạm avatar hoặc nút chevron | Mở màn Cài đặt, phụ đề là email đang đăng nhập | P0 | F |
| TC-SET-02 | Quay lại | Đang ở Cài đặt | Chạm nút quay lại tròn | Về đúng màn trước đó | P0 | F |
| TC-SET-03 | Chưa cấu hình Client ID | Lần đầu | Quan sát mục Google Calendar | Banner hướng dẫn + ô nhập Client ID + hiển thị Package và Redirect URI | P0 | UI |
| TC-SET-04 | Sao chép Redirect URI | — | Nhấn giữ dòng Redirect URI | Có thể bôi đen / sao chép được | P1 | F |
| TC-SET-05 | Lưu Client ID | — | Dán Client ID hợp lệ → "Lưu Client ID" | Lưu thành công, nút "Kết nối Google Calendar" được bật | P0 | F |
| TC-SET-06 | Kết nối Google | Đã có Client ID | Chạm "Kết nối Google Calendar" | Mở trình duyệt OAuth; cấp quyền xong trở lại app, trạng thái "Đã kết nối" | P0 | INT |
| TC-SET-07 | Huỷ giữa chừng OAuth | Đang ở màn Google | Đóng trình duyệt | App không treo, vẫn ở trạng thái "Chưa kết nối" | P0 | NEG |
| TC-SET-08 | Đồng bộ ngay | Đã kết nối | Chạm "Đồng bộ ngay" | Nút loading, kết thúc hiện số sự kiện đẩy lên / nhận về | P0 | INT |
| TC-SET-09 | Chọn lịch đích | Có nhiều lịch Google | Chọn 1 lịch khác lịch chính | Sự kiện mới được đẩy vào đúng lịch đã chọn | P1 | INT |
| TC-SET-10 | Tắt tự động đồng bộ | Đã kết nối | Tắt "Tự động đồng bộ" → tạo 1 sự kiện | Sự kiện không tự lên Google; đồng bộ tay vẫn đẩy được | P1 | F |
| TC-SET-11 | Ngắt kết nối | Đã kết nối | Chạm "Ngắt" | Trở về "Chưa kết nối"; huy hiệu Google biến mất khỏi header | P0 | F |
| TC-SET-12 | Trạng thái thông báo | — | Quan sát mục Thông báo | Hiển thị đúng đã cấp / chưa cấp quyền và tình trạng push token | P1 | UI |
| TC-SET-13 | Mở cài đặt hệ thống | Chưa cấp quyền thông báo | Chạm "Mở cài đặt hệ thống" | Mở đúng trang cài đặt app của hệ điều hành | P1 | INT |
| TC-SET-14 | Giờ nhắc thói quen | Bật nhắc thói quen | Chọn 21:00 | Thông báo tổng kết đến lúc 21:00 hôm đó hoặc hôm sau | P1 | F |
| TC-SET-15 | Thống kê dữ liệu | Có dữ liệu các nhóm | Quan sát mục "Dữ liệu của bạn" | 6 con số khớp số bản ghi thực tế | P1 | F |
| TC-SET-16 | Đổi mật khẩu | Đang đăng nhập | Nhập đúng mật khẩu hiện tại + mật khẩu mới ≥ 6 ký tự → Cập nhật | Báo thành công; đăng xuất và đăng nhập lại bằng mật khẩu mới thành công | P0 | F |

---

## N. Thông báo (NOTI) — 10 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-NOTI-01 | Xin quyền lần đầu | Cài mới | Đăng nhập lần đầu | Hệ thống hỏi quyền thông báo | P0 | F |
| TC-NOTI-02 | Từ chối quyền | — | Chọn Không cho phép | App vẫn dùng bình thường; Cài đặt hiện "Chưa cấp quyền thông báo" | P0 | NEG |
| TC-NOTI-03 | Nhắc trước sự kiện | Tạo sự kiện sau 3 phút, nhắc "Đúng giờ" và "5 phút" | Chờ tới mốc | Nhận thông báo đúng thời điểm với tên sự kiện | P0 | F |
| TC-NOTI-04 | Sửa sự kiện → đặt lại nhắc | Sự kiện đã có nhắc | Dời giờ sang muộn hơn 1 tiếng | Nhắc cũ bị huỷ, nhắc mới đúng giờ mới | P0 | F |
| TC-NOTI-05 | Xoá sự kiện → huỷ nhắc | — | Xoá sự kiện có nhắc | Không còn nhận thông báo cho sự kiện đó | P0 | F |
| TC-NOTI-06 | Chạm thông báo lịch | Có thông báo nhắc lịch | Chạm vào thông báo | App mở đúng tab Lịch | P1 | F |
| TC-NOTI-07 | Chạm thông báo lead | Có thông báo liên hệ mới | Chạm vào thông báo | App mở đúng tab Liên hệ | P1 | F |
| TC-NOTI-08 | Chạm thông báo thói quen | Có nhắc thói quen buổi tối | Chạm vào thông báo | Mở Cá nhân → tab Thói quen | P1 | F |
| TC-NOTI-09 | Lead mới khi app đang mở | App đang chạy | Gửi form liên hệ từ website | Nhận thông báo tức thì + badge tab tăng | P0 | INT |
| TC-NOTI-10 | Không bắn lại lịch sử | Có nhiều lead cũ | Đăng xuất rồi đăng nhập lại | Không nhận lại thông báo cho các lead cũ | P0 | NEG |

---

## O. Đồng bộ realtime & offline (SYNC) — 8 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-SYNC-01 | Realtime web → app | App đang mở tab Web | Sửa hồ sơ trên trình duyệt | Nội dung trong app đổi theo, không cần thao tác gì | P0 | INT |
| TC-SYNC-02 | Realtime app → web | Website đang mở | Thêm 1 dự án trong app | Website hiển thị dự án mới sau khi tải lại | P0 | INT |
| TC-SYNC-03 | Hai thiết bị | Đăng nhập cùng tài khoản trên 2 máy | Tạo việc ở máy A | Máy B thấy việc mới ngay | P1 | INT |
| TC-SYNC-04 | Mất mạng khi ghi | Bật chế độ máy bay | Tạo 1 công việc | Không crash; có mạng lại thì dữ liệu được đẩy lên | P0 | NEG |
| TC-SYNC-05 | Đẩy lên Google | Đã bật tự động đồng bộ | Tạo sự kiện mới | Sự kiện xuất hiện trên Google Calendar trong ít phút | P0 | INT |
| TC-SYNC-06 | Kéo từ Google về | Có sự kiện tạo trên Google | Chạm Đồng bộ | Sự kiện về app với màu xanh dương và huy hiệu Google | P0 | INT |
| TC-SYNC-07 | Không nhân bản | Đồng bộ 2 lần liên tiếp | Chạm Đồng bộ lại | Không xuất hiện sự kiện trùng lặp | P0 | NEG |
| TC-SYNC-08 | Token hết hạn | Token Google hết hạn | Chạm Đồng bộ | Tự làm mới token và đồng bộ thành công, hoặc báo lỗi rõ ràng | P1 | NEG |

---

## P. Tiếp cận & responsive (A11Y) — 12 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-A11Y-01 | Vùng chạm | Toàn app | Đo mọi nút icon | Mọi nút ≥ 44×44px, cách nhau ≥ 8px | P0 | A11y |
| TC-A11Y-02 | Nhãn cho trình đọc màn hình | Bật VoiceOver / TalkBack | Lướt qua các nút icon | Mỗi nút được đọc đúng chức năng, không đọc tên icon | P0 | A11y |
| TC-A11Y-03 | Trạng thái tab được đọc | Bật trình đọc màn hình | Lướt thanh tab | Tab đang mở được đọc là "đã chọn" | P1 | A11y |
| TC-A11Y-04 | Nút logo được đọc | Bật trình đọc màn hình | Chạm nút logo | Đọc "Trang chủ" + gợi ý "Mở bảng điều khiển tổng quan" | P1 | A11y |
| TC-A11Y-05 | Tương phản chữ trên brand header | — | Đo tương phản chữ trắng trên nền emerald | ≥ 4.5:1 với chữ thường, ≥ 3:1 với icon | P0 | A11y |
| TC-A11Y-06 | Không chỉ dùng màu | Toàn app | Kiểm trạng thái lỗi / hoàn thành / ưu tiên | Luôn kèm icon hoặc chữ, không chỉ dựa vào màu | P0 | A11y |
| TC-A11Y-07 | Cỡ chữ hệ thống lớn | Đặt cỡ chữ lớn nhất | Duyệt các màn chính | Không mất chữ, không chồng lấn nghiêm trọng | P1 | A11y |
| TC-A11Y-08 | Màn hình nhỏ 375px | iPhone SE | Duyệt Trang chủ, Lịch, Cài đặt | Không tràn ngang, không phải cuộn ngang | P0 | UI |
| TC-A11Y-09 | Màn hình lớn 6.7" | iPhone Pro Max | Duyệt các màn | Bố cục giãn hợp lý, thanh tab vẫn cân đối | P1 | UI |
| TC-A11Y-10 | Bàn phím che input | Form Cài đặt | Chạm ô "Mật khẩu mới" | Ô nhập được đẩy lên trên bàn phím, vẫn thấy được | P0 | UI |
| TC-A11Y-11 | Đóng bàn phím | Đang gõ trong sheet | Chạm ra vùng trống | Bàn phím đóng, sheet không đóng theo | P1 | UI |
| TC-A11Y-12 | Trạng thái nhấn | Toàn app | Nhấn giữ các nút | Có phản hồi tức thì (mờ / thu nhỏ) trong vòng 100ms | P1 | UI |

---

## Q. Hiệu năng & ổn định (PERF) — 8 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-PERF-01 | Khởi động nguội | Kill app | Mở app | Vào được màn chính trong ≤ 4 giây trên máy tầm trung | P1 | PERF |
| TC-PERF-02 | Cuộn danh sách dài | Có ≥ 200 giao dịch | Cuộn nhanh lên xuống | Không giật rõ rệt, không trắng khung kéo dài | P1 | PERF |
| TC-PERF-03 | Chuyển tab liên tục | — | Bấm qua lại 5 tab nhiều lần | Không rò rỉ bộ nhớ, không chậm dần | P1 | PERF |
| TC-PERF-04 | Đưa app xuống nền | Đang ở Trang chủ | Chuyển nền 5 phút rồi mở lại | Dữ liệu vẫn đúng, kiểm tra lại trạng thái kết nối Google | P1 | F |
| TC-PERF-05 | Xoay màn hình liên tục | Bật xoay | Xoay 10 lần | Không crash, bố cục không vỡ | P2 | PERF |
| TC-PERF-06 | Error boundary | Ép lỗi render | Gây lỗi ở 1 màn | Hiện màn báo lỗi thân thiện, không văng ra ngoài | P1 | NEG |
| TC-PERF-07 | Pin & mạng | Dùng 30 phút | Theo dõi tiêu thụ | Không có vòng lặp gọi mạng bất thường | P2 | PERF |
| TC-PERF-08 | Cài đè phiên bản mới | Đã có dữ liệu | Cài bản mới đè lên | Dữ liệu và phiên đăng nhập được giữ nguyên | P0 | F |

---

## R. Hệ chữ & thành phần theo design system (DS) — 16 case

| ID | Chức năng | Tiền điều kiện | Các bước | Kết quả mong đợi | Ưu tiên | Loại |
|---|---|---|---|---|---|---|
| TC-DS-01 | Nạp font khởi động | Cài mới, xoá cache | Mở app | Hiện vòng quay ngắn rồi vào app; không nháy đổi font giữa chừng | P0 | UI |
| TC-DS-02 | Font toàn app | Đã vào app | Duyệt mọi màn | Toàn bộ chữ là Be Vietnam Pro, không màn nào rơi về font hệ thống | P0 | UI |
| TC-DS-03 | Độ đậm trên Android | Máy Android | So sánh tiêu đề với nội dung | Bốn cấp đậm (400/500/600/700) phân biệt rõ, không bị làm đậm giả | P0 | UI |
| TC-DS-04 | Font lỗi tải | Chặn mạng lúc mở lần đầu | Mở app | App vẫn vào được bằng font hệ thống, không treo ở màn chờ | P1 | NEG |
| TC-DS-05 | Thang chữ header | Trang chủ | Đo cỡ chữ | Lời chào 12 · Tên 18 · Ngày 12, đúng thang trong Figma | P1 | UI |
| TC-DS-06 | Nhãn tab IN HOA | — | Quan sát thanh tab | 4 nhãn viết hoa, có giãn chữ, tab đang chọn đậm hơn và đổi màu | P1 | UI |
| TC-DS-07 | Segmented khoét vai | Cá nhân | Quan sát | Track emerald, mục đang chọn là mảng nền card cắt vào track bằng đường cong chữ S, rộng hơn ở mép trên | P0 | UI |
| TC-DS-08 | Segmented đổi mục | Cá nhân | Chạm lần lượt 4 mục | Mảng chọn nhảy đúng ô, ranh giới trùng đúng 1/4 bề rộng, nhãn không bị hình che | P0 | F |
| TC-DS-09 | Segmented 2 mục | Tab Web | Chạm Hồ sơ / Dự án | Ranh giới nằm đúng giữa, hình đối xứng | P1 | UI |
| TC-DS-10 | Tương phản segmented | — | Đo chữ trắng trên track | ≥ 4.5:1; nhãn mục đang chọn ≥ 4.5:1 trên nền card | P0 | A11y |
| TC-DS-11 | Thẻ KPI | Trang chủ | Quan sát 4 thẻ chỉ số | Bo góc 14, nhãn trên cùng + icon phải, số 26px đậm, phụ chú xám bên cạnh | P1 | UI |
| TC-DS-12 | Số dài không vỡ thẻ | Số dư âm hàng trăm nghìn | Quan sát thẻ Số dư | Hiện dạng rút gọn ("-150K", "12,4 tr", "1,3 tỷ"), không bị cắt cụt ở mép thẻ | P0 | UI |
| TC-DS-15 | Thẻ nội dung dài không tràn | Sự kiện có tên rất dài + huy hiệu trạng thái | Quan sát thẻ trên dòng thời gian | Tên cắt bằng "…", huy hiệu hiện đủ, thẻ nằm trọn trong lề màn hình | P0 | UI |
| TC-DS-16 | Rãnh lõm thanh tab | — | Soi kỹ khu vực quanh nút logo | Đường cong mượt hai bên, không có góc gãy hay khối vuông; đổi độ sâu rãnh trong token vẫn giữ được độ mượt | P1 | UI |
| TC-DS-13 | Hàng nhãn / giá trị | Màn có InfoRow | Quan sát | Nhãn trái xám, giá trị phải đậm; ô thiếu dữ liệu hiện "—" chứ không để trống | P1 | UI |
| TC-DS-14 | Thanh tiến độ | Nơi có Progress | Quan sát | Cao 5px, bo pill, phần chạy đúng tỉ lệ, đọc được bởi trình đọc màn hình | P2 | A11y |

---

## Bảng tổng hợp

| Nhóm | Số case | P0 | P1 | P2 |
|---|---|---|---|---|
| A. Xác thực | 16 | 10 | 5 | 1 |
| B. Điều hướng & thanh tab | 14 | 9 | 4 | 1 |
| C. Hệ thống giao diện | 16 | 4 | 12 | 0 |
| D. Trang chủ | 14 | 5 | 9 | 0 |
| E. Lịch làm việc | 22 | 10 | 9 | 3 |
| F. Form sự kiện | 15 | 6 | 8 | 1 |
| G. Công việc | 12 | 7 | 5 | 0 |
| H. Ghi chú | 10 | 3 | 6 | 1 |
| I. Thói quen | 10 | 4 | 5 | 1 |
| J. Chi tiêu | 12 | 6 | 6 | 0 |
| K. Hộp thư liên hệ | 14 | 8 | 5 | 1 |
| L. Quản trị website | 12 | 4 | 6 | 2 |
| M. Cài đặt & Google Calendar | 16 | 9 | 7 | 0 |
| N. Thông báo | 10 | 7 | 3 | 0 |
| O. Đồng bộ & offline | 8 | 6 | 2 | 0 |
| P. Tiếp cận & responsive | 12 | 6 | 6 | 0 |
| Q. Hiệu năng & ổn định | 8 | 1 | 5 | 2 |
| R. Hệ chữ & thành phần DS | 16 | 8 | 7 | 1 |
| **Tổng** | **237** | **113** | **110** | **14** |
