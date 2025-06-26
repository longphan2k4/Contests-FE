import React, { useState, useEffect } from "react";
import QRCodeDisplay from "../../../admin/controls/components/QRCodeDisplay";
import RescueStatsDisplay from "../QuestionDisplay/RescueStatsDisplay";
import { useSocket } from "../../../../contexts/SocketContext";
import {
  useMatchInfo,
  useCurrentQuestion,
} from "../../../admin/controls/hook/useControls";

interface AudienceState {
  type: "none" | "qr" | "chart";
  rescueId?: number;
  matchSlug?: string;
}

interface AudienceDisplayProps {
  matchSlug?: string;
}

const AudienceDisplay: React.FC<AudienceDisplayProps> = ({ matchSlug }) => {
  const { socket } = useSocket();
  const [displayState, setDisplayState] = useState<AudienceState>({
    type: "none",
  });

  // Lấy thông tin match và current question để truyền vào QRCodeDisplay
  const { data: matchInfoRes } = useMatchInfo(matchSlug ?? null);
  const { data: currentQuestionRes } = useCurrentQuestion(matchSlug ?? null);

  const matchInfo = matchInfoRes?.data;
  const currentQuestion = currentQuestionRes?.data;

  useEffect(() => {
    if (!socket) return;

    const handleShowQR = (data: { rescueId: number; matchSlug: string }) => {
      setDisplayState({
        type: "qr",
        rescueId: data.rescueId,
        matchSlug: data.matchSlug,
      });
    };

    const handleShowChart = (data: { rescueId: number }) => {
      setDisplayState({
        type: "chart",
        rescueId: data.rescueId,
      });
    };

    const handleHide = () => {
      setDisplayState({ type: "none" });
    };

    // Listen for socket events from controls
    socket.on("audience:showQR", handleShowQR);
    socket.on("audience:showChart", handleShowChart);
    socket.on("audience:hide", handleHide);

    return () => {
      socket.off("audience:showQR", handleShowQR);
      socket.off("audience:showChart", handleShowChart);
      socket.off("audience:hide", handleHide);
    };
  }, [socket]);

  // Không hiển thị gì nếu type là none
  if (displayState.type === "none") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {displayState.type === "qr" &&
        displayState.rescueId &&
        displayState.matchSlug && (
          <QRCodeDisplay
            rescueId={displayState.rescueId}
            matchSlug={displayState.matchSlug}
            matchName={matchInfo?.name}
            currentQuestionOrder={currentQuestion?.questionOrder}
          />
        )}

      {displayState.type === "chart" && displayState.rescueId && (
        <RescueStatsDisplay
          rescueId={displayState.rescueId}
          autoRefresh={true}
          refreshInterval={3000}
        />
      )}
    </div>
  );
};

export default AudienceDisplay;
