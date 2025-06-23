import React, { useEffect, useMemo } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";

import {
  UpdateGroupsSchema,
  type UpdateGroupInput,
} from "../types/group.shame";
import { useGetById, useListMatch, useListUser } from "../hook/useGroup";

interface EditClassProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateGroupInput) => void;
}

export default function EditClass({
  id,
  isOpen,
  onClose,
  onSubmit,
}: EditClassProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<UpdateGroupInput>({
    resolver: zodResolver(UpdateGroupsSchema),
  });

  const { data: groupData } = useGetById(id);
  const { slug } = useParams();

  const {
    data: listUsers,
    refetch: refetchUser,
    isError: isUserError,
    isLoading: isUserLoading,
  } = useListUser();

  const {
    data: listMatches,
    refetch: refetchMatch,
    isError: isMatchError,
    isLoading: isMatchLoading,
  } = useListMatch(slug ?? null);

  useEffect(() => {
    // Kiểm tra nếu slug có giá trị thì gọi lại hàm refetch để lấy dữ liệu mới
    if (slug) {
      refetchMatch();
      refetchUser();
    }
  }, [slug, refetchMatch, refetchUser, open]);

  // Memo hóa danh sách trường học để tránh re-render thừa
  const matches = useMemo(() => {
    if (listMatches?.success) {
      return listMatches.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    }
    return [];
  }, [listMatches]);

  const users = useMemo(() => {
    if (listUsers?.success) {
      return listUsers.data.map((item: any) => ({
        label: item.username,
        value: item.id,
      }));
    }
    return [];
  }, [listUsers]);
  useEffect(() => {
    if (isOpen && groupData) {
      reset({
        name: groupData.name,
        userId: groupData.userId,
        matchId: groupData.matchId,
      });
    }
  }, [isOpen, groupData, reset]);

  const handleFormSubmit = (formData: UpdateGroupInput) => {
    onSubmit(formData);
    onClose();
  };

  if (isUserLoading || isMatchLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isUserError || isMatchError) {
    return <div>Không thể tải dữ liệu</div>;
  }

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title={`Cập nhật lớp: ${groupData?.name || ""}`}
      maxWidth="sm"
    >
      <form id="create-class-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <FormInput
          id="name"
          label="Tên nhóm"
          placeholder="Nhập tên nhóm"
          error={errors.name}
          register={register("name")}
        />

        <FormSelect
          id="matchId"
          name="matchId"
          label="Chọn trận đấu"
          options={matches}
          control={control}
          error={errors.matchId}
        />

        <FormInput
          id="confirmCurrentQuestion"
          label="Xác nhận ở câu"
          placeholder="Nhập xác nhận ở câu"
          error={errors.confirmCurrentQuestion}
          register={register("confirmCurrentQuestion")}
          type="number"
        />

        <FormSelect
          id="userId"
          name="userId"
          label="Chọn trọng tài"
          options={users}
          control={control}
          error={errors.userId}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2, display: "block ", float: "right", marginTop: "24px" }}
        >
          Cập nhật
        </Button>
      </form>
    </AppFormDialog>
  );
}
