import { useState } from 'react';
import { faker } from '@faker-js/faker';
import SearchableTable from '../../components/SearchableTable';
import TableActionButton from '../../components/TableActionButton';
import ViewDetailPopup from '../../components/ViewDetailPopup';
import EditPopup from '../../components/EditPopup';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { type Candidate } from '../types/types';
import AddPopup from '../../components/AddPopup';
import { type FieldConfig } from '../../components/AddPopup';
import { Box } from '@mui/material';
import Button from '../../components/Button';
import SelectFilter from '../../components/Select';


const generateMockCandidates = (count: number): Candidate[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: `0${faker.string.numeric(9)}`,
    address: faker.location.streetAddress(),
    birthday: faker.date
      .birthdate({ min: 18, max: 35, mode: 'age' })
      .toISOString()
      .split('T')[0],
    gender: faker.helpers.arrayElement(['Nam', 'Nữ', 'Khác']),
  }));
};

const mockData: Candidate[] = generateMockCandidates(50);

const ContestantsManage = () => {
  const [data, setData] = useState<Candidate[]>(mockData);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | undefined>(undefined);
  const [filteredData, setFilteredData] = useState<Candidate[]>(mockData); 
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [addOpen, setAddOpen] = useState(false);

const fields: FieldConfig<Candidate>[] = [
  { label: 'Tên', field: 'name', type: 'text' },
  { label: 'Email', field: 'email', type: 'email' },
  { label: 'Số điện thoại', field: 'phone', type: 'tel' },
  { label: 'Địa chỉ', field: 'address', type: 'text' },
  { label: 'Ngày sinh', field: 'birthday', type: 'date' },
  { label: 'Giới tính', field: 'gender', type: 'text' },
];


  const handleEditSave = (updatedCandidate: Candidate) => {
    setData((prev) =>
      prev.map((item) => (item.id === updatedCandidate.id ? updatedCandidate : item))
    );
  };
  const handleAddCandidate = (newCandidate: Candidate) => {
    setData((prev) => [...prev, { ...newCandidate, id: prev.length + 1 }]);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Tên thí sinh', flex: 1 },
    {
      field: 'action',
      headerName: 'Hành động',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Candidate>) => (
        <TableActionButton
          onView={() => {
            setSelectedCandidate(params.row);
            setDetailOpen(true);
          }}
          onEdit={() => {
            setSelectedCandidate(params.row);
            setEditOpen(true);
          }}
        />
      ),
    },
  ];


  return (
    <>    
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
            <SelectFilter<Candidate>
                label="Lọc theo giới tính"
                field="gender"
                options={['Nam', 'Nữ', 'Khác']}
                data={data}
                onFilter={setFilteredData}
            />
            <Button color="primary" onClick={() => setAddOpen(true)}>
                Thêm thí sinh
            </Button>
        </Box>
      <AddPopup<Candidate>
        open={addOpen}
        onClose={() => setAddOpen(false)}
        fields={fields}
        onAdd={handleAddCandidate}
        title="Thêm thí sinh mới"
        />
      <SearchableTable
        data={filteredData}
        columns={columns}
        getRowId={(row) => row.id}
        searchField="name"
        />
      <ViewDetailPopup
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        record={selectedCandidate}
        fields={fields}
        title="Chi tiết thí sinh"
        />
      <EditPopup<Candidate>
        open={editOpen}
        onClose={() => setEditOpen(false)}
        record={selectedCandidate}
        onSave={handleEditSave}
        fields={fields}
        />
    </>
  );
};

export default ContestantsManage;
