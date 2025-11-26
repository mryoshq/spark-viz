import React from 'react';
import { motion } from 'framer-motion';

interface DataFlowAnimationProps {
  isAnimating: boolean;
}

// This component overlays the architecture and draws particles moving
// from Storage -> Compute -> Consumption
export const DataFlowAnimation: React.FC<DataFlowAnimationProps> = ({ isAnimating }) => {
  if (!isAnimating) return null;

  // Coordinates are percentage based roughly matching the layer positions
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut", repeat: Infinity }
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      <svg className="w-full h-full opacity-60">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Several paths representing data streams */}
        {[20, 50, 80].map((xPos, i) => (
          <motion.path
            key={i}
            d={`M ${xPos}% 90 L ${xPos}% 10`} 
            fill="transparent"
            stroke="url(#grad1)"
            strokeWidth="2"
            strokeDasharray="10 10"
            initial={{ pathOffset: 1 }}
            animate={{ pathOffset: 0 }}
            transition={{ 
              duration: 2 + i * 0.5, 
              ease: "linear", 
              repeat: Infinity 
            }}
          />
        ))}
        
        {/* Particles */}
        {[20, 50, 80].map((xPos, i) => (
          <motion.circle
            key={`p-${i}`}
            r="4"
            fill="#fb923c"
            initial={{ cx: `${xPos}%`, cy: '90%' }}
            animate={{ cy: '10%' }}
            transition={{ 
              duration: 2 + i * 0.5, 
              ease: "linear", 
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </svg>
    </div>
  );
};
