import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Checkbox,
} from "@mui/material";
import { format } from "date-fns";
import { GridDeleteIcon } from "@mui/x-data-grid";
import type { Contest } from "../types";

interface ContestCardProps {
  contest: Contest;
  onView?: (contestId: number) => void;
  onEdit?: (contestId: number) => void;
  onDelete?: (contestId: number) => void;
  selected?: boolean;
  onSelect?: () => void;
}

const ContestCard: React.FC<ContestCardProps> = ({
  contest,
  onEdit,
  onDelete,
  selected = false,
  onSelect,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log(contest?.slug);
    if (contest) {
      navigate(`/admin/cuoc-thi/${contest.slug}`);
    }
  };

  return (
    <Box>
      <Card
        sx={{
          width: "100%",
          position: "relative",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          },
          border: selected ? "2px solid #1976d2" : "none",
        }}
      >
        {/* Checkbox chọn nhiều - trái trên mobile, phải trên desktop */}
        {onSelect && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              right: "auto",
              zIndex: 2,
            }}
          >
            <Checkbox
              checked={selected}
              onChange={onSelect}
              onClick={(e) => e.stopPropagation()}
              sx={{
                color: "primary.main",
                "&.Mui-checked": { color: "primary.main" },
                p: 0.5,
              }}
            />
          </Box>
        )}
        {/* Icon xoá luôn ở góc phải */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
          }}
        >
          <Tooltip title="Xoá">
            <IconButton
              onClick={() => onDelete?.(contest.id)}
              size="small"
              color="primary"
            >
              <GridDeleteIcon style={{ color: "red" }} />
            </IconButton>
          </Tooltip>
        </Box>
        <CardActionArea onClick={handleCardClick}>
          <CardContent sx={{ pt: 5 }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                maxWidth: 270,
                pl: { xs: onSelect ? 4 : 0, sm: onSelect ? 4 : 0, md: 0 },
              }}
            >
              {contest.name || "Chưa có tên"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 2,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {contest.description}
            </Typography>
            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={contest.status}
                color={contest.status === "upcoming" ? "primary" : "default"}
                size="small"
                sx={{ fontWeight: "medium" }}
              />
              <Chip
                label={contest.isActive ? "Đang diễn ra" : "Đã kết thúc"}
                color={contest.isActive ? "success" : "error"}
                size="small"
                sx={{ fontWeight: "medium" }}
              />
            </Box>
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 1, color: "text.secondary" }}
            >
              <strong>Địa điểm:</strong> {contest.location}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 1, color: "text.secondary" }}
            >
              <strong>Thời gian:</strong>{" "}
              {format(new Date(contest.startTime), "dd/MM/yyyy HH:mm")} -{" "}
              {format(new Date(contest.endTime), "dd/MM/yyyy HH:mm")}
            </Typography>
            {contest.slogan && (
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 1, fontStyle: "italic", color: "text.secondary" }}
              >
                <strong>Slogan:</strong> {contest.slogan}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
        <Button
          fullWidth
          size="medium"
          color="primary"
          onClick={() => onEdit?.(contest.id)}
        >
          Chỉnh sửa
        </Button>
      </Card>
    </Box>
  );
};

export default ContestCard;
