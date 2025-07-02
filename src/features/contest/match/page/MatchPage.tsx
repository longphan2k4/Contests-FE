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
  type CreateMatchInput,
  type UpdateMatchInput,
  type DeleteMatchInput,
  type MatchQueryInput,
  type listStatus,
  type listRound,
  type pagination,
  type Match,
} from "../types/match.shame";

import CreateMatch from "../components/CreateMatch";
import ViewMatch from "../components/ViewMatch";
import EditeMatch from "../components/EditeMatch";
import ListMatch from "../components/ListMatch";
import { useToast } from "../../../../contexts/toastContext";
import ConfirmDelete from "../../../../components/Confirm";
import FormAutocompleteFilter from "../../../../components/FormAutocompleteFilter";

import {
  useGetAll,
  useCreate,
  useUpdate,
  useDelete,
  useDeletes,
  useStatus,
  useListRound,
  useToggleIsActive,
} from "../hook/useMatch";
import AddIcon from "@mui/icons-material/Add";

import SearchIcon from "@mui/icons-material/Search";

const MatchPage: React.FC = () => {
  const [Match, setMatch] = useState<Match[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<pagination>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isComfirmDelete, setIsComfirmDelete] = useState(false);
  const [isComfirmDeleteMany, setIsComfirmDeleteMany] = useState(false);

  const [filter, setFilter] = useState<MatchQueryInput>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [listRound, setListRound] = useState<listRound[]>([]);
  const [listStatus, setListStatus] = useState<listStatus[]>([]);

  const { showToast } = useToast();
  const { slug } = useParams();

  const {
    data: MatchData,
    isLoading: issLoading,
    isError: issError,
    refetch: refetchs,
  } = useGetAll(filter, slug ?? null);

  useEffect(() => {
    document.title = "Quản lý trận đấu";
  }, []);

  const { mutate: mutateCreate } = useCreate();

  const { mutate: mutateUpdate } = useUpdate();

  const { mutate: mutateDelete } = useDelete();

  const { mutate: mutateDeletes } = useDeletes();

  const { mutate: mutateToggleIsActive } = useToggleIsActive();

  const { data: roundData } = useListRound(slug ?? null);

  const { data: statusData } = useStatus();

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
    if (MatchData) {
      setMatch(MatchData.data.matches);
      setPagination(MatchData.data.pagination);
    }
  }, [MatchData]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const handeDeletes = (ids: DeleteMatchInput) => {
    mutateDeletes(ids, {
      onSuccess: data => {
        data.messages.forEach((item: { status: string; msg: string }) => {
          if (item.status === "error") {
            showToast(item.msg, "error");
          } else {
            showToast(item.msg, "success");
          }
        });
        refetchs();
      },
      onError: () => {
        showToast("Xóa trận đấu học thất bại");
      },
    });
  };

  const handleCreate = (payload: CreateMatchInput) => {
    mutateCreate(
      { payload: payload, slug: slug ?? null },
      {
        onSuccess: () => {
          showToast(`Thêm trận đấu thành công`, "success");
          refetchs();
        },
        onError: (err: unknown) => {
          const message = (
            err as { response?: { data?: { message?: string } } }
          )?.response?.data?.message;
          if (message) {
            showToast(message, "error"); // nên là "error" thay vì "success"
          }
        },
      }
    );
  };

  const handleUpdate = (payload: UpdateMatchInput) => {
    if (selectedId) {
      mutateUpdate(
        { id: selectedId, payload },
        {
          onSuccess: () => {
            showToast(`Cập nhật trận đấu thành công`, "success");
            refetchs();
          },
          onError: (err: unknown) => {
            const message = (
              err as { response?: { data?: { message?: string } } }
            )?.response?.data?.message;
            if (message) showToast(message, "error");
          },
        }
      );
    }
  };

  const toggleActive = useCallback((id: number) => {
    mutateToggleIsActive(id, {
      onSuccess: () => {
        showToast(`Cập nhật trạng thái thành công`, "success");
        refetchs();
        setSelectedId(null);
      },
      onError: (err: unknown) => {
        const message = (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message;
        if (message) showToast(message, "error");
      },
    });
  }, []);

  const handleDelete = useCallback((id: number | null) => {
    if (!id) return;
    mutateDelete(id, {
      onSuccess: () => {
        showToast(`Xóa trận đấu học thành công`);
        refetchs();
      },
      onError: (error: unknown) => {
        const message = (
          error as { response?: { data?: { message?: string } } }
        )?.response?.data?.message;
        if (message) showToast(message, "error");
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
          Không thể tải danh danh sách trận đấu
        </Alert>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Quản lý trận đấu </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Thêm trận đấu
        </Button>
      </Box>

      {/*  list card */}
      <Box
        sx={{
          backgMatch: "#FFFFFF",
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
                    : (val as "upcoming" | "ongoing" | "finished"),
              }))
            }
            sx={{ flex: 1, minWidth: 200 }}
          />

          {/* Trạng thái hoạt động */}
          <FormAutocompleteFilter
            label="Trạng thái"
            options={[
              { label: "Tất cả", value: "all" },
              { label: "Hoạt động", value: "active" },
              { label: "Không hoạt động", value: "inactive" },
            ]}
            value={
              filter.isActive === undefined
                ? "all"
                : filter.isActive
                ? "active"
                : "inactive"
            }
            onChange={val => {
              setFilter(prev => ({
                ...prev,
                isActive:
                  val === "all"
                    ? undefined
                    : val === "active"
                    ? true
                    : val === "inactive"
                    ? false
                    : undefined,
              }));
            }}
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
            Tổng số: {pagination.total} trận đấu học
          </Typography>
        </Box>

        {/* Danh sách trận đấu */}
        <ListMatch
          matchs={Match}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onView={id => handleAction("view", id)}
          onEdit={id => handleAction("edit", id)}
          onDelete={id => handleAction("delete", id)}
          onToggle={id => toggleActive(id)}
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
                    page: 1, // Reset to page 1 when changing limit
                  }));
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
        <CreateMatch
          isOpen={isCreateOpen}
          onClose={closeCreate}
          onSubmit={handleCreate}
        />

        <ViewMatch
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          id={selectedId}
        />

        <EditeMatch
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          id={selectedId}
          onSubmit={handleUpdate}
        />
        <ConfirmDelete
          open={isComfirmDelete}
          title="Xóa trận đấu học"
          onClose={() => setIsComfirmDelete(false)}
          description="Bạn có chắc chắn xóa trận đấu học này không"
          onConfirm={() => handleDelete(selectedId)}
        />

        <ConfirmDelete
          open={isComfirmDeleteMany}
          title="Xóa trận đấu học"
          onClose={() => setIsComfirmDeleteMany(false)}
          onConfirm={() => handeDeletes({ ids: selectedIds })}
        />
      </Box>
    </Box>
  );
};

export default memo(MatchPage);
