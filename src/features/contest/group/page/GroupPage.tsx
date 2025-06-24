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
  type GroupQueryInput,
  type CreateGroupInput,
  type UpdateGroupInput,
  type DeleteGroupsInput,
  type pagination,
  type Group,
  type listMatch,
  type listUser,
} from "../types/group.shame";

import CreateGroup from "../components/CreateGroup";
import ViewGroup from "../components/ViewGroup";
import EditeGroup from "../components/EditeGroup";
import ListGroup from "../components/ListGroup";
import { useToast } from "../../../../contexts/toastContext";
import ConfirmDelete from "../../../../components/Confirm";
import FormAutocompleteFilter from "../../../../components/FormAutocompleteFilter";

import {
  useGetAll,
  useCreate,
  useUpdate,
  useDelete,
  useDeletes,
  useListUser,
  useListMatch,
} from "../hook/useGroup";
import AddIcon from "@mui/icons-material/Add";

import SearchIcon from "@mui/icons-material/Search";

const GroupPage: React.FC = () => {
  const [Group, setGroup] = useState<Group[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<pagination>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isComfirmDelete, setIsComfirmDelete] = useState(false);
  const [isComfirmDeleteMany, setIsComfirmDeleteMany] = useState(false);

  const [filter, setFilter] = useState<GroupQueryInput>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [listMatch, setListMatch] = useState<listMatch[]>([]);
  const [listUser, setListUser] = useState<listUser[]>([]);

  const { showToast } = useToast();
  const { slug } = useParams();

  const {
    data: GroupData,
    isLoading: issLoading,
    isError: issError,
    refetch: refetchs,
  } = useGetAll(filter, slug ?? null);

  const { mutate: mutateCreate } = useCreate();

  const { mutate: mutateUpdate } = useUpdate();

  const { mutate: mutateDelete } = useDelete();

  const { mutate: mutateDeletes } = useDeletes();

  const {
    data: userData,
    refetch: refetchUser,
    isLoading: isLoadingUser,
    isError: isUserError,
  } = useListUser();
  const {
    data: matchData,
    refetch: refetchMatch,
    isLoading: isLoadingMatch,
    isError: isMatchError,
  } = useListMatch(slug ?? null);

  useEffect(() => {
    refetchs();
    refetchUser();
    refetchMatch();
  }, [refetchs, refetchUser, refetchMatch]);

  useEffect(() => {
    if (userData) {
      setListUser(userData.data);
    }
  }, [userData]);

  useEffect(() => {
    if (matchData) {
      setListMatch(matchData.data);
    }
  }, [matchData]);

  useEffect(() => {
    if (GroupData) {
      setGroup(GroupData.data.Groups);
      setPagination(GroupData.data.pagination);
    }
  }, [GroupData]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const handeDeletes = (ids: DeleteGroupsInput) => {
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
        showToast("Xóa nhóm  thất bại");
      },
    });
  };

  const handleCreate = (payload: CreateGroupInput) => {
    mutateCreate(
      { payload: payload, slug: slug ?? null },
      {
        onSuccess: () => {
          showToast(`Thêm nhóm thành công`, "success");
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

  const handleUpdate = (payload: UpdateGroupInput) => {
    if (selectedId) {
      mutateUpdate(
        { id: selectedId, payload },
        {
          onSuccess: () => {
            showToast(`Cập nhật nhóm thành công`, "success");
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
        showToast(`Xóa nhóm  thành công`);
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
    document.title = "Quản lý nhóm ";
  }, []);

  if (issLoading || isLoadingUser || isLoadingMatch) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (issError || isUserError || isMatchError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={<Button onClick={() => refetchs()}>Thử lại</Button>}
        >
          Không thể tải danh danh sách nhóm
        </Alert>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Quản lý nhóm </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Thêm nhóm
        </Button>
      </Box>

      {/*  list card */}
      <Box
        sx={{
          backgGroup: "#FFFFFF",
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
            sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
          />

          <FormAutocompleteFilter
            label="Trọng tài"
            options={[
              { label: "Tất cả", value: "all" },
              ...listUser.map(s => ({
                label: s.username,
                value: s.id,
              })),
            ]}
            value={filter.userId ?? "all"}
            onChange={(val: string | number | undefined) =>
              setFilter(prev => ({
                ...prev,
                userId: val === "all" ? undefined : Number(val),
              }))
            }
            sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
          />
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
            sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
          />

          {selectedIds.length > 0 && (
            <Button
              variant="contained"
              color="error"
              sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
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
            Tổng số: {pagination.total} nhóm
          </Typography>
        </Box>

        <ListGroup
          groups={Group}
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
      <CreateGroup
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onSubmit={handleCreate}
      />

      <ViewGroup
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        id={selectedId}
      />

      <EditeGroup
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        id={selectedId}
        onSubmit={handleUpdate}
      />
      <ConfirmDelete
        open={isComfirmDelete}
        title="Xóa nhóm "
        onClose={() => setIsComfirmDelete(false)}
        description="Bạn có chắc chắn xóa nhóm  này không"
        onConfirm={() => handleDelete(selectedId)}
      />

      <ConfirmDelete
        open={isComfirmDeleteMany}
        title="Xóa nhóm "
        onClose={() => setIsComfirmDeleteMany(false)}
        onConfirm={() => handeDeletes({ ids: selectedIds })}
      />
    </Box>
  );
};

export default memo(GroupPage);
