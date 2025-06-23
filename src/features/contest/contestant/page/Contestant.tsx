import React, { useState, useEffect, useCallback, memo } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  InputAdornment,
} from "@mui/material";
import { Button } from "@mui/material";
import { Pagination } from "@mui/material";

import {
  type UpdateContestantInput,
  type DeleteContestanteInput,
  type ContestantQueryInput,
  // type CreatesContestInput,
  type Contestant,
  type pagination,
  type listStatus,
  type listRound,
} from "../types/contestant.shame";

import CreateContestant from "../components/CreateContestant";
import ViewContestant from "../components/ViewContestant";
import Editecontestant from "../components/EditeContestant";
import Listcontestant from "../components/ListContestant";
import { useToast } from "../../../../contexts/toastContext";
import ConfirmDelete from "../../../../components/Confirm";
import FormAutocompleteFilter from "../../../../components/FormAutocompleteFilter";

import {
  useGetAll,
  useUpdate,
  useDelete,
  useDeletes,
  useContestStatus,
  useListRound,
} from "../hook/useContestant";
import AddIcon from "@mui/icons-material/Add";

import SearchIcon from "@mui/icons-material/Search";

const ContestantPage: React.FC = () => {
  const [contestant, setcontestant] = useState<Contestant[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<pagination>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isComfirmDelete, setIsComfirmDelete] = useState(false);
  const [isComfirmDeleteMany, setIsComfirmDeleteMany] = useState(false);

  const [filter, setFilter] = useState<ContestantQueryInput>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [listStatus, setListStatus] = useState<listStatus[]>([]);
  const [listRound, setListRound] = useState<listRound[]>([]);

  const { showToast } = useToast();
  const { slug } = useParams();

  const {
    data: contestantData,
    isLoading: issLoading,
    isError: issError,
    refetch: refetchs,
  } = useGetAll(filter, slug ?? null);

  const { mutate: mutateUpdate } = useUpdate();

  const { mutate: mutateDelete } = useDelete();

  const { mutate: mutateDeletes } = useDeletes();

  const { data: roundData } = useListRound(slug ?? null);

  const { data: statusData } = useContestStatus();

  useEffect(() => {
    if (roundData) {
      setListRound(roundData.data);
    }
  }, [roundData]);
  useEffect(() => {
    if (statusData?.data?.options?.length) {
      setListStatus(statusData?.data?.options);
    } else {
      setListStatus([]);
    }
  }, [statusData]);

  useEffect(() => {
    if (contestantData) {
      setcontestant(contestantData.data.Contestantes);
      setPagination(contestantData.data.pagination);
    }
  }, [contestantData]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const handeDeletes = (ids: DeleteContestanteInput) => {
    mutateDeletes(ids, {
      onSuccess: data => {
        data.messages.forEach((item: any) => {
          if (item.status === "error") {
            showToast(item.msg, "error");
          } else {
            showToast(item.msg, "success");
          }
        });
        refetchs();
      },
      onError: () => {
        showToast("Xóa thí sinh học thất bại");
      },
    });
  };

  const handleUpdate = (payload: UpdateContestantInput) => {
    if (selectedId) {
      mutateUpdate(
        { id: selectedId, payload },
        {
          onSuccess: () => {
            showToast(`Cập nhật thí sinh thành công`, "success");
            refetchs();
          },
          onError: (err: any) => {
            if (err.response?.data?.message)
              showToast(err.response?.data?.message, "error");
          },
        }
      );
    }
  };

  const handleDelete = useCallback((id: number | null) => {
    if (!id) return;
    mutateDelete(id, {
      onSuccess: () => {
        showToast(`Xóa thí sinh học thành công`);
        refetchs();
      },
      onError: (error: any) => {
        showToast(error.response?.data?.message, "error");
      },
    });
  }, []);

  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      setSelectedId(id);

      if (type === "delete") {
        setIsComfirmDelete(true);
      }
      if (type === "view") setIsViewOpen(true);
      if (type === "edit") setIsEditOpen(true);
    },
    [handleDelete]
  );

  if (issLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (issError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={<Button onClick={() => refetchs}>Thử lại</Button>}
        >
          Không thể tải danh danh sách thí sinh
        </Alert>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Quản lý thí sinh </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Thêm thí sinh
        </Button>
      </Box>

      {/*  list card */}
      <Box
        sx={{
          backgcontestant: "#FFFFFF",
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
            label="Vòng đấu"
            options={[
              { label: "Tất cả", value: "all" },
              ...listRound.map(s => ({
                label: s.name,
                value: s.id,
              })),
            ]}
            value={filter.roundId ?? "all"}
            onChange={(val: string | number | undefined) =>
              setFilter(prev => ({
                ...prev,
                roundId: val === "all" ? undefined : Number(val),
              }))
            }
            sx={{ flex: 1, minWidth: 200 }}
          />

          {/* Trạng thái */}
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

          {/* Nút Xoá nhiều */}
          {selectedIds.length > 0 && (
            <Button
              variant="contained"
              color="error"
              sx={{ width: { xs: "100%", sm: "auto" }, alignSelf: "center" }}
              onClick={() => setIsComfirmDeleteMany(true)}
            >
              Xoá ({selectedIds.length})
            </Button>
          )}
        </Stack>

        {/* Tổng số */}
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

        {/* Danh sách thí sinh */}
        <Listcontestant
          contestants={contestant}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onView={id => handleAction("view", id)}
          onEdit={id => handleAction("edit", id)}
          onDelete={id => handleAction("delete", id)}
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
        <CreateContestant
          isOpen={isCreateOpen}
          onClose={() => {
            closeCreate();
            refetchs();
          }}
        />

        <ViewContestant
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          id={selectedId}
        />

        <Editecontestant
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          id={selectedId}
          onSubmit={handleUpdate}
        />
        <ConfirmDelete
          open={isComfirmDelete}
          title="Xóa thí sinh học"
          onClose={() => setIsComfirmDelete(false)}
          description="Bạn có chắc chắn xóa thí sinh học này không"
          onConfirm={() => handleDelete(selectedId)}
        />

        <ConfirmDelete
          open={isComfirmDeleteMany}
          title="Xóa thí sinh học"
          onClose={() => setIsComfirmDeleteMany(false)}
          onConfirm={() => handeDeletes({ ids: selectedIds })}
        />
      </Box>
    </Box>
  );
};

export default memo(ContestantPage);
