import { useEffect, useState } from "react";
import MatchHeader from "../components/MatchHeader/MatchHeader";
import Background from "../components/QuestionDisplay/Background";
import FullScreenImage from "../components/Media/FullScreenImage";
import TopThreeBoard from "@features/leaderboard/top3/components/TopThreeBoard";

import GoldWinnerDisplay from "@features/leaderboard/gold/components/GoldWinnerDisplay";
import EliminateDisplay from "../components/Eliminate/EliminateDisplay";
import QRCodeDisplay from "../components/QuestionDisplay/QRCodeDisplay";
import RescueStatsDisplay from "../components/QuestionDisplay/RescueStatsDisplays";
import ChartDisplay from "../components/QuestionDisplay/ChartDisplay";
import Info from "../components/QuestionDisplay/Info";

import { mockContestants } from "../constants";

import { Box, CircularProgress } from "@mui/material";
import {
  type MatchInfo,
  type BgContest,
  type Question,
  type ListRescue,
  type ListContestant,
  type countContestant,
  type SceenControl,
  type CurrentQuestion,
  type updatedRescuesType,
  type contestStatistic,
  type ListAward,
} from "../types/control.type";

import {
  useBgContest,
  useCurrentQuestion,
  useListQuestion,
  useMatchInfo,
  useScreenControl,
  useCountContestant,
  useListContestant,
  useListRescues,
  useAllRescues,
  useStatistic,
  useStatisticsContestant,
  useListAwards,
} from "../hooks/useControls";
import { useParams } from "react-router-dom";

import QuestionContent from "../components/QuestionDisplay/QuestionContent";
import AnswerContent from "../components/QuestionDisplay/AnswerContent";
import QuestionExplanation from "../components/QuestionDisplay/QuestionExplanation";
import QuestionIntro from "../components/QuestionDisplay/QuestionIntro";
import { useSocket } from "../../../contexts/SocketContext";
import FullScreenVideo from "../components/Media/FullScreenVideo";
import TopWinner from "@features/match/components/ContestantsWinner/Top20Winner";

export default function MatchPage() {
  const { match } = useParams();
  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
  const [listContestant, setListContestant] = useState<ListContestant[]>([]);
  const [_listRescue, setListRescue] = useState<ListRescue[]>([]);
  const [bgContest, setBgContest] = useState<BgContest | null>(null);
  const [currentQuestion, setCurrentQuestion] =
    useState<CurrentQuestion | null>(null);
  const [countContestant, setCountContestant] =
    useState<countContestant | null>(null);
  const [listQuestion, setListQuestion] = useState<Question[]>([]);
  const [screenControl, setScreenControl] = useState<SceenControl | null>(null);
  const [updateRescuedData, setUpdateRescuedData] = useState<
    updatedRescuesType[]
  >([]);
  const [contestantsStatistic, setContestantsStatistic] = useState<
    contestStatistic[] | null
  >([]);

  const [statistic, setStatistic] = useState<
    { label: string; value: number }[] | null
  >([]);

  const [listAward, setListAward] = useState<ListAward | null>(null);

  // Use rescue hook to fetch initial data
  const {
    data: allRescuesRes,
    isLoading: isLoadingAllRescues,
    isSuccess: isSuccessAllRescues,
    isError: isErrorAllRescues,
  } = useAllRescues(match ?? null, currentQuestion?.questionOrder);

  const {
    data: listAwardRes,
    isLoading: isLoadingListAward,
    isSuccess: isSuccessListAward,
    isError: isErrorListAward,
  } = useListAwards(match ?? null);

  const {
    data: statisticRes,
    isLoading: isLoadingStatistic,
    isSuccess: isSuccessStatistic,
    isError: isErrorStatistic,
  } = useStatistic(match ?? null);

  const {
    data: matchInfoRes,
    isLoading: isLoadingMatch,
    isSuccess: isSuccessMatch,
    isError: isErrorMatch,
  } = useMatchInfo(match ?? null);

  const {
    data: bgContestRes,
    isLoading: isLoadingBg,
    isSuccess: isSuccessBg,
    isError: isErrorBg,
  } = useBgContest(match ?? null);

  const {
    data: currentQuestionRes,
    isLoading: isLoadingCurrentQuestion,
    isSuccess: isSuccessCurrentQuestion,
    isError: isErrorCurrentQuestion,
  } = useCurrentQuestion(match ?? null);

  const {
    data: listRescueRes,
    isLoading: isLoadingRescues,
    isSuccess: isSuccessRescues,
    isError: isErrorRescues,
  } = useListRescues(match ?? null);

  const {
    data: listContestantRes,
    isLoading: isLoadingContestants,
    isSuccess: isSuccessContestants,
    isError: isErrorContestants,
  } = useListContestant(match ?? null);

  const {
    data: countContestantRes,
    isLoading: isLoadingCount,
    isSuccess: isSuccessCount,
    isError: isErrorCount,
  } = useCountContestant(match ?? null);

  const {
    data: listQuestionRes,
    isLoading: isLoadingQuestions,
    isSuccess: isSuccessQuestions,
    isError: isErrorQuestions,
  } = useListQuestion(match ?? null);

  const {
    data: screenControlRes,
    isLoading: isLoadingControl,
    isSuccess: isSuccessControl,
    isError: isErrorControl,
  } = useScreenControl(match ?? null);

  const {
    data: statisticsContestantRes,
    isLoading: isLoadingStatisticsContestant,
    isSuccess: isSuccessStatisticsContestant,
    isError: isErrorStatisticsContestant,
  } = useStatisticsContestant(match ?? null);

  // 3. useEffect gọn gàng với isSuccess
  useEffect(() => {
    if (isSuccessMatch) setMatchInfo(matchInfoRes.data);
  }, [isSuccessMatch, matchInfoRes]);

  useEffect(() => {
    if (isSuccessListAward) setListAward(listAwardRes.data);
  }, [isSuccessListAward, listAwardRes]);

  useEffect(() => {
    if (isSuccessBg) setBgContest(bgContestRes.data);
  }, [isSuccessBg, bgContestRes]);

  useEffect(() => {
    if (isSuccessStatisticsContestant) {
      setContestantsStatistic(statisticsContestantRes.data);
    }
  }, [isSuccessStatisticsContestant, statisticsContestantRes]);

  useEffect(() => {
    if (isSuccessCurrentQuestion) setCurrentQuestion(currentQuestionRes.data);
  }, [isSuccessCurrentQuestion, currentQuestionRes]);

  useEffect(() => {
    if (isSuccessStatistic) setStatistic(statisticRes.data);
  }, [isSuccessStatistic, statisticRes]);

  useEffect(() => {
    if (isSuccessRescues) setListRescue(listRescueRes.data);
  }, [isSuccessRescues, listRescueRes]);

  useEffect(() => {
    if (isSuccessContestants) setListContestant(listContestantRes.data);
  }, [isSuccessContestants, listContestantRes]);

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
    document.title = `Trân đấu ${matchInfo?.name}`;
  }, [matchInfo]);

  // gọi getAllRescues khi match thay đổi
  useEffect(() => {
    if (isSuccessAllRescues && allRescuesRes?.data) {
      const formattedRescues: updatedRescuesType[] = allRescuesRes.data.map(
        (rescue: updatedRescuesType) => ({
          isEffect: rescue.isEffect,
          id: rescue.id,
          name: rescue.name,
          rescueType: rescue.rescueType,
          status: rescue.status,
          remainingContestants: rescue.remainingContestants || 0,
          questionFrom: rescue.questionFrom,
          questionTo: rescue.questionTo,
          index: rescue.index || 0,
        })
      );
      setUpdateRescuedData(formattedRescues);
    }
  }, [isSuccessAllRescues, allRescuesRes]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) {
      return () => {}; // Empty cleanup function
    }

    const handleScreenUpdate = (data: any) => {
      setScreenControl(data?.updatedScreen);
    };

    const handleCurrentQuestion = (data: any) => {
      setMatchInfo(data?.matchInfo);
      setCurrentQuestion(data?.currentQuestion);
      setListContestant(data?.ListContestant);
      setScreenControl(prev => {
        if (!prev) return null;

        return {
          ...prev,
          controlKey: "questionInfo",
        };
      });
    };

    const handleUpdateTime = (data: any) => {
      const newTime = data?.timeRemaining;
      setMatchInfo(prev => {
        if (!prev) return null;

        return {
          ...prev,
          remainingTime: newTime,
        };
      });
    };

    const handleUpdateGold = (data: any) => {
      if (!data?.matchInfo) return;
      setMatchInfo(data?.matchInfo);
    };

    // const handleUpdateStatus = (data: any) => {
    //   setListContestant(data?.ListContestant);
    // };

    const handleUpdateEliminate = (data: any) => {
      setListContestant(data?.ListContestant);
      setCountContestant(prev => ({
        ...prev!,
        countIn_progress: data?.countInProgress ?? 0,
      }));
      setScreenControl(data?.updatedScreen);
    };

    const handleUpdateRescued = (data: any) => {
      setListContestant(data?.ListContestant);
      setCountContestant(prev => ({
        ...prev!,
        countIn_progress: data?.countInProgress ?? 0,
      }));
      setScreenControl(data?.updateScreen);
    };

    const handleShowQrRescue = (data: any) => {
      setScreenControl(data?.updatedScreen);
    };

    const handleShowQrChart = (data: any) => {
      setScreenControl(data?.updatedScreen);
    };

    const getRescueStatus = (data: unknown) => {
      const typedData = data as {
        data: { updatedRescues: updatedRescuesType[] };
      };
      setUpdateRescuedData(typedData.data.updatedRescues);
    };

    const handleStatistics = (data: any) => {
      setStatistic(data?.statistics);
      setScreenControl(data?.updatedScreen);
    };

    const handleStatisticsContestant = (data: any) => {
      setContestantsStatistic(data?.statisticsContestant);
      setScreenControl(data?.updatedScreen);
    };

    const handleUpdateAward = (data: any) => {
      setListAward(data);
    };

    socket.on("rescue:statusUpdated", getRescueStatus);
    socket.on("screen:update", handleScreenUpdate);
    socket.on("currentQuestion:get", handleCurrentQuestion);
    socket.on("timer:update", handleUpdateTime);
    socket.on("update:winGold", handleUpdateGold);
    // socket.on("contestant:status-update", handleUpdateStatus);
    socket.on("update:Eliminated", handleUpdateEliminate);
    socket.on("update:Rescued", handleUpdateRescued);
    socket.on("showQrRescue", handleShowQrRescue);
    socket.on("showQrChart", handleShowQrChart);
    socket.on("statistics:update", handleStatistics);
    socket.on("statisticsContestant:update", handleStatisticsContestant);
    socket.on("update:award", handleUpdateAward);

    return () => {
      socket.off("rescue:statusUpdated", getRescueStatus);
      socket.off("screen:update", handleScreenUpdate);
      socket.off("currentQuestion:get", handleCurrentQuestion);
      socket.off("timer:update", handleUpdateTime);
      socket.off("update:winGold", handleUpdateGold);
      // socket.off("contestant:status-update", handleUpdateStatus);
      socket.off("update:Eliminated", handleUpdateEliminate);
      socket.off("update:Rescused", handleUpdateRescued);
      socket.off("showQrRescue", handleShowQrRescue);
      socket.off("showQrChart", handleShowQrChart);
      socket.off("statistics:update", handleStatistics);
      socket.off("update:Rescued", handleUpdateRescued);
      socket.off("statisticsContestant:update", handleStatisticsContestant);
      socket.off("update:award", handleUpdateAward);
    };
  }, [socket]);

  const isLoading =
    isLoadingMatch ||
    isLoadingBg ||
    isLoadingStatistic ||
    isLoadingCurrentQuestion ||
    isLoadingRescues ||
    isLoadingContestants ||
    isLoadingCount ||
    isLoadingQuestions ||
    isLoadingControl ||
    isLoadingStatisticsContestant ||
    isLoadingListAward ||
    isLoadingAllRescues;
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
    isErrorMatch ||
    isErrorStatistic ||
    isErrorBg ||
    isErrorListAward ||
    isErrorCurrentQuestion ||
    isErrorRescues ||
    isErrorContestants ||
    isErrorCount ||
    isErrorQuestions ||
    isErrorControl ||
    isErrorAllRescues ||
    isErrorStatisticsContestant ||
    isErrorStatisticsContestant
  ) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <p className="text-red-500">Đã có lỗi xảy ra khi tải dữ liệu.</p>
      </Box>
    );
  }

  return (
    <>
      {screenControl?.controlKey === "allPrize" && (
        <div key="allPrize">
          <TopThreeBoard ListAward={listAward} />
        </div>
      )}

      {screenControl?.controlKey === "statistic" && (
        <div key="statistic">
          <ChartDisplay chartData={statistic} title="Thống kê câu hỏi " />
        </div>
      )}

      {screenControl?.controlKey === "chartContestant" && (
        <div key="chartContestant">
          <ChartDisplay
            chartData={contestantsStatistic}
            title="Thống kê thí sinh"
          />
        </div>
      )}

      {screenControl?.controlKey === "qrcode" && (
        <div key="qrCode">
          <QRCodeDisplay
            matchSlug={match ?? ""}
            rescueId={Number(screenControl?.value) ?? 2}
            matchName={matchInfo?.name ?? ""}
            currentQuestionOrder={currentQuestion?.questionOrder}
          />
        </div>
      )}

      {screenControl?.controlKey === "chart" && (
        <div key="chart">
          <RescueStatsDisplay rescueId={Number(screenControl?.value) ?? 2} />
        </div>
      )}

      {screenControl?.controlKey === "question" && (
        <div key="question">
          <MatchHeader
            countContestant={countContestant}
            remainingTime={matchInfo?.remainingTime}
            currentQuestion={currentQuestion}
            countQuestion={listQuestion.length}
            updateRescuedData={updateRescuedData}
          />
          <QuestionContent
            content={currentQuestion?.content}
            controlValue={screenControl?.controlValue}
            questionMedia={currentQuestion?.questionMedia ?? null}
            options={currentQuestion?.options}
            type={currentQuestion?.questionType ?? null}
          />
        </div>
      )}
      {/* {screenControl?.controlKey === "question" && (
        <div key="question">
          <MatchHeader
            countContestant={countContestant}
            remainingTime={matchInfo?.remainingTime}
            currentQuestion={currentQuestion}
            countQuestion={listQuestion.length}
          />
          <QuestionContent
            content={currentQuestion?.content}
            controlValue={screenControl?.controlValue}
            questionMedia={currentQuestion?.questionMedia ?? null}
            options={currentQuestion?.options}
            type={currentQuestion?.questionType ?? null}
          />
        </div>
      )} */}
      {screenControl?.controlKey === "answer" && (
        <div key="answer">
          <MatchHeader
            countContestant={countContestant}
            remainingTime={matchInfo?.remainingTime}
            currentQuestion={currentQuestion}
            countQuestion={listQuestion.length}
            updateRescuedData={updateRescuedData}
          />
          <AnswerContent
            controlValue={screenControl?.controlValue ?? null}
            answermedia={currentQuestion?.mediaAnswer ?? null}
            correctAnswer={currentQuestion?.correctAnswer ?? null}
          />
        </div>
      )}
      {screenControl?.controlKey === "matchDiagram" && (
        <div key="matchDiagram" className="max-h-[100vh] overflow-y-auto">
          <MatchHeader
            countContestant={countContestant}
            remainingTime={matchInfo?.remainingTime}
            currentQuestion={currentQuestion}
            countQuestion={listQuestion.length}
            updateRescuedData={updateRescuedData}
          />
          <EliminateDisplay
            ListContestant={listContestant ?? []}
            currentQuestionOrder={currentQuestion?.questionOrder ?? 0}
            totalIcons={mockContestants.length}
            controlValue={screenControl?.controlValue ?? undefined}
          />
        </div>
      )}
      {screenControl?.controlKey === "background" && (
        <Background url={bgContest?.url || null} />
      )}
      {screenControl?.controlKey === "explanation" && (
        <div key="explanation ">
          <MatchHeader
            countContestant={countContestant}
            remainingTime={matchInfo?.remainingTime}
            currentQuestion={currentQuestion}
            countQuestion={listQuestion.length}
            updateRescuedData={updateRescuedData}
          />
          <QuestionExplanation
            explanation={
              currentQuestion?.explanation ??
              "Câu hỏi này không có phần mở rộng"
            }
          />
        </div>
      )}
      {screenControl?.controlKey === "image" && screenControl?.media && (
        <div key="image">
          <FullScreenImage imageUrl={screenControl?.media} />
        </div>
      )}
      {screenControl?.controlKey === "video" && screenControl?.media && (
        <div key="video">
          <FullScreenVideo
            videoUrl={screenControl?.media}
            control={screenControl.controlValue}
          />
        </div>
      )}
      {screenControl?.controlKey === "wingold" && (
        <div key="wingold">
          <GoldWinnerDisplay studentName={matchInfo?.studentName ?? null} />
        </div>
      )}
      {screenControl?.controlKey === "questionIntro" && (
        <div key="questionIntro">
          <MatchHeader
            countContestant={countContestant}
            remainingTime={matchInfo?.remainingTime}
            currentQuestion={currentQuestion}
            countQuestion={listQuestion.length}
            updateRescuedData={updateRescuedData}
          />
          <QuestionIntro
            intro={currentQuestion?.intro ?? "Câu hỏi này không có thông tin"}
          />
        </div>
      )}
      {screenControl?.controlKey === "questionInfo" && (
        <div key="questionInfo">
          <Info currentQuestion={currentQuestion} />
        </div>
      )}
      {screenControl?.controlKey === "top20Winner" && (
        <div key="top20Winner">
          <TopWinner match_id={matchInfo?.id ?? ""} />
        </div>
      )}
    </>
  );
}
