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
import { useParams } from "react-router-dom";
import CreateClassVideo from "../components/CreateClassVideo";
import ViewClassVideo from "../components/ViewClassVideo";
import EditClassVideo from "../components/EditClassVideo";
import ClassVideoList from "../components/ClassVideoList";
import { useToast } from "../../../../contexts/toastContext";
import ConfirmDeleteMany from "../../../../components/Confirm";
import ConfirmDelete from "../../../../components/Confirm";

import { useClassVideos } from "../hook/useClassVideos";
import { useCreateClassVideo } from "../hook/useCreate";
import { useUpdate } from "../hook/useUpdate";
import { useDeleteMany } from "../hook/useDeleteMany";
import { useDelete } from "../hook/useDelete";
import AddIcon from "@mui/icons-material/Add";

import {
  type ClassVideo,
  type CreateClassVideoInput,
  type UpdateClassVideoInput,
  type ClassVideoQuery,
  type pagination,
  type deleteClassVideosType,
} from "../types/class-video.shame";
import SearchIcon from "@mui/icons-material/Search";

const ClassVideos: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [classVideos, setclassVideos] = useState<ClassVideo[]>([]);
  const [selectedClassVideoId, setSelectedClassVideoId] = useState<
    number | null
  >(null);
  const [pagination, setPagination] = useState<pagination>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmDeleteMany, setIsConfirmDeleteMany] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const [filter, setFilter] = useState<ClassVideoQuery>({});
  const [selectedClassVideoIds, setSelectedClassVideoIds] = useState<number[]>(
    []
  );

  const { showToast } = useToast();

  const {
    data: classVideosQuery,
    isLoading: isClassVideosLoading,
    isError: isClassVideosError,
    refetch: refetchClassVideos,
  } = useClassVideos(slug || "", filter);

  const { mutate: mutateCreate } = useCreateClassVideo();

  const { mutate: mutateUpdate } = useUpdate();

  const { mutate: mutateDeleteMany } = useDeleteMany();

  const { mutate: mutateDelete } = useDelete();

  useEffect(() => {
    if (classVideosQuery) {
      setclassVideos(classVideosQuery.data.classVideos);
      setPagination(classVideosQuery.data.pagination);
    }
  }, [classVideosQuery]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const handeDeletes = (ids: deleteClassVideosType) => {
    mutateDeleteMany(ids, {
      onSuccess: data => {
        data.messages.forEach((item: any) => {
          if (item.status === "error") {
            showToast(item.msg, "error");
          } else {
            showToast(item.msg, "success");
          }
        });
        refetchClassVideos();
      },
      onError: err => {
        console.log(err);
      },
    });
  };

  const handleCreate = (payload: CreateClassVideoInput) => {
    mutateCreate(
      {
        slug: slug || "",
        data: payload,
      },
      {
        onSuccess: data => {
          if (data) showToast(`Tạo Video Lớp thành công`, "success");
          refetchClassVideos();
        },
        onError: (err: any) => {
          if (err.response?.data?.message) {
            showToast(err.response?.data?.message, "error");
          }
        },
      }
    );
  };

  const handleUpdate = (payload: UpdateClassVideoInput) => {
    if (selectedClassVideoId) {
      mutateUpdate(
        { id: selectedClassVideoId, payload },
        {
          onSuccess: () => {
            showToast(`Cập nhật Video Lớp thành công`, "success");
            refetchClassVideos();
            setSelectedClassVideoId(null);
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
        showToast(`Xóa Video Lớp thành công`, "success");
        refetchClassVideos();
        setSelectedClassVideoId(null);
      },
      onError: (error: any) => {
        showToast(error.response?.data?.message, "success");
      },
    });
  }, []);

  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      setSelectedClassVideoId(id);

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

  useEffect(() => {
    document.title = "Quản lý Video Lớp";
    refetchClassVideos();
  }, []);

  if (isClassVideosLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isClassVideosError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={<Button onClick={() => refetchClassVideos}>Thử lại</Button>}
        >
          Không thể tải danh sách Video Lớp.
        </Alert>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Quản lý video lớp</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Thêm Video Lớp
        </Button>
      </Box>

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
            {selectedClassVideoIds.length > 0 && (
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
                Xoá ({selectedClassVideoIds.length})
              </Button>
            )}
          </Stack>
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
              Tổng số: {pagination?.total} video lớp
            </Typography>
          </Box>

          <ClassVideoList
            classVideos={classVideos}
            selectedClassVideoIds={selectedClassVideoIds}
            setSelectedClassVideoIds={setSelectedClassVideoIds}
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
                    page: 1, // Reset to first page when changing limit
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
              Trang {filter.page || 1} / {pagination?.totalPages ?? 1}
            </Typography>
          </Box>
        </Box>
        <Box
          style={{
            display:
              pagination?.totalPages && pagination.totalPages > 1
                ? "block"
                : "none",
          }}
        >
          <Box className="flex flex-col items-center">
            <Pagination
              count={pagination?.totalPages ?? 1}
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
      <ConfirmDeleteMany
        open={isConfirmDeleteMany}
        onClose={() => setIsConfirmDeleteMany(false)}
        title="Xác nhận xóa video lớp "
        description={`Bạn có chắc xóa ${selectedClassVideoIds.length} video lớp này không`}
        onConfirm={() => handeDeletes({ ids: selectedClassVideoIds })}
      />
      <CreateClassVideo
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onSubmit={handleCreate}
      />

      <ViewClassVideo
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        id={selectedClassVideoId}
      />

      <EditClassVideo
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        id={selectedClassVideoId}
        onSubmit={handleUpdate}
      />
      <ConfirmDelete
        open={isConfirmDelete}
        onClose={() => setIsConfirmDelete(false)}
        title="Xác nhận xóa video lớp "
        description={`Bạn có chắc chắn xóa video lớp này không`}
        onConfirm={() => handleDelete(selectedClassVideoId)}
      />
    </Box>
  );
};

export default memo(ClassVideos);
