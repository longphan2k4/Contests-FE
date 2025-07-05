import React, { useEffect, useMemo, useState } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateStudentSchema,
  type CreateStudentInput,
} from "../types/student.shame";
import { useClasses } from "../hook/useGetClass";
import FormSwitch from "../../../../components/FormSwitch";
import FromSelect from "@components/FormSelect";
import { useListUserStudent } from "../hook/useListUserStudent";

interface CreateStudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export default function CreateStudentDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateStudentDialogProps): React.ReactElement {
  const { data, isLoading, isError, refetch } = useClasses();
  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    refetch: refetchUser,
  } = useListUserStudent();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const listClass = useMemo(() => {
    if (data?.success) {
      return data.data.map((item: { id: number; name: string }) => ({
        label: item.name,
        value: item.id,
      }));
    }
    return [];
  }, [data]);

  const listUserStudent = useMemo(() => {
    if (userData?.success) {
      return userData.data.map((item: { id: number; username: string }) => ({
        label: item.username,
        value: item.id,
      }));
    }
    return [];
  }, [userData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateStudentInput>({
    resolver: zodResolver(CreateStudentSchema),
    defaultValues: {
      isActive: true,
      classId: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      refetch();
      refetchUser();
      setImageFile(null);
      setImagePreview(null);
    }
  }, [isOpen]);

  const handleFormSubmit = (data: any) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("fullName", data?.fullName);
      formData.append("studentCode", data?.studentCode ?? "");
      formData.append("bio", data?.bio ?? "");
      formData.append("userId", data?.userId?.toString() ?? "");
      formData.append("classId", data?.classId?.toString() ?? "");
      formData.append("isActive", String(data?.isActive));
      formData.append("avatar", imageFile);
      onSubmit(formData);
      onClose();
    } else {
      onSubmit(data);
      onClose();
    }
  };

  if (isLoading || isLoadingUser) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || isErrorUser) return <div>Không thể tải dữ liệu</div>;

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title="Thêm học sinh mới"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormInput
          label="Họ và tên"
          id="fullName"
          placeholder="Nhập họ và tên"
          error={errors.fullName}
          register={register("fullName")}
        />

        <FromSelect
          label="Tài khoản học sinh"
          id="userId"
          placeholder="Chọn tài khoản học sinh"
          options={listUserStudent}
          control={control}
          error={errors.userId}
          name="userId"
        />

        <FromSelect
          label="Lớp học"
          id="classId"
          placeholder="Chọn lớp học"
          options={listClass}
          control={control}
          error={errors.classId}
          name="classId"
        />

        <FormInput
          label="Mã học sinh"
          id="studentCode"
          placeholder="Nhập mã học sinh"
          error={errors.studentCode}
          register={register("studentCode")}
        />

        <FormInput
          label="Link video giới thiệu"
          id="bio"
          placeholder="Nhập link video giới thiệu"
          error={errors.bio}
          register={register("bio")}
        />

        {/* Upload ảnh */}
        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Ảnh đại diện
        </Typography>
        <label htmlFor="image-upload">
          <Box
            sx={{
              mt: 1,
              border: "2px dashed #ccc",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 100,
              backgroundColor: "#fafafa",
            }}
          >
            {imageFile ? (
              <Typography variant="body2" color="primary">
                {imageFile.name}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nhấn để chọn ảnh
              </Typography>
            )}
          </Box>
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              setImageFile(file);
              setImagePreview(URL.createObjectURL(file));
            }
          }}
        />
        {imagePreview && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setImageFile(null);
              setImagePreview(null);
            }}
            sx={{ mt: 1 }}
          >
            Xóa ảnh
          </Button>
        )}

        {/* Preview ảnh */}
        <Box
          sx={{
            mt: 1,
            border: "2px dashed #ccc",
            borderRadius: 2,
            p: 2,
            textAlign: "center",
            height: 100,
            backgroundColor: "#fafafa",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="preview"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Ảnh đại diện sẽ hiển thị ở đây
            </Typography>
          )}
        </Box>

        {errors.avatar && (
          <Typography variant="caption" color="error">
            {errors.avatar.message as string}
          </Typography>
        )}

        <Controller
          name="isActive"
          control={control}
          defaultValue={true}
          render={({ field }) => (
            <FormSwitch
              label="Kích hoạt tài khoản"
              value={field.value}
              onChange={field.onChange}
            />
          )}
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
  );
}
