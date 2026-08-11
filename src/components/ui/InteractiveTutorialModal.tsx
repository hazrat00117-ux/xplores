import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Compass,
  Search,
  Box,
  Gift,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Play,
  RotateCw,
  Sun,
  Flame,
} from 'lucide-react';

interface InteractiveTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCakeModal?: () => void;
}

interface StepInfo {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  highlightText: string;
  demoVisual: React.ReactNode;
}

export const InteractiveTutorialModal: React.FC<InteractiveTutorialModalProps> = ({
  isOpen,
  onClose,
  onOpenCakeModal,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: StepInfo[] = [
    {
      title: 'Step 1: Explore the 3D Earth 🌍',
      subtitle: 'Interactive 360° World Globe',
      icon: <Globe size={24} className="text-[#d4af37]" />,
      description:
        'Click or drag anywhere on the screen to freely rotate the 3D Earth. Spot 70 iconic landmark pins illuminated across all 7 continents in real time!',
      highlightText: '💡 Tip: Hovering over any pin reveals a quick destination preview card.',
      demoVisual: (
        <div className="w-full h-32 bg-slate-950/80 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-2 border-dashed border-[#d4af37]/60 flex items-center justify-center bg-blue-950/40"
          >
            <Globe size={32} className="text-[#d4af37]" />
          </motion.div>
          <div className="text-[11px] text-white/60 mt-2 font-mono uppercase tracking-wider">
            Drag to Rotate 3D Earth
          </div>
        </div>
      ),
    },
    {
      title: 'Step 2: Continent Carousel 🧭',
      subtitle: 'Arrow Navigation Bar',
      icon: <Compass size={24} className="text-amber-400" />,
      description:
        'Use the bottom arrow buttons (< and >) to cycle through continents. Clicking a continent centers the 3D globe directly on that continent!',
      highlightText: '💡 Tip: Each continent unlocks a horizontal strip of famous landmarks.',
      demoVisual: (
        <div className="w-full h-32 bg-slate-950/80 border border-white/10 rounded-2xl flex items-center justify-center p-3 gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] text-xs font-semibold flex items-center gap-1">
            <Compass size={14} /> Europe
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs flex items-center gap-1">
            Asia
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs flex items-center gap-1">
            Africa
          </div>
        </div>
      ),
    },
    {
      title: 'Step 3: Instant Search & Globe Spin 🔍',
      subtitle: 'Type Any Famous Place',
      icon: <Search size={24} className="text-cyan-400" />,
      description:
        'Type any place in the search bar (e.g. Fuji, Eiffel, Pyramids, Taj Mahal). The globe automatically rotates in real-time to bring that landmark right in front of you!',
      highlightText: '💡 Tip: Suggestions pop up with quick 3D View launch buttons.',
      demoVisual: (
        <div className="w-full h-32 bg-slate-950/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-center space-y-2">
          <div className="w-full bg-white/10 border border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white flex items-center justify-between font-mono">
            <span>"Eiffel Tower..."</span>
            <span className="text-[10px] text-[#d4af37] uppercase">Globe Rotating 🌍</span>
          </div>
          <div className="bg-[#d4af37]/15 rounded-lg px-3 py-1.5 text-xs text-[#d4af37] font-serif flex items-center justify-between">
            <span>🏰 Eiffel Tower, Paris, France</span>
            <span className="text-[9px] bg-[#d4af37] text-black font-bold px-1.5 py-0.5 rounded">3D</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Step 4: Interactive 3D Landmark Scene 🏰',
      subtitle: 'Weather & Lighting Control',
      icon: <Box size={24} className="text-emerald-400" />,
      description:
        'Click any destination card or globe pin to open the 3D site inspector! Rotate the 3D model, change weather (Clear, Rain, Snow, Storm), and toggle lighting (Sunset, Day, Night, Aurora).',
      highlightText: '💡 Tip: The full 3D scene expands as an immersive background image!',
      demoVisual: (
        <div className="w-full h-32 bg-slate-950/80 border border-white/10 rounded-2xl flex items-center justify-around p-3">
          <div className="flex flex-col items-center gap-1">
            <div className="p-2.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <Sun size={20} />
            </div>
            <span className="text-[10px] text-white/70">Lighting</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="p-2.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40">
              <RotateCw size={20} />
            </div>
            <span className="text-[10px] text-white/70">3D Rotate</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="p-2.5 rounded-full bg-sky-500/20 text-sky-200 border border-sky-300/40">
              <Sparkles size={20} />
            </div>
            <span className="text-[10px] text-white/70">Weather</span>
          </div>
        </div>
      ),
    },
    {
      title: "Step 5: Benedicta's Birthday Cake & Fireworks 🎂",
      subtitle: 'Blow Candles & Fireworks',
      icon: <Flame size={24} className="text-rose-400" />,
      description:
        'Blow out birthday candles with your device microphone or tap the cake screen! Launch fireworks, play birthday melodies, and uncover Benedicta’s Secret Star Sanctuary!',
      highlightText: '🎉 Ready to begin Benedicta’s 3D Birthday Universe?',
      demoVisual: (
        <div className="w-full h-32 bg-slate-950/80 border border-[#d4af37]/40 rounded-2xl flex flex-col items-center justify-center p-3 text-center space-y-1">
          <div className="text-2xl animate-bounce">🎂 ✨ 🎆</div>
          <div className="text-xs font-serif font-semibold text-[#d4af37]">
            Make a Birthday Wish for Benedicta!
          </div>
          {onOpenCakeModal && (
            <button
              onClick={() => {
                onClose();
                onOpenCakeModal();
              }}
              className="mt-1 px-3 py-1 bg-[#d4af37] text-slate-950 font-bold text-[10px] uppercase rounded-full shadow hover:bg-amber-300 transition"
            >
              Open Cake & Blow Candle 🎂
            </button>
          )}
        </div>
      ),
    },
  ];

  if (!isOpen) return null;

  const activeStep = steps[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative max-w-lg w-full bg-slate-900/95 border border-[#d4af37]/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(212,175,55,0.3)] space-y-6 overflow-hidden my-auto"
        >
          {/* Header Bar with Step Badge & SKIP BUTTON */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] text-xs font-mono font-bold uppercase tracking-widest">
                TUTORIAL • STEP {currentStep + 1} OF {steps.length}
              </span>
            </div>

            {/* Prominent SKIP BUTTON (Game style) */}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition text-xs font-medium uppercase tracking-wider flex items-center gap-1"
            >
              <span>SKIP TUTORIAL</span>
              <X size={14} />
            </button>
          </div>

          {/* Step Main Content */}
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/15 flex-shrink-0">
                {activeStep.icon}
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-white leading-tight">
                  {activeStep.title}
                </h3>
                <p className="text-xs text-[#d4af37] font-mono tracking-wider uppercase mt-0.5">
                  {activeStep.subtitle}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
              {activeStep.description}
            </p>

            {/* Step Interactive Visual Card */}
            {activeStep.demoVisual}

            <div className="p-2.5 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-[11px] text-[#d4af37] font-sans">
              {activeStep.highlightText}
            </div>
          </div>

          {/* Navigation Dots & Buttons */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            {/* Step Progress Dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentStep === idx
                      ? 'w-6 bg-[#d4af37]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  title={`Go to Step ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next / Prev Buttons */}
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-medium uppercase tracking-wider flex items-center gap-1 transition"
                >
                  <ChevronLeft size={16} />
                  <span>Prev</span>
                </button>
              )}

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-lg transition"
                >
                  <span>Next Step</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-500 hover:from-amber-400 hover:to-[#d4af37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition animate-pulse"
                >
                  <Play size={14} className="fill-slate-950" />
                  <span>START ADVENTURE 🚀</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
