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
  type CreateRescueInput,
  type UpdateRescueInput,
  type DeleteRescuesInput,
  type RescuesQueryInput,
  type Rescues,
  type pagination,
  type listmatch,
  type listType,
  type liststatus,
} from "../types/rescue.shame";

import CreateRescue from "../components/CreateRescue";
import EditRescue from "../components/EditeRescue";
import ListRescue from "../components/ListRescue";
import ViewRescue from "../components/ViewRescue";
import { useToast } from "@/contexts/toastContext";
import ConfirmDelete from "@components/Confirm";
import FormAutocompleteFilter from "@components/FormAutocompleteFilter";

import {
  useGetAll,
  useCreate,
  useUpdate,
  useDelete,
  useDeletes,
  useListStatus,
  useListType,
  useListMatch,
} from "../hook/useRescue";
import AddIcon from "@mui/icons-material/Add";

import SearchIcon from "@mui/icons-material/Search";

const RescuePage: React.FC = () => {
  const [rescue, setRescue] = useState<Rescues[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<pagination>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isComfirmDelete, setIsComfirmDelete] = useState(false);
  const [isComfirmDeleteMany, setIsComfirmDeleteMany] = useState(false);

  const [filter, setFilter] = useState<RescuesQueryInput>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [listMatch, setListMatch] = useState<listmatch[]>([]);
  const [listStatus, setListStatus] = useState<liststatus[]>([]);
  const [listType, setListType] = useState<listType[]>([]);

  const { showToast } = useToast();
  const { slug } = useParams();

  const {
    data: rescueData,
    isLoading: issLoading,
    isError: issError,
    refetch: refetchs,
  } = useGetAll(filter, slug ?? null);

  const { mutate: mutateCreate } = useCreate();

  const { mutate: mutateUpdate } = useUpdate();

  const { mutate: mutateDelete } = useDelete();

  const { mutate: mutateDeletes } = useDeletes();

  const {
    data: statusData,
    refetch: refetchStatus,
    isLoading: isLoadingStatus,
  } = useListStatus();

  const {
    data: listTypeData,
    refetch: refetchListType,
    isLoading: isLoadingListType,
  } = useListType();
  const {
    data: matchData,
    refetch: refetchMatchData,
    isLoading: isLoadingMatchData,
  } = useListMatch(slug ?? null);

  useEffect(() => {
    refetchs();
    refetchStatus();
    refetchListType();
    refetchMatchData();
  }, [slug, refetchs, refetchStatus, refetchListType, refetchMatchData]);

  useEffect(() => {
    if (matchData) {
      setListMatch(matchData.data);
    }
  }, [matchData]);

  useEffect(() => {
    if (statusData?.data?.options?.length > 0) {
      setListStatus(statusData.data?.options);
    }
  }, [statusData]);

  useEffect(() => {
    if (listTypeData?.data?.options?.length > 0) {
      setListType(listTypeData.data?.options);
    } else {
      setListType([]);
    }
  }, [listTypeData]);

  useEffect(() => {
    if (rescueData) {
      setRescue(rescueData.data.rescues);
      setPagination(rescueData.data.pagination);
    }
  }, [rescueData]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const handleDeletes = (ids: DeleteRescuesInput) => {
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
        showToast("Xóa cứu trợ  thất bại");
      },
    });
  };

  const handleCreate = (payload: CreateRescueInput) => {
    if (payload.questionFrom > payload.questionTo) {
      showToast("Câu bắt đầu phải nhỏ hơn hoặc bằng câu kết thúc", "error");
      return;
    }
    if (payload.questionFrom < 1 || payload.questionTo < 1) {
      showToast("Câu bắt đầu và câu kết thúc phải lớn hơn 0", "error");
      return;
    }
    const data = { ...payload, supportAnswers: [], studentIds: [] };
    mutateCreate(
      { payload: data, slug: slug ?? null },
      {
        onSuccess: () => {
          showToast(`Thêm cứu trợ thành công`, "success");
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

  const handleUpdate = (payload: UpdateRescueInput) => {
    if (selectedId) {
      mutateUpdate(
        { id: selectedId, payload },
        {
          onSuccess: () => {
            showToast(`Cập nhật cứu trợ thành công`, "success");
            setSelectedId(null); // Reset selectedId after update
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
        showToast(`Xóa cứu trợ  thành công`);
        setSelectedId(null); // Reset selectedId after delete
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
  useEffect(() => {
    document.title = "Quản lý cứu trợ ";
  }, []);

  if (
    issLoading ||
    isLoadingStatus ||
    isLoadingListType ||
    isLoadingMatchData
  ) {
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
          Không thể tải danh danh sách cứu trợ
        </Alert>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Quản lý cứu trợ </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Thêm cứu trợ
        </Button>
      </Box>

      {/*  list card */}
      <Box
        sx={{
          backgrescue: "#FFFFFF",
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
            sx={{ alignItems: "stretch", mb: 2, gap: { xs: 1, sm: 2 } }}
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

            {/* Trận đấu */}
            <FormAutocompleteFilter
              label="Trận đấu"
              options={[
                { label: "Tất cả", value: "all" },
                ...listMatch.map(s => ({
                  label: s.name,
                  value: s.id,
                })),
              ]}
              value={filter.matchId ?? "all"}
              onChange={(val: string | number | undefined) =>
                setFilter(prev => ({
                  ...prev,
                  matchId: val === "all" ? undefined : Number(val),
                }))
              }
              sx={{ flex: 1, minWidth: 200 }}
            />

            {/* Loại cứu trợ */}
            <FormAutocompleteFilter
              label="Loại cứu trợ"
              options={[
                { label: "Tất cả", value: "all" },
                ...listType.map(s => ({
                  label: s.label,
                  value: s.value,
                })),
              ]}
              value={filter.rescueType ?? "all"}
              onChange={(val: string | number | undefined) =>
                setFilter(prev => ({
                  ...prev,
                  rescueType:
                    val === "all"
                      ? undefined
                      : (val as "resurrected" | "lifelineUsed"),
                }))
              }
              sx={{ flex: 1, minWidth: 200 }}
            />

            {/* Trạng thái cứu trợ */}
            <FormAutocompleteFilter
              label="Trạng thái cứu trợ"
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
                      : (val as "notUsed" | "used" | "passed"),
                }))
              }
              sx={{ flex: 1, minWidth: 200 }}
            />

            {/* Nút xoá nhiều */}
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

            {/* Tổng số */}
          </Stack>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Tổng số: {pagination.total} cứu trợ
            </Typography>
          </Box>

          <ListRescue
            rescues={rescue}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
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
              Trang {filter.page || 1} / {pagination.totalPages || 1}
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
          </Box>{" "}
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
          </Box>{" "}
        </Box>

        <CreateRescue
          isOpen={isCreateOpen}
          onClose={closeCreate}
          onSubmit={handleCreate}
        />

        <ViewRescue
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          id={selectedId}
        />

        <EditRescue
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          id={selectedId}
          onSubmit={handleUpdate}
        />
        <ConfirmDelete
          open={isComfirmDelete}
          title="Xóa cứu trợ "
          onClose={() => setIsComfirmDelete(false)}
          description="Bạn có chắc chắn xóa cứu trợ  này không"
          onConfirm={() => handleDelete(selectedId)}
        />

        <ConfirmDelete
          open={isComfirmDeleteMany}
          title="Xóa cứu trợ "
          onClose={() => setIsComfirmDeleteMany(false)}
          onConfirm={() => handleDeletes({ ids: selectedIds })}
        />
      </Box>
    </Box>
  );
};

export default memo(RescuePage);
