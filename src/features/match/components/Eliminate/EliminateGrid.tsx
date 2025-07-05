import React from "react";
import { motion } from "framer-motion";
import type { Icon } from "../../types";
import type { Variants, Easing } from "framer-motion";

interface EliminateGridProps {
  icons: Icon[];
  recentlyRestored: number[];
}

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
  icons,
  recentlyRestored,
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-10 gap-1 sm:gap-2 w-full h-full"
        style={{ 
          gridTemplateRows: 'repeat(10, 1fr)',
          aspectRatio: '1/1',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        {icons.slice(0, 100).map((icon) => (
          <div 
            key={icon.id} 
            className="relative flex justify-center items-center"
            style={{ minHeight: '0', minWidth: '0' }}
          >
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
                className={`w-full h-full rounded-lg flex flex-col items-center justify-center shadow-lg transition-all duration-300 ${
                  icon.isDisintegrated
                    ? "bg-red-500 text-white"
                    : recentlyRestored.includes(icon.registrationNumber)
                    ? "bg-green-500 text-white animate-pulse shadow-green-400/50 shadow-2xl"
                    : icon.isRescued
                    ? "bg-green-500 text-white animate-pulse shadow-green-400/50 shadow-2xl"
                    : "bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-400/50 hover:shadow-xl"
                }`}
                style={{
                  fontSize: 'clamp(0.5rem, 2vw, 1rem)',
                  aspectRatio: '1/1'
                }}
              >
                <span className="font-bold leading-none">
                  {icon.registrationNumber}
                </span>
              </motion.div>
            )}
            
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
                  className="absolute rounded-full bg-blue-600 pointer-events-none"
                  style={{
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    left: particle.left,
                    top: particle.top,
                  }}
                />
              ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default EliminateGrid;