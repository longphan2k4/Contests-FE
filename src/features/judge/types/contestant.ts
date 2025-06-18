export interface Contestant {
  registration_number: string;
  status: 'Đang thi' | 'Xác nhận 1' | 'Xác nhận 2';
}

export type TabType = 'Đang thi' | 'Xác nhận 1' | 'Xác nhận 2' | 'Đăng xuất';
export type NotificationType = 'success' | 'error' | 'warning';