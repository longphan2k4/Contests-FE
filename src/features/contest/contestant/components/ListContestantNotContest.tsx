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
import DataGrid from "../../../../components/DataGrid";

import {
  type listRound,
  type listStatus,
  type ContestantQueryInput,
} from "../types/contestant.shame";

import FormAutocompleteFilter from "../../../../components/FormAutocompleteFilter";
import SearchIcon from "@mui/icons-material/Search";

import {
  useContestStatus,
  useCreates,
  useGetAllNotContest,
  useGetListContest,
  useGetListRoundByContestId,
  useListRound,
} from "../hook/useContestant";
import { useToast } from "@contexts/toastContext";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormSelect from "@components/FormSelect";
import type { GridColDef } from "@mui/x-data-grid";

interface ListStudentProps {
  tab: number;
  open: boolean;
}

const createContestantSchema = z.object({
  roundId: z.string().min(1, "Vui lòng chọn vòng đấu"),
});

type FormValues = z.infer<typeof createContestantSchema>;

export interface Contestant {
  id: number;
  fullName: string;
  roundName: string;
  status: string;
  studentId: number;
}

export interface listContest {
  id: number;
  name: string;
}

export interface lisRoundByContestId {
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

export default function ListContestantNotContest({
  tab,
  open,
}: ListStudentProps): React.ReactElement {
  const { slug } = useParams();
  const [filter, setFilter] = useState<ContestantQueryInput>({});
  const [contestant, setContestant] = useState<Contestant[]>([]);
  const [listContest, setListContest] = useState<listContest[]>([]);
  const [listStatus, setListStatus] = useState<listStatus[]>([]);
  const [lisRoundByContestId, setlisRoundByContestId] = useState<
    lisRoundByContestId[]
  >([]);
  const [pagination, setPagination] = useState<pagination>({});
  const [contestId, setContestId] = useState<number>(1);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [listRound, setListRound] = useState<listRound[]>([]);

  const { showToast } = useToast();

  const { data: ContestantData, refetch } = useGetAllNotContest(
    filter,
    slug ?? null
  );

  const { data: roundData } = useListRound(slug ?? null);

  const { data: ListContestData } = useGetListContest(slug ?? null);

  const { data: lisRoundByContestIData } =
    useGetListRoundByContestId(contestId);

  const { mutate: mutateCreate } = useCreates();

  const { data: statusData } = useContestStatus();
  useEffect(() => {
    if (roundData) {
      setListRound(roundData.data);
    }
  }, [roundData]);

  useEffect(() => {
    if (ListContestData) {
      setListContest(ListContestData.data);
    }
  }, [ListContestData]);

  useEffect(() => {
    if (lisRoundByContestIData) {
      setlisRoundByContestId(lisRoundByContestIData.data);
    }
  }, [lisRoundByContestIData]);

  useEffect(() => {
    if (statusData?.data?.options?.length) {
      setListStatus(statusData?.data?.options);
    } else {
      setListStatus([]);
    }
  }, [statusData]);

  useEffect(() => {
    if (ContestantData) {
      setContestant(ContestantData.data.Contestantes);
      setPagination(ContestantData.data.pagination);
    }
  }, [ContestantData]);

  useEffect(() => {
    if (tab) {
      setSelectedIds([]);
    }
    refetch();
  }, [tab, open]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createContestantSchema),
  });

  const onSubmit = (data: FormValues) => {
    if (!slug) return;
    if (selectedIds.length <= 0) {
      showToast("Vui lòng chọn sinh viên", "warning");
      return;
    }
    mutateCreate(
      {
        payload: {
          ids: selectedIds,
          roundId: Number(data.roundId),
        },
        slug,
      },
      {
        onSuccess: res => {
          if (!res.success) {
            showToast(res.message || "Có lỗi xảy ra!", "error");
            return;
          }
          if (res.data?.successCount > 0) {
            showToast(
              `Thêm thành công: ${res.data?.successCount || 0}`,
              "success"
            );
          }

          res?.data?.messages?.forEach((msg: any) => {
            if (msg.status === "error") {
              showToast(
                `Thí sinh ID ${msg.studentId}: ${msg.msg || "Lỗi không rõ"}`,
                "error"
              );
            }
          });
          refetch();
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Lỗi không xác định!";
          showToast(message, "error");
          refetch();
        },
      }
    );
    refetch();
  };

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
    { field: "studentId", headerName: "Mã sinh viên", flex: 1 },
    {
      field: "roundName",
      headerName: "Vòng đấu",
    },
    {
      field: "status",
      headerName: "Trạng thái",
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
        <Box>
          {/* Select */}
          <Box className="min-w-[220px]">
            <FormSelect
              id="roundId"
              name="roundId"
              label="Tên vòng đấu"
              control={control}
              error={errors.roundId}
              options={[
                { label: "Chọn trận đấu", value: "" },
                ...listRound.map(r => ({
                  label: r.name,
                  value: String(r.id),
                })),
              ]}
            />
          </Box>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
            className="w-full !my-[8px]"
          >
            Thêm ({selectedIds.length})
          </Button>
        </Box>

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
            label="Cuộc thi"
            options={[
              ...listContest.map(s => ({
                label: s.name,
                value: s.id,
              })),
            ]}
            value={contestId || "all"}
            onChange={(val: string | number | undefined) => {
              const selectedId = val === "all" ? 0 : Number(val);
              setContestId(selectedId);
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />

          {/* Bộ lọc trạng thái */}
          <FormAutocompleteFilter
            label="Vòng đấu"
            options={lisRoundByContestId.map(s => ({
              label: s.name,
              value: s.id,
            }))}
            value={filter.roundId ?? "all"}
            onChange={(val: string | number | undefined) =>
              setFilter(prev => ({
                ...prev,
                roundId: val === "all" ? undefined : Number(val), // ✅ đúng là roundId
              }))
            }
            sx={{ flex: 1, minWidth: 200 }}
          />

          <FormAutocompleteFilter
            label="Trạng thái"
            options={[
              { label: "Tất cả", value: "all" },
              ...listStatus.map(s => ({
                label: s.label,
                value: s.value,
              })),
            ]}
            value={filter.status ?? "all"}
            onChange={(val: string | number | undefined) =>
              setFilter(prev => ({
                ...prev,
                status:
                  val === "all"
                    ? undefined
                    : (val as "compete" | "eliminate" | "advanced"),
              }))
            }
            sx={{ flex: 1, minWidth: 200 }}
          />
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
        {/* <DataGrid /> Tui muốn data Grid này lấy select theo contestant.studentId   */}
        <DataGrid
          rows={contestant}
          columns={columns}
          getRowId={row => row.studentId}
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
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={200}>200</MenuItem>
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
