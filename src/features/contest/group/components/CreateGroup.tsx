import React, { useEffect, useMemo } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useParams } from "react-router-dom";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";

import {
  CreateGroupsSchema,
  type CreateGroupInput,
} from "../types/group.shame";
import { useListMatch, useListUser } from "../hook/useGroup";

interface CreateClassProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGroupInput) => void;
}

export default function CreateGroup({
  isOpen,
  onClose,
  onSubmit,
}: CreateClassProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateGroupInput>({
    resolver: zodResolver(CreateGroupsSchema),
    defaultValues: {
      confirmCurrentQuestion: 0,
    },
  });

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
    refetchMatch();
    refetchUser();
  }, [refetchMatch, refetchUser, isOpen]);

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
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (formData: CreateGroupInput) => {
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
      title="Thêm nhóm mới"
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
          Thêm
        </Button>
      </form>
    </AppFormDialog>
  );
}
