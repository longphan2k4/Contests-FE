# TypeScript Configuration Guide

## Path Mapping

Dự án đã được cấu hình với path mapping để import dễ dàng hơn:

```typescript
// Thay vì
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';

// Bạn có thể dùng
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
```

## Các path đã được cấu hình:

- `@/*` → `src/*` (root của src)
- `@/components/*` → `src/components/*`
- `@/pages/*` → `src/pages/*`
- `@/features/*` → `src/features/*`
- `@/hooks/*` → `src/hooks/*`
- `@/utils/*` → `src/utils/*`
- `@/types/*` → `src/types/*`
- `@/contexts/*` → `src/contexts/*`
- `@/config/*` → `src/config/*`
- `@/assets/*` → `src/assets/*`
- `@/layouts/*` → `src/layouts/*`
- `@/routes/*` → `src/routes/*`
- `@/common/*` → `src/common/*`

## Cập nhật Vite Config

Để Vite nhận diện path mapping, bạn cần cập nhật `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/layouts': path.resolve(__dirname, './src/layouts'),
      '@/routes': path.resolve(__dirname, './src/routes'),
      '@/common': path.resolve(__dirname, './src/common'),
    },
  },
});
```

## Environment Variables

File `src/types/global.d.ts` đã định nghĩa các environment variables:

- `VITE_API_URL`: URL của backend API
- `VITE_SOCKET_URL`: URL của Socket.IO server
- `VITE_APP_TITLE`: Tiêu đề ứng dụng
- `VITE_TINYMCE_API_KEY`: API key cho TinyMCE editor
- `VITE_ENV`: Environment hiện tại

## File Types Support

Các file types đã được hỗ trợ:
- Images: `.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.ico`, `.bmp`
- Styles: `.css`, `.scss`, `.sass`, `.less`, `.styl`

## Strict Mode

TypeScript strict mode đã được bật với các tùy chọn:
- `strict: true`
- `exactOptionalPropertyTypes: true`
- `noImplicitReturns: true`
- `noImplicitOverride: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`

## Testing Configuration

File `tsconfig.test.json` đã được tạo riêng cho testing với Jest/Vitest support.
