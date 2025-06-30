import { useEffect, useState } from "react";
import MatchHeader from "../components/MatchHeader/MatchHeader";
import Background from "../components/QuestionDisplay/Background";
import FullScreenImage from "../components/Media/FullScreenImage";
import { AudienceDisplayManager } from "../components/AudienceDisplay";
import GoldWinnerDisplay from "@features/leaderboard/gold/components/GoldWinnerDisplay";
import EliminateDisplay from "../components/Eliminate/EliminateDisplay";

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
} from "../hooks/useControls";
import { useParams } from "react-router-dom";

import QuestionContent from "../components/QuestionDisplay/QuestionContent";
import AnswerContent from "../components/QuestionDisplay/AnswerContent";
import QuestionExplanation from "../components/QuestionDisplay/QuestionExplanation";
import QuestionIntro from "../components/QuestionDisplay/QuestionIntro";
import { useSocket } from "../../../contexts/SocketContext";
import FullScreenVideo from "../components/Media/FullScreenVideo";

export default function MatchPage() {
  const { match } = useParams();

  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
  const [listContestant, setListContestant] = useState<ListContestant[]>([]);
  const [_listRescue, setListRescue] = useState<ListRescue[]>([]);
  const [_bgContest, setBgContest] = useState<BgContest | null>(null);
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

  // 3. useEffect gọn gàng với isSuccess
  useEffect(() => {
    if (isSuccessMatch) setMatchInfo(matchInfoRes.data);
  }, [isSuccessMatch, matchInfoRes]);

  useEffect(() => {
    if (isSuccessBg) setBgContest(bgContestRes.data);
  }, [isSuccessBg, bgContestRes]);

  useEffect(() => {
    if (isSuccessCurrentQuestion) setCurrentQuestion(currentQuestionRes.data);
  }, [isSuccessCurrentQuestion, currentQuestionRes]);

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
      setScreenControl(prev => {
        if (!prev) return null;

        return {
          ...prev,
          controlKey: "question",
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

    const handleUpdateStatus = (data: any) => {
      setListContestant(data?.ListContestant);
    };

    const handleUpdateEliminate = (data: any) => {
      setListContestant(data?.ListContestant);
      setCountContestant(prev => ({
        ...prev!,
        countIn_progress: data?.countInProgress ?? 0,
      }));
      setScreenControl(data?.updatedScreen);
    };

    const handleUpdateRescued = (data: any) => {
      console.log("Rescued data:", data);
      setListContestant(data?.ListContestant);
      setCountContestant(prev => ({
        ...prev!,
        countIn_progress: data?.countInProgress ?? 0,
      }));
      setScreenControl(data?.updateScreen);
    };

    socket.on("screen:update", handleScreenUpdate);
    socket.on("currentQuestion:get", handleCurrentQuestion);
    socket.on("timer:update", handleUpdateTime);
    socket.on("update:winGold", handleUpdateGold);
    socket.on("contestant:status-update", handleUpdateStatus);
    socket.on("update:Eliminated", handleUpdateEliminate);
    socket.on("update:Rescused", handleUpdateRescued);

    return () => {
      socket.off("screen:update", handleScreenUpdate);
      socket.off("currentQuestion:get", handleCurrentQuestion);
      socket.off("timer:update", handleUpdateTime);
      socket.off("update:winGold", handleUpdateGold);
      socket.off("contestant:status-update", handleUpdateStatus);
      socket.off("update:Eliminated", handleUpdateEliminate);
      socket.off("update:Rescued", handleUpdateRescued);
    };
  }, [socket]);

  const isLoading =
    isLoadingMatch ||
    isLoadingBg ||
    isLoadingCurrentQuestion ||
    isLoadingRescues ||
    isLoadingContestants ||
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

  if (
    isErrorMatch ||
    isErrorBg ||
    isErrorCurrentQuestion ||
    isErrorRescues ||
    isErrorContestants ||
    isErrorCount ||
    isErrorQuestions ||
    isErrorControl
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
      {/* Audience Display Component - hiển thị QR hoặc Chart khi được điều khiển */}
      <AudienceDisplayManager
        matchSlug={match}
        currentQuestionId={currentQuestion?.id}
      />
      {screenControl?.controlKey === "question" && (
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
            countQuestion={listContestant.length}
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
            countQuestion={listContestant.length}
          />
          <EliminateDisplay
            ListContestant={listContestant ?? []}
            currentQuestionOrder={currentQuestion?.questionOrder ?? 0}
            totalIcons={mockContestants.length}
            controlValue={screenControl?.controlValue}
          />
        </div>
      )}
      {screenControl?.controlKey === "background" && <Background />}
      {screenControl?.controlKey === "explanation" && (
        <div key="explanation ">
          <MatchHeader
            countContestant={countContestant}
            remainingTime={matchInfo?.remainingTime}
            currentQuestion={currentQuestion}
            countQuestion={listContestant.length}
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
      {screenControl?.controlKey === "questionInfo" && (
        <div key="questionInfo">
          <MatchHeader
            countContestant={countContestant}
            remainingTime={matchInfo?.remainingTime}
            currentQuestion={currentQuestion}
            countQuestion={listContestant.length}
          />
          <QuestionIntro
            intro={currentQuestion?.intro ?? "Câu hỏi này không có thông tin"}
          />
        </div>
      )}
    </>
  );
}
