import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  QuestionControl,
  AnswerControl,
  ContestantsControl,
  QuestionHeader,
  SupplierVideo,
  AudienceRescueControl,
} from "../components";
import QuestionDetails from "../components/QuestionDetails";
import BackgroundControl from "../components/BackgroundControl";
import CurrentContestants from "../components/CurrentContestants";
import {
  useCurrentQuestion,
  useListQuestion,
  useMatchInfo,
  useScreenControl,
  useCountContestant,
} from "../hook/useControls";
import {
  type MatchInfo,
  type Question,
  type countContestant,
  type SceenControl,
  type CurrentQuestion,
} from "../type/control.type";
import { useSocket } from "../../../../contexts/SocketContext";
import { Box, CircularProgress } from "@mui/material";

// Define types for socket responses
interface SocketResponse {
  success: boolean;
  message?: string;
}

interface TimerUpdateData {
  timeRemaining: number;
}

const ControlsPage: React.FC = () => {
  const { match } = useParams();
  const { socket, isConnected } = useSocket();

  // 1. State
  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
  const [currentQuestion, setCurrentQuestion] =
    useState<CurrentQuestion | null>(null);
  const [countContestant, setCountContestant] =
    useState<countContestant | null>(null);
  const [listQuestion, setListQuestion] = useState<Question[]>([]);
  const [screenControl, setScreenControl] = useState<SceenControl | null>(null);

  const {
    data: matchInfoRes,
    isLoading: isLoadingMatch,
    isSuccess: isSuccessMatch,
  } = useMatchInfo(match ?? null);
  const {
    data: currentQuestionRes,
    isLoading: isLoadingCurrentQuestion,
    isSuccess: isSuccessCurrentQuestion,
  } = useCurrentQuestion(match ?? null);
  const {
    data: countContestantRes,
    isLoading: isLoadingCount,
    isSuccess: isSuccessCount,
  } = useCountContestant(match ?? null);
  const {
    data: listQuestionRes,
    isLoading: isLoadingQuestions,
    isSuccess: isSuccessQuestions,
  } = useListQuestion(match ?? null);
  const {
    data: screenControlRes,
    isLoading: isLoadingControl,
    isSuccess: isSuccessControl,
  } = useScreenControl(match ?? null);

  useEffect(() => {
    if (isSuccessMatch) setMatchInfo(matchInfoRes.data);
  }, [isSuccessMatch, matchInfoRes]);

  useEffect(() => {
    if (isSuccessCurrentQuestion) setCurrentQuestion(currentQuestionRes.data);
  }, [isSuccessCurrentQuestion, currentQuestionRes]);

  useEffect(() => {
    if (isSuccessCount) setCountContestant(countContestantRes.data);
  }, [isSuccessCount, countContestantRes]);

  useEffect(() => {
    if (isSuccessQuestions) setListQuestion(listQuestionRes.data);
  }, [isSuccessQuestions, listQuestionRes]);

  useEffect(() => {
    if (isSuccessControl) setScreenControl(screenControlRes.data);
  }, [isSuccessControl, screenControlRes]);

  // Di chuyển useEffect của socket lên trước isLoading
  useEffect(() => {
    if (!socket) {
      return () => {};
    }

    const handleScreenUpdate = (data: { updatedScreen: SceenControl }) => {
      setScreenControl(data?.updatedScreen);
    };

    const handleCurrentQuestion = (data: {
      matchInfo: MatchInfo;
      currentQuestion: CurrentQuestion;
    }) => {
      setMatchInfo({ ...data?.matchInfo });
      setCurrentQuestion({ ...data?.currentQuestion });
    };

    const handleUpdateTime = (data: TimerUpdateData) => {
      const newTime = data?.timeRemaining;
      setMatchInfo((prev) =>
        prev ? { ...prev, remainingTime: newTime } : prev
      );
    };

    socket.on("screen:update", handleScreenUpdate);
    socket.on("currentQuestion:get", handleCurrentQuestion);
    socket.on("timer:update", handleUpdateTime);

    return () => {
      socket.off("screen:update", handleScreenUpdate);
      socket.off("currentQuestion:get", handleCurrentQuestion);

      socket.off("timer:update", handleUpdateTime);
    };
  }, [socket]);

  // Handle audience rescue controls
  const handleShowQR = (rescueId: number) => {
    // Emit socket event để hiển thị QR trên màn hình chiếu
    if (socket) {
      socket.emit(
        "audience:showQR",
        {
          match: match,
          rescueId: rescueId,
          matchSlug: match,
        },
        // (response: SocketResponse) => {
        //   if (response?.success) {
        //     console.log("✅ Show QR successful:", response.message);
        //   } else {
        //     console.error("❌ Show QR failed:", response?.message);
        //   }
        // }
      );
    }
  };

  const handleShowChart = (rescueId: number) => {
    // Emit socket event để hiển thị chart trên màn hình chiếu
    if (socket) {
      socket.emit(
        "audience:showChart",
        {
          match: match,
          rescueId: rescueId,
          matchSlug: match,
        },
        // (response: SocketResponse) => {
        //   if (response?.success) {
        //     console.log("✅ Show Chart successful:", response.message);
        //   } else {
        //     console.error("❌ Show Chart failed:", response?.message);
        //   }
        // }
      );
    }
  };

  const handleHideAll = () => {
    // Emit socket event để ẩn audience display
    if (socket) {
      socket.emit(
        "audience:hide",
        {
          match: match,
          matchSlug: match,
        },
        (response: SocketResponse) => {
          if (response?.success) {
            console.log("✅ Hide All successful:", response.message);
          } else {
            console.error("❌ Hide All failed:", response?.message);
          }
        }
      );
    }
  };

  const isLoading =
    isLoadingMatch ||
    isLoadingCurrentQuestion ||
    isLoadingCount ||
    isLoadingQuestions ||
    isLoadingControl;

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <div className="flex w-full transition-all duration-300">
        <QuestionDetails
          questions={listQuestion}
          currentQuestion={matchInfo?.currentQuestion}
        />
        <div className="w-4/5 p-8 flex flex-col overflow-y-auto max-h-screen">
          <QuestionHeader
            questionOrder={matchInfo?.currentQuestion}
            timeRemaining={matchInfo?.remainingTime}
            totalQuestions={listQuestion.length}
            totalTime={currentQuestion?.defaultTime}
            matchNumber={matchInfo?.name}
          />
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 tracking-tight mb-4">
              Trạng thái điều khiển
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                <h3 className="text-blue-800 font-medium mb-1">
                  Màn hình chiếu
                </h3>
                <p className="text-blue-700 text-sm">
                  <Link to={`/tran-dau/${match}`}>Màn hình chiếu</Link>
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                <h3 className="text-green-800 font-medium mb-1">Socket.IO</h3>
                <p className="text-green-700 text-sm">
                  {isConnected === true ? `Đã kết nối ` : "Chưa kết nối"}
                </p>
              </div>
              <div className="bg-indigo-100 p-4 rounded-lg border border-indigo-200">
                <h3 className="text-indigo-800 font-medium mb-1">Đang chiếu</h3>
                <p className="text-indigo-700 text-sm font-semibold">
                  {screenControl?.controlKey}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
            <BackgroundControl />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
              <QuestionControl remainingTime={matchInfo?.remainingTime} />
            </div>
            <div className="grid grid-col-1">
              <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
                <CurrentContestants
                  countIn_progress={countContestant?.countIn_progress}
                  total={countContestant?.total}
                  currentQuestion={matchInfo?.currentQuestion}
                />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
                <AnswerControl currentQuestion={currentQuestion} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
            <SupplierVideo currentQuestion={currentQuestion} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
            <ContestantsControl />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
            <AudienceRescueControl
              matchSlug={match}
              currentQuestionOrder={currentQuestion?.questionOrder}
              onShowQR={handleShowQR}
              onShowChart={handleShowChart}
              onHideAll={handleHideAll}
            />
          </div>
          <div>
            <Link
              className="block text-center w-full btn bg-red-500 hover:bg-red-600 cursor-pointer text-white font-bold p-2 rounded-lg"
              to={"/admin"}
            >
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsPage;
