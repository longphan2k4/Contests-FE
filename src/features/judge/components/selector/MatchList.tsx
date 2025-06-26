import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Match } from "../../types/selector/Match";
import { getMatchesByContestId } from "../../services/selector/api";
import { useAuth } from "../../../auth/hooks/authContext";

const MatchList: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setError("Vui lòng đăng nhập để xem danh sách trận đấu.");
      setLoading(false);
      navigate("/login");
      return;
    }

    const fetchMatches = async () => {
      if (!contestId) return;
      try {
        setLoading(true);
        const matchList = await getMatchesByContestId(parseInt(contestId, 10));
        setMatches(matchList);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          navigate("/login");
        } else {
          setError("Không thể tải danh sách trận đấu.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [contestId, user, navigate]);

  const handleMatchSelect = (slug: string) => {
    navigate(`/trong-tai/tran-dau/${slug}`);
  };
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sm:p-6 sticky top-0 z-10 shadow-sm">
        {/* Back Button */}
        <button
          onClick={() => navigate("/cuoc-thi")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-200 hover:-translate-x-0.5 mb-4"
        >
          <span className="text-base">←</span>
          Quay lại
        </button>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-3 flex items-center justify-center gap-3">
            <span className="text-xl sm:text-2xl lg:text-3xl">⚽</span>
            Danh Sách Trận Đấu
          </h1>
          <div className="inline-block bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-semibold border border-blue-200">
            Cuộc thi ID: {contestId}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600">Đang tải danh sách trận đấu...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 m-4 sm:m-6 flex items-center gap-3">
          <div className="text-2xl flex-shrink-0">⚠️</div>
          <p className="text-red-600 text-sm sm:text-base leading-relaxed">
            {error}
          </p>
        </div>
      )}

      {/* Matches Container */}
      {!loading && !error && matches.length > 0 && (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          {/* Matches Header */}
          <div className="mb-6">
            <h2 className="text-slate-800 text-lg sm:text-xl font-semibold">
              {matches.length} trận đấu
            </h2>
          </div>

          {/* Match Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {matches.map((match, index) => (
              <div
                key={match.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-100 cursor-pointer animate-pulse"
                onClick={() => match.slug && handleMatchSelect(match.slug)}
                style={{
                  animation: `slideUp 0.5s ease forwards`,
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  transform: "translateY(20px)",
                }}
              >
                {/* Match Header */}
                <div className="bg-slate-50 p-3 sm:p-4 flex justify-between items-center border-b border-slate-200">
                  <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md min-w-[32px] text-center">
                    #{index + 1}
                  </div>
                  <div className="text-slate-500 text-xs font-medium font-mono">
                    ID: {match.id}
                  </div>
                </div>

                {/* Match Body */}
                <div className="p-3 sm:p-4 flex-1">
                  <h3 className="text-slate-800 font-semibold text-sm sm:text-base leading-tight mb-2 line-clamp-2">
                    {match.name}
                  </h3>
                  <p className="text-slate-500 text-xs font-mono opacity-80 truncate">
                    Slug: {match.slug}
                  </p>
                </div>

                {/* Match Footer */}
                <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Sẵn sàng
                  </div>
                  <span className="text-blue-600 text-xs font-medium opacity-80">
                    Click để xem chi tiết →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && matches.length === 0 && (
        <div className="text-center py-16 max-w-md mx-auto px-4">
          <div className="text-5xl sm:text-6xl mb-5 opacity-70">🏟️</div>
          <h3 className="text-slate-800 text-xl sm:text-2xl font-semibold mb-3">
            Chưa có trận đấu nào
          </h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
            Cuộc thi này chưa có trận đấu nào được tạo.
          </p>
          <button
            onClick={() => navigate("/contests")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors duration-200"
          >
            Chọn cuộc thi khác
          </button>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .animate-pulse {
          animation: none;
        }
      `}</style>
    </div>
  );
};

export default MatchList;
