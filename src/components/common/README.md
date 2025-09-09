# Error Components

Các component xử lý lỗi cho hệ thống Survey Management.

## Components

### OrganizationErrorModal
Component chuyên dụng để hiển thị lỗi khi user không thuộc organization được phép truy cập.

**Props:**
- `onGoHome: () => void` - Callback khi click nút "Về trang chủ"
- `onTryAgain?: () => void` - Callback khi click nút "Thử lại" (optional)
- `errorMessage?: string` - Thông báo lỗi (optional, có default)

**Sử dụng:**
```tsx
import { OrganizationErrorModal } from './components/common';

<OrganizationErrorModal
  onGoHome={() => navigate("/")}
  onTryAgain={() => window.location.reload()}
  errorMessage="Tài khoản của bạn không thuộc tổ chức được phép truy cập."
/>
```

### GeneralErrorModal
Component chung để hiển thị các lỗi khác.

**Props:**
- `onGoHome: () => void` - Callback khi click nút "Về trang chủ"
- `onTryAgain?: () => void` - Callback khi click nút "Thử lại" (optional)
- `errorMessage?: string` - Thông báo lỗi (optional, có default)
- `title?: string` - Tiêu đề lỗi (optional, có default)

**Sử dụng:**
```tsx
import { GeneralErrorModal } from './components/common';

<GeneralErrorModal
  onGoHome={() => navigate("/")}
  onTryAgain={() => window.location.reload()}
  errorMessage="Đã xảy ra lỗi trong quá trình xác thực."
  title="Lỗi xác thực"
/>
```

## Utility Functions

### authErrorUtils.ts
Các utility function để phân loại và xử lý lỗi Auth0.

**Functions:**
- `getErrorType(error: Auth0Error): string` - Phân loại lỗi
- `getErrorMessage(error: Auth0Error, errorType: string): string` - Lấy thông báo lỗi
- `getErrorTitle(errorType: string): string` - Lấy tiêu đề lỗi

**Các loại lỗi được hỗ trợ:**
- `organization` - Lỗi không thuộc organization
- `network` - Lỗi kết nối mạng
- `authentication` - Lỗi xác thực
- `authorization` - Lỗi phân quyền
- `general` - Lỗi chung

**Sử dụng:**
```tsx
import { getErrorType, getErrorMessage, getErrorTitle } from './utils/authErrorUtils';

const errorType = getErrorType(error);
const errorMessage = getErrorMessage(error, errorType);
const errorTitle = getErrorTitle(errorType);
```

## Error Test Page

Component `ErrorTestPage` được tạo để test các loại lỗi khác nhau trong development.

**Lưu ý:** Chỉ sử dụng trong môi trường development.

## Features

- **Responsive Design**: Tương thích với mọi kích thước màn hình
- **Dark Mode Support**: Hỗ trợ chế độ tối
- **Animation**: Sử dụng Framer Motion cho animation mượt mà
- **Accessibility**: Tuân thủ các tiêu chuẩn accessibility
- **TypeScript**: Được viết bằng TypeScript với type safety

## Styling

Các component sử dụng Chakra UI với:
- Consistent color scheme
- Proper spacing và typography
- Hover effects và transitions
- Box shadows và border radius

## Integration

Các component này được tích hợp vào `Callback.tsx` để xử lý lỗi Auth0 một cách tự động dựa trên loại lỗi. 