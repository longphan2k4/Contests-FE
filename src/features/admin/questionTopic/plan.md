# Kế hoạch xây dựng Question Topic

## 1. Cấu trúc thư mục
```
src/features/admin/questionTopic/
├── components/
│   ├── QuestionTopicList.tsx
│   ├── QuestionTopicForm.tsx
│   ├── CreateQuestionTopicDialog.tsx
│   ├── EditQuestionTopicDialog.tsx
│   ├── QuestionTopicDetailPopup.tsx
│   ├── QuestionTopicStatusSwitch.tsx
│   └── index.ts
├── hooks/
│   ├── crud/
│   │   ├── useCreateQuestionTopic.ts
│   │   ├── useUpdateQuestionTopic.ts
│   │   ├── useDeleteQuestionTopic.ts
│   │   └── useToggleQuestionTopicActive.ts
│   ├── list/
│   │   └── useQuestionTopicList.ts
│   ├── detail/
│   │   └── useQuestionTopic.ts
│   ├── form/
│   │   └── useQuestionTopicForm.ts
│   └── index.ts
├── pages/
│   ├── QuestionTopicsPage.tsx
│   └── index.ts
├── services/
│   └── questionTopicService.ts
├── types/
│   ├── questionTopic.ts
│   └── index.ts
└── schemas/
    └── questionTopic.schema.ts
```

## 2. Các thành phần chính

### 2.1. Types và Schemas
```typescript
// types/questionTopic.ts
export interface QuestionTopic {
  id: number;
  name: string;
  isActive: boolean;
  questionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionTopicFilter {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// schemas/questionTopic.schema.ts
export const CreateQuestionTopicSchema = z.object({
  name: z.string()
    .min(1, "Tên chủ đề là bắt buộc")
    .min(3, "Tên chủ đề phải có ít nhất 3 ký tự")
    .max(255, "Tên chủ đề không được vượt quá 255 ký tự")
    .trim(),
  isActive: z.boolean().optional().default(true),
});
```

### 2.2. Components

#### QuestionTopicList
- Hiển thị danh sách chủ đề dạng bảng
- Các cột:
  - ID
  - Tên chủ đề
  - Số lượng câu hỏi
  - Trạng thái
  - Thời gian tạo
  - Thao tác (Xem chi tiết, Sửa, Xóa)
- Tính năng:
  - Tìm kiếm theo tên
  - Lọc theo trạng thái
  - Phân trang
  - Sắp xếp theo cột

#### QuestionTopicForm
- Form nhập liệu với các trường:
  - Tên chủ đề
  - Trạng thái hoạt động
- Validation:
  - Tên bắt buộc
  - Độ dài tên từ 3-255 ký tự
  - Hiển thị thông báo lỗi

#### QuestionTopicDetailPopup
- Hiển thị thông tin chi tiết:
  - Thông tin cơ bản
  - Danh sách câu hỏi thuộc chủ đề
  - Thống kê số lượng câu hỏi theo độ khó

### 2.3. Hooks

#### useQuestionTopicList
- Quản lý state danh sách
- Xử lý phân trang
- Xử lý tìm kiếm và lọc
- Refresh dữ liệu

#### useQuestionTopicForm
- Quản lý form state
- Validation
- Xử lý submit

#### useCreateQuestionTopic, useUpdateQuestionTopic
- Gọi API tạo/cập nhật
- Xử lý loading state
- Xử lý lỗi
- Thông báo kết quả

### 2.4. Services

#### questionTopicService.ts
```typescript
export const getQuestionTopics = async (filter?: QuestionTopicFilter) => Promise<QuestionTopicsResponse>;
export const getQuestionTopicById = async (id: number) => Promise<QuestionTopic>;
export const createQuestionTopic = async (data: CreateQuestionTopicInput) => Promise<QuestionTopic>;
export const updateQuestionTopic = async (id: number, data: UpdateQuestionTopicInput) => Promise<QuestionTopic>;
export const deleteQuestionTopic = async (id: number) => Promise<void>;
export const toggleQuestionTopicActive = async (id: number) => Promise<QuestionTopic>;
```

## 3. Luồng xử lý

### 3.1. Tạo mới chủ đề
1. Click nút "Thêm mới"
2. Hiển thị dialog với form
3. Nhập thông tin
4. Validate dữ liệu
5. Gọi API tạo mới
6. Hiển thị thông báo kết quả
7. Refresh danh sách

### 3.2. Chỉnh sửa chủ đề
1. Click nút sửa
2. Hiển thị dialog với form đã điền sẵn
3. Chỉnh sửa thông tin
4. Validate dữ liệu
5. Gọi API cập nhật
6. Hiển thị thông báo kết quả
7. Refresh danh sách

### 3.3. Xem chi tiết
1. Click nút xem chi tiết
2. Hiển thị popup với thông tin chi tiết
3. Hiển thị danh sách câu hỏi thuộc chủ đề

## 4. Thông báo

### 4.1. Thông báo thành công
- Tạo mới: "Tạo chủ đề mới thành công"
- Cập nhật: "Cập nhật chủ đề thành công"
- Xóa: "Xóa chủ đề thành công"
- Kích hoạt/vô hiệu hóa: "Cập nhật trạng thái thành công"

### 4.2. Thông báo lỗi
- Lỗi validation: Hiển thị lỗi cụ thể
- Lỗi API: "Có lỗi xảy ra, vui lòng thử lại"
- Lỗi không tìm thấy: "Không tìm thấy chủ đề"

## 5. UI/UX

### 5.1. Giao diện
- Sử dụng Material-UI components
- Responsive design
- Loading states
- Error states
- Empty states

### 5.2. Tương tác
- Confirm dialog khi xóa
- Tooltip cho các nút
- Disable nút khi đang xử lý
- Auto close dialog sau khi thành công

## 6. Testing

### 6.1. Unit Tests
- Test các hooks
- Test các services
- Test các utils

### 6.2. Integration Tests
- Test luồng tạo mới
- Test luồng chỉnh sửa
- Test luồng xóa
- Test validation

## 7. Tối ưu hóa
- Debounce search input
- Cache API responses
- Lazy loading components
- Error boundary
- Performance monitoring 