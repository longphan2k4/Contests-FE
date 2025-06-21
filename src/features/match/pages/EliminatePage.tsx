import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EliminateGrid from "../components/Eliminate/EliminateGrid";
import ActionButtons from "../components/Eliminate/ActionButtons";
import EliminateSidebar from "../components/Eliminate/EliminateSidebar";
import { useEliminate } from "../hooks/useEliminate";
import MatchHeader from "../components/MatchHeader/MatchHeader";

export default function EliminatePage() {
  const {
    contestants,
    icons,
    recentlyRestored,
    fadingOutContestants,
    displayMode,
    setDisplayMode,
    handleSnap,
    canDelete,
    canRestore,
  } = useEliminate();

  const showSidebar = true;
  useEffect(() => {
    document.title = "Thí sinh - kết quả";
  }, []);
  return (
    <AnimatePresence>
      <div className="flex flex-col min-h-screen">
        {/* MatchHeader cố định ở phía trên */}

        {/* Nội dung chính với padding-top để tránh bị che bởi header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col flex-1 overflow-hidden" // Thêm pt-[80px] để tránh che khuất
        >
          <div className="flex flex-1 overflow-auto mt-2">
            <div className="flex-1 p-5 overflow-auto">
              <EliminateGrid
                icons={icons}
                recentlyRestored={recentlyRestored}
              />
              <ActionButtons
                canDelete={canDelete}
                canRestore={canRestore}
                handleSnap={handleSnap}
              />
            </div>
            {showSidebar && (
              <EliminateSidebar
                contestants={contestants}
                displayMode={displayMode}
                setDisplayMode={setDisplayMode}
                fadingOutContestants={fadingOutContestants}
                totalEliminated={
                  icons.filter(i => i.isActive && i.isDisintegrated).length
                }
                totalRescued={
                  icons.filter(i => i.isActive && i.isRescued).length
                }
              />
            )}
          </div>
        </motion.div>

        <style>{`
          @keyframes particle-float {
            0% {
              opacity: 1;
              transform: translate(0, 0) rotate(0deg);
            }
            100% {
              opacity: 0;
              transform: translate(var(--tx), var(--ty)) rotate(var(--tw-rotate)) scale(1.5);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.5s ease-out forwards;
          }

          @keyframes fadeOut {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(0.8);
            }
          }

          .animate-fadeOut {
            animation: fadeOut 0.7s ease-out forwards;
          }

          @keyframes rescuedContestant {
            0% {
              box-shadow: 0 0 20px rgba(3, 141, 95, 0.9);
              transform: scale(1.1);
            }
            100% {
              box-shadow: 0 0 0 rgba(16, 185, 129, 0);
              transform: scale(1);
              background-color: #1D4ED8;
            }
          }

          .animate-rescuedContestant {
            animation: rescuedContestant 4s ease-out forwards;
          }

          @keyframes pulse-green {
            0% {
              box-shadow: 0 0 5px rgba(16, 185, 129, 0.7);
              transform: scale(1);
            }
            50% {
              box-shadow: 0 0 15px rgba(16, 185, 129, 0.9);
              transform: scale(1.05);
            }
            100% {
              box-shadow: 0 0 5px rgba(16, 185, 129, 0.7);
              transform: scale(1);
            }
          }

          .animate-pulse-green {
            animation: pulse-green 2s ease-in-out infinite;
          }

          .shadow-glow:hover {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
          }
        `}</style>
      </div>
    </AnimatePresence>
  );
}
