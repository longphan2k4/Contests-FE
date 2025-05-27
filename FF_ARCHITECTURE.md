# Cấu trúc Feature-First cho Dự án

## Feature-First là gì?

Feature-First là một cách tổ chức mã nguồn tập trung vào các tính năng (feature) của ứng dụng thay vì các loại file. Trong kiến trúc này, code được tổ chức thành các module theo từng tính năng, mỗi tính năng sẽ chứa tất cả các thành phần cần thiết (components, hooks, services, utilities, tests...) liên quan đến tính năng đó.

## Lợi ích của Feature-First

- **Dễ bảo trì**: Tất cả code liên quan đến một tính năng được đặt cùng một nơi
- **Dễ mở rộng**: Dễ dàng thêm, sửa hoặc xóa một tính năng mà không ảnh hưởng đến các phần khác
- **Dễ quản lý**: Đơn giản hóa việc phân chia công việc cho các thành viên trong team
- **Dễ hiểu**: Người mới có thể nhanh chóng hiểu được cấu trúc dự án và tìm kiếm code

## Cấu trúc thư mục đề xuất

```
src/
├── assets/             # Tài nguyên tĩnh (hình ảnh, font, etc.)
├── common/             # Các thành phần dùng chung
│   ├── components/     # Components dùng chung
│   ├── hooks/          # Hooks dùng chung
│   ├── types/          # Types và interfaces dùng chung
│   └── utils/          # Hàm tiện ích dùng chung
├── config/             # Cấu hình ứng dụng
├── features/           # Thư mục chứa các tính năng
│   ├── auth/           # Tính năng xác thực
│   │   ├── components/ # Components của tính năng auth
│   │   ├── hooks/      # Hooks của tính năng auth
│   │   ├── pages/      # Pages của tính năng auth
│   │   │   ├── LoginPage/
│   │   │   ├── RegisterPage/
│   │   │   └── index.ts
│   │   ├── services/   # Services của tính năng auth
│   │   ├── types/      # Types của tính năng auth
│   │   ├── utils/      # Utils của tính năng auth
│   │   └── index.ts    # Export các thành phần của tính năng
│   ├── contests/       # Tính năng cuộc thi
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/      # Pages của tính năng contests
│   │   │   ├── ContestListPage/
│   │   │   ├── ContestDetailPage/
│   │   │   ├── CreateContestPage/
│   │   │   └── index.ts
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   └── [other-features]/
├── layouts/            # Các layout của ứng dụng
├── lib/                # Thư viện bên thứ ba và wrappers
├── routes/             # Định nghĩa routing
├── services/           # Services cấp ứng dụng (API client, etc.)
├── store/              # Quản lý state toàn cục (Redux, Zustand, etc.)
├── App.tsx             # Component gốc của ứng dụng
└── main.tsx            # Entry point
```

## Vai trò của thư mục Pages trong Feature-First

Trong cấu trúc Feature-First, thư mục `pages` của mỗi tính năng đóng vai trò đặc biệt quan trọng:

1. **Chứa các trang cụ thể**: Mỗi trang (page) là một thành phần React hoàn chỉnh được liên kết với một route cụ thể.

2. **Kết hợp các components**: Pages sử dụng các components, hooks, services trong cùng một tính năng để tạo ra giao diện hoàn chỉnh.

3. **Phân tách rõ ràng**: Mỗi page nên đặt trong một thư mục riêng với cấu trúc sau:
   ```
   PageName/
   ├── PageName.tsx      # Component chính của trang
   ├── PageName.test.tsx # Tests cho trang
   ├── PageName.css      # Styles (nếu cần)
   └── index.ts          # Export component
   ```

4. **Quản lý routing**: Pages được sử dụng trong file định tuyến (route) của tính năng, thường nằm trong `features/[feature-name]/routes.ts`.

## Áp dụng cho dự án hiện tại

Để chuyển đổi từ cấu trúc hiện tại sang cấu trúc feature-first, chúng ta có thể thực hiện các bước sau:

1. Tạo thư mục `features` trong `src`
2. Xác định các tính năng chính của ứng dụng (auth, contests, users, etc.)
3. Tạo thư mục cho mỗi tính năng trong thư mục `features`
4. Tạo cấu trúc thư mục con cho mỗi tính năng: `components`, `hooks`, `pages`, `services`, `types`, `utils`
5. Di chuyển các components, hooks, services từ các thư mục hiện tại sang thư mục tính năng tương ứng
6. Tạo file `index.ts` trong mỗi tính năng để export các thành phần cần thiết

## Quy tắc khi làm việc với cấu trúc Feature-First

1. **Tính năng phải độc lập**: Mỗi tính năng nên hoạt động độc lập, giảm thiểu sự phụ thuộc vào các tính năng khác
2. **Chia sẻ qua common**: Các thành phần dùng chung nên được đặt trong thư mục `common`
3. **Rõ ràng về ranh giới**: Mỗi tính năng cần có ranh giới rõ ràng về trách nhiệm và phạm vi
4. **Sử dụng barrel file**: Mỗi tính năng nên có file `index.ts` để export các thành phần
5. **Pages là điểm vào của tính năng**: Mỗi tính năng nên có các pages riêng để hiển thị giao diện người dùng

## Kết luận

Cấu trúc Feature-First giúp dự án dễ quản lý, dễ mở rộng và dễ bảo trì hơn. Nó đặc biệt phù hợp với các dự án lớn có nhiều tính năng phức tạp và được phát triển bởi nhiều thành viên. Khi áp dụng đúng, mỗi tính năng sẽ có đầy đủ các thành phần cần thiết, bao gồm cả pages, giúp tính năng đó hoạt động độc lập và dễ dàng tích hợp vào ứng dụng. 