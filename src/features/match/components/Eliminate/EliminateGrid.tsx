import React from 'react';
import { motion } from 'framer-motion';
import type { Icon } from '../../types';
import type { Variants, Easing } from 'framer-motion';

interface EliminateGridProps {
  icons: Icon[];
  recentlyRestored: number[];
}

// const containerVariants: Variants = {
//   hidden: { opacity: 0, scale: 0.98 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     transition: {
//       duration: 0.5,
//       ease: 'easeOut',
//       when: 'beforeChildren',
//       staggerChildren: 0.1,
//     },
//   },
//   exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3, ease: 'easeIn' } },
// };

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

const EliminateGrid: React.FC<EliminateGridProps> = ({ icons, recentlyRestored }) => {
  const groupedIcons: Icon[][] = [];
  for (let i = 0; i < icons.length; i += 20) {
    groupedIcons.push(icons.slice(i, i + 20));
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {groupedIcons.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1, duration: 0.5 }}
            className="grid grid-cols-10 grid-rows-2 gap-x-2 gap-y-2"
          >
            {group.map(icon => (
              <div key={icon.id} className="relative flex justify-center">
                {icon.isActive && (
                  <motion.div
                    variants={iconVariants}
                    initial="hidden"
                    animate={icon.isFading ? 'disintegrating' : icon.isDisintegrated ? 'hidden' : 'visible'}
                    className={`w-16 md:w-20 aspect-square rounded-lg flex flex-col items-center justify-center shadow-lg ${
                      icon.isDisintegrated
                        ? 'bg-red-700'
                        : recentlyRestored.includes(icon.registrationNumber)
                        ? 'bg-green-800 animate-rescuedContestant'
                        : icon.isRescued
                        ? 'bg-green-800 animate-rescuedContestant'
                        : 'bg-blue-800 hover:shadow-glow hover:bg-blue-700 transition-all'
                    }`}
                  >
                    <span className="text-white text-xl md:text-6xl font-bold">{icon.registrationNumber}</span>
                  </motion.div>
                )}
                {icon.particles.length > 0 &&
                  icon.particles.map(particle => (
                    <div
                      key={particle.id}
                      className="absolute rounded-full bg-blue-600"
                      style={
                        {
                          width: `${particle.size}px`,
                          height: `${particle.size}px`,
                          left: particle.left,
                          top: particle.top,
                          animation: 'particle-float 1s ease-out forwards',
                          ['--tw-rotate' as string]: particle.rotate,
                          ['--tx' as string]: particle.tx,
                          ['--ty' as string]: particle.ty,
                        } as React.CSSProperties
                      }
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
  );
};

export default EliminateGrid;