import React, { useEffect } from "react";
import AnimatedBackground from "../components/home/AnimatedBackground";
import JudgeHeader from "../components/home/JudgeHeader";
import JudgeTabs from "../components/home/JudgeTabs";
import ContestantList from "../components/home/ContestantList";
import LogoutSection from "../components/home/LogoutSection";
import { useAuth } from "../../auth/hooks/authContext";
import { useToast } from "@contexts/toastContext";
import { useSocket } from "@contexts/SocketContext";

import { type Contestant, type TabType, type MatchInfo } from "../types/type";

import {
  useContestantList,
  useMatchInfo,
  useGroupInfo,
} from "../hooks/useJudge";
import { useParams } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

const JudgeHomePage: React.FC = () => {
  const { match } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { socket } = useSocket();
  const [activeTab, setActiveTab] = React.useState<TabType>("Đang thi");
  const [contestants, setContestants] = React.useState<Contestant[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [matchInfo, setMatchInfo] = React.useState<MatchInfo | null>(null);
  const [groupInfo, setGroupInfo] = React.useState<any>(null);
  const [disabled, setDisabled] = React.useState<boolean>(false);

  const {
    data: matchData,
    isLoading: isLoadingMatch,
    isError: isErrorMatch,
    isSuccess: isSuccessMatch,
  } = useMatchInfo(match ?? null);
  const {
    data: contestantData,
    isLoading: isLoadingContestant,
    isError: isErrorContestant,
    isSuccess: isSuccessContestant,
  } = useContestantList(match ?? null);
  const {
    data: groupData,
    isLoading: isLoadingGroup,
    isError: isErrorGroup,
    isSuccess: isSuccessGroup,
  } = useGroupInfo(match ?? null);

  useEffect(() => {
    if (isSuccessMatch && matchData) {
      setMatchInfo(matchData.data);
    }
  }, [matchData]);

  useEffect(() => {
    if (isSuccessContestant && contestantData) {
      setContestants(contestantData.data);
    }
  }, [contestantData]);

  useEffect(() => {
    if (isSuccessGroup && groupData) {
      setGroupInfo(groupData.data);
    }
  }, [groupData]);

  useEffect(() => {
    document.title = "Theo dõi trận đấu - Giám khảo";
  }, []);

  useEffect(() => {
    if (!matchInfo?.currentQuestion) {
      return;
    }
    if (groupInfo?.confirmCurrentQuestion >= matchInfo.currentQuestion) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [matchInfo, groupInfo]);

  useEffect(() => {
    if (!socket) return;
    const handleCurrentQuestion = (data: any) => {
      setMatchInfo(data?.matchInfo);
    };

    const handleContestantUpdate = (data: any) => {
      if (data.data) {
        setContestants(data.data);
      }
    };

    const handleGroupUpdate = (data: any) => {
      if (data.updatedGroup) {
        setGroupInfo(data.updatedGroup);
      }
    };

    socket.on("currentQuestion:get", handleCurrentQuestion);
    socket.on("contestant:status-update-judge", handleContestantUpdate);
    socket.on("group:confirmCurrentQuestion-update", handleGroupUpdate);

    return () => {
      socket.off("currentQuestion:get", handleCurrentQuestion);
      socket.off("contestant:status-update-judge", handleContestantUpdate);
      socket.off("group:confirmCurrentQuestion-update", handleGroupUpdate);
    };
  }, [socket]);

  const getContestantCounts = () => {
    const counts = {
      "Xác nhận 1": 0,
      "Đang thi": 0,
      "Xác nhận 2": 0,
      "Đăng xuất": 0,
    };

    contestants.forEach(c => {
      if (c.status === "in_progress") counts["Đang thi"]++;
      else if (c.status === "confirmed1") counts["Xác nhận 1"]++;
      else if (c.status === "confirmed2") counts["Xác nhận 2"]++;
    });

    return counts;
  };
  const handleButtonClick = (id: string) => {
    setSelectedIds(prevIds =>
      prevIds.includes(id)
        ? prevIds.filter(prevId => prevId !== id)
        : [...prevIds, id]
    );
  };

  const selectAll = (status: "in_progress" | "confirmed1") => {
    const ids = contestants
      .filter(c => c.status === status)
      .map(c => c.registrationNumber);
    setSelectedIds([...new Set([...selectedIds, ...ids])]);
  };
  const deselectAll = (status: "in_progress" | "confirmed1") => {
    const ids = contestants
      .filter(c => c.status === status)
      .map(c => c.registrationNumber);
    setSelectedIds(selectedIds.filter(id => !ids.includes(id)));
  };
  const handleConfirm1 = async () => {
    if (
      selectedIds.length === 0 ||
      !selectedIds.some(
        id =>
          contestants.find(c => c.registrationNumber === id)?.status ===
          "in_progress"
      )
    ) {
      showToast("Vui lòng chọn ít nhất một thí sinh đang thi", "warning");
      return;
    }

    const payload = {
      match: match ?? "",
      userId: user?.id ?? "",
      status: "confirmed1",
      ids: selectedIds,
    };

    socket?.emit(
      "contestant:status-update-judge",
      payload,
      (err: any, response: any) => {
        if (err) {
          showToast(err.message || "Xác nhận 1 thất bại!", "error");
          return;
        }

        if (response.success) {
          showToast("Xác nhận 1 thành công!", "success");
          setSelectedIds([]);
          setActiveTab("Xác nhận 1");
        } else {
          showToast(response.message || "Xác nhận 1 thất bại!", "error");
        }
      }
    );
  };
  const handleRevoke = async () => {
    if (
      selectedIds.length === 0 ||
      !selectedIds.some(
        id =>
          contestants.find(c => c.registrationNumber === id)?.status ===
          "confirmed1"
      )
    ) {
      showToast("Vui lòng chọn ít nhất một thí sinh ở Xác nhận 1!", "warning");
      return;
    }
    const payload = {
      match: match ?? "",
      userId: user?.id ?? "",
      status: "in_progress",
      ids: selectedIds,
    };
    socket?.emit(
      "contestant:status-update-judge",
      payload,
      (err: any, response: any) => {
        if (err) {
          showToast(err.message || "Hủy xác nhận 1 thất bại!", "error");
          return;
        }

        if (response.success) {
          showToast("Hủy xác nhận 1 thành công!", "success");
          setSelectedIds([]);
          setActiveTab("Đang thi");
        } else {
          showToast(response.message || "Hủy xác nhận 1 thất bại!", "error");
        }
      }
    );
  };
  const handleConfirm2 = async () => {
    if (
      selectedIds.length === 0 ||
      !selectedIds.some(
        id =>
          contestants.find(c => c.registrationNumber === id)?.status ===
          "confirmed1"
      )
    ) {
      showToast("Vui lòng chọn ít nhất một thí sinh ở Xác nhận 1", "warning");
      return;
    }
    const payload = {
      match: match ?? "",
      userId: user?.id ?? "",
      status: "confirmed2",
      ids: selectedIds,
    };
    socket?.emit(
      "contestant:status-update-judge",
      payload,
      (err: any, response: any) => {
        if (err) {
          showToast(err.message || "Xác nhận 2 thất bại!", "error");
          return;
        }

        if (response.success) {
          showToast("Xác nhận 2 thành công!", "success");
          setSelectedIds([]);
          setActiveTab("Xác nhận 2");
        } else {
          showToast(response.message || "Xác nhận 2 thất bại!", "error");
        }
      }
    );
  };

  const handleChot = async () => {
    if (contestants.some(c => c.status === "confirmed1")) {
      showToast("Vẫn còn thí sinh ở trạng thái xác nhận 1!", "error");
      return;
    }
    const payload = {
      match: match ?? "",
      userId: user?.id ?? "",
      groupId: groupInfo.id ?? "",
      confirmCurrentQuestion: matchInfo?.currentQuestion ?? 0,
    };
    socket?.emit(
      "group:confirmCurrentQuestion-update",
      payload,
      (err: any, response: any) => {
        if (err) {
          showToast(err.message || "Chốt thất bại!", "error");
          return;
        }
        if (response.success) {
          showToast("Chốt thành công!", "success");
        } else {
          showToast(response.message || "Chốt thất bại!", "error");
        }
      }
    );
  };

  if (isLoadingMatch || isLoadingContestant || isLoadingGroup) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isErrorMatch || isErrorContestant || isErrorGroup) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <p className="text-red-500">Lỗi khi tải dữ liệu. Vui lòng thử lại.</p>
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4 flex flex-col">
      <AnimatedBackground />

      <div
        className={`relative z-10 flex-1 transition-all duration-1000 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <JudgeHeader
          username={user?.username ?? "Giám khảo"}
          questionOrder={matchInfo?.currentQuestion ?? 0}
          matchName={matchInfo?.name ?? "Trận đấu"}
          totalContestants={contestants.length}
        />
        <JudgeTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={getContestantCounts()}
        />
        <div className="bg-white/10 rounded-2xl shadow-2xl p-4 sm:p-8 border border-white/20">
          {activeTab === "Đăng xuất" ? (
            <LogoutSection handleLogout={() => {}} />
          ) : (
            <>
              <ContestantList
                activeTab={activeTab}
                selectedIds={selectedIds}
                contestants={contestants}
                handleButtonClick={handleButtonClick}
                selectAll={selectAll}
                deselectAll={deselectAll}
                handleConfirm1={handleConfirm1}
                handleRevoke={handleRevoke}
                handleConfirm2={handleConfirm2}
                handleChot={handleChot}
                chotDisabled={disabled}
                questionOrder={matchInfo?.currentQuestion ?? 0}
              />
              {/* <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              /> */}
            </>
          )}
        </div>
        <footer className="mt-auto text-center text-white/50">
          <p className="text-xs sm:text-base">
            Cuộc thi - Hệ thống quản lý trọng tài © 2025
          </p>
        </footer>
      </div>
    </div>
  );
};

export default JudgeHomePage;
