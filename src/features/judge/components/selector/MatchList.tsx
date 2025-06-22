import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Match } from '../../types/selector/Match';
import { getMatchesByContestId } from '../../services/selector/api';
import { useAuth } from '../../../auth/hooks/authContext';

const MatchList: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setError('Vui lòng đăng nhập để xem danh sách trận đấu.');
      setLoading(false);
      navigate('/login');
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
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          navigate('/login');
        } else {
          setError('Không thể tải danh sách trận đấu.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [contestId, user, navigate]);

  return (
    <div className="match-list">
      <h2>Danh Sách Trận Đấu - Cuộc Thi ID: {contestId}</h2>
      <button onClick={() => navigate('/contests')} className="back-button">
        Quay lại
      </button>
      {loading && <p>Đang tải danh sách trận đấu...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && matches.length > 0 ? (
        <ul>
          {matches.map((match) => (
            <li key={match.id}>
              <strong>{match.name}</strong> (ID: {match.id})
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p>Không có trận đấu nào cho cuộc thi này.</p>
      )}
    </div>
  );
};

export default MatchList;