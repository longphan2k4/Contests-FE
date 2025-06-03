import type { About } from '../types/about';

export const mockAboutData: About = {
  id: 1,
  schoolName: 'Trường Cao Đẳng Kỹ Thuật Cao Thắng',
  website: 'https://www.caothang.edu.vn/',
  departmentName: 'Khoa Công nghệ thông tin',
  email: 'ktcaothang@caothang.edu.vn',
  fanpage: 'https://www.facebook.com/caothang.edu.vn',
  mapEmbedCode: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.511673046614!2d106.69765159999999!3d10.771813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14e483a602db!2zVHLGsOG7nW5nIENhbyDEkOG6s25nIEvhu7kgVGh14bqtdCBDYW8gVGjhuq9uZw!5e0!3m2!1svi!2s!4v1651890673947!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}; 