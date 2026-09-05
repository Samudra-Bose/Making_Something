import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useExperienceStore } from '../experience/store';

export function AntiGravity({ children, className = '', depth = 1, float = true }: { children: React.ReactNode, className?: string, depth?: number, float?: boolean }) {
  const { scrollY } = useScroll();
  
  // Parallax based on scroll
  const yParallax = useTransform(scrollY, [0, 5000], [0, -100 * depth]);
  const ySpring = useSpring(yParallax, { stiffness: 30, damping: 20 });
  
  return (
    <motion.div className={className} style={{ y: ySpring }}>
      <motion.div
        animate={float ? {
          y: [0, -8 * depth, 0],
          x: [0, 4 * depth, 0],
          rotate: [0, 0.5 * depth, 0],
        } : {}}
        transition={{
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}