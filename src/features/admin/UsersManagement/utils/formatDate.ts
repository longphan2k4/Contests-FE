export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('vi-VN');
};