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
//import { Pagination } from "@mui/material";

import CreateSponsor from "../components/CreateSponsor";
import ViewSponsor from "../components/ViewSponsor";
import EditSponsor from "../components/EditSponsor";
import SponsorList from "../components/SponsorList";
import { useToast } from "../../../../contexts/toastContext";
import ConfirmDeleteMany from "../../../../components/Confirm";
import ConfirmDelete from "../../../../components/Confirm";

import { useSponsors } from "../hook/useSponsors";
import { useCreateSponsorForContest } from "../hook/useCreate";
import { useUpdate } from "../hook/useUpdate";
//import { useActive } from "../hook/useActive";
import { useDeleteMany } from "../hook/useDeleteMany";
import { useDelete } from "../hook/useDelete";
import { useStatistics } from "../hook/useStatistics";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import {
  type Sponsor,
  type CreateSponsorInput,
  type UpdateSponsorInput,
  type SponsorQuery,
  type pagination,
  type deleteSponsorsType,
} from "../types/sponsors.shame";
import SearchIcon from "@mui/icons-material/Search";

const SponsorsPage: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsorId, setSelectedSponsorId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<pagination>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmDeleteMany, setIsConfirmDeleteMany] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const [filter, setFilter] = useState<SponsorQuery>({});
  const [selectedSponsorIds, setSelectedSponsorIds] = useState<number[]>([]);

  const { showToast } = useToast();
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return null; 
  const {
    data: sponsorsQuery,
    isLoading: isSponsorsLoading,
    isError: isSponsorsError,
    refetch: refetchSponsors,
  } = useSponsors(slug as string, filter);

  const { mutate: mutateCreateSponsor  } = useCreateSponsorForContest(slug);
  const { mutate: mutateUpdate } = useUpdate();
  //const { mutate: mutateActive } = useActive();
  const { mutate: mutateDeleteMany } = useDeleteMany();
  const { mutate: mutateDelete } = useDelete();

  const { data: statisticsData } = useStatistics();

  useEffect(() => {
    if (sponsorsQuery) {
      setSponsors(sponsorsQuery);
      setPagination(statisticsData?.data?.totalSponsors);
    }
  }, [sponsorsQuery]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  // const toggleActive = useCallback((id: number) => {
  //   mutateActive(
  //     { id: id },
  //     {
  //       onSuccess: data => {
  //         showToast(`Cập nhật trạng thái thành công`, "success");
  //         refetchSponsors();
  //         setSelectedSponsorId(null);
  //       },
  //       onError: (err: any) => {
  //         showToast(err.response?.data?.message, "error");
  //       },
  //     }
  //   );
  // }, []);

  const handeDeletes = (ids: deleteSponsorsType) => {
    mutateDeleteMany(ids, {
      onSuccess: data => {
        data.messages.forEach((item: any) => {
          if (item.status === "error") {
            showToast(item.msg, "error");
          } else {
            showToast(item.msg, "success");
          }
        });
        refetchSponsors();
      },
      onError: err => {
        console.log(err);
      },
    });
  };

  const handleCreate = (payload: CreateSponsorInput) => {
  mutateCreateSponsor(payload, {
    onSuccess: () => {
      showToast("Tạo nhà tài trợ thành công", "success");
      refetchSponsors?.(); // Optional chaining an toàn
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message ?? "Đã xảy ra lỗi khi tạo nhà tài trợ";
      showToast(message, "error");
    },
  });
};


  const handleUpdate = (payload: UpdateSponsorInput) => {
    if (selectedSponsorId) {
      mutateUpdate(
        { id: selectedSponsorId, payload },
        {
          onSuccess: () => {
            showToast(`Cập nhật nhà tài trợ thành công`, "success");
            refetchSponsors();
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
        showToast(`Xóa nhà tài trợ thành công`, "success");
        refetchSponsors();
      },
      onError: (error: any) => {
        showToast(error.response?.data?.message, "error");
      },
    });
  }, []);

  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      setSelectedSponsorId(id);

      if (type === "delete") {
        setIsConfirmDelete(true);
      }

      if (type === "view") setIsViewOpen(true);
      if (type === "edit") setIsEditOpen(true);
    },
    []
  );

  const handleConfirmDeleteMany = () => {
    setIsConfirmDeleteMany(true);
  };

  if (isSponsorsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isSponsorsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={<Button onClick={() => refetchSponsors()}>Thử lại</Button>}
        >
          Không thể tải danh sách nhà tài trợ.
        </Alert>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Quản lý nhà tài trợ</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Thêm nhà tài trợ
        </Button>
      </Box>

      {/* Sponsor list card */}
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

            {selectedSponsorIds.length > 0 && (
              <Button
                variant="contained"
                color="error"
                onClick={handleConfirmDeleteMany}
                sx={{
                  flex: { sm: 1 },
                  width: { xs: "100%", sm: "auto" },
                  whiteSpace: "nowrap",
                }}
              >
                Xoá ({selectedSponsorIds.length}) nhà tài trợ
              </Button>
            )}

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
                Tổng số: {statisticsData?.data?.totalSponsors} nhà tài trợ
              </Typography>
            </Box>
          </Stack>

          <SponsorList
            sponsors={sponsors}
            selectedSponsorIds={selectedSponsorIds}
            setSelectedSponsorIds={setSelectedSponsorIds}
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
                    page: 1,
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
              Trang {filter?.page || 1} / {pagination?.totalPages}
            </Typography>
          </Box>
        </Box>

        {/* <Box className="flex flex-col items-center">
          <Pagination
            count={pagination?.totalPages}
            page={filter.page ?? 1}
            color="primary"
            onChange={(event, value) =>
              setFilter(prev => ({
                ...prev,
                page: value,
              }))
            }
            showFirstButton
            showLastButton
          />
        </Box> */}

        <CreateSponsor
          isOpen={isCreateOpen}
          onClose={closeCreate}
          onSubmit={handleCreate}
        />

        <ViewSponsor
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          id={selectedSponsorId}
        />

        <EditSponsor
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          id={selectedSponsorId}
          onSubmit={handleUpdate}
        />
      </Box>

      <ConfirmDeleteMany
        open={isConfirmDeleteMany}
        onClose={() => setIsConfirmDeleteMany(false)}
        title="Xác nhận xóa nhà tài trợ"
        description={`Bạn có chắc xóa ${selectedSponsorIds.length} nhà tài trợ này không?`}
        onConfirm={() => handeDeletes({ ids: selectedSponsorIds })}
      />

      <ConfirmDelete
        open={isConfirmDelete}
        onClose={() => setIsConfirmDelete(false)}
        title="Xác nhận xóa nhà tài trợ"
        description={`Bạn có chắc chắn xóa nhà tài trợ này không?`}
        onConfirm={() => handleDelete(selectedSponsorId)}
      />
    </Box>
  );
};

export default memo(SponsorsPage);