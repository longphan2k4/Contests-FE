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

import CreateRescue from "../components/CreateRescues";
import ViewRescue from "../components/ViewRescues";
import EditRescue from "../components/EditRescues";
import RescueList from "../components/RescueList";
import { useToast } from "../../../../contexts/toastContext";
import ConfirmDeleteMany from "../../../../components/Confirm";
import ConfirmDelete from "../../../../components/Confirm";
//import FormAutocompleteFilter from "../../../../components/FormAutocompleteFilter";

import { useRescue } from "../hook/useRescue";
import { useCreateRescue } from "../hook/useCreate";
import { useUpdate } from "../hook/useUpdate";
//import { useActive } from "../hook/useActive";
import { useDeleteMany } from "../hook/useDeleteMany";
import { useDelete } from "../hook/useDelete";
import AddIcon from "@mui/icons-material/Add";

import {
  type Rescue,
  type CreateRescueInput,
  type UpdateRescueInput,
  type RescueQuery,
  type pagination,
  type deleteRescueType,
} from "../types/rescues.shame";
import SearchIcon from "@mui/icons-material/Search";

const RescuesPage: React.FC = () => {
  const [rescue, setRescue] = useState<Rescue[]>([]);
  const [selectedRescueId, setSelectedRescueId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<pagination>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmDeleteMany, setIsConfirmDeleteMany] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const [filter, setFilter] = useState<RescueQuery>({});
  const [selectedRescueIds, setSelectedRescueIds] = useState<number[]>([]);

  const { showToast } = useToast();

  const {
    data: rescueQuery,
    isLoading: isRescueLoading,
    isError: isRescuesError,
    refetch: refetchRescue,
  } = useRescue(filter);

  const { mutate: mutateCreate } = useCreateRescue();

  const { mutate: mutateUpdate } = useUpdate();

  //const { mutate: mutateActive } = useActive();

  const { mutate: mutateDeleteMany } = useDeleteMany();

  const { mutate: mutateDelete } = useDelete();

  useEffect(() => {
    if (rescueQuery) {
      setRescue(rescueQuery.data.rescues);
      setPagination(rescueQuery.data.pagination);
    }
  }, [rescueQuery]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  // const toggleActive = useCallback((id: number) => {
  //   mutateActive(
  //     { id: id },
  //     {
  //       onSuccess: data => {
  //         showToast(`Cập nhật trạng thái thành công`, "success");

  //         refetchRescue();
  //         setSelectedRescueId(null);
  //       },
  //       onError: (err: any) => {
  //         showToast(err.response?.data?.message, "error");
  //       },
  //     }
  //   );
  // }, []);

  const handeDeletes = (ids: deleteRescueType) => {
    mutateDeleteMany(ids, {
      onSuccess: data => {
        data.messages.forEach((item: any) => {
          if (item.status === "error") {
            showToast(item.msg, "error");
          } else {
            showToast(item.msg, "success");
          }
        });
        refetchRescue();
      },
      onError: err => {
        console.log(err);
      },
    });
  };

  const handleCreate = (payload: CreateRescueInput) => {
    mutateCreate(payload, {
      onSuccess: data => {
        if (data) showToast(`Tạo cứu trợ thành công`, "success");
        refetchRescue();
      },
      onError: (err: any) => {
        if (err.response?.data?.message) {
          showToast(err.response?.data?.message, "success");
        }
      },
    });
  };

  const handleUpdate = (payload: UpdateRescueInput) => {
    if (selectedRescueId) {
      mutateUpdate(
        { id: selectedRescueId, payload },
        {
          onSuccess: () => {
            showToast(`Cập nhật cứu trợ thành công`, "success");
            refetchRescue();
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
        showToast(`Xóa cứu trợ thành công`, "success");
        refetchRescue();
      },
      onError: (error: any) => {
        showToast(error.response?.data?.message, "success");
      },
    });
  }, []);

  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      setSelectedRescueId(id);

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

  if (isRescueLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isRescuesError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={<Button onClick={() => refetchRescue}>Thử lại</Button>}
        >
          Không thể tải danh sách cứu trợ.
        </Alert>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Quản lý cứu trợ</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Thêm người dùng
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
            {selectedRescueIds.length > 0 && (
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
                Xoá người ({selectedRescueIds.length})
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
                Tổng số: {pagination.total} người dùng
              </Typography>
            </Box>
          </Stack>

          <RescueList
            rescues={rescue}
            selectedRescueIds={selectedRescueIds}
            setSelectedRescueIds={setSelectedRescueIds}
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
        <CreateRescue
          isOpen={isCreateOpen}
          onClose={closeCreate}
          onSubmit={handleCreate}
        />

        <ViewRescue
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          id={selectedRescueId}
        />

        <EditRescue
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          id={selectedRescueId}
          onSubmit={handleUpdate}
        />
      </Box>
      <ConfirmDeleteMany
        open={isConfirmDeleteMany}
        onClose={() => setIsConfirmDeleteMany(false)}
        title="Xác nhận xóa cứu trợ "
        description={`Bạn có chắc xóa ${selectedRescueIds.length} cứu trợ này không`}
        onConfirm={() => handeDeletes({ ids: selectedRescueIds })}
      />

      <ConfirmDelete
        open={isConfirmDelete}
        onClose={() => setIsConfirmDelete(false)}
        title="Xác nhận xóa cứu trợ "
        description={`Bạn có chắc chắn xóa cứu trợ này không`}
        onConfirm={() => handleDelete(selectedRescueId)}
      />
    </Box>
  );
};

export default memo(RescuesPage);
