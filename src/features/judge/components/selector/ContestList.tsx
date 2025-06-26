import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Contest } from '../../types/selector/Contest';
import { getContests } from '../../services/selector/api';
import { useAuth } from '../../../auth/hooks/authContext';

const ContestList: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setError('Vui lòng đăng nhập để xem danh sách cuộc thi.');
      setLoading(false);
      navigate('/login');
      return;
    }

    const fetchContests = async () => {
      try {
        setLoading(true);
        const contestList = await getContests();
        setContests(contestList);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          navigate('/login');
        } else {
          setError('Không thể tải danh sách cuộc thi.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, [user, navigate]);

  const handleContestSelect = (contestId: number) => {
    navigate(`/contests/${contestId}/matches`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="text-center mb-8 pt-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2 flex items-center justify-center gap-3">
          <span className="text-2xl sm:text-3xl lg:text-4xl">🏆</span>
          Danh Sách Cuộc Thi
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Chọn cuộc thi để xem danh sách trận đấu
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600">Đang tải danh sách cuộc thi...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mx-auto max-w-md sm:max-w-lg flex items-center gap-3 my-5">
          <div className="text-2xl flex-shrink-0">⚠️</div>
          <p className="text-red-600 text-sm sm:text-base leading-relaxed">{error}</p>
        </div>
      )}

      {/* Contest Grid */}
      {!loading && !error && contests.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {contests.map((contest) => (
            <div
              key={contest.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100 overflow-hidden min-h-[140px] flex flex-col"
              onClick={() => handleContestSelect(contest.id)}
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex items-center gap-3">
                <div className="text-lg sm:text-xl flex-shrink-0">🎯</div>
                <h3 className="text-slate-800 font-semibold text-base sm:text-lg leading-tight flex-1 truncate">
                  {contest.name}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 pt-3 flex-1 flex flex-col justify-between">
                <p className="text-slate-500 text-xs sm:text-sm font-mono mb-4 truncate">
                  Slug: {contest.slug}
                </p>
                
                {/* Card Footer */}
                <div className="flex justify-end">
                  <span className="text-blue-600 text-xs sm:text-sm font-semibold">
                    Xem chi tiết →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && contests.length === 0 && (
        <div className="text-center py-16 max-w-md mx-auto px-4">
          <div className="text-4xl sm:text-5xl mb-4">📋</div>
          <h3 className="text-slate-800 text-lg sm:text-xl font-semibold mb-2">
            Chưa có cuộc thi nào
          </h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Hiện tại chưa có cuộc thi nào được tạo.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContestList;