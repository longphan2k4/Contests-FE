import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Typography,
  Alert,
  Pagination,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DataGrid from "../../../../../components/DataGrid";
import type { GridColDef } from "@mui/x-data-grid";
import FormAutocompleteFilter from "../../../../../components/FormAutocompleteFilter";

// Interface for student data
interface Student {
  id: number;
  fullName: string;
  studentCode: string;
  email?: string;
  class: {
    id: number;
    name: string;
    school: {
      id: number;
      name: string;
    };
  };
}

interface ListStudentProps {
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
}

// Mock data - replace with actual API call
const mockStudents: Student[] = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    studentCode: "SV001",
    email: "nguyenvana@example.com",
    class: {
      id: 1,
      name: "CNTT1",
      school: {
        id: 1,
        name: "Đại học Công nghệ",
      },
    },
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    studentCode: "SV002",
    email: "tranthib@example.com",
    class: {
      id: 2,
      name: "CNTT2",
      school: {
        id: 1,
        name: "Đại học Công nghệ",
      },
    },
  },
  // Add more mock data as needed
];

export default function ListStudent({
  selectedIds,
  setSelectedIds,
}: ListStudentProps): React.ReactElement {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState<number | undefined>();
  const [classFilter, setClassFilter] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Fetch students data
  const fetchStudents = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // const response = await studentApi.getStudents({
      //   search,
      //   schoolId: schoolFilter,
      //   classId: classFilter,
      //   page,
      //   limit,
      // });
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      let filteredStudents = [...mockStudents];
      
      // Apply search filter
      if (search) {
        filteredStudents = filteredStudents.filter(student =>
          student.fullName.toLowerCase().includes(search.toLowerCase()) ||
          student.studentCode.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Apply school filter
      if (schoolFilter) {
        filteredStudents = filteredStudents.filter(student =>
          student.class.school.id === schoolFilter
        );
      }
      
      // Apply class filter
      if (classFilter) {
        filteredStudents = filteredStudents.filter(student =>
          student.class.id === classFilter
        );
      }
      
      setStudents(filteredStudents);
      setTotalPages(Math.ceil(filteredStudents.length / limit));
    } catch (err) {
      setError("Không thể tải danh sách học sinh");
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  }, [search, schoolFilter, classFilter, limit]);

  useEffect(() => {
    fetchStudents();
  }, [search, schoolFilter, classFilter, page]);

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "STT",
      width: 70,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    {
      field: "studentCode",
      headerName: "Mã sinh viên",
      flex: 1,
    },
    {
      field: "fullName",
      headerName: "Họ và tên",
      flex: 1.5,
    },
    {
      field: "className",
      headerName: "Lớp",
      flex: 1,
      valueGetter: (_, row) => row.class.name,
    },
    {
      field: "schoolName",
      headerName: "Trường",
      flex: 1.5,
      valueGetter: (_, row) => row.class.school.name,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
    },
  ];

  // Get unique schools for filter
  const schools = Array.from(
    new Set(mockStudents.map(s => JSON.stringify({ id: s.class.school.id, name: s.class.school.name })))
  ).map(s => JSON.parse(s));

  // Get classes for selected school
  const classes = schoolFilter
    ? Array.from(
        new Set(
          mockStudents
            .filter(s => s.class.school.id === schoolFilter)
            .map(s => JSON.stringify({ id: s.class.id, name: s.class.name }))
        )
      ).map(c => JSON.parse(c))
    : [];

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Search and Filters */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />

        <FormAutocompleteFilter
          label="Trường học"
          options={[
            { label: "Tất cả", value: "all" },
            ...schools.map(school => ({
              label: school.name,
              value: school.id,
            })),
          ]}
          value={schoolFilter ?? "all"}
          onChange={(val) => {
            setSchoolFilter(val === "all" ? undefined : Number(val));
            setClassFilter(undefined); // Reset class when school changes
          }}
          sx={{ flex: 1 }}
        />

        <FormAutocompleteFilter
          label="Lớp học"
          options={[
            { label: "Tất cả", value: "all" },
            ...classes.map(cls => ({
              label: cls.name,
              value: cls.id,
            })),
          ]}
          value={classFilter ?? "all"}
          onChange={(val) =>
            setClassFilter(val === "all" ? undefined : Number(val))
          }
          disabled={!schoolFilter}
          sx={{ flex: 1 }}
        />
      </Stack>

      {/* Results count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {loading ? "Đang tải..." : `Tìm thấy ${students.length} học sinh`}
          {selectedIds.length > 0 && ` • Đã chọn ${selectedIds.length}`}
        </Typography>
      </Box>

      {/* Student list */}
      <Box sx={{ height: 400, mb: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={students}
            columns={columns}
            getRowId={(row) => row.id}
            selectedIds={selectedIds}
            onSelectChange={(selection) => {
              const idsArray = Array.isArray(selection)
                ? selection
                : Array.from((selection as unknown as { ids: number[] }).ids || []);
              setSelectedIds(idsArray.map(id => Number(id)));
            }}
            checkboxSelection
          />
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
}
