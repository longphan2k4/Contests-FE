import React, { useState, useEffect, useCallback, memo } from "react";
import PaginationControl from "../components/PaginationControl";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import CreateQuestionPackage from "../components/CreateQuestionPackage";
import ViewQuestionPackage from "../components/ViewQuestionPackage";
import EditQuestionPackage from "../components/EditQuestionPackage";
import QuestionPackageList from "../components/QuestionPackagesList";

import { useNotification } from "../../../../contexts/NotificationContext";

import type { Filter } from "../components/QuestionPackagesList";
import { useQuestionPackages } from "../hook/useQuestionPackages";
import { useQuestionPackageById } from "../hook/useQuestionPackageById";
import { useCreateQuestionPackage } from "../hook/useCreate";
import { useDeleteQuestionPackage } from "../hook/useDelete";
import { useEditQuestionPackage } from "../hook/useEdit";
import {
  type QuestionPackage,
  type CreateUpdateQuestionPackageInput,
} from "../types/questionpackages.shame";

const QuestionPackagesPage: React.FC = () => {
  const { showSuccessNotification, showErrorNotification } = useNotification();

  // Filter state
  const [filter, setFilter] = useState<Filter>({
  page: 1,
  limit: 10,
  keyword: "",
  searchText: "",
});
 
  const { mutate: deleteQuestionPackage } = useDeleteQuestionPackage();
  // Search input state
  const [searchValue, setSearchValue] = useState("");

  // UI modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Selected question package
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<QuestionPackage | null>(
    null
  );

  // Pending action to trigger modal after data fetched
  const [pendingAction, setPendingAction] = useState<"view" | "edit" | null>(
    null
  );

  // Fetch question packages list with react query hook
  const {
  data: questionPackagesResponse,
  isLoading,
  isError,
  refetch,
} = useQuestionPackages(filter);

  // Fetch selected package details
  const { data: selectedData } = useQuestionPackageById(selectedId);

  // Mutation hook to create package
  const { mutate: createQuestionPackage } = useCreateQuestionPackage();
  const { mutate: editQuestionPackage } = useEditQuestionPackage();
  // Local list state synced with fetched data
  const [, setQuestionPackages] = useState<QuestionPackage[]>([]);

  // Sync fetched question packages into local state
  useEffect(() => {
  if (questionPackagesResponse?.data) {
    setQuestionPackages(questionPackagesResponse.data);
  }
}, [questionPackagesResponse]);


  // When selectedData or pendingAction changes, open corresponding modal
  useEffect(() => {
    if (!selectedData || !pendingAction) return;

    setSelectedPackage(selectedData);

    if (pendingAction === "view") setIsViewOpen(true);
    if (pendingAction === "edit") setIsEditOpen(true);

    setPendingAction(null);
  }, [selectedData, pendingAction]);

  // Handle search input change with debounced effect
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    setFilter((prev) => ({
      ...prev,
      keyword: value.trim(),
      page: 1, // reset to first page when searching
    }));
  };
  // Open and close create modal
  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  // Toggle active state locally (simulate API call)
  const toggleActive = useCallback((id: number) => {
    setQuestionPackages((prev) =>
      prev.map((pkg) =>
        pkg.id === id ? { ...pkg, isActive: !pkg.isActive } : pkg
      )
    );
    // TODO: Call API to toggle active status
  }, []);

  // Delete question package locally (simulate API call)
  const handleDelete = useCallback((id: number) => {
    if (window.confirm("Bạn có chắc muốn xoá gói câu hỏi này không?")) {
    deleteQuestionPackage(id, {
      onSuccess: () => {
        // Nếu bạn đang dùng local state students, thì cần cập nhật:
        setQuestionPackages(prev => prev.filter(s => s.id !== id));
      },
      onError: () => {
        alert("Xoá học sinh thất bại");
      }
    });
  }
}, [deleteQuestionPackage]);

  // Create new question package
  const handleCreate = (payload: CreateUpdateQuestionPackageInput) => {
    createQuestionPackage(payload, {
      onSuccess: () => {
        showSuccessNotification(`Tạo gói câu hỏi "${payload.name}" thành công`);
        refetch();
        closeCreate();
      },
      onError: (err: any) => {
        if (err.response?.data?.message) {
          showErrorNotification(err.response.data.message);
        } else {
          showErrorNotification("Có lỗi xảy ra khi tạo gói câu hỏi");
        }
      },
    });
  };

  // Update existing question package
const handleUpdate = (payload: CreateUpdateQuestionPackageInput) => {
  if (selectedId === null) return; // kiểm tra xem đã chọn đúng id chưa

  editQuestionPackage({
    id: selectedId,
    data: payload,
  });
};

  // Handle actions: view, edit, delete
  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      if (type === "delete") {
        handleDelete(id);
        return;
      }
      setSelectedId(id);
      setPendingAction(type);
    },
    [handleDelete]
  );

  const filteredPackages = questionPackagesResponse?.data || [];
  
  const total = questionPackagesResponse?.pagination?.total || 0;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={<Button onClick={() => refetch()}>Thử lại</Button>}
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
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Thêm gói câu hỏi
        </Button>
      </Box>

     
      {/* List */}
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

 {/* Search and total */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={2}
      >
        <TextField
          size="small"
          placeholder="Tìm kiếm gói câu hỏi"
          value={searchValue}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: { xs: "100%", sm: 300 },
            maxWidth: { xs: "100%", sm: 300 },
          }}
        />

        <Typography
          variant="body2"
          color="text.secondary"
          flexShrink={0}
          textAlign={{ xs: "right", sm: "right" }}
          sx={{ minWidth: 120 }}
        >
          Tổng số: {total} gói câu hỏi
        </Typography>
      </Box>


        <QuestionPackageList
          questionPackages={filteredPackages}
          onView={(id) => handleAction("view", id)}
          onEdit={(id) => handleAction("edit", id)}
          onDelete={(id) => handleAction("delete", id)}
          onToggle={toggleActive}
          totalItems={total}
          filter={filter}
          onFilterChange={setFilter}
        />
        <PaginationControl
          totalPages={Math.ceil(total / filter.limit)}
          currentPage={filter.page}
          pageSize={filter.limit}
          onPageChange={(page) =>
            setFilter((prev) => ({ ...prev, page }))
          }
          onPageSizeChange={(newSize) =>
            setFilter((prev) => ({ ...prev, limit: newSize, page: 1 }))
          }
        />
      </Box>

      {/* Modals */}
      <CreateQuestionPackage
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onSubmit={handleCreate}
      />

      <ViewQuestionPackage
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        questionPackage={selectedPackage}
      />

      <EditQuestionPackage
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        questionPackage={selectedPackage}
        onSubmit={handleUpdate}
      />
    </Box>
  );
};

export default memo(QuestionPackagesPage);
