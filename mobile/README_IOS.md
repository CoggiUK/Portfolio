# Hướng dẫn Build & Chạy Ứng dụng trên iOS (iPhone / iPad)

Dự án **Tùng Lâm Workspace Mobile** được phát triển trên nền tảng **React Native & Expo SDK 57**, hỗ trợ đầy đủ nền tảng **iOS**. Dưới đây là 4 phương pháp từ đơn giản nhất đến nâng cao để chạy và đóng gói ứng dụng cho iOS:

---

## Cách 1: Chạy trực tiếp trên iPhone thật qua Expo Go (Khuyên dùng khi Dev - Không cần Mac)

> **Ưu điểm:** Cực nhanh, **không cần máy tính Mac**, không cần tài khoản Apple Developer ($99/năm), không cần cài đặt Xcode.

1. **Trên iPhone:** Vào **App Store** tải ứng dụng **Expo Go** (miễn phí).
2. **Trên máy tính phát triển (Linux/Windows):** Mở terminal và chạy:
   ```bash
   cd mobile
   npm start
   ```
3. **Kết nối:**
   - Mở camera của iPhone và quét mã QR hiển thị trên Terminal.
   - Nhấn vào thông báo mở trong Expo Go. Ứng dụng sẽ tải bundle JS và chạy trực tiếp trên iPhone của bạn với đầy đủ tính năng Hot Reload.

---

## Cách 2: Đóng gói Cloud với EAS Build (Build file .ipa / Simulator từ Linux)

> **Ưu điểm:** Build trên hạ tầng máy chủ macOS của Expo trên mây. Bạn có thể trigger trực tiếp từ máy tính Linux hiện tại.

### 2.1. Cài đặt EAS CLI & Đăng nhập
```bash
npm install -g eas-cli
eas login
```

### 2.2. Build bản Simulator (Không cần tài khoản Apple Developer)
Tạo bản build chạy trên iOS Simulator (hoặc đưa lên trình duyệt qua Appetize.io):
```bash
cd mobile
npm run build:ios:sim
# Hoặc: eas build --platform ios --profile preview
```

### 2.3. Build bản cài trên iPhone thật (Internal Distribution .ipa)
```bash
npm run build:ios:device
# Hoặc: eas build --platform ios --profile preview-device
```
*Lưu ý: Yêu cầu đăng nhập tài khoản Apple Developer để Expo tự động cấu hình Certificates & Provisioning Profiles.*

### 2.4. Build bản phát hành App Store / TestFlight
```bash
npm run build:ios:prod
# Hoặc: eas build --platform ios --profile production
```

---

## Cách 3: Tự động Build bằng GitHub Actions (100% Miễn phí, Không cần máy Mac)

Dự án đã được tích hợp sẵn workflow GitHub Actions tại:
[`.github/workflows/ios-build.yml`](../.github/workflows/ios-build.yml)

1. Đẩy code lên GitHub repository của bạn (`git push`).
2. Mở trình duyệt vào GitHub repo -> Tab **Actions**.
3. Chọn workflow **Build iOS App** ở cột trái.
4. Bấm nút **Run workflow** -> Chọn branch và cấu hình (Debug/Release) -> Bấm **Run workflow**.
5. Sau ~10-15 phút, GitHub sẽ hoàn tất build trên máy chủ `macos-14` (Apple Silicon M1) và xuất file zip **`TungLam-Workspace-iOS-Simulator`** tại phần Artifacts để bạn tải về ngay.

---

## Cách 4: Build và chạy cục bộ trên máy tính Mac (Xcode)

Nếu bạn hoặc cộng sự có máy tính Mac:

### 4.1. Tạo thư mục native iOS
```bash
cd mobile
npm run prebuild:ios
# Hoặc: npx expo prebuild --platform ios --clean
```

### 4.2. Cài đặt CocoaPods và mở Xcode
```bash
cd ios
pod install
open TngLmWorkspace.xcworkspace
```

### 4.3. Chạy qua dòng lệnh (Expo CLI)
```bash
cd mobile
npx expo run:ios
```
Lệnh trên sẽ tự động khởi động iOS Simulator và cài ứng dụng lên máy ảo.
