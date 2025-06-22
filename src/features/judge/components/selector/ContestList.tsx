
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
    <div className="contest-list">
      <h2>Danh Sách Cuộc Thi</h2>
      {loading && <p>Đang tải danh sách cuộc thi...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && contests.length > 0 && (
        <ul>
          {contests.map((contest) => (
            <li
              key={contest.id}
              className="contest-item"
              onClick={() => handleContestSelect(contest.id)}
            >
              <strong>{contest.name}</strong> (Slug: {contest.slug})
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && contests.length === 0 && <p>Không có cuộc thi nào.</p>}
    </div>
  );
};

export default ContestList;