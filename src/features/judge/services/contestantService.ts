// export const fetchContestants = async (): Promise<Contestant[]> => {
//   // Thay bằng API call thực tế
//   return [
//     ...Array(50).fill(null).map((_, index) => ({
//       registration_number: String(index + 1).padStart(3, '0'),
//       status: index % 3 === 0 ? 'Đang thi' : index % 3 === 1 ? 'Xác nhận 1' : 'Xác nhận 2',
//     })),
//   ] as Contestant[];
// };
