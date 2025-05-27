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

### 7. `features/contests/index.ts`

```typescript
// Re-export components
export * from './components';

// Re-export hooks
export * from './hooks';

// Re-export types
export * from './types';

// Re-export services (only if needed outside the feature)
// export * from './services';

// Re-export constants and routes
export * from './constants';
export * from './routes';
```

### 8. `features/contests/routes.ts`

```typescript
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy-loaded pages
const ContestsPage = lazy(() => import('@/pages/ContestsPage'));
const ContestDetailPage = lazy(() => import('@/pages/ContestDetailPage'));
const CreateContestPage = lazy(() => import('@/pages/CreateContestPage'));
const EditContestPage = lazy(() => import('@/pages/EditContestPage'));

export const contestsRoutes: RouteObject[] = [
  {
    path: 'contests',
    children: [
      {
        index: true,
        element: <ContestsPage />,
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

## Pages sử dụng tính năng Contests

### `pages/ContestsPage.tsx`

```tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ContestList } from '@/features/contests';
import { PageLayout } from '@/layouts/PageLayout';

const ContestsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Danh sách cuộc thi | Platform Name</title>
      </Helmet>
      <PageLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8">Danh sách cuộc thi</h1>
          <ContestList />
        </div>
      </PageLayout>
    </>
  );
};

export default ContestsPage;
```

## Lợi ích của cấu trúc này

1. **Tính mô-đun cao**: Tất cả các thành phần liên quan đến cuộc thi được đặt trong cùng một thư mục, dễ dàng tìm kiếm và quản lý.

2. **Tái sử dụng**: Components và hooks có thể được tái sử dụng trong cùng một tính năng.

3. **Dễ bảo trì**: Khi cần sửa đổi logic liên quan đến cuộc thi, bạn chỉ cần tìm đến thư mục `contests`.

4. **Phát triển song song**: Các thành viên trong team có thể làm việc trên các tính năng khác nhau mà không gây xung đột.

5. **Tích hợp dễ dàng**: Với file `index.ts` ở mỗi cấp, việc import các thành phần trở nên đơn giản hơn.

6. **Kiểm thử đơn giản**: Mỗi component có file test riêng nằm cùng thư mục với component đó.

7. **Mở rộng dễ dàng**: Khi cần thêm tính năng mới, bạn chỉ cần tạo thêm thư mục tương ứng trong `features`. 