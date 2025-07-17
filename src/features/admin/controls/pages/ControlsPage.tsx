import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import ChartControl from "../components/ChartControl";
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
  useListAwards,
  useResultsByMatchSlug,
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
  type ListAward,
  type ListResult,
} from "../type/control.type";
import { useSocket } from "@contexts/SocketContext";
import { Box, CircularProgress } from "@mui/material";
import AwardControl from "../components/AwardControl";

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

  const [isBackgroundControlOpen, setIsBackgroundControlOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsBackgroundControlOpen(false);
      }
    };

    if (isBackgroundControlOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isBackgroundControlOpen]);

  // Handle ESC key to close panel
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsBackgroundControlOpen(false);
      }
    };

    if (isBackgroundControlOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isBackgroundControlOpen]);
  const questionControlRef = useRef<HTMLDivElement>(null);
  const onlineExamControlRef = useRef<HTMLDivElement>(null);
  const supplierVideoRef = useRef<HTMLDivElement>(null);
  const videoControlRef = useRef<HTMLDivElement>(null);
  const contestantsControlRef = useRef<HTMLDivElement>(null);
  const rescueControlRef = useRef<HTMLDivElement>(null);
  const audienceRescueControlRef = useRef<HTMLDivElement>(null);
  const awardControlRef = useRef<HTMLDivElement>(null);
  const chartControlRef = useRef<HTMLDivElement>(null);

  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
  const [listAward, setListAward] = useState<ListAward | null>(null);
  const [currentQuestion, setCurrentQuestion] =
    useState<CurrentQuestion | null>(null);
  const [countContestant, setCountContestant] =
    useState<countContestant | null>(null);
  const [listQuestion, setListQuestion] = useState<Question[]>([]);
  const [screenControl, setScreenControl] = useState<SceenControl | null>(null);
  const [listContestant, setListContestant] = useState<ListContestant[]>([]);
  const [sponsorMedia, setSponsorMedia] = useState<MediaType[]>([]);
  const [classVideo, setClassVideo] = useState<MediaType[]>([]);
  const [listResult, setListResult] = useState<ListResult[]>([]);
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

  const {
    data: listAwardRes,
    isLoading: isLoadingListAward,
    isSuccess: isSuccessListAward,
    isError: isErrorListAward,
    refetch: refetchListAward,
  } = useListAwards(match ?? null);

  const {
    data: listResultRes,
    isLoading: isLoadingListResult,
    isSuccess: isSuccessListResult,
    isError: isErrorListResult,
    refetch: refetchListResult,
  } = useResultsByMatchSlug(match ?? null);

  useEffect(() => {
    refetchMatchInfo();
    refetchCurrentQuestion();
    refetchCountContestant();
    refetchListQuestion();
    refetchScreenControl();
    refetchSponsorMedia();
    refetchClassVideo();
    refetchListAward();
    refetchListResult();
    refetchListContestant();
    refetchListRescueLifelineUsed();
  }, [match]);

  useEffect(() => {
    if (isSuccessListResult) {
      setListResult(listResultRes.data);
    }
  }, [isSuccessListResult, listResultRes]);

  useEffect(() => {
    if (isSuccessSponsorMedia) setSponsorMedia(sponsorMediaRes.data);
  }, [isSuccessSponsorMedia, sponsorMediaRes]);

  useEffect(() => {
    if (isSuccessClassVideo) setClassVideo(classVideoRes.data);
  }, [isSuccessClassVideo, classVideoRes]);

  useEffect(() => {
    if (isSuccessListAward) {
      setListAward(listAwardRes.data);
    }
  }, [isSuccessListAward, listAwardRes]);

  useEffect(() => {
    if (isSuccessListResult) {
      setListResult(listResultRes.data);
    }
  }, [isSuccessListResult, listResultRes]);

  useEffect(() => {
    if (isSuccessListRescueLifelineUsed) {
      setListRescueLifelineUsed(listRescueLifelineUsedRes.data);
    }
  }, [isSuccessListRescueLifelineUsed, listRescueLifelineUsedRes]);

  useEffect(() => {
    if (isSuccessMatch) {
      setMatchInfo(matchInfoRes.data);
      document.title = `Điều khiển trận đấu - ${
        matchInfoRes?.data?.name || "Chưa có trận đấu"
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
      return () => {};
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

    const handstatistics = (data: any) => {
      console.log("Statistics data:", data);
      setScreenControl(data?.updatedScreen);
    };

    const handleUpdateAward = (data: any) => {
      setListAward(data);
    };

    const handListResult = (data: any) => {
      setListResult(data?.data);
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
    socket.on("statistics:update", handstatistics);
    socket.on("update:award", handleUpdateAward);
    socket.on("listResult", handListResult);

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
      socket.off("update:award", handleUpdateAward);
      socket.off("listResult", handListResult);
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

  // Navigation sections data
  const navigationSections = [
    {
      id: "question-control",
      name: "Điều khiển câu hỏi",
      ref: questionControlRef,
      icon: "❓",
    },
    {
      id: "online-exam",
      name: "Thi online",
      ref: onlineExamControlRef,
      icon: "💻",
    },
    {
      id: "supplier-video",
      name: "Video nhà tài trợ",
      ref: supplierVideoRef,
      icon: "🎬",
    },
    {
      id: "video-control",
      name: "Điều khiển video",
      ref: videoControlRef,
      icon: "📹",
    },
    {
      id: "contestants",
      name: "Thí sinh",
      ref: contestantsControlRef,
      icon: "👥",
    },
    { id: "rescue", name: "Cứu trợ", ref: rescueControlRef, icon: "🆘" },
    {
      id: "audience-rescue",
      name: "Cứu trợ khán giả",
      ref: audienceRescueControlRef,
      icon: "🙋",
    },
    { id: "award", name: "Giải thưởng", ref: awardControlRef, icon: "🏆" },
    { id: "chart", name: "Biểu đồ", ref: chartControlRef, icon: "📊" },
  ] as const;

  // Scroll to section function
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Observer to track active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const sections = [
      { id: "question-control", ref: questionControlRef },
      { id: "online-exam", ref: onlineExamControlRef },
      { id: "supplier-video", ref: supplierVideoRef },
      { id: "video-control", ref: videoControlRef },
      { id: "contestants", ref: contestantsControlRef },
      { id: "rescue", ref: rescueControlRef },
      { id: "audience-rescue", ref: audienceRescueControlRef },
      { id: "award", ref: awardControlRef },
      { id: "chart", ref: chartControlRef },
    ];

    sections.forEach(section => {
      if (section.ref.current) {
        const observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                setActiveSection(section.id);
              }
            });
          },
          { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" }
        );
        observer.observe(section.ref.current);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const isLoading =
    isLoadingMatch ||
    isLoadingCurrentQuestion ||
    isLoadingCount ||
    isLoadingQuestions ||
    isLoadingControl ||
    isLoadingSponsorMedia ||
    isLoadingClassVideo ||
    isLoadingListRescueLifelineUsed ||
    isLoadingContestants ||
    isLoadingListResult ||
    isLoadingListAward;

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
    isErrorContestants ||
    isErrorListAward ||
    isErrorListResult
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

          {/* Fixed Background Control Button */}
          <button
            onClick={() => setIsBackgroundControlOpen(!isBackgroundControlOpen)}
            className="fixed top-4 right-4 z-50 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200"
            title="Điều khiển nhanh"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>

          {/* Sliding Panel */}
          <div
            ref={panelRef}
            className={`fixed top-0 right-0 h-full w-70 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
              isBackgroundControlOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <h3 className="font-semibold text-lg">Điều khiển nhanh</h3>
                </div>
                <button
                  onClick={() => setIsBackgroundControlOpen(false)}
                  className="text-white hover:text-gray-200 p-2 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Section */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <div className="mb-6">
                    <div className="space-y-2">
                      {navigationSections.map(section => (
                        <button
                          key={section.id}
                          onClick={() => {
                            scrollToSection(section.ref);
                            setIsBackgroundControlOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                            activeSection === section.id
                              ? "bg-blue-50 border border-blue-200 text-blue-700 shadow-sm"
                              : "hover:bg-gray-50 text-gray-600 hover:text-gray-800"
                          }`}
                        >
                          <span className="text-xl">{section.icon}</span>
                          <span className="font-medium flex-1">
                            {section.name}
                          </span>
                          {activeSection === section.id && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Control Section - Fixed at bottom */}
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="p-6">
                  <BackgroundControl />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div
              ref={questionControlRef}
              className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100"
            >
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
          <div
            ref={onlineExamControlRef}
            className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100"
          >
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
          <div
            ref={supplierVideoRef}
            className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100"
          >
            <SupplierVideo
              currentQuestion={currentQuestion}
              controlKey={screenControl?.controlKey}
            />
          </div>
          <div
            ref={videoControlRef}
            className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100"
          >
            <VideoControl
              sponsorMedia={sponsorMedia}
              classVideo={classVideo}
              controlKey={screenControl?.controlKey}
            />
          </div>
          <div
            ref={contestantsControlRef}
            className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100"
          >
            <ContestantsControl
              ListContestant={listContestant}
              questionOrder={currentQuestion?.questionOrder || 0}
              controlKey={screenControl?.controlKey}
            />
          </div>

          {/** triển khai phần cứu trợ ở đây */}
          <div ref={rescueControlRef}>
            <RescueControl
              matchId={matchInfo?.id ?? 0}
              currentQuestionOrder={currentQuestion?.questionOrder || 0}
            />
          </div>

          <div
            ref={audienceRescueControlRef}
            className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100"
          >
            <AudienceRescueControl
              currentQuestionOrder={currentQuestion?.questionOrder}
              totalQuestions={listQuestion.length}
              controlKey={screenControl?.controlKey || null}
              ListRescueLifelineUsed={listRescueLifelineUsed || []}
              matchId={matchInfo?.id || null}
            />
          </div>
          <div
            ref={awardControlRef}
            className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100"
          >
            <AwardControl
              ListAward={listAward || null}
              MatchInfo={matchInfo || null}
              ListResult={listResult || null}
            />
          </div>
          <div
            ref={chartControlRef}
            className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100"
          >
            <ChartControl />
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
