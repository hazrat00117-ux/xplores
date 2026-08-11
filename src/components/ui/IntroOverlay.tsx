import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Globe } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthday';
import { soundEngine } from '../../utils/audio';

interface IntroOverlayProps {
  onEnter: () => void;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onEnter }) => {
  const handleStart = () => {
    soundEngine.playSpaceAmbience();
    onEnter();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040a] text-white overflow-hidden p-6 select-none">
      {/* Space Radial Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#0d1b3a_0%,_#02040a_100%)]" />

      {/* Subtle Star Grid Effect */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 max-w-xl w-full text-center space-y-8 glass-panel p-8 sm:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-white/15"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] text-xs font-mono uppercase tracking-[2px]"
        >
          <Globe size={14} className="animate-spin-slow" />
          A Special Birthday Universe
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-white leading-tight">
            Someone has prepared a little world for you,{' '}
            <span className="text-[#d4af37] italic font-normal block sm:inline mt-1 sm:mt-0">
              {BIRTHDAY_CONFIG.HER_NAME}
            </span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base font-light italic leading-relaxed">
            "Ready to see where it takes you?"
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="pt-2"
        >
          <button
            onClick={handleStart}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-white text-white font-medium text-xs sm:text-sm uppercase tracking-[2.5px] rounded-full shadow-[0_0_30px_rgba(212,175,55,0.25)] hover:bg-white hover:text-black transition-all duration-300"
          >
            <Sparkles size={18} className="text-[#d4af37] group-hover:text-black transition-colors duration-300" />
            <span>ENTER YOUR WORLD ✨</span>
          </button>
        </motion.div>

        <p className="text-[11px] text-white/40 uppercase tracking-[2px] font-mono pt-4">
          7 Continents • 70 Iconic Landmarks • 1 Secret Sanctuary
        </p>
      </motion.div>
    </div>
  );
};
