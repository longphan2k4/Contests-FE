import React from "react";
import { Box, Typography, Alert } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";

interface QuestionResultProps {
  answerResult: {
    isCorrect: boolean;
    correctAnswer: string | number[];
    explanation?: string;
    score: number;
    eliminated: boolean;
    questionOrder: number;
    submittedAt: string;
  } | null;
  selectedAnswer: string;
  canShowResult: boolean;
  pendingResult: {
    isCorrect: boolean;
    correctAnswer: string | number[];
    explanation?: string;
    score: number;
    eliminated: boolean;
    questionOrder: number;
    submittedAt: string;
  } | null;
  isSubmitted: boolean;
}

const QuestionResult: React.FC<QuestionResultProps> = ({
  answerResult,
  selectedAnswer,
  canShowResult,
  pendingResult,
  isSubmitted,
}) => {


  return (
    <Box className="space-y-4">


      {/* Thông báo đã gửi, đang chờ hiển thị kết quả */}
      {isSubmitted && pendingResult && !answerResult && !canShowResult && (
        <Alert severity="info" className="mt-3 border-2 border-blue-200">
          <Box className="flex items-center gap-2">
            <Typography variant="body1" className="font-medium text-blue-800">
              Đã gửi{" "}
              {selectedAnswer === "[KHÔNG CHỌN ĐÁP ÁN]"
                ? "yêu cầu bỏ qua câu hỏi" // 🔧 Thông báo khác khi không chọn
                : "đáp án"}{" "}
              thành công!
            </Typography>
          </Box>
          <Typography variant="body2" className="text-blue-600 mt-1">
            Kết quả sẽ được hiển thị khi hết thời gian...
          </Typography>
        </Alert>
      )}

      {/* Kết quả */}
      {canShowResult && answerResult && (
        <Box className="mt-6 space-y-4">
          {/* Alert kết quả chính */}
          <Alert
            severity={answerResult.isCorrect ? "success" : "error"}
            className="border-2"
            icon={
              answerResult.isCorrect ? (
                <CheckCircle className="text-2xl" />
              ) : (
                <Cancel className="text-2xl" />
              )
            }
          >
            <Box className="space-y-2">
              <Typography variant="h6" className="font-bold">
                {answerResult.isCorrect
                  ? `🎉 Chính xác!`
                  : selectedAnswer === "[KHÔNG CHỌN ĐÁP ÁN]"
                  ? " Bạn không chọn đáp án nào!" // 🔧 Thông báo đặc biệt
                  : " Bạn đã bị loại khỏi trận đấu"}
              </Typography>

              <Typography variant="body1" className="font-medium">
                <span className="text-gray-700">Đáp án của bạn: </span>
                <span
                  className={
                    answerResult.isCorrect ? "text-green-700" : "text-red-700"
                  }
                >
                  {selectedAnswer === "[KHÔNG CHỌN ĐÁP ÁN]"
                    ? "❌ Không chọn đáp án nào" // 🔧 Hiển thị rõ ràng hơn
                    : selectedAnswer}
                </span>
              </Typography>

              {!answerResult.isCorrect && (
                <Typography variant="body1" className="font-medium">
                  <span className="text-gray-700">Đáp án đúng: </span>
                  <span className="text-green-700 font-bold">
                    {answerResult.correctAnswer}
                  </span>
                </Typography>
              )}
            </Box>
          </Alert>
          {/* Giải thích */}
          {answerResult.explanation && (
            <Box className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
              <Typography
                variant="subtitle1"
                className="text-blue-800 font-bold mb-2 flex items-center gap-2"
              >
                💡 Giải thích chi tiết:
              </Typography>
              <Typography
                variant="body1"
                className="text-blue-700 leading-relaxed"
              >
                {answerResult.explanation}
              </Typography>
            </Box>
          )}
          {/* Cảnh báo bị loại
          {answerResult.eliminated && (
            <Alert
              severity="error"
              className="border-2 border-red-500 bg-red-50"
            >
              <Typography variant="h6" className="font-bold text-red-800">
                ⚠️ Bạn đã bị loại khỏi trận đấu!
              </Typography>
              <Typography variant="body2" className="text-red-700 mt-1">
                {selectedAnswer === "[KHÔNG CHỌN ĐÁP ÁN]"
                  ? "Do không chọn đáp án nào" // 🔧 Thông báo cụ thể
                  : "Do trả lời sai câu hỏi"}
              </Typography>
            </Alert>
          )} */}


        </Box>
      )}
    </Box>
  );
};

export default QuestionResult;
