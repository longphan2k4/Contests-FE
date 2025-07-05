import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EliminateGrid from "../Eliminate/EliminateGrid";
import EliminateSidebar from "../Eliminate/EliminateSidebar";
import { createParticles } from "../../utils/particleUtils";
import type { Icon } from "../../types";

export interface Contestant {
  registration_number: number;
  fullname: string;
  status:
    | "not_started"
    | "in_progress"
    | "confirmed1"
    | "confirmed2"
    | "eliminated"
    | "rescued"
    | "banned"
    | "completed";
  eliminated_at_question_order: number | null;
  rescued_at_question_order?: number | null;
}

import type { ControlValue, ListContestant } from "../../types/control.type";

interface EliminateDisplayProps {
  ListContestant: ListContestant[];
  totalIcons?: number;
  currentQuestionOrder: number;
  controlValue?: ControlValue | null;
}

export default function EliminateDisplay({
  ListContestant,
  totalIcons = 100,
  currentQuestionOrder,
  controlValue,
}: EliminateDisplayProps) {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [recentlyRestored, setRecentlyRestored] = useState<number[]>([]);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [fadingOutContestants, setFadingOutContestants] = useState<number[]>([]);
  const [displayMode, setDisplayMode] = useState<"eliminated" | "rescued">("eliminated");
  
  console.log("Control value changed:", controlValue);

  useEffect(() => {
    if (controlValue === "Eliminate") {
      handleSnap("delete");
    } else if (controlValue === "Rescued") {
      handleSnap("restore");
    }
  }, [controlValue]);

  useEffect(() => {
    const contestantsData = ListContestant.flatMap(group =>
      group.contestantMatches.map(c => ({
        registration_number: c.registrationNumber,
        fullname: `${c.contestant.student.fullName}`,
        status: c.status,
        eliminated_at_question_order: c.eliminatedAtQuestionOrder,
        rescued_at_question_order: c.rescuedAtQuestionOrder,
      }))
    );
    setContestants(contestantsData);
  }, [ListContestant, currentQuestionOrder]);

  useEffect(() => {
    const newIcons: Icon[] = Array.from(
      { length: Math.max(totalIcons, contestants.length) },
      (_, index) => {
        const contestant = contestants.find(
          c => c.registration_number === index + 1
        );
        return {
          id: contestant?.registration_number || index + 1,
          registrationNumber: contestant?.registration_number || index + 1,
          name: contestant?.fullname || "",
          isDisintegrated: contestant
            ? ![
                "in_progress",
                "not_started",
                "confirmed1",
                "confirmed2",
                "rescued",
              ].includes(contestant.status)
            : true,
          isRescued: contestant?.status === "rescued",
          particles: [],
          isFading: false,
          isActive: !!contestant,
        };
      }
    );
    setIcons(newIcons);
  }, [contestants, totalIcons]);

  useEffect(() => {
    const hasRescued = contestants.some(c => c.status === "rescued");
    setDisplayMode(hasRescued ? "rescued" : "eliminated");
  }, [contestants]);

  const handleSnap = (action: "delete" | "restore") => {
    if (actionInProgress) return;
    setActionInProgress(true);
    console.log(contestants);
    if (action === "delete") handleSnapDelete();
    else if (action === "restore") handleSnapRestore();
  };

  const handleSnapDelete = () => {
    setRecentlyRestored([]);

    const deleteList = contestants
      .filter(
        c =>
          c.status === "eliminated" &&
          c.eliminated_at_question_order === currentQuestionOrder
      )
      .map(c => c.registration_number);

    if (deleteList.length === 0) {
      setActionInProgress(false);
      return;
    }

    setContestants(prev =>
      prev.map(c =>
        deleteList.includes(c.registration_number)
          ? {
              ...c,
              status: "eliminated",
              eliminated_at_question_order: currentQuestionOrder,
            }
          : c
      )
    );

    setIcons(prev =>
      prev.map(icon =>
        deleteList.includes(icon.registrationNumber)
          ? { ...icon, isFading: true }
          : icon
      )
    );

    setTimeout(() => {
      setIcons(prev =>
        prev.map(icon =>
          deleteList.includes(icon.registrationNumber)
            ? {
                ...icon,
                isDisintegrated: true,
                isFading: false,
                particles: createParticles(icon.registrationNumber),
              }
            : icon
        )
      );

      setTimeout(() => {
        setIcons(prev =>
          prev.map(icon =>
            deleteList.includes(icon.registrationNumber)
              ? { ...icon, particles: [] }
              : icon
          )
        );
        setActionInProgress(false);
      }, 1000);
    }, 1000);
  };

  const handleSnapRestore = () => {
    setActionInProgress(true);

    const disintegrated = icons
      .filter(i => i.isDisintegrated && i.isActive)
      .map(i => i.registrationNumber);

    if (disintegrated.length === 0) {
      setActionInProgress(false);
      return;
    }

    const toBeRescued = contestants
      .filter(
        c =>
          disintegrated.includes(c.registration_number) &&
          c.status === "eliminated" &&
          c.eliminated_at_question_order === currentQuestionOrder
      )
      .map(c => c.registration_number);

    if (toBeRescued.length === 0) {
      setActionInProgress(false);
      return;
    }

    setContestants(prev =>
      prev.map(c =>
        toBeRescued.includes(c.registration_number)
          ? {
              ...c,
              status: "rescued",
              rescued_at_question_order: currentQuestionOrder,
            }
          : c
      )
    );

    setFadingOutContestants(toBeRescued);

    setTimeout(() => {
      setRecentlyRestored(toBeRescued);
      setFadingOutContestants([]);

      setIcons(prev =>
        prev.map(icon =>
          toBeRescued.includes(icon.registrationNumber)
            ? {
                ...icon,
                isDisintegrated: false,
                isFading: false,
                particles: [],
              }
            : icon
        )
      );

      setTimeout(() => {
        setActionInProgress(false);
      }, 800);
    }, 1000);
  };

  const showSidebar = true;

  useEffect(() => {
    document.title = "Thí sinh - kết quả";
  }, []);

  return (
    <AnimatePresence>
      {/* Container với chiều cao tính toán động */}
      <div 
        className="flex overflow-hidden"
        style={{ 
          height: 'calc(100vh - 200px)', // Trừ đi chiều cao header (khoảng 200px)
          minHeight: '500px' // Đảm bảo chiều cao tối thiểu
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-1 overflow-hidden"
        >
          {/* Grid Container - chiếm không gian còn lại */}
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <EliminateGrid
              icons={icons}
              recentlyRestored={recentlyRestored}
            />
          </div>
          
          {/* Sidebar với chiều cao cố định */}
          {showSidebar && (
            <div className="w-85 md:w-96 flex-shrink-0">
              <EliminateSidebar
                contestants={contestants}
                displayMode={displayMode}
                setDisplayMode={setDisplayMode}
                questionOrder={currentQuestionOrder}
                fadingOutContestants={fadingOutContestants}
                totalEliminated={
                  icons.filter(i => i.isActive && i.isDisintegrated).length
                }
                totalRescued={
                  icons.filter(i => i.isActive && i.isRescued).length
                }
              />
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}