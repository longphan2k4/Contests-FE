import React from "react";
import { motion } from "framer-motion";
import type { Icon } from "../../types";
import type { Variants, Easing } from "framer-motion";
import type { ListContestant } from "@features/match/types/control.type";

interface EliminateGridProps {
  icons: Icon[];
  recentlyRestored: number[];
  maxContestantColumn: number;
  listContestant?: ListContestant[];
}

type IconOrBreak = Icon | { id: string; isLineBreak: true };

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

const EliminateGrid: React.FC<EliminateGridProps> = ({
  listContestant,
  maxContestantColumn,
  icons,
  recentlyRestored,
}) => {
  const totalContestants = icons.length;
  
  if (totalContestants === 0) {
    return <div className="w-full h-full flex items-center justify-center text-gray-500">No contestants</div>;
  }
  
  // Tính toán layout tối ưu
  const calculateBestLayout = (total: number, maxCols: number) => {
    const maxColumns = Math.min(maxCols || 10, total);
    
    // Tìm layout tối ưu dựa trên tỷ lệ màn hình
    let bestCols = 1;
    let bestRows = total;
    let bestScore = 0;
    
    for (let cols = 1; cols <= maxColumns; cols++) {
      const rows = Math.ceil(total / cols);
      
      // Tính điểm dựa trên tỷ lệ và tận dụng không gian
      const aspectRatio = cols / rows;
      const spaceUtilization = total / (cols * rows);
      
      // Ưu tiên tỷ lệ gần với 16:9 và tận dụng không gian tốt
      const aspectScore = 1 - Math.abs(aspectRatio - 16/9) / (16/9);
      const utilScore = spaceUtilization;
      
      const score = aspectScore * 0.3 + utilScore * 0.7;
      
      if (score > bestScore) {
        bestScore = score;
        bestCols = cols;
        bestRows = rows;
      }
    }
    
    return { columns: bestCols, rows: bestRows };
  };
  
  const { columns, rows } = calculateBestLayout(totalContestants, maxContestantColumn);
  
  // Tính toán kích thước item dựa trên container
  // const containerPadding = 16; // 4 * 4px
  const gapSize = Math.max(2, Math.min(5, 100 / Math.sqrt(totalContestants)));
  
  // Nếu có listContestant, tạo array với line break
  let iconsWithBreaks: IconOrBreak[] = icons;
  if (listContestant && listContestant.length > 0) {
    iconsWithBreaks = [];
    listContestant.forEach((group, groupIndex) => {
      const groupIcons = icons.filter(icon => 
        group?.contestantMatches?.some(contestant => 
          contestant?.registrationNumber === icon.registrationNumber
        )
      ).filter(icon => icon.isActive);
      
      iconsWithBreaks.push(...groupIcons);
      
      // Thêm line break sau mỗi group (trừ group cuối)
      if (groupIndex < listContestant.length - 1 && groupIcons.length > 0) {
        iconsWithBreaks.push({ id: `break-${groupIndex}`, isLineBreak: true });
      }
    });
  }

  return (
    <div className="w-full h-full overflow-hidden p-0 sm:p-0">
      <div 
        className="w-full h-full grid place-items-center"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`, 
          // gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: `${gapSize}px`,
          // padding: `${containerPadding}px`,
          boxSizing: 'border-box'
        }}
      >
        {iconsWithBreaks.map((icon, index) => {
          // Render line break
          if ('isLineBreak' in icon) {
            return (
              <div 
                key={icon.id}
                className="col-span-full h-1 flex items-center justify-center"
              >
                <div className="w-full h-px bg-black/30"></div>
              </div>
            );
          }
          
          // Chỉ render các item active
          if (!icon.isActive) return null;
          
          return (
            <motion.div
              key={icon.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.02 }}
              className="relative w-full h-full flex items-center justify-center"
              style={{
                minWidth: '20px',
                minHeight: '20px',
                aspectRatio: '1/1'
              }}
            >
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
                className={`
                  w-full h-full rounded-lg flex items-center justify-center 
                  shadow-lg border-2
                  ${icon.isDisintegrated
                  ? "bg-red-500 text-white border-red-400 shadow-red-500/30"
                  : recentlyRestored.includes(icon.registrationNumber)
                    ? "bg-green-500 text-white animate-pulse shadow-green-400/50 border-green-400"
                    : icon.isRescued
                    ? "bg-green-500 text-white animate-pulse shadow-green-400/50 border-green-400"
                    : "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-400/50 border-blue-400"
                  }
                `}
                style={{
                  fontSize: `clamp(${Math.max(10, 280 / Math.max(columns, rows))}px, ${Math.max(2.5, 18 / Math.max(columns, rows))}vw, ${Math.max(16, 380 / Math.max(columns, rows))}px)`,
                  minWidth: '100%',
                  minHeight: '100%'
                }}
                >
                <span 
                  className="font-black leading-none text-center drop-shadow-lg select-none"
                  style={{
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  wordBreak: 'break-all',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px',
                  width: '100%',
                  height: '100%'
                  }}
                >
                  {icon.registrationNumber}
                </span>
                </motion.div>

              {/* Particles Effect */}
              {icon.particles.length > 0 &&
                icon.particles.map(particle => (
                  <motion.div
                    key={particle.id}
                    initial={{
                      opacity: 1,
                      scale: 1,
                      x: 0,
                      y: 0
                    }}
                    animate={{
                      opacity: 0,
                      scale: 0.3,
                      x: particle.tx,
                      y: particle.ty,
                      rotate: particle.rotate
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeOut"
                    }}
                    className="absolute rounded-full bg-blue-600 pointer-events-none shadow-lg"
                    style={{
                      width: `${Math.max(3, particle.size * 0.3)}px`,
                      height: `${Math.max(3, particle.size * 0.3)}px`,
                      left: particle.left,
                      top: particle.top,
                    }}
                  />
                ))}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EliminateGrid;