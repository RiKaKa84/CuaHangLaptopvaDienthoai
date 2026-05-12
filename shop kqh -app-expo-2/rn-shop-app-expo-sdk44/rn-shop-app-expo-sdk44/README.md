# Cửa Hàng Laptop và Điện Thoại (KQH Shop)

## Giới thiệu hệ thống
**KQH Shop** là ứng dụng thương mại điện tử (Mobile App) được xây dựng bằng React Native và Expo. Hệ thống cung cấp nền tảng mua sắm trực tuyến các thiết bị công nghệ như Laptop và Điện thoại, với các tính năng từ tìm kiếm, xem chi tiết, thêm vào giỏ hàng, đặt hàng (hỗ trợ COD và quét mã QR) cho đến trang quản trị dành riêng cho Admin để quản lý sản phẩm và đơn hàng.

## Danh sách thành viên và Phân công nhiệm vụ

| STT | Họ và Tên | Mã sinh viên (MSSV) | Phân công nhiệm vụ |
|:---:|---|---|---|
| 1 | **Nguyễn Đức Quân** | `23810310026` | Thiết kế UI/UX, lập trình giao diện Frontend (Trang chủ, Chi tiết sản phẩm, Giỏ hàng), cấu hình React Navigation. |
| 2 | **Triệu Bảo Khanh** | `23810310013` | Tích hợp Firebase (Auth & Realtime Database), quản lý State bằng Redux (Auth, Cart, Orders), xử lý luồng đặt hàng. |
| 3 | **Vũ Đức Quang Huy** | `23810310036` | Xây dựng màn hình Admin (Quản lý sản phẩm, đơn hàng), tối ưu hóa hiệu năng FlatList, viết tài liệu và kiểm thử hệ thống. |

## Công nghệ sử dụng
- **Frontend App:** React Native, Expo
- **Điều hướng (Navigation):** React Navigation (Stack & Drawer)
- **Quản lý trạng thái (State Management):** Redux, Redux Thunk
- **Backend & Database:** Firebase Authentication, Firebase Realtime Database

## Hướng dẫn cài đặt

1. **Clone mã nguồn về máy:**
   ```bash
   git clone https://github.com/RiKaKa84/CuaHangLaptopvaDienthoai.git
   ```
2. **Di chuyển vào thư mục dự án:**
   Mở Terminal/Command Prompt tại thư mục dự án.
3. **Cài đặt các gói thư viện (Dependencies):**
   ```bash
   npm install
   ```

## Link online đã deploy
- *Hiện tại ứng dụng là Mobile App chạy qua môi trường Expo nội bộ (Local/LAN).*

##  Hướng dẫn chạy project

**Cách 1 (Dành cho Windows):**
- Nhấn đúp chuột vào file `Chay_App.bat` hoặc `ChayApp.bat` có sẵn trong thư mục gốc.

**Cách 2 (Sử dụng Terminal):**
- Mở terminal và chạy lệnh:
  ```bash
  npx expo start -c
  ```
  *(Thêm `-c` để tự động xóa bộ nhớ đệm cache)*

**Cách xem ứng dụng:**
- Tải ứng dụng **Expo Go** trên điện thoại (iOS/Android).
- Dùng camera (trên iOS) hoặc quét mã QR trực tiếp từ app Expo Go (trên Android) để mở ứng dụng.

## Tài khoản Demo

Để tiện cho việc chấm điểm và trải nghiệm hệ thống, vui lòng sử dụng các tài khoản có sẵn dưới đây:

### 1. Tài khoản Admin (Quản lý sản phẩm, đơn hàng, người dùng)
- **Email:** `trieubaokhanh2005@gmail.com`
- **Mật khẩu:** `1234567`

### 2. Tài khoản Người dùng (User - Đặt hàng, Xem giỏ hàng)
*Bạn có thể tự đăng ký một tài khoản mới trực tiếp trên app để vào thẳng hệ thống, hoặc sử dụng tài khoản có sẵn sau:*
- **Email:** `khanh@gmail.com`
- **Mật khẩu:** `1234567`
