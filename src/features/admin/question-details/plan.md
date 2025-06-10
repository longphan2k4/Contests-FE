# Kế hoạch phát triển tính năng Quản lý gói câu hỏi

## 1. Cấu trúc thư mục
```
src/
  features/
    admin/
      question-details/
        components/
          QuestionDetailList.tsx
          QuestionDetailForm.tsx
          QuestionDetailStats.tsx
        services/
          questionDetailService.ts
          questionDetailStatsService.ts
        types/
          questionDetail.ts
        hooks/
          useQuestionDetails.ts
          useQuestionDetailStats.ts
        pages/
          QuestionDetailListPage.tsx
          QuestionDetailStatsPage.tsx
        schemas/
          questionDetail.schema.ts
          questionDetailStats.schema.ts
```

## 2. Các bước triển khai

### Bước 1: Thiết lập cơ sở
- [ ] Tạo cấu trúc thư mục
- [ ] Tạo các file types
- [ ] Tạo các service cơ bản
- [ ] Tạo các hooks cơ bản

### Bước 2: Phát triển components
- [ ] QuestionDetailList
  - [ ] Hiển thị dạng bảng
  - [ ] Tích hợp kéo thả
  - [ ] Xử lý bật/tắt trạng thái
- [ ] QuestionDetailForm
  - [ ] Form thêm câu hỏi
  - [ ] Validation
  - [ ] Xử lý submit
- [ ] QuestionDetailStats
  - [ ] Hiển thị tổng quan
  - [ ] Tích hợp biểu đồ

### Bước 3: Phát triển pages
- [ ] QuestionDetailListPage
  - [ ] Layout
  - [ ] Tích hợp components
  - [ ] Xử lý routing
- [ ] QuestionDetailStatsPage
  - [ ] Layout
  - [ ] Tích hợp components
  - [ ] Xử lý routing

### Bước 4: Tích hợp API
- [ ] Tích hợp các API endpoints
- [ ] Xử lý lỗi
- [ ] Loading states
- [ ] Error handling

### Bước 5: Testing & Optimization
- [ ] Unit tests
- [ ] Integration tests
- [ ] Performance optimization
- [ ] Code review

## 3. Chi tiết các components

### QuestionDetailList
```typescript
interface QuestionDetailListProps {
  packageId: number;
  onReorder?: (newOrder: QuestionDetail[]) => void;
  onStatusChange?: (id: number, isActive: boolean) => void;
}
```

### QuestionDetailForm
```typescript
interface QuestionDetailFormProps {
  packageId: number;
  onSubmit: (data: QuestionDetailFormData) => void;
  onCancel: () => void;
}
```

### QuestionDetailStats
```typescript
interface QuestionDetailStatsProps {
  packageId?: number;
  timeRange?: 'day' | 'week' | 'month' | 'year';
}
```

## 4. API Endpoints

### Question Details
- GET /api/question-details
- POST /api/question-details
- PUT /api/question-details/{id}
- DELETE /api/question-details/{id}
- PUT /api/question-details/reorder

### Statistics
- GET /api/question-details/stats
- GET /api/question-details/stats/package/{packageId}

## 5. Dependencies cần thêm
```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/sortable": "^7.0.0",
    "recharts": "^2.0.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0"
  }
}
```

### 1. Create Question Detail
**POST** `/api/question-details`

Creates a new relationship between a question and a question package.

**Request Body:**
```json
{
  "questionId": 1,
  "questionPackageId": 1,
  "questionOrder": 1,
  "isActive": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Thêm câu hỏi vào gói thành công",
  "data": {
    "questionId": 1,
    "questionPackageId": 1,
    "questionOrder": 1,
    "isActive": true,
    "createdAt": "2025-06-07T09:00:00.000Z",
    "updatedAt": "2025-06-07T09:00:00.000Z"
  },
  "timestamp": "2025-06-07T09:00:00.000Z"
}
```

**Error Responses:**
- `400`: Invalid input data
- `404`: Question or question package not found
- `409`: Question already exists in package or order already taken

### 2. Get Question Details (List with Pagination)
**GET** `/api/question-details`

Retrieves question details with pagination, filtering, and search capabilities.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `questionId` (number, optional): Filter by question ID
- `questionPackageId` (number, optional): Filter by question package ID
- `isActive` (boolean, optional): Filter by active status
- `search` (string, optional): Search in question content

**Response (200):**
```json
{
  "success": true,
  "message": "Lấy danh sách chi tiết câu hỏi thành công",
  "data": {
    "questionDetails": [
      {
        "questionId": 1,
        "questionPackageId": 1,
        "questionOrder": 1,
        "isActive": true,
        "createdAt": "2025-06-07T09:00:00.000Z",
        "updatedAt": "2025-06-07T09:00:00.000Z",
        "question": {
          "id": 1,
          "title": "Sample Question"
        },
        "questionPackage": {
          "id": 1,
          "name": "Sample Package"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  },
  "timestamp": "2025-06-07T09:00:00.000Z"
}
```

### 3. Get Question Detail by Composite Key
**GET** `/api/question-details/{questionId}/{questionPackageId}`

Retrieves a specific question detail by its composite primary key.

**Path Parameters:**
- `questionId` (number): The question ID
- `questionPackageId` (number): The question package ID

**Response (200):**
```json
{
  "success": true,
  "message": "Lấy chi tiết câu hỏi thành công",
  "data": {
    "questionId": 1,
    "questionPackageId": 1,
    "questionOrder": 1,
    "isActive": true,
    "createdAt": "2025-06-07T09:00:00.000Z",
    "updatedAt": "2025-06-07T09:00:00.000Z",
    "question": {
      "id": 1,
      "title": "Sample Question",
      "content": "Question content here"
    },
    "questionPackage": {
      "id": 1,
      "name": "Sample Package",
      "description": "Package description"
    }
  },
  "timestamp": "2025-06-07T09:00:00.000Z"
}
```

### 4. Update Question Detail
**PUT** `/api/question-details/{questionId}/{questionPackageId}`

Updates an existing question detail relationship.

**Path Parameters:**
- `questionId` (number): The question ID
- `questionPackageId` (number): The question package ID

**Request Body:**
```json
{
  "questionOrder": 2,
  "isActive": false
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cập nhật chi tiết câu hỏi thành công",
  "data": {
    "questionId": 1,
    "questionPackageId": 1,
    "questionOrder": 2,
    "isActive": false,
    "createdAt": "2025-06-07T09:00:00.000Z",
    "updatedAt": "2025-06-07T09:01:00.000Z"
  },
  "timestamp": "2025-06-07T09:01:00.000Z"
}
```

### 5. Delete Question Detail (Soft Delete)
**DELETE** `/api/question-details/{questionId}/{questionPackageId}`

Soft deletes a question detail relationship by setting isActive to false.

**Path Parameters:**
- `questionId` (number): The question ID
- `questionPackageId` (number): The question package ID

**Response (200):**
```json
{
  "success": true,
  "message": "Xóa mềm chi tiết câu hỏi thành công",
  "data": {
    "questionId": 1,
    "questionPackageId": 1,
    "questionOrder": 1,
    "isActive": false,
    "createdAt": "2025-06-07T09:00:00.000Z",
    "updatedAt": "2025-06-07T09:02:00.000Z"
  },
  "timestamp": "2025-06-07T09:02:00.000Z"
}
```

### 6. Delete Question Detail (Hard Delete)
**DELETE** `/api/question-details/{questionId}/{questionPackageId}/hard`

Permanently removes a question detail relationship from the database.

**Path Parameters:**
- `questionId` (number): The question ID
- `questionPackageId` (number): The question package ID

**Response (200):**
```json
{
  "success": true,
  "message": "Xóa cứng chi tiết câu hỏi thành công",
  "timestamp": "2025-06-07T09:03:00.000Z"
}
```

### 7. Bulk Create Question Details
**POST** `/api/question-details/bulk`

Creates multiple question detail relationships in a single request.

**Request Body:**
```json
{
  "questionDetails": [
    {
      "questionId": 1,
      "questionPackageId": 1,
      "questionOrder": 1,
      "isActive": true
    },
    {
      "questionId": 2,
      "questionPackageId": 1,
      "questionOrder": 2,
      "isActive": true
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Tạo hàng loạt chi tiết câu hỏi thành công",
  "data": {
    "created": [
      {
        "questionId": 1,
        "questionPackageId": 1,
        "questionOrder": 1,
        "isActive": true,
        "createdAt": "2025-06-07T09:00:00.000Z",
        "updatedAt": "2025-06-07T09:00:00.000Z"
      },
      {
        "questionId": 2,
        "questionPackageId": 1,
        "questionOrder": 2,
        "isActive": true,
        "createdAt": "2025-06-07T09:00:00.000Z",
        "updatedAt": "2025-06-07T09:00:00.000Z"
      }
    ],
    "summary": {
      "totalRequested": 2,
      "successful": 2,
      "failed": 0
    }
  },
  "timestamp": "2025-06-07T09:00:00.000Z"
}
```

### 8. Reorder Questions in Package
**PUT** `/api/question-details/reorder`

Updates the order of multiple questions within a package.

**Request Body:**
```json
{
  "questionPackageId": 1,
  "questionOrders": [
    {
      "questionId": 1,
      "questionOrder": 3
    },
    {
      "questionId": 2,
      "questionOrder": 1
    },
    {
      "questionId": 3,
      "questionOrder": 2
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Sắp xếp lại thứ tự câu hỏi thành công",
  "data": {
    "updated": [
      {
        "questionId": 1,
        "questionPackageId": 1,
        "questionOrder": 3,
        "isActive": true,
        "updatedAt": "2025-06-07T09:05:00.000Z"
      },
      {
        "questionId": 2,
        "questionPackageId": 1,
        "questionOrder": 1,
        "isActive": true,
        "updatedAt": "2025-06-07T09:05:00.000Z"
      }
    ],
    "summary": {
      "totalRequested": 3,
      "successful": 2,
      "failed": 1
    }
  },
  "timestamp": "2025-06-07T09:05:00.000Z"
}
```

### 9. Get Questions by Package
**GET** `/api/question-details/package/{packageId}`

Retrieves all questions associated with a specific package.

**Path Parameters:**
- `packageId` (number): The question package ID

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `isActive` (boolean, optional): Filter by active status
- `includeInactive` (boolean, optional): Include inactive questions (default: false)

**Response (200):**
```json
{
  "success": true,
  "message": "Lấy danh sách câu hỏi theo gói thành công",
  "data": {
    "packageInfo": {
      "id": 1,
      "name": "Sample Package",
      "description": "Package description"
    },
    "questions": [
      {
        "questionId": 1,
        "questionOrder": 1,
        "isActive": true,
        "question": {
          "id": 1,
          "title": "Question 1",
          "content": "Question content"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 5,
      "itemsPerPage": 10
    }
  },
  "timestamp": "2025-06-07T09:00:00.000Z"
}
```

### 10. Get Packages by Question
**GET** `/api/question-details/question/{questionId}`

Retrieves all packages that contain a specific question.

**Path Parameters:**
- `questionId` (number): The question ID

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `isActive` (boolean, optional): Filter by active status

**Response (200):**
```json
{
  "success": true,
  "message": "Lấy danh sách gói theo câu hỏi thành công",
  "data": {
    "questionInfo": {
      "id": 1,
      "title": "Sample Question",
      "content": "Question content"
    },
    "packages": [
      {
        "questionPackageId": 1,
        "questionOrder": 1,
        "isActive": true,
        "questionPackage": {
          "id": 1,
          "name": "Package 1",
          "description": "Package description"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 3,
      "itemsPerPage": 10
    }
  },
  "timestamp": "2025-06-07T09:00:00.000Z"
}
```

### 11. Get Question Detail Statistics
**GET** `/api/question-details/stats`

Retrieves statistics about question details in the system.

**Query Parameters:**
- `questionPackageId` (number, optional): Filter stats by specific package

**Response (200):**
```json

{
    "success": true,
    "message": "Lấy thống kê chi tiết câu hỏi thành công",
    "data": {
        "totalQuestionDetails": 181,
        "activeQuestionDetails": 181,
        "uniqueQuestions": 35,
        "uniquePackages": 15,
        "averageQuestionsPerPackage": 12.07
    },
    "timestamp": "2025-06-08T05:43:25.043Z"}
```
## 12. Get Statistics by Package
**GET** `/api/question-details/stats?questionPackageId={{questionPackageId}}`

## 13. Get Question Details with Filters
**GET** `/api/question-details?questionPackageId={{questionPackageId}}&isActive=true&page=1&limit=5`

## 6. Timeline dự kiến
1. Thiết lập cơ sở: 1 ngày
2. Phát triển components: 2-3 ngày
3. Phát triển pages: 1-2 ngày
4. Tích hợp API: 2-3 ngày
5. Testing & Optimization: 1-2 ngày

Tổng thời gian: 7-11 ngày

## 7. Lưu ý quan trọng
1. Đảm bảo validation dữ liệu
2. Xử lý các trường hợp lỗi
3. Tối ưu performance
4. Tuân thủ coding standards
