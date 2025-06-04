import { faker } from '@faker-js/faker';
import type { School, SchoolFilter, SchoolsResponse } from '../types/school';

// Dữ liệu mẫu để test
const generateMockSchools = (count: number): School[] => {
  const cities = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];
  const districts = ['Quận 1', 'Quận 2', 'Quận 3', 'Hai Bà Trưng', 'Cầu Giấy', 'Thanh Xuân', 'Đống Đa'];
  
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Trường ${faker.company.name()}`,
    code: faker.helpers.fromRegExp(/[A-Z]{3,5}/),
    address: faker.location.streetAddress(),
    city: faker.helpers.arrayElement(cities),
    district: faker.helpers.arrayElement(districts),
    email: faker.internet.email().toLowerCase(),
    phone: `0${faker.string.numeric(9)}`,
    website: faker.internet.url(),
    description: faker.lorem.paragraph(),
    isActive: faker.datatype.boolean(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString()
  }));
};

const mockSchools = generateMockSchools(15);

// Lấy danh sách trường học với bộ lọc và phân trang
export const getSchools = async (filter?: SchoolFilter): Promise<SchoolsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 200)); // Giảm delay xuống còn 200ms

  const page = filter?.page || 0;
  const limit = filter?.limit || 10;
  const start = page * limit;
  const end = start + limit;

  let filteredData = [...mockSchools];

  // Lọc theo thành phố
  if (filter?.city) {
    filteredData = filteredData.filter(school => school.city === filter.city);
  }

  // Lọc theo trạng thái
  if (filter?.isActive !== undefined) {
    filteredData = filteredData.filter(school => school.isActive === filter.isActive);
  }

  // Tìm kiếm
  if (filter?.search) {
    const searchLower = filter.search.toLowerCase();
    filteredData = filteredData.filter(school => 
      school.name.toLowerCase().includes(searchLower) || 
      school.code.toLowerCase().includes(searchLower) ||
      school.address.toLowerCase().includes(searchLower)
    );
  }

  return {
    schools: filteredData.slice(start, end),
    total: filteredData.length,
    page,
    limit
  };
};

// Lấy chi tiết một trường học
export const getSchoolById = async (id: number): Promise<School> => {
  await new Promise(resolve => setTimeout(resolve, 100)); // Giảm delay xuống còn 100ms

  const school = mockSchools.find(school => school.id === id);
  
  if (!school) {
    throw new Error('Không tìm thấy trường học');
  }
  
  return school;
};

// Thêm trường học mới
export const createSchool = async (schoolData: Partial<School>): Promise<School> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Giảm delay xuống còn 300ms
  
  // Tạo ID mới
  const newId = Math.max(...mockSchools.map(s => s.id)) + 1;
  
  const now = new Date().toISOString();
  const newSchool: School = {
    id: newId,
    name: schoolData.name || '',
    code: schoolData.code || '',
    address: schoolData.address || '',
    city: schoolData.city || '',
    district: schoolData.district || '',
    email: schoolData.email || '',
    phone: schoolData.phone || '',
    website: schoolData.website || '',
    description: schoolData.description || '',
    logo: schoolData.logo,
    isActive: schoolData.isActive !== undefined ? schoolData.isActive : true,
    createdAt: now,
    updatedAt: now
  };
  
  // Thêm vào mảng dữ liệu
  mockSchools.push(newSchool);
  
  return newSchool;
};

// Cập nhật trường học
export const updateSchool = async (id: number, schoolData: Partial<School>): Promise<School> => {
  await new Promise(resolve => setTimeout(resolve, 200)); // Giảm delay xuống còn 200ms
  
  const index = mockSchools.findIndex(school => school.id === id);
  
  if (index === -1) {
    throw new Error('Không tìm thấy trường học');
  }
  
  const updatedSchool = {
    ...mockSchools[index],
    ...schoolData,
    updatedAt: new Date().toISOString()
  };
  
  mockSchools[index] = updatedSchool;
  
  return updatedSchool;
};

// Xóa trường học
export const deleteSchool = async (id: number): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200)); // Giảm delay xuống còn 200ms
  
  const index = mockSchools.findIndex(school => school.id === id);
  
  if (index === -1) {
    throw new Error('Không tìm thấy trường học');
  }
  
  mockSchools.splice(index, 1);
}; 