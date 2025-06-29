# Student Socket Architecture

## Tổng quan kiến trúc Socket cho Student

Đã được tối ưu hóa để sử dụng **1 kết nối socket duy nhất** thay vì nhiều kết nối chồng chéo.

## Cấu trúc Hooks

### 1. `useStudentSocket` - Hook chính (Centralized Socket Management)

**Vai trò**: Quản lý kết nối socket duy nhất cho tất cả student features
- ✅ Kết nối duy nhất tới namespace `/student`
- ✅ Xử lý authentication qua httpOnly cookie
- ✅ Auto-reconnection và error handling
- ✅ Cung cấp socket instance cho các hooks khác

**API**:
```typescript
const { 
  socket,           // Socket instance 
  isConnected,      // Connection status
  joinMatchRoom,    // Join specific match room
  leaveMatchRoom,   // Leave match room
  joinMatchForAnswering // Join answer room
} = useStudentSocket();
```

### 2. `useStudentAuth` - Authentication Hook

**Vai trò**: Quản lý authentication, không tạo socket riêng
- ✅ Không có socket connection (chỉ API calls)
- ✅ Login/logout functions
- ✅ Contestant info management

### 3. `useStudentRealTime` - Real-time Updates Hook

**Vai trò**: Nhận real-time updates cho trận đấu
- ✅ Sử dụng socket từ `useStudentSocket`
- ✅ Lắng nghe: match events, timer updates, eliminations
- ✅ Auto join/leave match rooms

**Events nhận được**:
- `match:started` - Trận đấu bắt đầu
- `match:questionChanged` - Câu hỏi thay đổi  
- `match:timerUpdated` - Cập nhật timer
- `match:ended` - Trận đấu kết thúc
- `student:eliminated` - Student bị loại

### 4. `useStudentMatch` - Match Interaction Hook

**Vai trò**: Tương tác với trận đấu (submit answers, get status)
- ✅ Sử dụng socket từ `useStudentSocket`
- ✅ Submit answers, get match status
- ✅ Lắng nghe match events

**Functions**:
- `joinMatch()` - Tham gia trận đấu
- `submitAnswer()` - Gửi câu trả lời
- `getMatchStatus()` - Lấy trạng thái trận đấu

## Luồng hoạt động

```
1. Login → Set httpOnly cookie with accessToken
2. useStudentSocket → Create single socket connection to /student namespace
3. useStudentRealTime → Listen for real-time updates
4. useStudentMatch → Handle match interactions
5. StudentDashboard → Use all hooks together
```

## Lợi ích của cấu trúc mới

### ✅ Đã loại bỏ
- ❌ Multiple socket connections per student
- ❌ Duplicate event listeners  
- ❌ Connection conflicts
- ❌ matchControlSocket (không cần cho student)
- ❌ Chồng chéo namespaces

### ✅ Đã tối ưu
- ✅ Single socket connection per student
- ✅ Centralized connection management
- ✅ Clean separation of concerns
- ✅ Better error handling
- ✅ Reduced server load

## Backend Integration

Backend gửi events tới namespace `/student` cho:
- Match status updates
- Question changes  
- Timer updates
- Eliminations
- Answer submissions

Students chỉ kết nối tới namespace `/student` và nhận tất cả events cần thiết qua kết nối này.

## Debug Logs

Tất cả hooks có debug logs với format:
- `🔗 [STUDENT SOCKET]` - Socket connection logs
- `🎧 [REALTIME HỌC SINH]` - Real-time event logs  
- `🎮 [STUDENT MATCH]` - Match interaction logs
- `🏠 [FE]` - Room join/leave logs

## Files đã được cập nhật

1. ✅ `useStudentSocket.ts` - Simplified to single socket
2. ✅ `useStudentRealTime.ts` - Removed matchControlSocket 
3. ✅ `useStudentMatch.ts` - Use unified socket
4. ✅ `StudentDashboard.tsx` - Works with unified socket
5. ✅ Backend namespaces - Send events to appropriate namespace

## Testing

Để test kết nối socket:
1. Mở Developer Console
2. Login as student
3. Kiểm tra logs:
   - Cookie gửi lên backend
   - Socket connection success 
   - Event listeners registration
   - Real-time events received 