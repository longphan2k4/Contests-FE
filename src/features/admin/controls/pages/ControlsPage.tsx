import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  QuestionControl,
  AnswerControl,
  ContestantsControl,
  QuestionHeader,
  SupplierVideo,
  AudienceRescueControl,
  VideoControl,
  StatusControl,
  RescueControl,
  ContestantsWinnerControlPanel,
} from "../components";
import { OnlineExamControl } from "../../controlsOnline";
import QuestionDetails from "../components/QuestionDetails";
import BackgroundControl from "../components/BackgroundControl";
import CurrentContestants from "../components/CurrentContestants";
import AwardControl from "../components/AwardControl";
import {
  useCurrentQuestion,
  useListQuestion,
  useMatchInfo,
  useScreenControl,
  useCountContestant,
  useListClassVideo,
  useListSponsorMedia,
  useListContestant,
  useListRescueLifelineUsed,
} from "../hook/useControls";
import {
  type MatchInfo,
  type Question,
  type countContestant,
  type SceenControl,
  type CurrentQuestion,
  type MediaType,
  type ListContestant,
  type ListRescueLifelineUsed,
} from "../type/control.type";
import { useSocket } from "@contexts/SocketContext";
import { Box, CircularProgress } from "@mui/material";

// Define types for socket responses

interface TimerUpdateData {
  timeRemaining: number;
}

interface ContestantStatusUpdate {
  ListContestant?: ListContestant[];
}

const ControlsPage: React.FC = () => {
  const { match, slug } = useParams();
  const { socket, isConnected } = useSocket();

  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
  const [currentQuestion, setCurrentQuestion] =
    useState<CurrentQuestion | null>(null);
  const [countContestant, setCountContestant] =
    useState<countContestant | null>(null);
  const [listQuestion, setListQuestion] = useState<Question[]>([]);
  const [screenControl, setScreenControl] = useState<SceenControl | null>(null);
  const [listContestant, setListContestant] = useState<ListContestant[]>([]);
  const [sponsorMedia, setSponsorMedia] = useState<MediaType[]>([]);
  const [classVideo, setClassVideo] = useState<MediaType[]>([]);
  const [listRescueLifelineUsed, setListRescueLifelineUsed] = useState<
    ListRescueLifelineUsed[]
  >([]);
  const {
    data: matchInfoRes,
    isLoading: isLoadingMatch,
    isSuccess: isSuccessMatch,
    isError,
    refetch: refetchMatchInfo,
  } = useMatchInfo(match ?? null);
  const {
    data: currentQuestionRes,
    isLoading: isLoadingCurrentQuestion,
    isSuccess: isSuccessCurrentQuestion,
    isError: isErrorCurrentQuestion,
    refetch: refetchCurrentQuestion,
  } = useCurrentQuestion(match ?? null);
  const {
    data: countContestantRes,
    isLoading: isLoadingCount,
    isSuccess: isSuccessCount,
    isError: isErrorCount,
    refetch: refetchCountContestant,
  } = useCountContestant(match ?? null);
  const {
    data: listQuestionRes,
    isLoading: isLoadingQuestions,
    isSuccess: isSuccessQuestions,
    isError: isErrorQuestions,
    refetch: refetchListQuestion,
  } = useListQuestion(match ?? null);
  const {
    data: screenControlRes,
    isLoading: isLoadingControl,
    isSuccess: isSuccessControl,
    isError: isErrorControl,
    refetch: refetchScreenControl,
  } = useScreenControl(match ?? null);

  const {
    data: listRescueLifelineUsedRes,
    isLoading: isLoadingListRescueLifelineUsed,
    isSuccess: isSuccessListRescueLifelineUsed,
    isError: isErrorListRescueLifelineUsed,
    refetch: refetchListRescueLifelineUsed,
  } = useListRescueLifelineUsed(match ?? null);

  const {
    data: sponsorMediaRes,
    isLoading: isLoadingSponsorMedia,
    isSuccess: isSuccessSponsorMedia,
    isError: isErrorSponsorMedia,
    refetch: refetchSponsorMedia,
  } = useListSponsorMedia(slug ?? null);

  const {
    data: classVideoRes,
    isLoading: isLoadingClassVideo,
    isSuccess: isSuccessClassVideo,
    isError: isErrorClassVideo,
    refetch: refetchClassVideo,
  } = useListClassVideo(slug ?? null);
  const {
    data: listContestantRes,
    isLoading: isLoadingContestants,
    isSuccess: isSuccessContestants,
    isError: isErrorContestants,
    refetch: refetchListContestant,
  } = useListContestant(match ?? null);

  useEffect(() => {
    refetchMatchInfo();
    refetchCurrentQuestion();
    refetchCountContestant();
    refetchListQuestion();
    refetchScreenControl();
    refetchSponsorMedia();
    refetchClassVideo();
    refetchListContestant();
    refetchListRescueLifelineUsed();
  }, [match]);

  useEffect(() => {
    if (isSuccessSponsorMedia) setSponsorMedia(sponsorMediaRes.data);
  }, [isSuccessSponsorMedia, sponsorMediaRes]);

  useEffect(() => {
    if (isSuccessClassVideo) setClassVideo(classVideoRes.data);
  }, [isSuccessClassVideo, classVideoRes]);

  useEffect(() => {
    if (isSuccessListRescueLifelineUsed) {
      setListRescueLifelineUsed(listRescueLifelineUsedRes.data);
    }
  }, [isSuccessListRescueLifelineUsed, listRescueLifelineUsedRes]);

  useEffect(() => {
    if (isSuccessMatch) {
      setMatchInfo(matchInfoRes.data);
      document.title = `Điều khiển trận đấu - ${matchInfoRes?.data?.name || "Chưa có trận đấu"
        }`;
    }
  }, [isSuccessMatch, matchInfoRes]);

  useEffect(() => {
    if (isSuccessCurrentQuestion) {
      setCurrentQuestion(currentQuestionRes.data);
    }
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
  useEffect(() => {
    if (isSuccessContestants) setListContestant(listContestantRes.data);
  }, [isSuccessContestants, listContestantRes]);

  useEffect(() => {
    if (!socket) {
      return () => { };
    }

    const handleScreenUpdate = (data: { updatedScreen: SceenControl }) => {
      setScreenControl(data?.updatedScreen);
    };

    const handleCurrentQuestion = (data: {
      matchInfo: MatchInfo;
      currentQuestion: CurrentQuestion;
      ListContestant: ListContestant[];
    }) => {
      setMatchInfo({ ...data?.matchInfo });
      setListContestant(data?.ListContestant);
      setCurrentQuestion({ ...data?.currentQuestion });
    };

    const handleUpdateTime = (data: TimerUpdateData) => {
      const newTime = data?.timeRemaining;
      setMatchInfo(prev => (prev ? { ...prev, remainingTime: newTime } : prev));
    };
    const handleUpdateStatus = (data: ContestantStatusUpdate) => {
      if (data.ListContestant) {
        setListContestant(data.ListContestant);
      }
    };

    const handleUpdateGold = (data: any) => {
      if (data?.matchInfo) {
        setMatchInfo(data.matchInfo);
      }
    };

    const handleUpdateEliminate = (data: any) => {
      setListContestant(data?.ListContestant);
      setScreenControl(data?.updatedScreen);
      setCountContestant(prev => ({
        ...prev!,
        countIn_progress: data?.countInProgress ?? 0,
      }));
    };

    const handleShowQrRescue = (data: any) => {
      setListRescueLifelineUsed(data?.LisstRescue);
      setScreenControl(data?.updatedScreen);
    };

    const handleShowQrChart = (data: any) => {
      setListRescueLifelineUsed(data?.ListRescue);
      setScreenControl(data?.updatedScreen);
    };

    const handleTimerRescue = (data: any) => {
      setListRescueLifelineUsed(data?.ListRescue);
    };

    const handleUpdateRescued = (data: any) => {
      setListRescueLifelineUsed(data?.ListRescue);
    };

    socket.on("screen:update", handleScreenUpdate);
    socket.on("currentQuestion:get", handleCurrentQuestion);
    socket.on("timer:update", handleUpdateTime);
    socket.on("contestant:status-update", handleUpdateStatus);
    socket.on("update:winGold", handleUpdateGold);
    socket.on("update:Eliminated", handleUpdateEliminate);
    socket.on("showQrRescue", handleShowQrRescue);
    socket.on("timerStart:Rescue", handleTimerRescue);
    socket.on("timerEnd:Rescue", handleTimerRescue);
    socket.on("showQrChart", handleShowQrChart);
    socket.on("rescue:updateStatus", handleUpdateRescued);

    return () => {
      socket.off("screen:update", handleScreenUpdate);
      socket.off("currentQuestion:get", handleCurrentQuestion);
      socket.off("contestant:status-update", handleUpdateStatus);
      socket.off("timer:update", handleUpdateTime);
      socket.off("update:winGold", handleUpdateGold);
      socket.off("update:Eliminated", handleUpdateEliminate);
      socket.off("showQrRescue", handleShowQrRescue);
      socket.off("timerStart:Rescue", handleTimerRescue);
      socket.off("timerEnd:Rescue", handleTimerRescue);
      socket.off("showQrChart", handleShowQrChart);
      socket.off("rescue:updateStatus", handleUpdateRescued);
      // socket.off("update:Rescued", handleUpdateRescued);
    };
  }, [socket]);

  // Transform function để convert CurrentQuestion thành CurrentQuestionData
  const transformCurrentQuestionData = (question: CurrentQuestion | null) => {
    if (!question) {
      return undefined;
    }

    const transformedData = {
      order: question.questionOrder,
      question: {
        id: question.id,
        content: question.content,
        intro: question.intro || undefined,
        questionType: question.questionType,
        difficulty: question.difficulty,
        score: question.score,
        defaultTime: question.defaultTime,
        options: Array.isArray(question.options)
          ? question.options.map(opt => String(opt))
          : [],
        correctAnswer:
          typeof question.correctAnswer === "string"
            ? parseInt(question.correctAnswer)
            : question.correctAnswer,
      },
    };

    return transformedData;
  };

  const isLoading =
    isLoadingMatch ||
    isLoadingCurrentQuestion ||
    isLoadingCount ||
    isLoadingQuestions ||
    isLoadingControl ||
    isLoadingSponsorMedia ||
    isLoadingClassVideo ||
    isLoadingListRescueLifelineUsed ||
    isLoadingContestants;

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

  if (
    isError ||
    isErrorCurrentQuestion ||
    isErrorCount ||
    isErrorQuestions ||
    isErrorControl ||
    isErrorSponsorMedia ||
    isErrorClassVideo ||
    isErrorListRescueLifelineUsed ||
    isErrorContestants
  ) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-red-500 font-bold text-lg">
          Đã có lỗi xảy ra, vui lòng thử lại sau.
        </div>
      </div>
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
          <StatusControl
            isConnected={isConnected}
            screenControl={screenControl}
          />
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
            <BackgroundControl />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
              <QuestionControl
                remainingTime={matchInfo?.remainingTime}
                controlKey={screenControl?.controlKey}
              />
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
            <OnlineExamControl
              currentQuestionData={(() => {
                const transformed =
                  transformCurrentQuestionData(currentQuestion);
                return transformed;
              })()}
              isGameStarted={
                matchInfo?.currentQuestion
                  ? matchInfo.currentQuestion > 0
                  : false
              }
              remainingTime={matchInfo?.remainingTime || 0}
              isLoading={isLoadingCurrentQuestion}
              isTimerPaused={false}
            />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
            <SupplierVideo
              currentQuestion={currentQuestion}
              controlKey={screenControl?.controlKey}
            />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
            <VideoControl
              sponsorMedia={sponsorMedia}
              classVideo={classVideo}
              controlKey={screenControl?.controlKey}
            />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
            <ContestantsControl
              ListContestant={listContestant}
              questionOrder={currentQuestion?.questionOrder || 0}
              controlKey={screenControl?.controlKey}
            />
          </div>

          {/** triển khai phần cứu trợ ở đây */}
          <RescueControl
            matchId={matchInfo?.id ?? 0}
            currentQuestionOrder={currentQuestion?.questionOrder || 0}
          />

          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
            <AudienceRescueControl
              currentQuestionOrder={currentQuestion?.questionOrder}
              totalQuestions={listQuestion.length}
              controlKey={screenControl?.controlKey || null}
              ListRescueLifelineUsed={listRescueLifelineUsed || []}
              matchId={matchInfo?.id || null}
            />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
            <AwardControl
              ListContestant={listContestant}
              MatchInfo={matchInfo || null}
            />
          </div>

          {/** Phần điều khiển thí sinh chiến thắng */}
          <ContestantsWinnerControlPanel matchId={matchInfo?.id ?? 0} />
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
