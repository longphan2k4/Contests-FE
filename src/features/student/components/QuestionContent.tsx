import React from "react";
import { Box, Typography, Card, CardContent, Divider } from "@mui/material";
import MediaGrid from "./MediaGrid";

interface MediaData {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

interface QuestionContentProps {
  intro?: string;
  content: string;
  media?: MediaData[];
  onMediaClick: (media: MediaData) => void;
  children?: React.ReactNode;
}

const QuestionContent: React.FC<QuestionContentProps> = ({
  intro,
  content,
  media,
  onMediaClick,
  children,
}) => {
  return (
    <Card>
      <CardContent>
        {intro && (
          <Typography variant="body2" className="text-gray-600 mb-3 italic">
            📝 {intro}
          </Typography>
        )}

        <Box
          className="text-gray-800 mb-4 text-lg font-semibold"
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />

        <Divider className="mb-4" />

        {/* Media Grid */}
        {media && media.length > 0 && (
          <Box className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <MediaGrid
              mediaList={media}
              onMediaClick={onMediaClick}
              currentQuestionMediaCount={media.length}
            />
          </Box>
        )}

        {/* Render children (options) chung nền trắng */}
        {children}
      </CardContent>
    </Card>
  );
};

export default QuestionContent;
