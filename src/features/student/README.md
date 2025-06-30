# Student Feature - Tính năng Thí sinh

## Tổng quan
Tính năng dành cho thí sinh tham gia cuộc thi lập trình với hệ thống trả lời realtime.

## Cấu trúc
```
src/features/student/
├── pages/
│   ├── StudentLogin.tsx        # Trang đăng nhập thí sinh
│   ├── StudentDashboard.tsx    # Dashboard chính của thí sinh
│   ├── StudentWaitingRoom.tsx  # Phòng chờ trước khi thi
│   └── StudentAnswerRoom.tsx   # Phòng thi realtime
├── routes/
│   └── index.tsx              # Routing cho student
├── types/
│   └── index.ts               # Type definitions
└── index.ts                   # Export chính
```

## Routes
- `/student/login` - Đăng nhập thí sinh (Public)
- `/student/dashboard` - Dashboard thí sinh (Protected)
- `/student/waiting/:matchId` - Phòng chờ trận đấu (Protected)  
- `/student/answer/:matchId` - Phòng thi realtime (Protected)

## Components

### 1. StudentLogin
- Form đăng nhập với mã sinh viên và mật khẩu
- Có tính năng "Đăng nhập demo" với dữ liệu mẫu
- Validation form đầy đủ
- UI responsive và thân thiện

### 2. StudentDashboard  
- Hiển thị thông tin cuộc thi hiện tại
- Danh sách trận đấu có thể tham gia
- Thông tin cá nhân thí sinh
- Trạng thái kết nối socket
- Hướng dẫn tham gia

### 3. StudentWaitingRoom
- Hiển thị thông tin chi tiết về trận đấu
- Đếm ngược thời gian bắt đầu
- Thông tin thí sinh và cuộc thi
- Nút vào phòng thi khi sẵn sàng

### 4. StudentAnswerRoom
- Giao diện trả lời câu hỏi realtime
- Timer đếm ngược cho mỗi câu hỏi
- Hiển thị kết quả ngay lập tức (đúng/sai)
- Lịch sử các câu trả lời
- Thanh tiến độ hiển thị vị trí câu hỏi

## Mock Data
Tất cả components hiện tại sử dụng mock data để demo:

### Student Info
```typescript
{
  id: 1,
  fullName: 'Nguyễn Văn An',
  studentCode: 'SV001', 
  email: 'an.nguyen@student.edu.vn',
  university: 'Đại học Bách Khoa Hà Nội',
  major: 'Công nghệ Thông tin'
}
```

### Contest Info
```typescript
{
  id: 1,
  name: 'Cuộc thi Lập trình Olympic 2024',
  description: 'Cuộc thi lập trình dành cho sinh viên toàn quốc',
  status: 'active'
}
```

## Socket Events
Các events socket được sử dụng:

### Outgoing (Client → Server)
- `student:joinMatch` - Tham gia phòng trận đấu
- `student:submitAnswer` - Gửi câu trả lời
- `student:getMatchStatus` - Lấy trạng thái trận đấu

### Incoming (Server → Client)  
- `match:questionUpdate` - Cập nhật câu hỏi mới
- `match:answerResult` - Kết quả câu trả lời (đúng/sai)
- `match:statusUpdate` - Cập nhật trạng thái trận đấu

## Cách sử dụng

### 1. Đăng nhập
- Truy cập `/student/login`
- Nhập mã sinh viên và mật khẩu
- Hoặc sử dụng "Đăng nhập demo"

### 2. Dashboard
- Xem thông tin cuộc thi
- Chọn trận đấu muốn tham gia
- Kiểm tra trạng thái kết nối

### 3. Tham gia trận đấu
- Click "Tham gia" ở trận đấu
- Chờ trong phòng chờ
- Vào phòng thi khi trận đấu bắt đầu

### 4. Trả lời câu hỏi
- Đọc câu hỏi và chọn đáp án
- Submit trong thời gian cho phép
- Xem kết quả ngay lập tức
- Tiếp tục với câu hỏi tiếp theo

## Tích hợp API thực tế

Để tích hợp với backend thực tế, cần thay thế:

1. **AuthContext**: Sử dụng `useAuth` từ `features/auth/hooks/authContext`
2. **API calls**: Thay thế mock data bằng API calls
3. **Socket events**: Kết nối với socket server thật
4. **Error handling**: Xử lý lỗi từ API và socket

## Cần cải thiện

1. **Authentication**: Tích hợp với hệ thống auth hiện có
2. **Error boundaries**: Xử lý lỗi toàn diện
3. **Loading states**: Hiển thị loading khi fetch data
4. **Responsive**: Tối ưu cho mobile
5. **Accessibility**: Hỗ trợ screen reader và keyboard navigation 