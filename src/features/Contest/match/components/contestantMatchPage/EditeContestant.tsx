import React, { useEffect, useMemo } from "react";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import AppFormDialog from "../../../../../components/AppFormDialog";

import FormSelect from "../../../../../components/FormSelect";

import {
  type UpdateContestantInput,
  UpdateContestantSchema,
} from "../../../contestant/types/contestant.shame";

import {
  useContestStatus,
  useListRound,
  useGetById,
} from "../../hook/contestantMatchPage/useContestant";

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

  const { data: contestantData } = useGetById(id);

  const { slug } = useParams();

  const { data: listStatus } = useContestStatus();

  const { data: listRound } = useListRound(slug ?? null);

  const round = useMemo(() => {
    if (listRound?.success && Array.isArray(listRound.data)) {
      return listRound.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    }
    return [];
  }, [listRound]);

  const status = useMemo(() => {
    if (listStatus?.success && Array.isArray(listStatus.data.options)) {
      return listStatus.data.options.map((item: any) => ({
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
          label="Tên vòng đấu"
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
