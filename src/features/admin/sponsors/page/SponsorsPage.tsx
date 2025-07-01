import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
// import { useQueryClient } from "@tanstack/react-query";

import { useNotification } from "../../../../hooks/useNotification";
import { useSponsors } from "../hook/useSponsors";
import { useCreateSponsorForContest } from "../hook/useCreate";
// import { useUpdate } from "../hook/useUpdate";
import { useDeleteMany } from "../hook/useDeleteMany";
import { useDelete } from "../hook/useDelete";

import SponsorList from "../components/SponsorList";
import CreateSponsor from "../components/CreateSponsor";
import ViewSponsor from "../components/ViewSponsor";
// import EditSponsor from "../components/EditSponsor";
import ConfirmDeleteMany from "../components/ConfirmDeleteMany";
import ConfirmDelete from "../components/ConfirmDelete";
import NotificationSnackbar from "../../components/NotificationSnackbar";

import type {
  Sponsor,
  CreateSponsorForContestInput,
  // UpdateSponsorInput,
  SponsorQuery,
  deleteSponsorsType,
} from "../types/sponsors.shame";

const SponsorsPage: React.FC = () => {
  const [sponsors, _setSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsorId, setSelectedSponsorId] = useState<number | null>(
    null
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  // const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmDeleteMany, setIsConfirmDeleteMany] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const [filter, setFilter] = useState<SponsorQuery>({});
  const [selectedSponsorIds, setSelectedSponsorIds] = useState<number[]>([]);

  const {
    showSuccessNotification,
    showErrorNotification,
    notificationState,
    hideNotification,
  } = useNotification();
  const { slug } = useParams<{ slug: string }>();
  // const queryClient = useQueryClient();

  // All hooks must be called unconditionally
  const {
    data: sponsorsQuery,
    isLoading: isSponsorsLoading,
    isError: isSponsorsError,
    refetch: refetchSponsors,
  } = useSponsors(slug || "", filter);
  const { mutate: mutateCreateSponsor, isPending: isCreating } =
    useCreateSponsorForContest(slug || "");
  // const { mutate: mutateUpdate, isPending: isUpdating } = useUpdate();
  const { mutate: mutateDeleteMany } = useDeleteMany();
  const { mutate: mutateDelete } = useDelete();
  const handleDelete = useCallback(
    (id: number | null) => {
      if (!id) return;
      mutateDelete(id, {
        onSuccess: () => {
          showSuccessNotification(`Xóa nhà tài trợ thành công`, "Thành công");
          refetchSponsors();
          setIsConfirmDelete(false);
          setSelectedSponsorId(null);
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          showErrorNotification(
            err.response?.data?.message || "Có lỗi xảy ra khi xóa nhà tài trợ",
            "Lỗi xóa"
          );
        },
      });
    },
    [
      mutateDelete,
      refetchSponsors,
      showSuccessNotification,
      showErrorNotification,
    ]
  );

  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      setSelectedSponsorId(id);

      if (type === "delete") {
        setIsConfirmDelete(true);
      }

      if (type === "view") setIsViewOpen(true);
      // if (type === "edit") setIsEditOpen(true);
    },
    []
  );
  useEffect(() => {
    if (sponsorsQuery) {
      // setSponsors(sponsorsQuery);
    }
  }, [sponsorsQuery]);

  // Early return after hooks
  if (!slug) return null;

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);
  const handeDeletes = (ids: deleteSponsorsType) => {
    mutateDeleteMany(ids, {
      onSuccess: data => {
        let successCount = 0;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.messages.forEach((item: any) => {
          if (item.status === "error") {
            showErrorNotification(item.msg, "Lỗi xóa");
          } else {
            successCount++;
          }
        });

        if (successCount > 0) {
          showSuccessNotification(
            `Xóa thành công ${successCount} nhà tài trợ`,
            "Thành công"
          );
        }

        refetchSponsors();
        setIsConfirmDeleteMany(false);
        setSelectedSponsorIds([]);
      },
      onError: err => {
        console.log(err);
        showErrorNotification(
          "Có lỗi xảy ra khi xóa nhà tài trợ",
          "Lỗi xóa hàng loạt"
        );
      },
    });
  };
  const handleCreate = (payload: CreateSponsorForContestInput) => {
    mutateCreateSponsor(payload, {
      onSuccess: () => {
        showSuccessNotification("Tạo nhà tài trợ thành công", "Thành công");
        refetchSponsors?.();
        setIsCreateOpen(false); // Close create dialog
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } };
        const message =
          err.response?.data?.message ?? "Đã xảy ra lỗi khi tạo nhà tài trợ";
        showErrorNotification(message, "Lỗi tạo mới");
      },
    });
  };
  // const handleUpdate = (payload: UpdateSponsorInput) => {
  //   if (selectedSponsorId) {
  //     mutateUpdate(
  //       { id: selectedSponsorId, payload },
  //       {
  //         onSuccess: () => {
  //           showSuccessNotification(
  //             `Cập nhật nhà tài trợ thành công`,
  //             "Thành công"
  //           );
  //           refetchSponsors();
  //           // Invalidate individual sponsor cache to refresh ViewSponsor
  //           queryClient.invalidateQueries({
  //             queryKey: ["sponsor", selectedSponsorId],
  //           });
  //           setIsEditOpen(false); // Close edit dialog
  //         },
  //         onError: (err: unknown) => {
  //           const error = err as { response?: { data?: { message?: string } } };
  //           const message =
  //             error.response?.data?.message ??
  //             "Đã xảy ra lỗi khi cập nhật nhà tài trợ";
  //           showErrorNotification(message, "Lỗi cập nhật");
  //         },
  //       }
  //     );
  //   }
  // };

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

  // const selectedSponsor = sponsors.find(s => s.id === selectedSponsorId);

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
              sx={{
                flex: { sm: 1 },
                minWidth: { xs: "100%", sm: 200 },
              }}
            />
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
      </Box>
      {/* Dialogs */}{" "}
      <CreateSponsor
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />
      <ViewSponsor
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        id={selectedSponsorId}
      />
      {/* {selectedSponsor && (
        <EditSponsor
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          sponsor={selectedSponsor}
          onSubmit={handleUpdate}
          isLoading={isUpdating}
        />
      )} */}
      <ConfirmDeleteMany
        open={isConfirmDeleteMany}
        onClose={() => setIsConfirmDeleteMany(false)}
        count={selectedSponsorIds.length}
        onConfirm={() => handeDeletes({ ids: selectedSponsorIds })}
      />{" "}
      <ConfirmDelete
        open={isConfirmDelete}
        onClose={() => setIsConfirmDelete(false)}
        onConfirm={() => handleDelete(selectedSponsorId)}
      />{" "}
      {/* Notification Snackbar */}
      <NotificationSnackbar
        open={notificationState.open}
        onClose={hideNotification}
        severity={notificationState.severity}
        {...(notificationState.title && { title: notificationState.title })}
        message={notificationState.message}
      />
    </Box>
  );
};

export default memo(SponsorsPage);
