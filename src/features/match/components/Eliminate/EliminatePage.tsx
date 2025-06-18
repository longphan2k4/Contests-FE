import React, { useState, useEffect } from "react";
import { UserMinusIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants, Easing } from "framer-motion";

// Define the Contestant interface
interface Contestant {
  registration_number: number;
  fullname: string;
  match_status: string;
  eliminated_at_question_order: number | null;
  rescued_at_question_order?: number | null;
}

// Define the Icon interface for the icons state
interface Icon {
  id: number;
  registrationNumber: number;
  name: string;
  isDisintegrated: boolean;
  isRescued: boolean;
  particles: Particle[];
  isFading: boolean;
  isActive: boolean;
}

// Define the Particle interface for particle effects
interface Particle {
  id: string;
  size: number;
  left: string;
  top: string;
  tx: string;
  ty: string;
  rotate: string;
}

// Mock data for contestants
const mockContestants: Contestant[] = Array.from({ length: 60 }, (_, index) => {
  const status = ['Đang thi', 'Bị loại', 'Được cứu', 'Cấm thi'][Math.floor(Math.random() * 4)];
  return {
    registration_number: index + 1,
    fullname: `Contestant ${index + 1}`,
    match_status: status,
    eliminated_at_question_order: status === 'Bị loại' || status === 'Cấm thi' ? Math.floor(Math.random() * 5) + 1 : null,
    rescued_at_question_order: status === 'Được cứu' ? Math.floor(Math.random() * 5) + 1 : null,
  };
});

// Mock current question
const mockCurrentQuestion = 3;

export default function EliminatePage() {
  // State management with explicit types
  const [contestants, setContestants] = useState<Contestant[]>(mockContestants);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [recentlyRestored, setRecentlyRestored] = useState<number[]>([]);
  const [showSidebar] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [fadingOutContestants, setFadingOutContestants] = useState<number[]>([]);
  const [displayMode, setDisplayMode] = useState<"eliminated" | "rescued">("eliminated");

  const TOTAL_ICONS = 60;

  // Initialize and update icons based on contestants
  useEffect(() => {
    console.log("Contestants data:", contestants);
    const newIcons: Icon[] = Array.from({ length: Math.max(TOTAL_ICONS, contestants.length) }, (_, index) => {
      const contestant = contestants.find(c => c.registration_number === (index + 1));
      return {
        id: index + 1,
        registrationNumber: contestant?.registration_number || index + 1,
        name: contestant?.fullname || "",
        isDisintegrated: contestant ? !['Đang thi', 'Qua vòng', 'Xác nhận 1', 'Xác nhận 2', 'Được cứu'].includes(contestant.match_status) : true,
        isRescued: contestant ? contestant.match_status === "Được cứu" : false,
        particles: [],
        isFading: false,
        isActive: !!contestant,
      };
    });
    setIcons(newIcons);
  }, [contestants]);

  // Automatically switch display mode based on rescued contestants
  useEffect(() => {
    const hasRescuedContestants = contestants.some(c => c.match_status === "Được cứu");
    setDisplayMode(hasRescuedContestants ? "rescued" : "eliminated");
  }, [contestants]);

  // Function to create particles
  const createParticles = (id: number): Particle[] => {
    const particleCount = 10;
    return Array.from({ length: particleCount }, (_, i) => ({
      id: `${id}-${i}`,
      size: Math.random() * 6 + 2,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      tx: `${(Math.random() - 0.5) * 100}px`,
      ty: `${(Math.random() - 0.5) * 100}px`,
      rotate: `${Math.random() * 360}deg`,
    }));
  };

  // Handle snap action
  const handleSnap = (action: "delete" | "restore") => {
    if (actionInProgress) return;
    setActionInProgress(true);

    if (action === "delete") {
      setRecentlyRestored([]);
      const activeIcons = icons.filter((icon) => !icon.isDisintegrated && icon.isActive);
      if (activeIcons.length > 0) {
        const deleteList = activeIcons
          .filter(() => Math.random() > 0.5)
          .map((icon) => icon.registrationNumber);
        if (deleteList.length === 0) {
          setActionInProgress(false);
          return;
        }
        setContestants(prev => prev.map(c =>
          deleteList.includes(c.registration_number) ? { ...c, match_status: "Bị loại", eliminated_at_question_order: mockCurrentQuestion } : c
        ));
        setIcons((prevIcons) =>
          prevIcons.map((icon) =>
            deleteList.includes(icon.registrationNumber) ? { ...icon, isFading: true } : icon
          )
        );
        setTimeout(() => {
          setIcons((prevIcons) =>
            prevIcons.map((icon) =>
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
            setIcons((prevIcons) =>
              prevIcons.map((icon) =>
                deleteList.includes(icon.registrationNumber) ? { ...icon, particles: [] } : icon
              )
            );
            setActionInProgress(false);
          }, 1000);
        }, 1000);
      } else {
        setActionInProgress(false);
      }
    } else if (action === "restore") {
      const disintegratedIcons = icons
        .filter((icon) => icon.isDisintegrated && icon.isActive)
        .map((icon) => icon.registrationNumber);
      if (disintegratedIcons.length > 0) {
        setContestants(prev => prev.map(c =>
          disintegratedIcons.includes(c.registration_number) ? { ...c, match_status: "Được cứu", eliminated_at_question_order: null } : c
        ));
        setFadingOutContestants(disintegratedIcons);
        setTimeout(() => {
          setRecentlyRestored(disintegratedIcons);
          setFadingOutContestants([]);
          setIcons((prevIcons) =>
            prevIcons.map((icon) => {
              if (disintegratedIcons.includes(icon.registrationNumber)) {
                return {
                  ...icon,
                  isDisintegrated: false,
                  isFading: false,
                  particles: [],
                };
              }
              return icon;
            })
          );
          setTimeout(() => {
            setActionInProgress(false);
          }, 800);
        }, 1000);
      } else {
        setActionInProgress(false);
      }
    }
  };

  // Calculate active icons and check action availability
  const activeIconCount = icons.filter((icon) => !icon.isDisintegrated && icon.isActive).length;
  const canDelete = activeIconCount > 0 && !actionInProgress;
  const canRestore = icons.some((icon) => icon.isDisintegrated && icon.isActive) && !actionInProgress;

  // Group icons into rows
  const groupedIcons: Icon[][] = [];
  for (let i = 0; i < icons.length; i += 20) {
    groupedIcons.push(icons.slice(i, i + 20));
  }

  // Define framer-motion variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3, ease: "easeIn" } },
  };

  const iconVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] as Easing,
      },
    },
    disintegrating: { opacity: 0, scale: 0.9, transition: { duration: 1 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden"
      >
        

        <div className="flex flex-1 overflow-auto mt-2">
          <div className="flex-1 p-5 overflow-auto">
            <div className="w-full max-w-5xl mx-auto">
              {groupedIcons.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.1, duration: 0.5 }}
                    className="grid grid-cols-10 grid-rows-2 gap-x-2 gap-y-2"
                  >
                    {group.map((icon) => (
                      <div key={icon.id} className="relative flex justify-center">
                        {icon.isActive && (
                          <motion.div
                            variants={iconVariants}
                            initial="hidden"
                            animate={
                              icon.isFading
                                ? "disintegrating"
                                : icon.isDisintegrated
                                ? "hidden"
                                : "visible"
                            }
                            className={`w-16 md:w-20 aspect-square rounded-lg flex flex-col items-center justify-center shadow-lg ${
                              icon.isDisintegrated ? "bg-red-700" : 
                              recentlyRestored.includes(icon.registrationNumber) ? "bg-green-800 animate-rescuedContestant" : 
                              icon.isRescued ? "bg-green-800 animate-rescuedContestant" : 
                              "bg-blue-800 hover:shadow-glow hover:bg-blue-700 transition-all"
                            }`}
                          >
                            <span className="text-white text-xl md:text-6xl font-bold">
                              {icon.registrationNumber}
                            </span>
                          </motion.div>
                        )}
                        {icon.particles.length > 0 &&
                          icon.particles.map((particle) => (
                            <div
                              key={particle.id}
                              className="absolute rounded-full bg-blue-600"
                              style={{
                                width: `${particle.size}px`,
                                height: `${particle.size}px`,
                                left: particle.left,
                                top: particle.top,
                                animation: "particle-float 1s ease-out forwards",
                                ["--tw-rotate" as string]: particle.rotate,
                                ["--tx" as string]: particle.tx,
                                ["--ty" as string]: particle.ty,
                              } as React.CSSProperties}
                            />
                          ))}
                      </div>
                    ))}
                  </motion.div>
                  {groupIndex < groupedIcons.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ delay: groupIndex * 0.1 + 0.2, duration: 0.5 }}
                      className="w-full h-0.5 bg-gray-300 my-5 rounded-full"
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="gap-4 mt-6 justify-center flex">
              <button
                className={`p-3 rounded-lg w-14 h-14 flex items-center justify-center transition-all ${
                  canDelete
                    ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                    : "bg-red-800 opacity-50 cursor-not-allowed"
                }`}
                onClick={() => canDelete && handleSnap("delete")}
                disabled={!canDelete}
              >
                <UserMinusIcon className="w-7 h-7 text-white" />
              </button>
              <button
                className={`p-3 rounded-lg w-14 h-14 flex items-center justify-center transition-all ${
                  canRestore
                    ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                    : "bg-green-800 opacity-50 cursor-not-allowed"
                }`}
                onClick={() => canRestore && handleSnap("restore")}
                disabled={!canRestore}
              >
                <UserPlusIcon className="w-7 h-7 text-white" />
              </button>
            </div>
          </div>

          {showSidebar && (
            <div className="w-85 md:w-90 h-full bg-gray-100 border-l border-gray-300 p-3 flex flex-col shadow-md">
              <div className="pb-3 border-b border-gray-300 mb-4">
                <div className="justify-center mb-3 flex">
                  <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      onClick={() => setDisplayMode("eliminated")}
                      className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                        displayMode === "eliminated"
                          ? "bg-red-700 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Bị loại ({icons.filter(i => i.isActive && i.isDisintegrated).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDisplayMode("rescued")}
                      className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                        displayMode === "rescued"
                          ? "bg-green-700 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      disabled={!contestants.some(c => c.match_status === "Được cứu")}
                    >
                      Được cứu ({icons.filter(i => i.isActive && i.isRescued).length})
                    </button>
                  </div>
                </div>
                <h3 className={`text-xl sm:text-4xl font-semibold text-center ${
                  displayMode === "eliminated" ? "text-red-800" : "text-green-800"
                }`}>
                  {displayMode === "eliminated"
                    ? `Bị loại (${icons.filter(i => i.isActive && i.isDisintegrated).length})`
                    : `Được cứu (${icons.filter(i => i.isActive && i.isRescued).length})`
                  }
                </h3>
              </div>

              <div className="overflow-hidden flex-1">
                {displayMode === "eliminated" && (
                  <div className="mb-4">
                    <div className="mb-3">
                      <h4 className="text-3xl font-bold text-black-700 mb-2">Câu hiện tại:</h4>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {contestants
                          .filter(contestant =>
                            (contestant.match_status === "Bị loại" || contestant.match_status === "Cấm thi") &&
                            contestant.eliminated_at_question_order === mockCurrentQuestion
                          )
                          .map((contestant, index) => {
                            const bgColorClass = contestant.match_status === "Cấm thi"
                              ? "bg-gray-800 text-gray-100 border border-black-700"
                              : "bg-red-600 text-gray-100 border border-red-700";
                            const isFadingOut = fadingOutContestants.includes(contestant.registration_number);
                            return (
                              <div
                                key={`current-${contestant.registration_number}-${index}`}
                                className={`border rounded-xl h-15 w-15 flex flex-col items-center justify-center ${
                                  isFadingOut ? "animate-fadeOut" : "animate-fadeInUp"
                                } ${bgColorClass}`}
                              >
                                <span className="font-bold text-4xl">{contestant.registration_number}</span>
                              </div>
                            );
                          })}
                        {!contestants.some(c =>
                          (c.match_status === "Bị loại" || c.match_status === "Cấm thi") &&
                          c.eliminated_at_question_order === mockCurrentQuestion
                        ) && (
                          <p className="text-center text-gray-600 col-span-full">Không có thí sinh nào bị loại ở câu này.</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-3xl font-bold text-black-700 mb-2">Các câu trước:</h4>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {contestants
                          .filter(contestant =>
                            (contestant.match_status === "Bị loại" || contestant.match_status === "Cấm thi") &&
                            contestant.eliminated_at_question_order !== mockCurrentQuestion
                          )
                          .map((contestant, index) => {
                            const bgColorClass = contestant.match_status === "Cấm thi"
                              ? "bg-gray-800 text-gray-100 border border-black-700"
                              : "bg-red-600 text-gray-100 border border-red-700";
                            const isFadingOut = fadingOutContestants.includes(contestant.registration_number);
                            return (
                              <div
                                key={`previous-${contestant.registration_number}-${index}`}
                                className={`border rounded-xl h-15 w-15 flex flex-col items-center justify-center ${
                                  isFadingOut ? "animate-fadeOut" : "animate-fadeInUp"
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

                {displayMode === "rescued" && (
                  <div className="mb-4">
                    <div>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {contestants
                          .filter(contestant => contestant.match_status === "Được cứu")
                          .map((contestant, index) => (
                            <motion.div
                              key={`rescued-${contestant.registration_number}-${index}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                              className="rounded-xl h-15 w-15 flex flex-col items-center justify-center bg-green-500 text-gray-100 border border-green-700 animate-pulse-green"
                              title={`Được cứu ở câu: ${contestant.rescued_at_question_order ?? '?'}`}
                            >
                              <span className="font-bold text-4xl">{contestant.registration_number}</span>
                            </motion.div>
                          ))}
                        {!contestants.some(c => c.match_status === "Được cứu") && (
                          <p className="text-center text-gray-600 col-span-full">Không có thí sinh nào được cứu.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CSS styles for animations */}
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
      </motion.div>
    </AnimatePresence>
  );
}