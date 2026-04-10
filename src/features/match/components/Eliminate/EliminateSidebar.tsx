import React from "react";
import { motion } from "framer-motion";
import type { Contestant } from "../../types";
//icon hinh vuong mau do
import SquareIcon from '@mui/icons-material/Square';

interface EliminateSidebarProps {
  contestants: Contestant[];
  displayMode: "eliminated" | "rescued";
  setDisplayMode: (mode: "eliminated" | "rescued") => void;
  fadingOutContestants: number[];
  totalEliminated: number;
  totalRescued: number;
  questionOrder: number;
  canShowAll:Boolean
}

const EliminateSidebar: React.FC<EliminateSidebarProps> = ({
  contestants,
  displayMode,
  setDisplayMode,
  fadingOutContestants,
  totalEliminated,
  totalRescued,
  questionOrder,
  canShowAll,
}) => {
  const currentEliminated = contestants.filter(
    contestant =>
      (contestant.status === "eliminated" || contestant.status === "banned") &&
      contestant.eliminated_at_question_order === questionOrder//tuankiet: them dieu dien de loc
  );

  const previousEliminated = contestants.filter(
    contestant =>
      (contestant.status === "eliminated" || contestant.status === "banned") &&
      contestant.eliminated_at_question_order !== questionOrder
  );

  const rescuedContestants = contestants.filter(
    contestant => contestant.status === "rescued"
  );

  return (
    <div className="h-full bg-gradient-to-b from-gray-50 to-gray-100 border-l border-gray-300 shadow-lg flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 py-2 px-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg shadow-md bg-gray-100 p-1" role="group">
            <button
              type="button"
              onClick={() => setDisplayMode("eliminated")}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${displayMode === "eliminated"
                ? "bg-red-500 text-white shadow-md"
                : "bg-transparent text-gray-700 hover:bg-gray-200"
                }`}
            >
              Bị loại: {canShowAll?0:totalEliminated}
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode("rescued")}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${displayMode === "rescued"
                ? "bg-green-500 text-white shadow-md"
                : "bg-transparent text-gray-700 hover:bg-gray-200"
                }`}
              disabled={rescuedContestants.length === 0}
            >
              Được cứu: {totalRescued}
            </button>
          </div>
        </div>

        {/* <h3 className={`text-2xl font-bold text-center ${displayMode === "eliminated" ? "text-red-700" : "text-green-700"
          }`}>
          {displayMode === "eliminated"
            ? `Bị loại (${totalEliminated})`
            : `Được cứu (${totalRescued})`}
        </h3> */}
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMode === "eliminated" && (
          <>
            {/* Current Question Eliminated */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-red-200">
              <h4 className="text-lg font-semibold text-red-700 mb-3 flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Bị loại ở câu này: {canShowAll?0:currentEliminated.length}
              </h4>

              {(currentEliminated.length > 0 && !canShowAll) ? (
                <div className="grid grid-cols-6 gap-2">
                {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(40px,1fr))] gap-2"> */}
                  {currentEliminated.map((contestant, index) => {
                    const bgColorClass = contestant.status === "banned"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-red-500 text-white border-red-600";
                    const isFadingOut = fadingOutContestants.includes(
                      contestant.registration_number
                    );

                    return (
                      <motion.div
                        key={`current-${contestant.registration_number}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: isFadingOut ? 0 : 1,
                          scale: isFadingOut ? 0.8 : 1
                        }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`
                          rounded-lg h-10 w-10 flex flex-col items-center justify-center
                          border-2 font-bold transition-all duration-200
                          hover:scale-105 ${bgColorClass}
                        `}
                        title={`${contestant.fullname} - ${contestant.status === "banned" ? "Bị cấm" : "Bị loại"}`}
                      >
                        {/* {contestant.registration_number} */}
                        {/*tuankiet: hien thi dap an cho thi sinh thua*/}
                        {/* Số báo danh */}
                        <div className="text-lg leading-none">
                          {contestant.registration_number}
                        </div>

                        {/* Đáp án */}
                        {/* <div
                          className="
                          text-sm font-extrabold text-yellow-300 
                          text-center leading-tight px-1
                          break-words
                        "
                          style={{
                            whiteSpace: 'normal',
                            wordBreak: 'normal',
                            overflowWrap: 'break-word'
                          }}
                        >
                          {contestant.currentAnswer?.answer}
                        </div> */}
                      </motion.div>
                    );
                  })}
                </div>
              ) 
              : (
                <div className="text-center py-6 text-gray-500">
                  {/* quy xóa text */}
                  {/* <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <p>Không có thí sinh nào bị loại ở câu này</p> */}
                </div>
              )}
            </div>

            {/* Previous Questions Eliminated */}
            {previousEliminated.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                  Danh sách bị loại <SquareIcon style={{ color: 'red' }} /> và bị cấm <SquareIcon style={{ color: 'black' }} />
                </h4>
                <div className="grid grid-cols-6 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                  {previousEliminated.map((contestant, index) => {
                    const bgColorClass = contestant.status === "banned"
                      ? "bg-gray-600 text-white border-gray-500"
                      : "bg-red-400 text-white border-red-500";

                    return (
                      <motion.div
                        key={`previous-${contestant.registration_number}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`
                          rounded-lg h-10 w-10 flex items-center justify-center
                          border font-bold text-lg transition-all duration-200
                          hover:scale-105 ${bgColorClass}
                        `}
                        title={`${contestant.fullname} - Câu ${contestant.eliminated_at_question_order}`}
                      >
                        {contestant.registration_number}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {displayMode === "rescued" && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
            <h4 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Thí sinh được cứu
            </h4>

            {rescuedContestants.length > 0 ? (
              <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
                {rescuedContestants.map((contestant, index) => (
                  <motion.div
                    key={`rescued-${contestant.registration_number}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                    className="
                      rounded-lg h-12 w-12 flex items-center justify-center
                      bg-green-500 text-white border-2 border-green-600 
                      font-bold text-sm transition-all duration-200
                      hover:scale-105 shadow-lg animate-pulse
                    "
                    title={`${contestant.fullname} - Được cứu ở câu ${contestant.rescued_at_question_order}`}
                  >
                    {contestant.registration_number}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">💔</span>
                </div>
                <p>Chưa có thí sinh nào được cứu</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EliminateSidebar;