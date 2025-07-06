# PLAN TÁI CẤU TRÚC HỆ THỐNG ĐIỀU KHIỂN ONLINE

## Tổng quan thay đổi
Gộp hệ thống `control-online` vào `match-control` để tạo một luồng điều khiển đồng bộ, sử dụng slug thay vì ID để đồng nhất với hệ thống hiện tại.

## Flow mới
1. **Admin bấm Start** → Khởi tạo trận đấu (status: `ongoing`)
2. **Admin bấm Hiển thị câu hỏi** → Gửi câu hỏi tới student (không bắt đầu timer)
3. **Admin bấm Play** (trong Điều khiển thời gian) → Bắt đầu timer đồng bộ

---

## 1. BACKEND CHANGES

### 1.1. Xóa Online Control Namespace
**File cần xóa:**
- `src/socket/namespaces/onlineControl.namespace.ts`

**Lý do:** Gộp vào match-control để đồng bộ

### 1.2. Cập nhật Match Control Namespace
**File:** `src/socket/namespaces/matchControl.namespace.ts`

**Thay đổi:**
```typescript
// Thêm logic từ onlineControl vào matchControl
// Sử dụng slug thay vì ID
// Thêm event "onlineControl:joinMatch" vào matchControl namespace
```

### 1.3. Cập nhật Match Events
**File:** `src/socket/events/match.events.ts`

**Thay đổi:**
- **Xóa:** `match:nextQuestion` event (thay bằng `currentQuestion:get có sẵn trong question.events.ts`)
- **Cập nhật:** Sử dụng timer từ `timer.event.ts` thay vì timer tự quản lý
- **Xóa:** Tất cả logic `timerService` và `match:timerUpdated`

**Events mới:**


// Xóa các timer events (dùng timer.event.ts)
// - match:pauseTimer
// - match:resumeTimer  
// - match:updateTimer
```

### 1.4. Cập nhật Timer Events
**File:** `src/socket/events/timer.event.ts`

**Thay đổi:**
- **Thêm:** Support cho online namespace
- **Cập nhật:** Emit tới cả `/match-control` và `/student` namespace
- **Thêm:** Logic đồng bộ timer giữa admin và student

```typescript
// Cập nhật timer:play
io.of("/match-control").to(roomName).emit("timer:update", {
  timeRemaining: matchTimer!.timeRemaining,
});

// THÊM: Emit tới student namespace
io.of("/student").to(roomName).emit("timer:update", {
  timeRemaining: matchTimer!.timeRemaining,
});
```

---

## 2. FRONTEND CHANGES

### 2.1. Xóa Online Control Socket Context
**File cần xóa:**
- `src/contexts/OnlineControlSocketContext.tsx`

**Lý do:** Sử dụng match-control socket thay thế

### 2.2. Cập nhật useAdminSocket Hook
**File:** `src/features/admin/controlsOnline/hooks/useAdminSocket.ts`

**Thay đổi:**
- **Đổi:** Từ `useOnlineControlSocket` sang `useMatchControlSocket`
- **Đổi:** Từ `matchId` sang `matchSlug` trong tất cả events
- **Xóa:** `nextQuestion` function
- **Thay:** `showQuestion` function mới
- **Xóa:** Tất cả timer logic (dùng timer events từ backend)

```typescript
// Thay đổi import
import { useMatchControlSocket } from '@contexts/MatchControlSocketContext';

// Xóa nextQuestion, thêm showQuestion
const showQuestion = useCallback(async (): Promise<SocketResponse> => {
  if (!socket || !match) {
    return { success: false, message: 'Socket không kết nối hoặc thiếu match slug' };
  }

  return new Promise((resolve) => {
    socket.emit('match:showQuestion', { match }, (response: SocketResponse) => {
      console.log('📺 Show question response:', response);
      resolve(response);
    });
  });
}, [socket, match]);

// Xóa timer logic, listen timer events từ backend
```

### 2.3. Cập nhật Controls Online Component
**File:** `src/features/admin/controlsOnline/ControlsOnline.tsx`

**Thay đổi:**
- **Đổi:** Button "Câu Tiếp Theo" → "Hiển Thị Câu Hỏi"
- **Xóa:** Timer logic (sử dụng timer component từ match-control)
- **Thêm:** Integration với timer controls

```tsx
// Thay đổi button
<button
  onClick={handleShowQuestion}
  disabled={...}
  className="..."
>
  <EyeIcon className="h-5 w-5" />
  <span>Hiển Thị Câu Hỏi</span>
</button>

// Thêm timer controls component
<TimerControls matchSlug={match} />
```

### 2.4. Thêm Timer Controls Component
**File mới:** `src/features/admin/controlsOnline/components/TimerControls.tsx`

```tsx
// Component điều khiển timer (play, pause, reset)
// Sử dụng events từ timer.event.ts
```

---

## 3. STUDENT NAMESPACE CHANGES

### 3.1. Cập nhật Student Events
**File:** `src/socket/namespaces/student.namespace.ts`

**Thay đổi:**
- **Listen:** `timer:update` events từ timer.event.ts
- **Listen:** `match:showQuestion` thay vì `match:questionChanged`
- **Cập nhật:** Logic nhận câu hỏi và timer riêng biệt

---

## 4. IMPLEMENTATION STEPS

### Phase 1: Backend Cleanup
1. ✅ Xóa `onlineControl.namespace.ts`
2. ✅ Cập nhật `matchControl.namespace.ts` với logic online
3. ✅ Cập nhật `match.events.ts`:
   - Xóa `match:nextQuestion`
   - Thêm `match:showQuestion`
   - Xóa timer logic

### Phase 2: Timer Integration
1. ✅ Cập nhật `timer.event.ts` support student namespace
2. ✅ Xóa `timerService` từ match.events.ts
3. ✅ Test timer đồng bộ giữa admin và student

### Phase 3: Frontend Refactor
1. ✅ Xóa `OnlineControlSocketContext`
2. ✅ Cập nhật `useAdminSocket` sử dụng match-control
3. ✅ Cập nhật `ControlsOnline` component
4. ✅ Tạo `TimerControls` component

### Phase 4: Student Integration
1. ✅ Cập nhật student namespace listen timer events
2. ✅ Test flow: start → show question → play timer
3. ✅ Verify đồng bộ giữa admin và student

---

## 5. TESTING CHECKLIST

### Flow Testing
- [ ] Admin start match → Status đổi thành "ongoing"
- [ ] Admin show question → Student nhận câu hỏi (timer chưa chạy)
- [ ] Admin play timer → Timer chạy đồng bộ admin/student
- [ ] Admin pause/resume timer → Đồng bộ
- [ ] Admin show next question → Timer reset, question mới

### Edge Cases
- [ ] Multiple admins điều khiển cùng match
- [ ] Student disconnect/reconnect trong timer
- [ ] Network issues handling
- [ ] Timer accuracy validation

---

## 6. ROLLBACK PLAN

### Nếu có vấn đề:
1. **Keep backup** của files gốc
2. **Revert commits** theo từng phase
3. **Restore** online-control namespace nếu cần
4. **Document issues** và fix incrementally

---

## 7. BENEFITS AFTER REFACTOR

1. **Đồng bộ:** Single source of truth cho timer
2. **Maintainable:** Ít duplicate code
3. **Scalable:** Dễ extend features mới
4. **Consistent:** Same slug-based approach
5. **Performance:** Ít socket connections

---

## 8. MIGRATION NOTES

- **Database:** Không thay đổi schema
- **API:** Không thay đổi REST endpoints  
- **Socket Events:** Rename và consolidate
- **Frontend Routes:** Không thay đổi URLs
- **Authentication:** Giữ nguyên logic 