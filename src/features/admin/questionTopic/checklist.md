# Checklist thực hiện Question Topic

## 1. Cấu trúc thư mục
- [x] Tạo cấu trúc thư mục cơ bản
- [x] Tạo các file components
- [x] Tạo các file hooks
- [x] Tạo các file services
- [x] Tạo các file types và schemas

## 2. Types và Schemas
- [x] Định nghĩa interface QuestionTopic
- [x] Định nghĩa interface QuestionTopicFilter
- [x] Tạo CreateQuestionTopicSchema
- [x] Tạo UpdateQuestionTopicSchema
- [x] Tạo QuestionTopicIdSchema
- [x] Tạo QuestionTopicQuerySchema

## 3. Components
### QuestionTopicList
- [x] Tạo component cơ bản
- [x] Thêm DataGrid
- [x] Thêm các cột hiển thị
- [x] Thêm chức năng tìm kiếm
- [x] Thêm chức năng lọc
- [x] Thêm phân trang
- [x] Thêm sắp xếp
- [x] Thêm các nút thao tác

### QuestionTopicForm
- [ ] Tạo form cơ bản
- [ ] Thêm các trường input
- [ ] Thêm validation
- [ ] Thêm xử lý submit
- [ ] Thêm hiển thị lỗi

### CreateQuestionTopicDialog
- [ ] Tạo dialog cơ bản
- [ ] Tích hợp QuestionTopicForm
- [ ] Thêm xử lý đóng/mở
- [ ] Thêm loading state
- [ ] Thêm thông báo kết quả

### EditQuestionTopicDialog
- [ ] Tạo dialog cơ bản
- [ ] Tích hợp QuestionTopicForm
- [ ] Thêm xử lý đóng/mở
- [ ] Thêm loading state
- [ ] Thêm thông báo kết quả

### QuestionTopicDetailPopup
- [ ] Tạo popup cơ bản
- [ ] Hiển thị thông tin chi tiết
- [ ] Hiển thị danh sách câu hỏi
- [ ] Thêm thống kê
- [ ] Thêm xử lý đóng/mở

### QuestionTopicStatusSwitch
- [ ] Tạo component switch
- [ ] Thêm xử lý toggle
- [ ] Thêm loading state
- [ ] Thêm thông báo kết quả

## 4. Hooks
### useQuestionTopicList
- [x] Tạo hook cơ bản
- [x] Thêm state management
- [x] Thêm xử lý phân trang
- [x] Thêm xử lý tìm kiếm
- [x] Thêm xử lý lọc
- [x] Thêm refresh data

### useQuestionTopicForm
- [ ] Tạo hook cơ bản
- [ ] Thêm form state
- [ ] Thêm validation
- [ ] Thêm xử lý submit
- [ ] Thêm xử lý lỗi

### CRUD Hooks
- [x] useCreateQuestionTopic
- [x] useUpdateQuestionTopic
- [x] useDeleteQuestionTopic
- [x] useToggleQuestionTopicActive

## 5. Services
- [x] Tạo service cơ bản
- [x] Thêm getQuestionTopics
- [x] Thêm getQuestionTopicById
- [x] Thêm createQuestionTopic
- [x] Thêm updateQuestionTopic
- [x] Thêm deleteQuestionTopic
- [x] Thêm toggleQuestionTopicActive

## 6. Pages
- [ ] Tạo QuestionTopicsPage
- [ ] Tích hợp QuestionTopicList
- [ ] Tích hợp các dialog
- [ ] Thêm xử lý routing
- [ ] Thêm loading state
- [ ] Thêm error handling



## 8. Tối ưu hóa
- [ ] Thêm debounce cho search
- [ ] Thêm cache cho API responses
- [ ] Thêm lazy loading
- [ ] Thêm error boundary
- [ ] Thêm performance monitoring

## 9. Documentation
- [ ] Viết README
- [ ] Thêm comments cho code
- [ ] Viết hướng dẫn sử dụng
- [ ] Cập nhật API documentation

## 10. Review
- [ ] Code review
- [ ] UI/UX review
- [ ] Performance review
