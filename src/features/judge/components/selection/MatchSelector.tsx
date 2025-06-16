import React from 'react';
import type { Match } from '../../types/match';

interface MatchSelectorProps {
  matches: Match[];
  selectedMatch: number | null;
  onSelectMatch: (id: number) => void;
}

const MatchSelector: React.FC<MatchSelectorProps> = ({ matches, selectedMatch, onSelectMatch }) => {
  return (
    <div className="mb-8">
      <label className="block text-white font-semibold mb-4 text-lg">Trận đấu:</label>
      <div className="relative">
        <select
          className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer hover:bg-white/20"
          value={selectedMatch ?? ''}
          onChange={(e) => onSelectMatch(Number(e.target.value))}
        >
          <option value="" disabled className="bg-gray-800 text-white">
            Chọn một trận đấu
          </option>
          {matches.map((match) => (
            <option key={match.id} value={match.id} className="bg-gray-800 text-white">
              {match.match_name} - {new Date(match.start_time).toLocaleString('vi-VN')}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MatchSelector;