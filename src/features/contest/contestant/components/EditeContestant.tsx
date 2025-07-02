import React, { useEffect, useMemo } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import AppFormDialog from "../../../../components/AppFormDialog";

import FormSelect from "../../../../components/FormSelect";

import {
  type UpdateContestantInput,
  UpdateContestantSchema,
} from "../types/contestant.shame";

import {
  useContestStatus,
  useListRound,
  useGetById,
} from "../hook/useContestant";

interface EditecontestantProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateContestantInput) => void;
}

export default function EditeContestant({
  id,
  isOpen,
  onClose,
  onSubmit,
}: EditecontestantProps): React.ReactElement {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<UpdateContestantInput>({
    resolver: zodResolver(UpdateContestantSchema),
  });

  const { slug } = useParams();

  const {
    data: contestantData,
    isLoading: isLoadingContestant,
    isError: isErrorContestant,
    refetch: refetchContestant,
  } = useGetById(id);

  const {
    data: listStatus,
    isLoading: isLoadingStatus,
    isError: isErrorStatus,
    refetch: refetchStatus,
  } = useContestStatus();

  const {
    data: listRound,
    isLoading: isLoadingRound,
    isError: isErrorRound,
    refetch: refetchRound,
  } = useListRound(slug ?? null);

  useEffect(() => {
    if (isOpen) {
      refetchContestant();
      refetchStatus();
      refetchRound();
    }
  }, [isOpen, refetchContestant, refetchStatus, refetchRound]);

  const round = useMemo(() => {
    if (listRound?.success && Array.isArray(listRound.data)) {
      return listRound.data.map((item: { id: number; name: string }) => ({
        label: item.name,
        value: item.id,
      }));
    }
    return [];
  }, [listRound]);

  const status = useMemo(() => {
    if (listStatus?.success && Array.isArray(listStatus.data.options)) {
      return listStatus.data.options.map((item: { label: string; value: string }) => ({
        label: item.label,
        value: item.value,
      }));
    }
    return [];
  }, [listStatus]);

  useEffect(() => {
    if (isOpen && contestantData) {
      reset({
        status: contestantData.status,
        roundId: contestantData.roundId,
      });
    }
  }, [isOpen, contestantData, reset]);

  const handleFormSubmit = (formData: UpdateContestantInput) => {
    onSubmit(formData);
    onClose();
  };

  if (isLoadingContestant || isLoadingStatus || isLoadingRound) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isErrorContestant || isErrorStatus || isErrorRound) {
    return <div>Không thể tải dữ liệu</div>;
  }

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title={`Cập nhật thí sinh : ${contestantData?.student.fullName || ""}`}
      maxWidth="sm"
    >
      <form id="create-class-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <FormSelect
          id="roundId"
          name="roundId"
          label="Tên vòng đấu"
          options={round}
          control={control}
          error={errors.roundId}
        />

        <FormSelect
          id="status"
          name="status"
          label="Trạng thái"
          options={status}
          control={control}
          error={errors.status}
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
