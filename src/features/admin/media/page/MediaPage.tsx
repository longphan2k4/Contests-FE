import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { Button } from "@mui/material";
import { Pagination } from "@mui/material";

import CreateMedia from "../components/CreateMedia";
import ViewMedia from "../components/ViewMedia";
import EditMedia from "../components/EditMedia";
import MediaList from "../components/MediaList";
import { useToast } from "../../../../contexts/toastContext";
import ConfirmDeleteMany from "../../../../components/Confirm";
import ConfirmDelete from "../../../../components/Confirm";
//import FormAutocompleteFilter from "../../../../components/FormAutocompleteFilter";
import { useParams } from "react-router-dom";
import { useMedias } from "../hook/useMedias";
import { useCreateMedia } from "../hook/useCreate";
import { useUpdate } from "../hook/useUpdate";
//import { useActive } from "../hook/useActive";
import { useDeleteMany } from "../hook/useDeleteMany";
import { useDelete } from "../hook/useDelete";
import AddIcon from "@mui/icons-material/Add";

import {
  type MediaItem,
  type CreateMediaInput,
  type UpdateMediaInput,
  type pagination,
  type MediaQuery,
  type DeleteMediasType,
} from "../types/media.shame";
import FormAutocompleteFilter from "@components/FormAutocompleteFilter";

const MediaPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [medias, setMedias] = useState<MediaItem[]>([]);
  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<pagination>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmDeleteMany, setIsConfirmDeleteMany] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const [filter, setFilter] = useState<MediaQuery>({});
  const [selectedMediaIds, setSelectedMediaIds] = useState<number[]>([]);
  const { showToast } = useToast();
  const {
    data: mediasQuery,
    isLoading: isMediasLoading,
    isError: isMediasError,
    refetch: refetchMedias,
  } = useMedias(slug || "", filter);

  const { mutate: mutateCreate } = useCreateMedia();

  const { mutate: mutateUpdate } = useUpdate();

  const { mutate: mutateDeleteMany } = useDeleteMany();

  const { mutate: mutateDelete } = useDelete();

  useEffect(() => {
    if (mediasQuery) {
      setMedias(mediasQuery?.data.medias);
      setPagination(mediasQuery?.data.pagination);
    }
  }, [mediasQuery]);
  useEffect(() => {
    refetchMedias();
    document.title = "Quản lý Media";
  }, [refetchMedias]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const handeDeletes = (ids: DeleteMediasType) => {
    mutateDeleteMany(ids, {
      onSuccess: () => {
        // Hook useDeleteMany đã xử lý invalidation và toast
        setIsConfirmDeleteMany(false);
        setSelectedMediaIds([]);
      },
      onError: (err: unknown) => {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Đã xảy ra lỗi khi xóa Media";
        showToast(message, "error");
      },
    });
  };

  const handleCreate = (payload: CreateMediaInput) => {
    mutateCreate(
      {
        slug: slug || "",
        data: payload,
      },
      {
        onSuccess: data => {
          if (data) showToast(`Tạo Media thành công`, "success");
          refetchMedias();
        },
        onError: (err: any) => {
          if (err.response?.data?.message) {
            showToast(err.response?.data?.message, "error");
          }
        },
      }
    );
  };

  const handleUpdate = (payload: UpdateMediaInput) => {
    if (selectedMediaId) {
      mutateUpdate(
        { id: selectedMediaId, payload },
        {
          onSuccess: () => {
            showToast(`Cập nhật Media thành công`, "success");
            refetchMedias();
            setSelectedMediaId(null);
          },
          onError: (err: any) => {
            if (err.response?.data?.message)
              showToast(err.response?.data?.message, "error");
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
          showToast(`Xóa Media thành công`, "success");
          refetchMedias();
          setSelectedMediaId(null);
          setIsConfirmDelete(false);
        },
        onError: (error: unknown) => {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Đã xảy ra lỗi khi xóa Media";
          showToast(message, "error");
        },
      });
    },
    [mutateDelete, showToast]
  );
  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      setSelectedMediaId(id);

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

  if (isMediasLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isMediasError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={<Button onClick={() => refetchMedias()}>Thử lại</Button>}
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
        <Typography variant="h5">Quản lý Media</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Thêm Media
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
            <FormAutocompleteFilter
              label="Trạng thái"
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Logo", value: "logo" },
                { label: "Ảnh nền", value: "background" },
                { label: "Hình ảnh", value: "images" },
              ]}
              value={filter.type}
              onChange={val => {
                setFilter(prev => ({
                  ...prev,
                  type:
                    val === "all"
                      ? undefined
                      : val === "logo"
                      ? "logo"
                      : val === "background"
                      ? "background"
                      : val === "images"
                      ? "images"
                      : undefined, // fallback nếu Autocomplete trả undefined
                }));
              }}
              sx={{ flex: 1, minWidth: 200 }}
            />

            {selectedMediaIds.length > 0 && (
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
                Xoá ({selectedMediaIds.length})
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
                Tổng số: {pagination?.total} Media
              </Typography>
            </Box>
          </Stack>

          <MediaList
            media={medias}
            selectedMediaIds={selectedMediaIds}
            setSelectedMediaIds={setSelectedMediaIds}
            onView={id => handleAction("view", id)}
            onEdit={id => handleAction("edit", id)}
            onDelete={id => handleAction("delete", id)}
          />
        </Box>
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
                  page: 1, // Reset về trang 1 khi thay đổi limit
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
        <Box
          sx={{
            display:
              pagination?.totalPages !== undefined && pagination.totalPages > 1
                ? "block"
                : "none",
          }}
        >
          <Box>
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
        </Box>

        <CreateMedia
          isOpen={isCreateOpen}
          onClose={closeCreate}
          onSubmit={handleCreate}
        />

        <ViewMedia
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          id={selectedMediaId}
        />

        <EditMedia
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          id={selectedMediaId}
          onSubmit={handleUpdate}
        />
      </Box>
      <ConfirmDeleteMany
        open={isConfirmDeleteMany}
        onClose={() => setIsConfirmDeleteMany(false)}
        title="Xác nhận xóa Media "
        description={`Bạn có chắc xóa ${selectedMediaIds.length} Media này không`}
        onConfirm={() => handeDeletes({ ids: selectedMediaIds })}
      />

      <ConfirmDelete
        open={isConfirmDelete}
        onClose={() => setIsConfirmDelete(false)}
        title="Xác nhận xóa Media "
        description={`Bạn có chắc chắn xóa Media này không`}
        onConfirm={() => handleDelete(selectedMediaId)}
      />
    </Box>
  );
};

export default memo(MediaPage);
