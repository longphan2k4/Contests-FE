import { useEffect, useState } from "react";
import MatchHeader from "../components/MatchHeader/MatchHeader";
import Background from "../components/QuestionDisplay/Background";

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

export default function MatchPage() {
  useEffect(() => {
    document.title = "Theo dõi trận đấu - Olympic Tin học.";
  }, []);
  const { match } = useParams();

  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
  const [listContestant, setListContestant] = useState<ListContestant[]>([]);
  const [listRescue, setListRescue] = useState<ListRescue[]>([]);
  const [bgContest, setBgContest] = useState<BgContest | null>(null);
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
    data: bgContestRes,
    isLoading: isLoadingBg,
    isSuccess: isSuccessBg,
  } = useBgContest(match ?? null);

  const {
    data: currentQuestionRes,
    isLoading: isLoadingCurrentQuestion,
    isSuccess: isSuccessCurrentQuestion,
  } = useCurrentQuestion(match ?? null);

  const {
    data: listRescueRes,
    isLoading: isLoadingRescues,
    isSuccess: isSuccessRescues,
  } = useListRescues(match ?? null);

  const {
    data: listContestantRes,
    isLoading: isLoadingContestants,
    isSuccess: isSuccessContestants,
  } = useListContestant(match ?? null);

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

    socket.on("screen:update", handleScreenUpdate);
    socket.on("currentQuestion:get", handleCurrentQuestion);
    socket.on("timer:update", handleUpdateTime);

    return () => {
      socket.off("screen:update", handleScreenUpdate);
      socket.off("currentQuestion:get", handleCurrentQuestion);
      socket.off("timer:update", handleUpdateTime);
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

  return (
    <>
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
            questionMedia={currentQuestion?.questionMedia ?? null}
            options={currentQuestion?.options}
            type={currentQuestion?.questionType ?? null}
          />
        </div>
      )}

      {screenControl?.controlKey === "answer" && (
        <div key="answer">
          <MatchHeader
            countContestant={countContestant}
            remainingTime={matchInfo?.remainingTime}
            currentQuestion={currentQuestion}
            countQuestion={listContestant.length}
          />
          <AnswerContent
            answermedia={currentQuestion?.mediaAnswer ?? null}
            correctAnswer={currentQuestion?.correctAnswer ?? null}
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
