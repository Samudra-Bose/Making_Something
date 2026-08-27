/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DotGrid from './DotGrid';
import Waves from './Waves';

export default function App() {
  const [key, setKey] = useState(0);
  return <MainScreen key={key} onReplay={() => setKey((k) => k + 1)} />;
}

function MainScreen({ onReplay }: { onReplay: () => void; key?: number }) {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans">
      <motion.div
        className="absolute inset-0 z-30 bg-[#030712] flex items-center justify-center overflow-hidden"
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ clipPath: 'circle(150% at 50% 50%)' }}
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }} // cinematic ease
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <DotGrid />
          <Waves
            lineColor="rgba(139, 92, 246, 0.5)"
            backgroundColor="transparent"
            waveSpeedX={0.02}
            waveSpeedY={0.01}
            waveAmpX={40}
            waveAmpY={20}
            friction={0.9}
            tension={0.01}
            maxCursorMove={120}
            xGap={12}
            yGap={36}
          />
        </div>
        <div className="flex flex-col items-center gap-10 z-10 relative">
          <motion.button 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8, type: 'spring', bounce: 0.4 }}
            onClick={onReplay} 
            className="px-8 py-3 bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-white/10 rounded-full text-gray-300 font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-2 group backdrop-blur-sm"
          >
            <span>Replay Animation</span>
            <motion.span 
              className="inline-block transition-transform duration-300 group-hover:rotate-180"
            >
              ↺
            </motion.span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
