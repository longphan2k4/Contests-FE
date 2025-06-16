import React, { useEffect,useMemo } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button,Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateSponsorSchema, type UpdateSponsorInput } from "../types/sponsors.shame";

import { useSponsorById } from "../hook/useSponsorById";

interface EditSponsorProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateSponsorInput) => void;
}


export default function EditSponsor({
  id,
  isOpen,
  onClose,
  onSubmit,
}: EditSponsorProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<UpdateSponsorInput>({
    resolver: zodResolver(UpdateSponsorSchema),
  });

  const { data: sponsor } = useSponsorById(id);

  useEffect(() => {
    if (sponsor) {
      reset({
        name: sponsor.name,
        logo: sponsor.logo ?? "",
        images: sponsor.images ?? "",
        videos: sponsor.videos ?? "",
        contestId: sponsor.contestId,
      });
    }
  }, [sponsor, reset]);


    const logoFile = watch("logo")?.[0];
  const imagesFile = watch("images")?.[0];
  const videoUrl = watch("videos");

  const logoPreview = useMemo(() => {
    if (logoFile instanceof File) return URL.createObjectURL(logoFile);
    if (typeof sponsor?.logo === "string") return sponsor.logo;
    return undefined;
  }, [logoFile, sponsor?.logo]);

  const imagePreview = useMemo(() => {
    if (imagesFile instanceof File) return URL.createObjectURL(imagesFile);
    if (typeof sponsor?.images === "string") return sponsor.images;
    return undefined;
  }, [imagesFile, sponsor?.images]);

  const handleFormSubmit = (data: UpdateSponsorInput) => {
    onSubmit(data);
    onClose();
  };
  
function convertYoutubeUrlToEmbed(url?: string): string {
  if (!url) return "";
  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(regExp);
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
}
  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Cập nhật ${sponsor?.name ?? "nhà tài trợ"}`}
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormInput
            label="Tên nhà tài trợ"
            id="name"
            placeholder="Nhập tên nhà tài trợ"
            error={errors.name}
            register={register("name")}
          />
     {/* Logo */}
        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Logo (ảnh)
        </Typography>
        <label htmlFor="logo-upload">
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
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#fafafa",
            }}
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="logo-preview"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nhấn để chọn logo
              </Typography>
            )}
          </Box>
        </label>
        <input
          id="logo-upload"
          type="file"
          accept="image/*"
          {...register("logo")}
          style={{ display: "none" }}
        />
        {errors.logo && (
          <Typography variant="caption" color="error">
            {errors.logo.message as string}
          </Typography>
        )}

        {/* Hình ảnh */}
        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Hình ảnh giới thiệu (nếu có)
        </Typography>
        <label htmlFor="images-upload">
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
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#fafafa",
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="image-preview"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nhấn để chọn ảnh
              </Typography>
            )}
          </Box>
        </label>
        <input
          id="images-upload"
          type="file"
          accept="image/*"
          {...register("images")}
          style={{ display: "none" }}
        />
        {errors.images && (
          <Typography variant="caption" color="error">
            {errors.images.message as string}
          </Typography>
        )}
   
     
        {/* Video (URL) */}
        <FormInput
          label="Video giới thiệu (URL)"
          id="videos"
          placeholder="https://youtube.com/..."
          register={register("videos")}
        />
        {videoUrl && (
          <Box mt={2}>
            <Typography variant="subtitle2">Xem trước video:</Typography>
            <Box mt={1}>
              <iframe
                width="100%"
                height="250"
                src={convertYoutubeUrlToEmbed(videoUrl)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="video preview"
              ></iframe>
            </Box>
          </Box>
        )}
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