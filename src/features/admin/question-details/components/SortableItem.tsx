import React from "react";
import { ListItem, ListItemText, Box, Chip, Typography } from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { QuestionDetail } from "../types";

interface SortableItemProps {
  id: string;
  question: QuestionDetail;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, question }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  // Thêm hàm chuyển đổi HTML thành text
  const stripHtml = (html: string | undefined) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        bgcolor: "background.paper",
        "&:hover": { bgcolor: "action.hover" },
        mb: 1,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        cursor: "grab",
      }}
    >
      <Box
        {...attributes}
        {...listeners}
        sx={{
          mr: 2,
          color: "text.secondary",
          display: "flex",
          alignItems: "center",
          cursor: "grab",
        }}
      >
        <DragHandleIcon />
        <Box sx={{ ml: 1, fontWeight: "bold", width: 30 }}>
          {question.questionOrder}
        </Box>
      </Box>
      <ListItemText
        primary={stripHtml(question.question?.content) || "Không có tiêu đề"}
        secondary={
          <Box sx={{ display: "flex", gap: 1, mt: 0.5, alignItems: "center" }}>
            <Chip
              size="small"
              label={
                question.question?.questionType === "multiple_choice"
                  ? "Trắc nghiệm"
                  : "Tự luận"
              }
              color={
                question.question?.questionType === "multiple_choice"
                  ? "primary"
                  : "secondary"
              }
            />
            <Chip
              size="small"
              label={question.question?.difficulty}
              color={
                question.question?.difficulty === "Alpha"
                  ? "info"
                  : question.question?.difficulty === "Beta"
                  ? "warning"
                  : question.question?.difficulty === "Gold"
                  ? "success"
                  : "default"
              }
            />
            <Typography
              variant="body2"
              component="span"
              sx={{
                fontWeight: 600,
                color: question.isActive ? "success.main" : "error.main",
                ml: 1,
              }}
            >
              {question.isActive ? "Đang hoạt động" : "Vô hiệu hóa"}
            </Typography>
          </Box>
        }
        secondaryTypographyProps={{
          component: "div",
        }}
      />
    </ListItem>
  );
};
