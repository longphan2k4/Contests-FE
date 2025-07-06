import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Paper,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import {
  Quiz,
  Timer,
  Star,
  Category,
  Numbers,
  CheckCircle,
  Close,
  ZoomIn,
  PlayArrow,
  VolumeUp,
} from "@mui/icons-material";

interface MediaData {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

interface QuestionData {
  id: number;
  content: string;
  intro?: string;
  questionType: string;
  difficulty: string;
  score: number;
  defaultTime: number;
  options: string[];
  correctAnswer?: number;
  media?: MediaData[];
}

interface CurrentQuestionData {
  order: number;
  question: QuestionData;
}

interface CurrentQuestionProps {
  currentQuestionData?: CurrentQuestionData;
  isGameStarted: boolean;
  remainingTime: number;
  isLoading: boolean;
  isTimerPaused?: boolean;
}

const CurrentQuestion: React.FC<CurrentQuestionProps> = ({
  currentQuestionData,
  isGameStarted,
  remainingTime,
  isLoading,
  isTimerPaused = false,
}) => {
  // State cho media modal
  const [selectedMedia, setSelectedMedia] = React.useState<MediaData | null>(
    null
  );
  const [mediaModalOpen, setMediaModalOpen] = React.useState(false);

  const getTimerProgress = () => {
    if (remainingTime <= 0 || !currentQuestionData) return 0;
    const maxTime = currentQuestionData.question.defaultTime;
    return Math.max(0, Math.min(100, (remainingTime / maxTime) * 100));
  };

  const formatTime = (seconds: number) => {
    const timeValue = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(timeValue / 60);
    const secs = timeValue % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (remainingTime <= 10) return "error";
    if (remainingTime <= 30) return "warning";
    return "primary";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "alpha":
        return "success";
      case "beta":
        return "warning";
      case "gamma":
        return "error";
      default:
        return "default";
    }
  };

  // Xử lý media
  const handleMediaClick = (media: MediaData) => {
    setSelectedMedia(media);
    setMediaModalOpen(true);
  };

  const handleCloseMediaModal = () => {
    setMediaModalOpen(false);
    setSelectedMedia(null);
  };

  // Component MediaGrid để hiển thị media với bố cục responsive
  const MediaGrid: React.FC<{ mediaList: MediaData[] }> = ({ mediaList }) => {
    if (!mediaList || mediaList.length === 0) return null;

    const getGridLayout = (count: number) => {
      switch (count) {
        case 1:
          return "grid-cols-1";
        case 2:
          return "grid-cols-1 sm:grid-cols-2";
        case 3:
          return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
        case 4:
        default:
          return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4";
      }
    };

    const renderMediaItem = (media: MediaData, index: number) => {
      const commonClasses =
        "relative cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 group";

      return (
        <Box
          key={media.id}
          className={commonClasses}
          onClick={() => handleMediaClick(media)}
        >
          {/* Overlay với icon */}
          <Box className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-center justify-center">
            <Box className="flex flex-col items-center text-white">
              {media.type === "image" && <ZoomIn className="text-3xl mb-1" />}
              {media.type === "video" && (
                <PlayArrow className="text-3xl mb-1" />
              )}
              {media.type === "audio" && <VolumeUp className="text-3xl mb-1" />}
              <Typography variant="caption" className="text-center px-2">
                {media.type === "image" && "Xem ảnh"}
                {media.type === "video" && "Phát video"}
                {media.type === "audio" && "Nghe audio"}
              </Typography>
            </Box>
          </Box>

          {/* Media content */}
          {media.type === "image" && (
            <img
              src={media.url}
              alt={media.title || `Media ${index + 1}`}
              className="w-full h-32 sm:h-40 md:h-48 object-cover"
              loading="lazy"
            />
          )}

          {media.type === "video" && (
            <Box className="relative">
              <video
                src={media.url}
                poster={media.thumbnail}
                className="w-full h-32 sm:h-40 md:h-48 object-cover"
                muted
                preload="metadata"
              />
              <Box className="absolute inset-0 flex items-center justify-center">
                <PlayArrow className="text-white text-4xl bg-black bg-opacity-50 rounded-full p-2" />
              </Box>
            </Box>
          )}

          {media.type === "audio" && (
            <Box className="h-32 sm:h-40 md:h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex flex-col items-center justify-center text-white">
              <VolumeUp className="text-4xl mb-2" />
              <Typography variant="body2" className="text-center px-2">
                {media.title || "File âm thanh"}
              </Typography>
            </Box>
          )}

          {/* Media title */}
          {media.title && (
            <Box className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
              <Typography
                variant="caption"
                className="text-white font-medium line-clamp-2"
              >
                {media.title}
              </Typography>
            </Box>
          )}
        </Box>
      );
    };

    return (
      <Box className="space-y-3">
        <Typography
          variant="body1"
          className="text-gray-800 font-bold flex items-center gap-2"
        >
          <Box className="w-1 h-5 bg-purple-500 rounded-full" />
          🎬 Media đính kèm ({mediaList.length})
        </Typography>
        <Box
          className={`grid gap-3 ${getGridLayout(
            mediaList.slice(0, 4).length
          )}`}
        >
          {mediaList
            .slice(0, 4)
            .map((media, index) => renderMediaItem(media, index))}
        </Box>
        {mediaList.length > 4 && (
          <Typography variant="caption" className="text-gray-500 italic">
            * Hiển thị 4/{mediaList.length} media đầu tiên
          </Typography>
        )}
      </Box>
    );
  };

  // Media Modal Component
  const MediaModal: React.FC = () => {
    if (!selectedMedia) return null;

    return (
      <Dialog
        open={mediaModalOpen}
        onClose={handleCloseMediaModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          className: "m-2 max-h-[90vh]",
        }}
      >
        <DialogContent className="p-2 relative">
          {/* Close Button */}
          <IconButton
            onClick={handleCloseMediaModal}
            className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
            size="small"
          >
            <Close />
          </IconButton>

          {/* Media Content */}
          <Box className="flex flex-col items-center">
            {selectedMedia.type === "image" && (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.title || "Media"}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            )}

            {selectedMedia.type === "video" && (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] rounded-lg"
                poster={selectedMedia.thumbnail}
              />
            )}

            {selectedMedia.type === "audio" && (
              <Box className="w-full max-w-md p-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg text-white text-center">
                <VolumeUp className="text-6xl mb-4" />
                <Typography variant="h6" className="mb-4">
                  {selectedMedia.title || "File âm thanh"}
                </Typography>
                <audio
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="w-full"
                />
              </Box>
            )}

            {/* Media Info */}
            {(selectedMedia.title || selectedMedia.description) && (
              <Box className="mt-4 p-4 bg-gray-50 rounded-lg w-full">
                {selectedMedia.title && (
                  <Typography
                    variant="h6"
                    className="font-bold text-gray-800 mb-2"
                  >
                    {selectedMedia.title}
                  </Typography>
                )}
                {selectedMedia.description && (
                  <Typography variant="body2" className="text-gray-600">
                    {selectedMedia.description}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    );
  };


  if (!isGameStarted) {
    return (
      <Card elevation={3} className="w-full border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <Box className="text-center py-12">
            <Box className="mb-4">
              <Quiz className="text-gray-300" style={{ fontSize: 60 }} />
            </Box>
            <Typography variant="h5" className="text-gray-500 mb-2 font-bold">
              Trận đấu chưa bắt đầu
            </Typography>
            <Typography variant="body1" className="text-gray-400">
              Câu hỏi sẽ hiển thị khi trận đấu bắt đầu
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !currentQuestionData) {
    return (
      <Card elevation={3} className="w-full border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <Box className="text-center py-12">
            <LinearProgress className="mb-3" />
            <Typography variant="h6" className="text-gray-500">
              🔄 Đang tải câu hỏi...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const { order, question } = currentQuestionData;
  const timerProgress = getTimerProgress();

  return (
    <Card elevation={3} className="w-full border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        {/* Question Header - Tương tự QuestionAnswer */}
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center gap-3">
            <Box className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg">
              <Quiz className="text-white" fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="h6" className="font-bold text-gray-800 mb-1">
                Câu hỏi số {order}
              </Typography>
            </Box>
          </Box>

          <Box className="flex items-center gap-2">
            <Chip
              icon={<Timer />}
              label={formatTime(remainingTime)}
              color={getTimerColor()}
              size="medium"
              className={`font-mono text-base px-4 py-2 ${
                remainingTime <= 10 ? "animate-pulse" : ""
              }`}
            />
            {isTimerPaused && (
              <Chip
                label="⏸ Tạm dừng"
                color="warning"
                className="animate-pulse"
                size="small"
              />
            )}
          </Box>
        </Box>

        {/* Timer Progress Bar - Tương tự QuestionAnswer */}
        <Box className="mb-4">
          <LinearProgress
            variant="determinate"
            value={timerProgress}
            color={getTimerColor()}
            className="h-3 rounded-full shadow-inner"
          />
          <Box className="flex justify-between items-center mt-2">
            <Typography variant="caption" className="text-gray-500">
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              Tổng thời gian: {question.defaultTime || 0}s
            </Typography>
          </Box>
        </Box>

        {/* Question Info Tags - Cải thiện */}
        <Box className="flex flex-wrap gap-2 mb-4">
          <Chip
            icon={<Category />}
            label={
              question.questionType === "multiple_choice"
                ? "Trắc nghiệm"
                : question.questionType
            }
            variant="outlined"
            size="small"
            className="px-3 py-1"
          />
          <Chip
            icon={<Star />}
            label={`Độ khó: ${question.difficulty}`}
            color={getDifficultyColor(question.difficulty)}
            size="small"
            className="px-3 py-1"
          />
          <Chip
            icon={<Numbers />}
            label={`${question.score} điểm`}
            variant="outlined"
            size="small"
            className="px-3 py-1"
          />
        </Box>

        {/* Question Intro */}
        {question.intro && (
          <Paper className="p-3 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <Typography
              variant="body2"
              className="text-blue-800 italic font-medium"
            >
              📝 {question.intro}
            </Typography>
          </Paper>
        )}

        {/* Question Content */}
        <Paper className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 mb-4">
          <Typography
            variant="body1"
            component="div"
            className="text-gray-800 font-bold mb-5 flex items-center gap-2"
          >
            <Box className="w-1 h-5 bg-blue-500 rounded-full" />
            📋 Nội dung câu hỏi
          </Typography>
          <Box
            className="text-gray-700 text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: question.content }}
            sx={{
              "& p": { margin: "0.5em 0" },
              "& strong": { fontWeight: "bold" },
              "& em": { fontStyle: "italic" },
              "& ul, & ol": { paddingLeft: "1.5em", margin: "0.5em 0" },
              "& li": { margin: "0.25em 0" },
              "& img": { maxWidth: "100%", height: "auto" },
              "& code": {
                backgroundColor: "#f3f4f6",
                padding: "0.125em 0.25em",
                borderRadius: "0.25em",
                fontFamily: "monospace",
              },
            }}
          />
        </Paper>

        {/* Question Options - Cải thiện hiển thị */}
        {question.options && question.options.length > 0 && (
          <Paper className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 mb-4">
            <Box className="space-y-3">
              {question.options.map((option, index) => {
                const isCorrect = question.correctAnswer === index;
                return (
                  <Box
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-colors ${
                      isCorrect
                        ? "bg-green-50 border-green-300 hover:border-green-400"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Box
                      className={`flex-shrink-0 w-8 h-8 text-white rounded-full flex items-center justify-center font-bold text-sm ${
                        isCorrect ? "bg-green-500" : "bg-gray-500"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </Box>
                    <Box
                      className="text-gray-700 flex-1 leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{ __html: option }}
                      sx={{
                        "& p": { margin: "0.25em 0" },
                        "& strong": { fontWeight: "bold" },
                        "& em": { fontStyle: "italic" },
                        "& img": { maxWidth: "100%", height: "auto" },
                        "& code": {
                          backgroundColor: "#f3f4f6",
                          padding: "0.125em 0.25em",
                          borderRadius: "0.25em",
                          fontFamily: "monospace",
                          fontSize: "0.9em",
                        },
                      }}
                    />
                    {isCorrect && (
                      <Box className="flex items-center gap-2">
                        <CheckCircle
                          className="text-green-600 flex-shrink-0"
                          fontSize="small"
                        />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Paper>
        )}

        {/* Media Grid */}
        {question.media && question.media.length > 0 && (
          <Paper className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200">
            <MediaGrid mediaList={question.media} />
          </Paper>
        )}
      </CardContent>

      {/* Media Modal */}
      <MediaModal />
    </Card>
  );
};

export default CurrentQuestion;
