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

##  Link online đã deploy
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

##  Tài khoản Demo

Để tiện cho việc chấm điểm và trải nghiệm hệ thống, vui lòng sử dụng các tài khoản có sẵn dưới đây:

### 1. Tài khoản Admin (Quản lý sản phẩm, đơn hàng, người dùng)
- **Email:** `trieubaokhanh2005@gmail.com`
- **Mật khẩu:** `1234567`

### 2. Tài khoản Người dùng (User - Đặt hàng, Xem giỏ hàng)
*Bạn có thể tự đăng ký một tài khoản mới trực tiếp trên app để vào thẳng hệ thống, hoặc sử dụng tài khoản có sẵn sau:*
- **Email:** `khanh@gmail.com`
- **Mật khẩu:** `1234567`

## Project sử dụng Firebase Realtime Database theo kiểu REST endpoint của Firebase (dùng fetch tới URL dạng .../products.json?auth=...).
Frontend API base URL (URL gốc gọi API từ app)
Base URL thực tế nằm ở biến DATABASE_URL trong config.js:
DATABASE_URL được import từ @env
### Trong thực tế khi gọi API, app dùng:
fetch(${config.DATABASE_URL}/.json?auth=${token})
Cho nên project không dùng Swagger/OpenAPI; “Remote API” mà 
app gọi là Firebase Realtime Database REST API (theo pattern /products.json, /orders/...json, /profiles.json),
ví dụ trong store/actions/orders.js:

### GET ${DATABASE_URL}/orders/${userId}.json?auth=${token}
### POST ${DATABASE_URL}/orders/${userId}.json?auth=${token}
### DELETE ${DATABASE_URL}/orders/${userId}/${orderId}.json?auth=${token}
### GET ${DATABASE_URL}/orders.json?auth=${token} (admin)
### PATCH ${DATABASE_URL}/orders/${userId}/${orderId}.json?auth=${token} (admin)

Kết luận: Frontend API base URL = DATABASE_URL (Firebase Realtime Database base URL)

- Toàn bộ API đã sử dụng trong project
1) Products
GET ${DATABASE_URL}/products.json?auth=${token}
GET ${DATABASE_URL}/products/${id}.json?auth=${token}
(nếu có trong file gọi chi tiết sản phẩm—cần kiểm tra thêm ở store/actions/products.js)

2) Orders
POST ${DATABASE_URL}/orders/${userId}.json?auth=${token}
(thường body là object order)
GET ${DATABASE_URL}/orders/${userId}.json?auth=${token}
(nếu action có load order—cần kiểm tra thêm trong store/actions/orders.js)
3) Profiles
GET ${DATABASE_URL}/profiles.json?auth=${token} (từ ví dụ trong ON_THI_VAN_DAP_CODE.md và thường được dùng trong app)
hoặc các biến thể theo path profile tuỳ implement (cần đối chiếu thêm trong store/actions/profile.js)

4) DELETE
DELETE ${DATABASE_URL}/orders/${userId}/${orderId}.json?auth=${token}
Xóa đơn hàng theo userId + orderId.

5) GET
GET ${DATABASE_URL}/orders/${userId}.json?auth=${token}
Lấy toàn bộ orders của user hiện tại.
Code duyệt resData theo key và map thành Order(...).

6)POST
POST ${DATABASE_URL}/orders/${userId}.json?auth=${token}
Tạo đơn hàng mới.
Body JSON chứa:
cartItems, totalAmount, date, address, paymentMethod, status
status hiện đang set mặc định là 'warehouse'.

### Orders (admin)
7)  GET (all users)
GET ${DATABASE_URL}/orders.json?auth=${token}
Lấy toàn bộ orders của tất cả user.
Code duyệt: for (const userId in resData) for (const orderId in resData[userId]) ...
Sau đó sort theo date giảm dần.

8) PATCH (admin: update status)
PATCH ${DATABASE_URL}/orders/${userId}/${orderId}.json?auth=${token}
Body JSON: { status: newStatus }

## Toàn bộ dữ liệu thêm sản phẩm và người dùng đều ở trong Firebase Realtime Data của Google:
<img width="1916" height="1080" alt="2026-05-12 21_55_26-" src="https://github.com/user-attachments/assets/360592ff-df06-44d0-864c-604c15b0d729" />
<img width="1920" height="1080" alt="2026-05-12 21_55_50-" src="https://github.com/user-attachments/assets/d46425bc-0061-4c96-ad79-455eb0040392" />


## Ảnh Sản Phẩm trên màn hình

<img width="1320" height="2868" alt="z7816558072959_bfa45af2fe6462ff95c0cb417d599fe3" src="https://github.com/user-attachments/assets/fd8a3f16-78fd-4514-ab98-0868c7138f15" />
<img width="1320" height="2868" alt="z7816558641254_64dddde670b99c9a8cd3ef537f86678f" src="https://github.com/user-attachments/assets/acae8461-3b03-4fc4-afed-65a305badfa3" />
<img width="1320" height="2868" alt="z7818331797354_d2a9736df8603a055556a357676a76e0" src="https://github.com/user-attachments/assets/4d2497a3-48ff-4b1b-865a-c17e8d03f65d" />
<img width="1320" height="2868" alt="z7816558931187_404eed87f13cc0a89ab788c29e10232b" src="https://github.com/user-attachments/assets/91e7f88b-00f6-44e5-b863-c3e21afadac9" />
<img width="1320" height="2868" alt="z7818169881605_ca2a56e770e85b4b405186fab2c7e95c" src="https://github.com/user-attachments/assets/fcbb3395-cf29-40f1-8233-c3ce0dec71ba" />
<img width="1320" height="2868" alt="z7818180977207_21c33bb4af5ce6fc1be2f67150a85325" src="https://github.com/user-attachments/assets/d3f171fa-f91b-4c14-bd6f-eeedbcdca9d5" />
<img width="1320" height="2868" alt="z7818188094444_c0a3760faa1d93425d1629f14923aab0" src="https://github.com/user-attachments/assets/e12da223-d073-4e27-8a19-5e2c2c09844c" />
<img width="1320" height="2868" alt="z7818208378231_0c4b4eccb2a7aa4e8da6de6e28178328" src="https://github.com/user-attachments/assets/72f7c383-e624-473d-924b-ae77517fcd7d" />
<img width="1320" height="2868" alt="z7818205566522_ccf4cbf1773dd52afff7e7f7cc99b636" src="https://github.com/user-attachments/assets/73c6bd29-073f-4e18-8779-97312c1361e1" />








