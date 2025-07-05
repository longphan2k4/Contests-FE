import React, { useEffect, useMemo } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateAwardSchema, type UpdateAwardInput } from "../types/award.shame";
import { useAwardById } from "../hook/useAwardById";
import FromSelect from "@/components/FormSelect";
import { useParams } from "react-router-dom";
import { useListContestants } from "../hook/useListContestants";

interface EditAwardProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateAwardInput) => void;
}

export default function EditeAward({
  id,
  isOpen,
  onClose,
  onSubmit,
}: EditAwardProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<UpdateAwardInput>({
    resolver: zodResolver(UpdateAwardSchema),
  });
  const { slug } = useParams();
  const options = [
    { value: "firstPrize", label: "Giải Nhất" },
    { value: "secondPrize", label: "Giải Nhì" },
    { value: "thirdPrize", label: "Giải Ba" },
    { value: "fourthPrize", label: "Giải Khuyến Khích" },
    { value: "impressiveVideo", label: "Video Ấn Tượng" },
    { value: "excellentVideo", label: "Video Xuất Sắc" },
  ];

  const { data: award, isLoading, isError, refetch } = useAwardById(id);
  const {
    data: contestants,
    isLoading: isLoadingContestants,
    isError: isErrorContestants,
    refetch: refetchContestants,
  } = useListContestants(slug ?? "");

  const listContestants = useMemo(() => {
    if (contestants?.success && contestants.data) {
      return contestants.data.map(
        (contestant: { id: number; fullName: string }) => ({
          label: contestant.fullName,
          value: contestant.id,
        })
      );
    }
  }, [contestants]);

  useEffect(() => {
    if (isOpen) {
      refetchContestants();
      refetch();
    }
  }, [isOpen, refetchContestants, refetch]);

  useEffect(() => {
    if (isOpen && award) {
      reset({
        name: award.name,
        contestantId: award.contestantId,
        type: award.type,
      });
    }
  }, [award, reset]);

  const handleFormSubmit = (data: UpdateAwardInput) => {
    onSubmit(data);
    onClose();
  };

  if (isLoading || isLoadingContestants) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || isErrorContestants) {
    return <div>Không thể tải dữ liệu</div>;
  }

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Cập nhật giải thưởng ${award?.name}`}
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormInput
            label="Tên giải thưởng"
            id="name"
            placeholder="Nhập tên giải thưởng"
            {...(errors.name && { error: errors.name })}
            register={register("name")}
          />
          <FromSelect
            label="Thí sinh"
            id="contestantId"
            name="contestantId"
            placeholder="Chọn thí sinh"
            options={listContestants}
            control={control}
            error={errors.contestantId}
          />
          <FromSelect
            label="Loại giải"
            id="type"
            name="type"
            placeholder="Chọn loại giải"
            options={options}
            control={control}
            error={errors.type}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, float: "right" }}
          >
            Cập nhật
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}
