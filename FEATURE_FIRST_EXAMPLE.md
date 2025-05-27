# Ví dụ chi tiết về cấu trúc Feature-First

Dưới đây là một ví dụ cụ thể về cách tổ chức tính năng "Contests" (Cuộc thi) theo cấu trúc Feature-First.

## Cấu trúc thư mục

```
src/
├── features/
│   ├── contests/                         # Tính năng Contests
│   │   ├── components/                   # Components của tính năng
│   │   │   ├── ContestCard/              # Component hiển thị thông tin cuộc thi
│   │   │   │   ├── ContestCard.tsx       # File chính của component
│   │   │   │   ├── ContestCard.test.tsx  # File test
│   │   │   │   └── index.ts              # File barrel để export
│   │   │   ├── ContestList/              # Component hiển thị danh sách cuộc thi
│   │   │   │   ├── ContestList.tsx
│   │   │   │   ├── ContestList.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ContestDetail/            # Component hiển thị chi tiết cuộc thi
│   │   │   │   ├── ContestDetail.tsx
│   │   │   │   ├── ContestDetail.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ContestForm/              # Component form tạo/chỉnh sửa cuộc thi
│   │   │   │   ├── ContestForm.tsx
│   │   │   │   ├── ContestForm.test.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts                  # Barrel file export tất cả components
│   │   ├── hooks/                        # Custom hooks
│   │   │   ├── useContestList.ts         # Hook để lấy danh sách cuộc thi
│   │   │   ├── useContestDetail.ts       # Hook để lấy chi tiết cuộc thi
│   │   │   ├── useContestMutation.ts     # Hook để tạo/cập nhật/xóa cuộc thi
│   │   │   └── index.ts                  # Barrel file export tất cả hooks
│   │   ├── pages/                        # Pages của tính năng
│   │   │   ├── ContestListPage/          # Trang danh sách cuộc thi
│   │   │   │   ├── ContestListPage.tsx   # File chính của page
│   │   │   │   ├── ContestListPage.test.tsx # File test
│   │   │   │   └── index.ts              # File barrel để export
│   │   │   ├── ContestDetailPage/        # Trang chi tiết cuộc thi
│   │   │   │   ├── ContestDetailPage.tsx
│   │   │   │   ├── ContestDetailPage.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── CreateContestPage/        # Trang tạo cuộc thi mới
│   │   │   │   ├── CreateContestPage.tsx
│   │   │   │   ├── CreateContestPage.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── EditContestPage/          # Trang chỉnh sửa cuộc thi
│   │   │   │   ├── EditContestPage.tsx
│   │   │   │   ├── EditContestPage.test.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts                  # Barrel file export tất cả pages
│   │   ├── services/                     # API services
│   │   │   ├── contestsApi.ts            # Các hàm gọi API liên quan đến cuộc thi
│   │   │   └── index.ts                  # Barrel file export tất cả services
│   │   ├── types/                        # Type definitions
│   │   │   ├── Contest.ts                # Interface cho đối tượng Contest
│   │   │   ├── ContestParams.ts          # Interface cho các tham số API
│   │   │   └── index.ts                  # Barrel file export tất cả types
│   │   ├── utils/                        # Utilities
│   │   │   ├── contestHelpers.ts         # Các hàm helper
│   │   │   ├── contestValidation.ts      # Các hàm validation
│   │   │   └── index.ts                  # Barrel file export tất cả utils
│   │   ├── constants.ts                  # Các hằng số
│   │   ├── routes.ts                     # Định nghĩa các route của tính năng
│   │   └── index.ts                      # Main barrel file export
│   │
│   └── ...các tính năng khác
└── ...các thư mục khác của dự án
```

## Nội dung các file chính

### 1. `features/contests/types/Contest.ts`

```typescript
export interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  organizerId: string;
  participants: number;
  banner?: string;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ContestListItem {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  participants: number;
  banner?: string;
}
```

### 2. `features/contests/services/contestsApi.ts`

```typescript
import axios from 'axios';
import { Contest, ContestListItem } from '../types';

const API_URL = '/api/contests';

export const getContests = async (): Promise<ContestListItem[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getContestById = async (id: string): Promise<Contest> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createContest = async (contestData: Omit<Contest, 'id' | 'createdAt' | 'updatedAt' | 'participants'>): Promise<Contest> => {
  const response = await axios.post(API_URL, contestData);
  return response.data;
};

export const updateContest = async (id: string, contestData: Partial<Contest>): Promise<Contest> => {
  const response = await axios.put(`${API_URL}/${id}`, contestData);
  return response.data;
};

export const deleteContest = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
```

### 3. `features/contests/hooks/useContestList.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { getContests } from '../services/contestsApi';
import { ContestListItem } from '../types';

export const CONTESTS_QUERY_KEY = 'contests';

export const useContestList = () => {
  return useQuery<ContestListItem[], Error>({
    queryKey: [CONTESTS_QUERY_KEY],
    queryFn: getContests,
  });
};
```

### 4. `features/contests/hooks/useContestDetail.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { getContestById } from '../services/contestsApi';
import { Contest } from '../types';
import { CONTESTS_QUERY_KEY } from './useContestList';

export const useContestDetail = (id: string) => {
  return useQuery<Contest, Error>({
    queryKey: [CONTESTS_QUERY_KEY, id],
    queryFn: () => getContestById(id),
    enabled: !!id,
  });
};
```

### 5. `features/contests/components/ContestCard/ContestCard.tsx`

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { formatDate } from '@/common/utils/dateUtils';
import { ContestListItem } from '../../types';

interface ContestCardProps {
  contest: ContestListItem;
}

export const ContestCard: React.FC<ContestCardProps> = ({ contest }) => {
  const { id, title, startDate, endDate, status, participants, banner } = contest;
  
  const getStatusBadge = () => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="outline">Sắp diễn ra</Badge>;
      case 'active':
        return <Badge variant="success">Đang diễn ra</Badge>;
      case 'completed':
        return <Badge variant="secondary">Đã kết thúc</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-0">
        {banner && (
          <div className="w-full h-40 overflow-hidden">
            <img src={banner} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {getStatusBadge()}
        </div>
        <div className="text-sm text-gray-500">
          <p>Bắt đầu: {formatDate(startDate)}</p>
          <p>Kết thúc: {formatDate(endDate)}</p>
          <p>Số người tham gia: {participants}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link 
          to={`/contests/${id}`} 
          className="w-full text-center bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
        >
          Xem chi tiết
        </Link>
      </CardFooter>
    </Card>
  );
};
```

### 6. `features/contests/components/ContestList/ContestList.tsx`

```tsx
import React from 'react';
import { ContestCard } from '../ContestCard';
import { useContestList } from '../../hooks/useContestList';

export const ContestList: React.FC = () => {
  const { data: contests, isLoading, error } = useContestList();

  if (isLoading) {
    return <div className="text-center p-8">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Có lỗi xảy ra: {error.message}</div>;
  }

  if (!contests || contests.length === 0) {
    return <div className="text-center p-8">Không có cuộc thi nào.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contests.map(contest => (
        <ContestCard key={contest.id} contest={contest} />
      ))}
    </div>
  );
};
```

### 7. `features/contests/pages/ContestListPage/ContestListPage.tsx`

```tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ContestList } from '../../components/ContestList';
import { PageLayout } from '@/layouts/PageLayout';
import { Button } from '@/common/components/ui/button';
import { Link } from 'react-router-dom';

export const ContestListPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Danh sách cuộc thi | Platform Name</title>
      </Helmet>
      <PageLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Danh sách cuộc thi</h1>
            <Link to="/contests/new">
              <Button>Tạo cuộc thi mới</Button>
            </Link>
          </div>
          <ContestList />
        </div>
      </PageLayout>
    </>
  );
};

export default ContestListPage;
```

### 8. `features/contests/pages/ContestDetailPage/ContestDetailPage.tsx`

```tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '@/layouts/PageLayout';
import { useContestDetail } from '../../hooks/useContestDetail';
import { ContestDetail } from '../../components/ContestDetail';

export const ContestDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { data: contest, isLoading, error } = useContestDetail(id);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 text-center">
          <p>Đang tải...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !contest) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 text-center text-red-500">
          <p>Có lỗi xảy ra khi tải thông tin cuộc thi</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{contest.title} | Platform Name</title>
      </Helmet>
      <PageLayout>
        <div className="container mx-auto py-8">
          <ContestDetail contest={contest} />
        </div>
      </PageLayout>
    </>
  );
};

export default ContestDetailPage;
```

### 9. `features/contests/pages/CreateContestPage/CreateContestPage.tsx`

```tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/layouts/PageLayout';
import { ContestForm } from '../../components/ContestForm';
import { Contest } from '../../types';
import { useMutation } from '@tanstack/react-query';
import { createContest } from '../../services/contestsApi';
import { queryClient } from '@/lib/react-query';
import { CONTESTS_QUERY_KEY } from '../../hooks/useContestList';

export const CreateContestPage: React.FC = () => {
  const navigate = useNavigate();
  
  const createContestMutation = useMutation({
    mutationFn: createContest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CONTESTS_QUERY_KEY] });
      navigate(`/contests/${data.id}`);
    },
  });

  const handleSubmit = (contestData: Omit<Contest, 'id' | 'createdAt' | 'updatedAt' | 'participants'>) => {
    createContestMutation.mutate(contestData);
  };

  return (
    <>
      <Helmet>
        <title>Tạo cuộc thi mới | Platform Name</title>
      </Helmet>
      <PageLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8">Tạo cuộc thi mới</h1>
          <ContestForm 
            onSubmit={handleSubmit} 
            isLoading={createContestMutation.isPending}
            error={createContestMutation.error?.message}
          />
        </div>
      </PageLayout>
    </>
  );
};

export default CreateContestPage;
```

### 10. `features/contests/pages/index.ts`

```typescript
export * from './ContestListPage';
export * from './ContestDetailPage';
export * from './CreateContestPage';
export * from './EditContestPage';
```

### 11. `features/contests/index.ts`

```typescript
// Re-export components
export * from './components';

// Re-export hooks
export * from './hooks';

// Re-export pages
export * from './pages';

// Re-export types
export * from './types';

// Re-export services (only if needed outside the feature)
// export * from './services';

// Re-export constants and routes
export * from './constants';
export * from './routes';
```

### 12. `features/contests/routes.ts`

```typescript
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy-loaded pages
const ContestListPage = lazy(() => import('./pages/ContestListPage'));
const ContestDetailPage = lazy(() => import('./pages/ContestDetailPage'));
const CreateContestPage = lazy(() => import('./pages/CreateContestPage'));
const EditContestPage = lazy(() => import('./pages/EditContestPage'));

export const contestsRoutes: RouteObject[] = [
  {
    path: 'contests',
    children: [
      {
        index: true,
        element: <ContestListPage />,
      },
      {
        path: ':id',
        element: <ContestDetailPage />,
      },
      {
        path: 'new',
        element: <CreateContestPage />,
      },
      {
        path: ':id/edit',
        element: <EditContestPage />,
      },
    ],
  },
];
```

## Sử dụng routes trong App.tsx

```tsx
import { Routes, Route, useRoutes } from 'react-router-dom';
import { Suspense } from 'react';
import { contestsRoutes } from './features/contests/routes';
import { authRoutes } from './features/auth/routes';
import { dashboardRoutes } from './features/dashboard/routes';

function App() {
  // Kết hợp tất cả các routes từ các tính năng
  const routes = [
    ...contestsRoutes,
    ...authRoutes,
    ...dashboardRoutes,
    {
      path: '*',
      element: <div>404 - Không tìm thấy trang</div>,
    },
  ];

  // Sử dụng useRoutes hook
  const element = useRoutes(routes);

  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      {element}
    </Suspense>
  );
}

export default App;
```

## Mối quan hệ giữa Pages và Components trong Feature-First

Trong cấu trúc Feature-First, sự phân chia giữa pages và components rất quan trọng:

1. **Pages là điểm vào của tính năng**:
   - Pages là component cấp cao nhất của tính năng, được liên kết với một route cụ thể
   - Mỗi page được truy cập thông qua một URL
   - Pages thường có cấu trúc layout hoàn chỉnh với các thành phần như header, footer, sidebar

2. **Components là các khối xây dựng**:
   - Components là các thành phần UI nhỏ hơn, có thể tái sử dụng
   - Components tập trung vào việc hiển thị và tương tác với dữ liệu
   - Components không biết về routing hay cấu trúc trang web

3. **Mối quan hệ giữa Pages và Components**:
   - Pages sử dụng và kết hợp các components
   - Pages cung cấp dữ liệu cho components thông qua props
   - Pages xử lý logic nghiệp vụ và quản lý trạng thái
   - Components tập trung vào việc hiển thị UI và xử lý tương tác người dùng cấp thấp

4. **Phân chia trách nhiệm**:
   - Pages: Routing, layout, quản lý trạng thái, điều hướng, xử lý dữ liệu
   - Components: Hiển thị UI, tương tác người dùng, kiểm tra hợp lệ đầu vào

Ví dụ minh họa mối quan hệ này:
- `ContestListPage` (Page) sử dụng `ContestList` (Component), cung cấp layout và xử lý điều hướng
- `ContestList` (Component) hiển thị danh sách các `ContestCard` (Component con), tập trung vào hiển thị dữ liệu
- `ContestCard` (Component) chỉ hiển thị thông tin của một cuộc thi, không biết về cấu trúc trang hay routing

## Lợi ích của cấu trúc này

1. **Tính mô-đun cao**: Tất cả các thành phần liên quan đến cuộc thi được đặt trong cùng một thư mục, dễ dàng tìm kiếm và quản lý.

2. **Tái sử dụng**: Components và hooks có thể được tái sử dụng trong cùng một tính năng.

3. **Dễ bảo trì**: Khi cần sửa đổi logic liên quan đến cuộc thi, bạn chỉ cần tìm đến thư mục `contests`.

4. **Phát triển song song**: Các thành viên trong team có thể làm việc trên các tính năng khác nhau mà không gây xung đột.

5. **Tích hợp dễ dàng**: Với file `index.ts` ở mỗi cấp, việc import các thành phần trở nên đơn giản hơn.

6. **Kiểm thử đơn giản**: Mỗi component có file test riêng nằm cùng thư mục với component đó.

7. **Mở rộng dễ dàng**: Khi cần thêm tính năng mới, bạn chỉ cần tạo thêm thư mục tương ứng trong `features`. 