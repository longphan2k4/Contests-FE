import React from "react";
import { Button, Box, Alert, AlertTitle, Typography } from "@mui/material";
import Cancel from "@mui/icons-material/Cancel";

interface EssayInputProps {
  value: string;
  isSubmitted: boolean;
  isEliminated: boolean;
  isBanned: boolean;
  banMessage: string;
  isApiSubmitting: boolean;
  isRescued: boolean;
  isInRescueMode: boolean;
  onAnswerChange: (answer: string) => void;
  onSubmitAnswer: () => void;
  canShowResult?: boolean; // Thêm prop này để đồng bộ với logic loại
}

const EssayInput: React.FC<EssayInputProps> = ({
  value,
  isSubmitted,
  isEliminated,
  isBanned,
  isApiSubmitting,
  isRescued,
  isInRescueMode,
  onAnswerChange,
  onSubmitAnswer,
  canShowResult = false,
}) => {
  const isDisabled =
    isSubmitted ||
    (isEliminated && !isRescued) ||
    (isBanned && !isRescued) ||
    isApiSubmitting ||
    isRescued ||
    isInRescueMode;
  return (
    <Box className="space-y-4 p-4">
      {/* Alert bị cấm */}
      {isBanned && !isRescued && (
        <Alert
          severity="error"
          icon={<Cancel />}
          className="border-2 border-red-500 bg-red-50 mb-4"
        >
          <AlertTitle>Bị cấm tham gia</AlertTitle>
          <Box className="space-y-3">
            <Typography variant="h6" className="font-bold text-red-800">
              Bạn đã bị cấm tham gia vì vi phạm quy chế!
            </Typography>
          </Box>
        </Alert>
      )}
      {/* Alert bị loại */}
      {isEliminated && !canShowResult && !isRescued && (
        <Alert
          severity="warning"
          icon={<Cancel />}
          className="border-2 border-orange-500 bg-orange-50 mb-4"
        >
          <AlertTitle>Đã bị loại</AlertTitle>
          <Box className="space-y-3">
            <Typography variant="h6" className="font-bold text-blue-800">
              Bạn có thể được hồi sinh!
            </Typography>
            <Typography variant="body2" className="text-blue-800">
              💡 Đừng rời đi nhé
            </Typography>
          </Box>
        </Alert>
      )}
      {(!isEliminated || isRescued) && (!isBanned || isRescued) && (
        <>
          <textarea
            value={value}
            onChange={(e) => onAnswerChange(e.target.value)}
            disabled={isDisabled}
            placeholder="Nhập câu trả lời của bạn..."
            rows={6}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1.5px solid #bdbdbd",
              padding: "12px",
              fontSize: 16,
              background: isDisabled ? "#f5f5f5" : "#fff",
              resize: "vertical",
              outline: "none",
              minHeight: 120,
              boxSizing: "border-box",
              fontFamily: "Arial, sans-serif",
            }}
          />
          <Box className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              onClick={onSubmitAnswer}
              disabled={isDisabled}
            >
              xác nhận
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default EssayInput;
