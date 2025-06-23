import React, { useState, useEffect, useCallback, memo, use } from "react";
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
  type RoundQueryInput,
  type CreateRoundInput,
  type UpdateRoundInput,
  type DeleteRoundsInput,
  type pagination,
  type Rounds,
} from "../types/round.shame";

import CreateRound from "../components/CreateRound";
import ViewRound from "../components/ViewRound";
import EditeRound from "../components/EditeRound";
import ListRound from "../components/ListRound";
import { useToast } from "../../../../contexts/toastContext";
import ConfirmDelete from "../../../../components/Confirm";
import FormAutocompleteFilter from "../../../../components/FormAutocompleteFilter";

import {
  useGetAll,
  useCreate,
  useUpdate,
  useDelete,
  useDeletes,
  useToggleIsActive,
} from "../hook/useRound";
import AddIcon from "@mui/icons-material/Add";

import SearchIcon from "@mui/icons-material/Search";

const RoundPage: React.FC = () => {
  const [round, setRound] = useState<Rounds[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<pagination>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isComfirmDelete, setIsComfirmDelete] = useState(false);
  const [isComfirmDeleteMany, setIsComfirmDeleteMany] = useState(false);

  const [filter, setFilter] = useState<RoundQueryInput>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { showToast } = useToast();
  const { slug } = useParams();

  const {
    data: roundData,
    isLoading: issLoading,
    isError: issError,
    refetch: refetchs,
  } = useGetAll(filter, slug ?? null);

  const { mutate: mutateCreate } = useCreate();

  const { mutate: mutateUpdate } = useUpdate();

  const { mutate: mutateToggleIsActive } = useToggleIsActive();

  const { mutate: mutateDelete } = useDelete();

  const { mutate: mutateDeletes } = useDeletes();

  useEffect(() => {
    if (roundData) {
      setRound(roundData.data.rounds);
      setPagination(roundData.data.pagination);
    }
  }, [roundData]);

  useEffect(() => {
    refetchs();
    document.title = "Quản lý vòng đấu";
  }, [refetchs, slug]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const toggleActive = useCallback((id: number) => {
    mutateToggleIsActive(id, {
      onSuccess: () => {
        showToast(`Cập nhật trạng thái thành công`, "success");
        refetchs();
        setSelectedId(null);
      },
      onError: (err: any) => {
        showToast(err.response?.data?.message, "error");
      },
    });
  }, []);

  const handeDeletes = (ids: DeleteRoundsInput) => {
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
        showToast("Xóa vòng đấu học thất bại");
      },
    });
  };

  const handleCreate = (payload: CreateRoundInput) => {
    const data = {
      name: payload.name,
      index: payload.index,
      isActive: payload.isActive,
      startTime: new Date(payload.startTime).toISOString(),
      endTime: new Date(payload.endTime).toISOString(),
    };

    mutateCreate(
      { payload: data, slug: slug ?? null },
      {
        onSuccess: () => {
          showToast(`Thêm vòng đấu thành công`, "success");
          refetchs();
        },
        onError: (err: any) => {
          if (err.response?.data?.message) {
            showToast(err.response?.data?.message, "error"); // nên là "error" thay vì "success"
          }
        },
      }
    );
  };

  const handleUpdate = (payload: UpdateRoundInput) => {
    if (selectedId) {
      mutateUpdate(
        { id: selectedId, payload },
        {
          onSuccess: () => {
            showToast(`Cập nhật vòng đấu thành công`, "success");
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
        showToast(`Xóa vòng đấu học thành công`);
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
          Không thể tải danh danh sách vòng đấu
        </Alert>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Quản lý vòng đấu </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Thêm vòng đấu
        </Button>
      </Box>

      {/*  list card */}
      <Box
        sx={{
          background: "#FFFFFF",
          p: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          boxShadow:
            "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
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
                      : undefined, // fallback nếu Autocomplete trả undefined
                }));
              }}
              sx={{ flex: 1, minWidth: 200 }}
            />

            {selectedIds.length > 0 && (
              <Button
                variant="contained"
                color="error"
                sx={{ flex: 1, minWidth: 200 }}
                onClick={() => setIsComfirmDeleteMany(true)}
              >
                Xoá ({selectedIds.length})
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
              Tổng số: {pagination.total} vòng đấu
            </Typography>
          </Box>

          <ListRound
            rounds={round}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onView={id => handleAction("view", id)}
            onEdit={id => handleAction("edit", id)}
            onDelete={id => handleAction("delete", id)}
            onToggle={toggleActive}
          />
        </Box>

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
        <CreateRound
          isOpen={isCreateOpen}
          onClose={closeCreate}
          onSubmit={handleCreate}
        />

        <ViewRound
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          id={selectedId}
        />

        <EditeRound
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          id={selectedId}
          onSubmit={handleUpdate}
        />
        <ConfirmDelete
          open={isComfirmDelete}
          title="Xóa vòng đấu học"
          onClose={() => setIsComfirmDelete(false)}
          description="Bạn có chắc chắn xóa vòng đấu học này không"
          onConfirm={() => handleDelete(selectedId)}
        />

        <ConfirmDelete
          open={isComfirmDeleteMany}
          title="Xóa vòng đấu học"
          onClose={() => setIsComfirmDeleteMany(false)}
          onConfirm={() => handeDeletes({ ids: selectedIds })}
        />
      </Box>
    </Box>
  );
};

export default memo(RoundPage);
