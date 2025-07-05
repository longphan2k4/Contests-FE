# QuestionAnswer Component Structure

## Tổng quan
Component `QuestionAnswer` đã được tách thành các component nhỏ hơn để dễ quản lý và debug.
lưu ý : QuestionAnswer để backup
## Cấu trúc Component

### Component Chính
- **QuestionAnswer.tsx** - Component gốc (1402 dòng)
- **QuestionAnswerRefactored.tsx** - Component đã tách, sử dụng các component con

### Component Con (Đã Tách)

#### 1. QuestionHeader.tsx
- **Chức năng**: Hiển thị header với timer và thông tin câu hỏi
- **Props**:
  - `questionOrder`: Số thứ tự câu hỏi
  - `remainingTime`: Thời gian còn lại
  - `defaultTime`: Thời gian mặc định
  - `score`: Điểm số
  - `difficulty`: Độ khó
  - `questionType`: Loại câu hỏi

#### 2. QuestionContent.tsx
- **Chức năng**: Hiển thị nội dung câu hỏi và media
- **Props**:
  - `intro`: Phần giới thiệu
  - `content`: Nội dung câu hỏi
  - `media`: Danh sách media
  - `onMediaClick`: Callback khi click media

#### 3. QuestionOptions.tsx
- **Chức năng**: Hiển thị các lựa chọn trả lời
- **Props**:
  - `options`: Danh sách lựa chọn
  - `selectedAnswer`: Đáp án đã chọn
  - `isSubmitted`: Đã submit chưa
  - `isEliminated`: Bị loại chưa
  - `isBanned`: Bị cấm chưa
  - `answerResult`: Kết quả câu trả lời
  - `canShowResult`: Có thể hiển thị kết quả chưa
  - `onAnswerSelect`: Callback khi chọn đáp án
  - `onSubmitAnswer`: Callback khi submit

#### 4. QuestionResult.tsx
- **Chức năng**: Hiển thị kết quả câu trả lời
- **Props**:
  - `answerResult`: Kết quả câu trả lời
  - `selectedAnswer`: Đáp án đã chọn
  - `canShowResult`: Có thể hiển thị kết quả chưa
  - `pendingResult`: Kết quả tạm thời
  - `isSubmitted`: Đã submit chưa

#### 5. AntiCheatStatus.tsx
- **Chức năng**: Hiển thị trạng thái chống gian lận
- **Props**:
  - `isMonitoring`: Đang giám sát không
  - `isFullscreen`: Toàn màn hình không
  - `warningCount`: Số lần cảnh báo
  - `maxViolations`: Số lần vi phạm tối đa

#### 6. OtherStudentNotification.tsx
- **Chức năng**: Thông báo thí sinh khác trả lời
- **Props**:
  - `showNotification`: Hiển thị thông báo không
  - `latestAnswer`: Thông tin đáp án mới nhất
  - `onClose`: Callback khi đóng thông báo

#### 7. MediaGrid.tsx
- **Chức năng**: Grid hiển thị media tối ưu cho mobile
- **Props**:
  - `mediaList`: Danh sách media
  - `onMediaClick`: Callback khi click media
  - `currentQuestionMediaCount`: Số lượng media của câu hỏi hiện tại

#### 8. MediaModal.tsx
- **Chức năng**: Modal xem media tối ưu cho mobile
- **Props**:
  - `selectedMedia`: Media được chọn
  - `isOpen`: Modal mở không
  - `onClose`: Callback khi đóng modal

## Lợi ích của việc tách component

### 1. Dễ Debug
- Mỗi component có trách nhiệm rõ ràng
- Có thể debug từng phần riêng biệt
- Dễ dàng tìm lỗi trong component cụ thể

### 2. Dễ Quản lý
- Code ngắn gọn, dễ đọc
- Mỗi component có thể được test riêng
- Dễ dàng thay đổi logic của từng phần

### 3. Tái sử dụng
- Các component con có thể được sử dụng ở nơi khác
- Dễ dàng thay đổi UI mà không ảnh hưởng logic

### 4. Performance
- Chỉ re-render component cần thiết
- Tối ưu hóa render cho từng phần

## Cách sử dụng

### Sử dụng component gốc
```tsx
import { QuestionAnswer } from './components';

<QuestionAnswer 
  currentQuestion={currentQuestion}
  remainingTime={remainingTime}
  // ... other props
/>
```

### Sử dụng component đã tách
```tsx
import { QuestionAnswerRefactored } from './components';

<QuestionAnswerRefactored 
  currentQuestion={currentQuestion}
  remainingTime={remainingTime}
  // ... other props
/>
```

### Sử dụng component con riêng lẻ
```tsx
import { QuestionHeader, QuestionContent } from './components';

<QuestionHeader 
  questionOrder={1}
  remainingTime={60}
  // ... other props
/>

<QuestionContent 
  content="Nội dung câu hỏi"
  // ... other props
/>
```

## Lưu ý
- Logic chính vẫn được giữ nguyên trong `QuestionAnswerRefactored`
- UI được tách thành các component nhỏ
- Props được truyền xuống các component con
- Callback được truyền lên component cha 