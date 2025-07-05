import React, { useState, useEffect, useCallback, memo } from "react";
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

import CreateAward from "../components/CreateAward";
import ViewAward from "../components/ViewAward";
import EditAward from "../components/EditAward";
import AwardList from "../components/AwardList";
import { useToast } from "../../../../contexts/toastContext";
import ConfirmDeleteMany from "../../../../components/Confirm";
import ConfirmDelete from "../../../../components/Confirm";
//import FormAutocompleteFilter from "../../../../components/FormAutocompleteFilter";
import { useParams } from "react-router-dom";
import { useAwards } from "../hook/useAwards";
import { useCreateAward } from "../hook/useCreate";
import { useUpdate } from "../hook/useUpdate";
//import { useActive } from "../hook/useActive";
import { useDeleteMany } from "../hook/useDeleteMany";
import { useDelete } from "../hook/useDelete";
import AddIcon from "@mui/icons-material/Add";

import {
  type Award,
  type CreateAwardInput,
  type UpdateAwardInput,
  type AwardQuery,
  type pagination,
  type deleteAwardsType,
} from "../types/award.shame";
import SearchIcon from "@mui/icons-material/Search";

const AwardsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [awards, setAwards] = useState<Award[]>([]);
  const [selectedAwardId, setSelectedAwardId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<pagination>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmDeleteMany, setIsConfirmDeleteMany] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const [filter, setFilter] = useState<AwardQuery>({});
  const [selectedAwardIds, setSelectedAwardIds] = useState<number[]>([]);
  const { showToast } = useToast();
  const {
    data: awardsQuery,
    isLoading: isAwardsLoading,
    isError: isAwardsError,
    refetch: refetchAwards,
  } = useAwards(slug || "", filter);

  const { mutate: mutateCreate } = useCreateAward(slug || "");

  const { mutate: mutateUpdate } = useUpdate();

  //const { mutate: mutateActive } = useActive();

  const { mutate: mutateDeleteMany } = useDeleteMany();

  const { mutate: mutateDelete } = useDelete();

  useEffect(() => {
    if (awardsQuery) {
      setAwards(awardsQuery?.data.awards);
      setPagination(awardsQuery?.data.pagination);
    }
  }, [awardsQuery]);

  useEffect(() => {
    refetchAwards();
    document.title = "Quản lý giải thưởng";
  }, []);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const handeDeletes = (ids: deleteAwardsType) => {
    mutateDeleteMany(ids, {
      onSuccess: () => {
        // Hook useDeleteMany đã xử lý invalidation và toast
        setIsConfirmDeleteMany(false);
        setSelectedAwardIds([]);
      },
      onError: (err: unknown) => {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Đã xảy ra lỗi khi xóa giải thưởng";
        showToast(message, "error");
      },
    });
  };

  const handleCreate = (payload: CreateAwardInput) => {
    mutateCreate(payload, {
      onSuccess: () => {
        // Hook useCreateAward đã xử lý invalidation và toast
        setIsCreateOpen(false);
      },
      onError: (err: unknown) => {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Đã xảy ra lỗi khi tạo giải thưởng";
        showToast(message, "error");
      },
    });
  };
  const handleUpdate = (payload: UpdateAwardInput) => {
    if (selectedAwardId) {
      mutateUpdate(
        { id: selectedAwardId, payload },
        {
          onSuccess: () => {
            showToast("Cập nhật giải thưởng thành công", "success");
            refetchAwards();
            setSelectedAwardId(null);
            setIsEditOpen(false);
          },
          onError: (err: unknown) => {
            const message =
              (err as { response?: { data?: { message?: string } } })?.response
                ?.data?.message || "Đã xảy ra lỗi khi cập nhật giải thưởng";
            showToast(message, "error");
          },
        }
      );
    }
  };
  const handleDelete = useCallback(
    (id: number | null) => {
      if (!id) return;
      mutateDelete(id, {
        onSuccess: () => {
          showToast("Xóa giải thưởng thành công", "success");
          refetchAwards();
          setIsConfirmDelete(false);
          setSelectedAwardId(null);
        },
        onError: (error: unknown) => {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Đã xảy ra lỗi khi xóa giải thưởng";
          showToast(message, "error");
        },
      });
    },
    [mutateDelete, showToast]
  );
  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      setSelectedAwardId(id);

      if (type === "delete") {
        setIsConfirmDelete(true);
      }

      if (type === "view") setIsViewOpen(true);
      if (type === "edit") setIsEditOpen(true);
    },
    []
  );
  const hanldConfirmDeleteManyDeletes = () => {
    setIsConfirmDeleteMany(true);
  };

  // Handle missing slug
  if (!slug) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Không tìm thấy thông tin cuộc thi</Alert>
      </Box>
    );
  }

  if (isAwardsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isAwardsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={<Button onClick={() => refetchAwards()}>Thử lại</Button>}
        >
          Không thể tải danh sách giải thưởng
        </Alert>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Quản lý giải thưởng</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Thêm giải thưởng
        </Button>
      </Box>

      {/* User list card */}
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
            sx={{
              flexWrap: "wrap",
              alignItems: { sm: "center" },
              mb: 2,
            }}
          >
            {/* Ô tìm kiếm */}
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
              sx={{
                flex: { sm: 1 },
                minWidth: { xs: "100%", sm: 200 },
              }}
            />

            {/* Nút xoá người */}
            {selectedAwardIds.length > 0 && (
              <Button
                variant="contained"
                color="error"
                onClick={hanldConfirmDeleteManyDeletes}
                sx={{
                  flex: { sm: 1 },
                  width: { xs: "100%", sm: "auto" },
                  whiteSpace: "nowrap",
                }}
              >
                Xoá ({selectedAwardIds.length})
              </Button>
            )}

            {/* Tổng số người dùng */}
            <Box
              sx={{
                ml: { xs: 0, sm: "auto" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                alignSelf={{ xs: "flex-start", sm: "center" }}
              >
                Tổng số: {pagination?.total} giải thưởng
              </Typography>
            </Box>
          </Stack>

          <AwardList
            awards={awards}
            selectedAwardIds={selectedAwardIds}
            setSelectedAwardIds={setSelectedAwardIds}
            onView={id => handleAction("view", id)}
            onEdit={id => handleAction("edit", id)}
            onDelete={id => handleAction("delete", id)}
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
              Trang {filter?.page || 1} / {pagination?.totalPages || 1}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display:
              pagination?.totalPages !== undefined && pagination?.totalPages > 1
                ? "block"
                : "none",
          }}
        >
          <Box className="flex flex-col items-center">
            {" "}
            <Pagination
              count={pagination?.totalPages || 0}
              page={filter?.page ?? 1}
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
        <CreateAward
          isOpen={isCreateOpen}
          onClose={closeCreate}
          onSubmit={handleCreate}
        />

        <ViewAward
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          id={selectedAwardId}
        />

        <EditAward
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          id={selectedAwardId}
          onSubmit={handleUpdate}
        />
      </Box>
      <ConfirmDeleteMany
        open={isConfirmDeleteMany}
        onClose={() => setIsConfirmDeleteMany(false)}
        title="Xác nhận xóa giải thưởng "
        description={`Bạn có chắc xóa ${selectedAwardIds.length} giải thưởng này không`}
        onConfirm={() => handeDeletes({ ids: selectedAwardIds })}
      />

      <ConfirmDelete
        open={isConfirmDelete}
        onClose={() => setIsConfirmDelete(false)}
        title="Xác nhận xóa giải thưởng "
        description={`Bạn có chắc chắn xóa giải thưởng này không`}
        onConfirm={() => handleDelete(selectedAwardId)}
      />
    </Box>
  );
};

export default memo(AwardsPage);
