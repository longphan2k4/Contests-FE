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
import { useNavigate } from "react-router-dom";
import CreateQuestionPackage from "../components/CreateQuestionPackage";
import ViewQuestionPackage from "../components/ViewQuestionPackage";
import EditQuestionPackage from "../components/EditQuestionPackage";
import QuestionPackageList from "../components/QuestionPackageList";
import { useToast } from "../../../../contexts/toastContext";
import ConfirmDeleteMany from "../../../../components/Confirm";
import ConfirmDelete from "../../../../components/Confirm";
import FormAutocompleteFilter from "../../../../components/FormAutocompleteFilter";

import { useQuestionPackages } from "../hook/useQuestionPackages";
import { useCreateQuestionPackage } from "../hook/useCreate";
import { useUpdate } from "../hook/useUpdate";
import { useActive } from "../hook/useActive";
import { useDeleteMany } from "../hook/useDeleteMany";
import { useDelete } from "../hook/useDelete";
import AddIcon from "@mui/icons-material/Add";

import {
  type QuestionPackage,
  type CreateQuestionPackageInput,
  type UpdateQuestionPackageInput,
  type QuestionPackageQuery,
  type pagination,
  type deleteQuestionPackagesType,
} from "../types/questionpackages.shame";
import SearchIcon from "@mui/icons-material/Search";

const QuestionsPackagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [questionPackages, setQuestionPackages] = useState<QuestionPackage[]>([]);
  const [selectedQuestionPackageId, setSelectedQuestionPackageId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<pagination>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmDeleteMany, setIsConfirmDeleteMany] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const [filter, setFilter] = useState<QuestionPackageQuery>({});
  const [selectedQuestionPackageIds, setSelectedQuestionPackageIds] = useState<number[]>([]);

  const { showToast } = useToast();

  const {
    data: questionPackagesQuery,
    isLoading: isQuestionPackagesLoading,
    isError: isQuestionPackagesError,
    refetch: refetchQuestionPackages,
  } = useQuestionPackages(filter);

  const { mutate: mutateCreate } = useCreateQuestionPackage();

  const { mutate: mutateUpdate } = useUpdate();

  const { mutate: mutateActive } = useActive();

  const { mutate: mutateDeleteMany } = useDeleteMany();

  const { mutate: mutateDelete } = useDelete();

  useEffect(() => {
    if (questionPackagesQuery) {
      setQuestionPackages(questionPackagesQuery.data);
      setPagination(questionPackagesQuery.pagination);
    }
  }, [questionPackagesQuery]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const toggleActive = useCallback((id: number) => {
    mutateActive(
      { id: id },
      {
        onSuccess: () => {
          showToast(`Cập nhật trạng thái thành công`, "success");

          refetchQuestionPackages();
          setSelectedQuestionPackageId(null);
        },
        onError: (err: any) => {
          showToast(err.response?.data?.message, "error");
        },
      }
    );
  }, []);

  const handeDeletes = (ids: deleteQuestionPackagesType) => {
    mutateDeleteMany(ids, {
      onSuccess: data => {
        data.messages.forEach((item: any) => {
          if (item.status === "error") {
            showToast(item.msg, "error");
          } else {
            showToast(item.msg, "success");
          }
        });
        refetchQuestionPackages();
      },
      onError: err => {
        console.log(err);
      },
    });
  };

  const handleCreate = (payload: CreateQuestionPackageInput) => {
    mutateCreate(payload, {
      onSuccess: data => {
        if (data) showToast(`Tạo gói câu hỏi thành công`, "success");
        refetchQuestionPackages();
      },
      onError: (err: any) => {
        if (err.response?.data?.message) {
          showToast(err.response?.data?.message, "success");
        }
      },
    });
  };

  const handleUpdate = (payload: UpdateQuestionPackageInput) => {
    if (selectedQuestionPackageId) {
      mutateUpdate(
        { id: selectedQuestionPackageId, payload },
        {
          onSuccess: () => {
            showToast(`Cập nhật gói câu hỏi thành công`, "success");
            refetchQuestionPackages();
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
        showToast(`Xóa gói câu hỏi thành công`, "success");
        refetchQuestionPackages();
      },
      onError: (error: any) => {
        showToast(error.response?.data?.message, "success");
      },
    });
  }, []);

  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      setSelectedQuestionPackageId(id);

      if (type === "delete") {
        setIsConfirmDelete(true);
      }

      if (type === "view") setIsViewOpen(true);
      if (type === "edit") setIsEditOpen(true);
    },
    []
  );
const handleViewQuestions = useCallback((id: number) => {
    navigate(`/admin/question-packages/${id}`);
  }, [navigate]);

  const hanldConfirmDeleteManyDeletes = () => {
    setIsConfirmDeleteMany(true);
  };

  if (isQuestionPackagesLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isQuestionPackagesError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={<Button onClick={() => refetchQuestionPackages}>Thử lại</Button>}
        >
          Không thể tải danh sách gói câu hỏi.
        </Alert>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Quản lý gói câu hỏi</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Thêm gói câu hỏi
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
              sx={{ flex: { sm: 1 }, minWidth: { xs: "100%", sm: 200 } }}
            />

           
            {/* Nút xoá người */}
            {selectedQuestionPackageIds.length > 0 && (
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
                Xoá ({selectedQuestionPackageIds.length})
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
                Tổng số: {pagination?.total} gói câu hỏi
              </Typography>
            </Box>
          </Stack>

          <QuestionPackageList
            questionPackages={questionPackages}
            selectedQuestionPackageIds={selectedQuestionPackageIds}
            setSelectedQuestionPackageIds={setSelectedQuestionPackageIds}
            onViewQuestions={handleViewQuestions}
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
              Trang {filter.page || 1} / {pagination?.totalPages}
            </Typography>
          </Box>
        </Box>
        <Box className="flex flex-col items-center">
          {" "}
          <Pagination
            count={pagination?.totalPages}
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
        <CreateQuestionPackage
          isOpen={isCreateOpen}
          onClose={closeCreate}
          onSubmit={handleCreate}
        />

        <ViewQuestionPackage
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          id={selectedQuestionPackageId}
        />

        <EditQuestionPackage
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          id={selectedQuestionPackageId}
          onSubmit={handleUpdate}
        />
      </Box>
      <ConfirmDeleteMany
        open={isConfirmDeleteMany}
        onClose={() => setIsConfirmDeleteMany(false)}
        title="Xác nhận xóa gói câu hỏi "
        description={`Bạn có chắc xóa ${selectedQuestionPackageIds.length} gói câu hỏi này không`}
        onConfirm={() => handeDeletes({ ids: selectedQuestionPackageIds })}
      />

      <ConfirmDelete
        open={isConfirmDelete}
        onClose={() => setIsConfirmDelete(false)}
        title="Xác nhận xóa gói câu hỏi "
        description={`Bạn có chắc chắn xóa gói câu hỏi này không`}
        onConfirm={() => handleDelete(selectedQuestionPackageId)}
      />
    </Box>
  );
};

export default memo(QuestionsPackagesPage);
