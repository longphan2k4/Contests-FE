import React from 'react';
import { motion } from 'framer-motion';
import type { Contestant } from '../../types';
import { MOCK_CURRENT_QUESTION } from '../../constants';

interface EliminateSidebarProps {
  contestants: Contestant[];
  displayMode: 'eliminated' | 'rescued';
  setDisplayMode: (mode: 'eliminated' | 'rescued') => void;
  fadingOutContestants: number[];
  totalEliminated: number;
  totalRescued: number;
}

const EliminateSidebar: React.FC<EliminateSidebarProps> = ({
  contestants,
  displayMode,
  setDisplayMode,
  fadingOutContestants,
  totalEliminated,
  totalRescued,
}) => {
  return (
    <div className="w-85 md:w-90 h-full bg-gray-100 border-l border-gray-300 p-3 flex flex-col shadow-md">
      <div className="pb-3 border-b border-gray-300 mb-4">
        <div className="justify-center mb-3 flex">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setDisplayMode('eliminated')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                displayMode === 'eliminated' ? 'bg-red-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Bị loại ({totalEliminated})
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('rescued')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                displayMode === 'rescued' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              disabled={!contestants.some(c => c.match_status === 'Được cứu')}
            >
              Được cứu ({totalRescued})
            </button>
          </div>
        </div>
        <h3
          className={`text-xl sm:text-4xl font-semibold text-center ${
            displayMode === 'eliminated' ? 'text-red-800' : 'text-green-800'
          }`}
        >
          {displayMode === 'eliminated' ? `Bị loại (${totalEliminated})` : `Được cứu (${totalRescued})`}
        </h3>
      </div>

      <div className="overflow-hidden flex-1">
        {displayMode === 'eliminated' && (
          <div className="mb-4">
            <div className="mb-3">
              <h4 className="text-3xl font-bold text-black-700 mb-2">Câu hiện tại:</h4>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {contestants
                  .filter(
                    contestant =>
                      (contestant.match_status === 'Bị loại' || contestant.match_status === 'Cấm thi') &&
                      contestant.eliminated_at_question_order === MOCK_CURRENT_QUESTION
                  )
                  .map((contestant, index) => {
                    const bgColorClass =
                      contestant.match_status === 'Cấm thi'
                        ? 'bg-gray-800 text-gray-100 border border-black-700'
                        : 'bg-red-600 text-gray-100 border border-red-700';
                    const isFadingOut = fadingOutContestants.includes(contestant.registration_number);
                    return (
                      <div
                        key={`current-${contestant.registration_number}-${index}`}
                        className={`border rounded-xl h-15 w-15 flex flex-col items-center justify-center ${
                          isFadingOut ? 'animate-fadeOut' : 'animate-fadeInUp'
                        } ${bgColorClass}`}
                      >
                        <span className="font-bold text-4xl">{contestant.registration_number}</span>
                      </div>
                    );
                  })}
                {!contestants.some(
                  c =>
                    (c.match_status === 'Bị loại' || c.match_status === 'Cấm thi') &&
                    c.eliminated_at_question_order === MOCK_CURRENT_QUESTION
                ) && <p className="text-center text-gray-600 col-span-full">Không có thí sinh nào bị loại ở câu này.</p>}
              </div>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-black-700 mb-2">Các câu trước:</h4>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {contestants
                  .filter(
                    contestant =>
                      (contestant.match_status === 'Bị loại' || contestant.match_status === 'Cấm thi') &&
                      contestant.eliminated_at_question_order !== MOCK_CURRENT_QUESTION
                  )
                  .map((contestant, index) => {
                    const bgColorClass =
                      contestant.match_status === 'Cấm thi'
                        ? 'bg-gray-800 text-gray-100 border border-black-700'
                        : 'bg-red-600 text-gray-100 border border-red-700';
                    const isFadingOut = fadingOutContestants.includes(contestant.registration_number);
                    return (
                      <div
                        key={`previous-${contestant.registration_number}-${index}`}
                        className={`border rounded-xl h-15 w-15 flex flex-col items-center justify-center ${
                          isFadingOut ? 'animate-fadeOut' : 'animate-fadeInUp'
                        } ${bgColorClass}`}
                        title={`Loại ở câu: ${contestant.eliminated_at_question_order}`}
                      >
                        <span className="font-bold text-4xl">{contestant.registration_number}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {displayMode === 'rescued' && (
          <div className="mb-4">
            <div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {contestants
                  .filter(contestant => contestant.match_status === 'Được cứu')
                  .map((contestant, index) => (
                    <motion.div
                      key={`rescued-${contestant.registration_number}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                      className="rounded-xl h-15 w-15 flex flex-col items-center justify-center bg-green-500 text-gray-100 border border-green-700 animate-pulse-green"
                      title={`Được cứu ở câu: ${contestant.rescued_at_question_order ?? '?'}`}
                    >
                      <span className="font-bold text-4xl">{contestant.registration_number}</span>
                    </motion.div>
                  ))}
                {!contestants.some(c => c.match_status === 'Được cứu') && (
                  <p className="text-center text-gray-600 col-span-full">Không có thí sinh nào được cứu.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EliminateSidebar;