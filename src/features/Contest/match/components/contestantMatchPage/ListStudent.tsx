import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Pagination,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import DataGrid from "../../../../../components/DataGrid";
import type { GridColDef } from "@mui/x-data-grid";

import { type StudentQueryParams } from "../../../contestant/types/contestant.shame";
import { listSchool } from "../../../../admin/class/service/api";
import FormAutocompleteFilter from "../../../../../components/FormAutocompleteFilter";
import SearchIcon from "@mui/icons-material/Search";

import {
  useClassSchoolId,
  useGetListSchool,
  useGetStudent,
} from "../../hook/contestantMatchPage/useContestant";

interface ListStudentProps {
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export interface Student {
  id: number;
  fullName: string;
  studentCode: string;
  isActive: boolean;
  className: string;
}

export interface listSchool {
  id: number;
  name: string;
}

export interface listClass {
  id: number;
  name: string;
}

export type pagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export default function ListStudent({
  selectedIds,
  setSelectedIds,
}: ListStudentProps): React.ReactElement {
  const { slug } = useParams();
  const [filter, setFilter] = useState<StudentQueryParams>({});
  const [stundent, SetStudent] = useState<Student[]>([]);
  const [listSchool, setListSchool] = useState<listSchool[]>([]);
  const [listClass, setlistClass] = useState<listClass[]>([]);
  const [pagination, setPagination] = useState<pagination>({});
  const [schoolId, setSchoolId] = useState<number>(1);
  const { data: studentData } = useGetStudent(filter, slug ?? null);

  const { data: SchoolData } = useGetListSchool();

  const { data: ClassData } = useClassSchoolId(schoolId);

  useEffect(() => {
    if (studentData) {
      SetStudent(studentData.data.students);
      setPagination(studentData.data.pagination);
    }
  }, [studentData]);

  useEffect(() => {
    if (SchoolData) {
      setListSchool(SchoolData.data);
    }
  }, [SchoolData]);

  useEffect(() => {
    if (ClassData) {
      setlistClass(ClassData.data);
    }
  }, [ClassData]);

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "STT",
      width: 70,
      sortable: false,
      filterable: false,
      renderCell: params =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    { field: "fullName", headerName: "Họ và tên", flex: 1 },
    {
      field: "studentCode",
      headerName: "Mã số",
    },
    {
      field: "className",
      headerName: "Lớp",
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          p: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          boxShadow:
            "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          useFlexGap
          flexWrap="wrap"
          sx={{
            alignItems: "stretch",
            mb: 2,
            gap: 2,
          }}
        >
          {/* Tìm kiếm */}
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={filter.search || ""}
            onChange={e =>
              setFilter(prev => ({
                ...prev,
                search: e.target.value,
              }))
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />

          {/* Bộ lọc vòng đấu */}
          <FormAutocompleteFilter
            label="Trường"
            options={[
              { label: "Tất cả", value: "all" },
              ...listSchool.map(s => ({
                label: s.name,
                value: s.id,
              })),
            ]}
            value={schoolId || "all"}
            onChange={(val: string | number | undefined) => {
              const selectedId = val === "all" ? 0 : Number(val);
              setSchoolId(selectedId);
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />

          {/* Bộ lọc trạng thái */}
          <FormAutocompleteFilter
            label="Lớp học"
            options={[
              { label: "Tất cả", value: "all" },
              ...listClass.map(s => ({
                label: s.name,
                value: s.id,
              })),
            ]}
            value={filter.classId ?? "all"}
            onChange={(val: string | number | undefined) =>
              setFilter(prev => ({
                ...prev,
                classId: val === "all" ? undefined : Number(val),
              }))
            }
            sx={{ flex: 1, minWidth: 200 }}
          />

          {selectedIds.length > 0 && (
            <Button
              variant="contained"
              color="error"
              sx={{ width: { xs: "100%", sm: "auto" }, alignSelf: "center" }}
            >
              Thêm ({selectedIds.length})
            </Button>
          )}
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Tổng số: {pagination.total} thí sinh học
          </Typography>
        </Box>
        <DataGrid
          rows={stundent}
          columns={columns}
          getRowId={row => row.id}
          selectedIds={selectedIds}
          onSelectChange={selection => {
            const idsArray = Array.isArray(selection)
              ? selection
              : Array.from((selection as any).ids || []);
            setSelectedIds(idsArray.map(id => Number(id)));
          }}
        />
        <Box>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="page-size-select-label">Hiển thị</InputLabel>
              <Select
                labelId="page-size-select-label"
                value={String(filter.limit || 10)}
                onChange={e => {
                  setFilter(prev => ({
                    ...prev,
                    limit: Number(e.target.value),
                  }));
                  filter.page = 1;
                }}
                label="Hiển thị"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            <Typography>
              Trang {filter.page || 1} / {pagination.totalPages}
            </Typography>
          </Box>
        </Box>
        <Box
          style={{
            display:
              pagination.totalPages !== undefined && pagination.totalPages > 1
                ? "block"
                : "none",
          }}
        >
          <Box className="flex flex-col items-center">
            {" "}
            <Pagination
              count={pagination.totalPages}
              page={filter.page ?? 1}
              color="primary"
              onChange={(_event, value) =>
                setFilter(prev => ({
                  ...prev,
                  page: value,
                }))
              }
              showFirstButton
              showLastButton
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
