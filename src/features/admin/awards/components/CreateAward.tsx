import React, { useEffect, useMemo } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAwardSchema, type CreateAwardInput } from "../types/award.shame";
import { useListMatch } from "../hook/useListMatch";
import FormSelect from "@/components/FormSelect";
import { useParams } from "react-router-dom";

interface CreateAwardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAwardInput) => void;
}

export default function CreateAwardDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateAwardDialogProps): React.ReactElement {
  const { slug } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateAwardInput>({
    resolver: zodResolver(CreateAwardSchema),
    defaultValues: {},
  });

  const options = [
    { value: "firstPrize", label: "Giải Nhất" },
    { value: "secondPrize", label: "Giải Nhì" },
    { value: "thirdPrize", label: "Giải Ba" },
  ];

  const {
    data: matches,
    isLoading,
    isError,
    refetch,
  } = useListMatch(slug ?? "");

  useEffect(() => {
    if (isOpen) {
      reset();
      refetch();
    }
  }, [isOpen, reset]);

  const ListMatch = useMemo(() => {
    if (matches?.success && matches.data) {
      return matches.data.map((match: { id: number; name: string }) => ({
        label: match.name,
        value: match.id,
      }));
    }
    return [];
  }, [matches]);

  const handleFormSubmit = (data: CreateAwardInput) => {
    onSubmit(data);
    onClose();
  };
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError) {
    return <div>Không thể tải dữ liệu</div>;
  }

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title="Thêm giải thưởng"
        maxWidth="sm"
      >
        <form id="create-award-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <FormInput
            label="Tên giải thưởng"
            id="name"
            placeholder="Nhập tên giải thưởng"
            {...(errors.name && { error: errors.name })}
            register={register("name")}
          />

          <FormSelect
            label="Loại giải"
            id="type"
            name="type"
            placeholder="Chọn loại giải"
            options={options}
            control={control}
            error={errors.type}
          />
          <FormSelect
            label="Trận đấu"
            id="matchId"
            name="matchId"
            placeholder="Chọn trận đấu"
            options={ListMatch}
            control={control}
            error={errors.matchId}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, float: "right" }}
          >
            Thêm
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}
