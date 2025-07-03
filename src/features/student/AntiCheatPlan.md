# Kế hoạch phát triển tính năng phòng chống gian lận thí sinh

## 1. Phân tích yêu cầu
- [x] Xác định các hình thức gian lận phổ biến (chuyển tab, copy/paste, chụp màn hình, sử dụng phần mềm thứ 3, v.v.)
- [x] Tham khảo các giải pháp phòng chống gian lận hiện có trên thị trường

## 2. Đề xuất giải pháp kỹ thuật
- [x] Cảnh báo khi thí sinh chuyển tab hoặc thu nhỏ cửa sổ
- [x] Ngăn chặn thao tác copy/paste trong bài thi
- [x] Ghi nhận log các sự kiện bất thường (chuyển tab, mất kết nối, v.v.)
- [ ] Chụp ảnh webcam định kỳ (nếu có yêu cầu)
- [x] Phát hiện và cảnh báo khi mở nhiều cửa sổ/thiết bị
- [x] Hiển thị cảnh báo cho thí sinh khi vi phạm

## 3. Thiết kế UI/UX
- [x] Thiết kế giao diện cảnh báo cho thí sinh
- [ ] Thiết kế giao diện quản trị để xem log/phát hiện gian lận

## 4. Phát triển tính năng
- [x] Triển khai phát hiện chuyển tab/ẩn cửa sổ
- [x] Triển khai chặn copy/paste
- [x] Ghi log sự kiện và lưu trữ server
- [x] Tích hợp cảnh báo realtime cho thí sinh
- [ ] Tích hợp giao diện quản trị log

## 5. Kiểm thử & Đánh giá
- [x] Viết test case cho các tình huống gian lận
- [x] Kiểm thử trên nhiều trình duyệt, thiết bị
- [ ] Đánh giá hiệu quả và tối ưu giải pháp

## 6. Triển khai & Hướng dẫn sử dụng
- [x] Cập nhật tài liệu hướng dẫn cho thí sinh và admin
- [ ] Đào tạo, phổ biến tính năng mới 

## ✅ Đã hoàn thành:

### 🔧 Core Components:
- **useAntiCheat Hook**: Custom hook quản lý toàn bộ logic chống gian lận
- **AntiCheatWarning Component**: Giao diện cảnh báo thân thiện cho thí sinh  
- **StudentAnswerRoom**: Trang làm bài với tích hợp đầy đủ tính năng chống gian lận
- **AntiCheatDemo**: Component demo để test và kiểm thử các tính năng

### 🛡️ Tính năng Bảo mật:
- ✅ **Fullscreen bắt buộc**: Tự động vào fullscreen khi bắt đầu thi
- ✅ **Phát hiện chuyển tab**: Detect khi thí sinh chuyển tab/ứng dụng
- ✅ **Chặn Copy/Paste**: Ngăn chặn Ctrl+C/V/X
- ✅ **Chặn Context Menu**: Ngăn chặn chuột phải
- ✅ **Chặn Developer Tools**: Ngăn chặn F12, Ctrl+Shift+I
- ✅ **Phát hiện ESC**: Detect khi nhấn phím ESC
- ✅ **Phát hiện mất focus**: Detect khi minimize/chuyển app
- ✅ **Hệ thống cảnh báo**: 3 lần vi phạm → kết thúc bài thi

### 📱 Tương thích Cross-platform:
- ✅ **Web (Desktop)**: Chrome, Firefox, Edge, Safari
- ✅ **Mobile Support**: Responsive design cho tablet/mobile
- ✅ **Multi-browser**: Sử dụng API chuẩn và fallback cho các trình duyệt

### Hướng dẫn kiểm thử khi chỉ có 1 máy local
- [x] Sử dụng nhiều trình duyệt (Chrome, Firefox, Edge) trên cùng máy để kiểm tra các tính năng phát hiện gian lận.
- [x] Mở nhiều tab/cửa sổ cùng lúc để kiểm tra phát hiện chuyển tab, mở nhiều cửa sổ.
- [x] Sử dụng chế độ ẩn danh/incognito để kiểm tra phát hiện đăng nhập nhiều phiên.
- [x] Thay đổi kích thước cửa sổ, thu nhỏ/minimize để kiểm tra cảnh báo.
- [x] Thực hiện thao tác copy/paste, chụp màn hình để kiểm tra tính năng chặn.
- [x] Ngắt kết nối mạng tạm thời để kiểm tra log sự kiện mất kết nối.
- [ ] Nếu có tính năng webcam, dùng vật che camera hoặc tắt camera để kiểm tra cảnh báo.

## 🚀 Cách sử dụng:

### 1. Import và sử dụng useAntiCheat Hook:
```typescript
import { useAntiCheat } from '../hooks/useAntiCheat';

const {
  violations,
  warningCount,
  isFullscreen,
  startMonitoring,
  stopMonitoring,
  maxViolations
} = useAntiCheat(config, onViolation, onTerminate);
```

### 2. Demo và Test:
- Truy cập component `AntiCheatDemo` để test đầy đủ tính năng
- Thử nghiệm các hành động: ESC, Alt+Tab, Ctrl+C/V, F12, chuột phải
- Quan sát log và cảnh báo realtime

### 3. Tích hợp vào trang thi:
- Sử dụng `StudentAnswerRoom` làm template
- Tự động vào fullscreen khi bắt đầu
- Hiển thị cảnh báo khi vi phạm
- Kết thúc bài thi khi vượt quá giới hạn vi phạm

## 📋 Files đã tạo:

```
src/features/student/
├── hooks/
│   └── useAntiCheat.ts                 # Core hook chống gian lận
├── components/
│   ├── AntiCheatWarning.tsx           # Component cảnh báo
│   └── AntiCheatDemo.tsx              # Component demo/test
├── pages/
│   └── StudentAnswerRoom.tsx          # Trang làm bài với anti-cheat
└── routes/
    └── index.tsx                      # Updated routes
```

## 🎯 Tính năng chính đã implement:

1. **🔒 Fullscreen Protection**: Bắt buộc fullscreen, phát hiện thoát
2. **🚫 Input Blocking**: Chặn copy/paste, context menu, dev tools
3. **👁️ Activity Monitoring**: Theo dõi chuyển tab, mất focus, phím ESC
4. **⚠️ Smart Warnings**: Hệ thống cảnh báo 3 cấp độ với UI thân thiện
5. **📊 Logging System**: Ghi nhận đầy đủ vi phạm với timestamp
6. **🎮 Demo Interface**: Công cụ test và demo đầy đủ chức năng 