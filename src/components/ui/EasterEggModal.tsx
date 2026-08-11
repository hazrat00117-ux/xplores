import React from 'react';
import { Sparkles, Moon, Gift, X } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface EasterEggModalProps {
  title: string;
  message: string;
  iconType: 'moon' | 'santa' | 'star';
  onClose: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({
  title,
  message,
  iconType,
  onClose,
}) => {
  React.useEffect(() => {
    soundEngine.playEasterEggSound();
  }, []);

  const getIcon = () => {
    switch (iconType) {
      case 'moon':
        return <Moon size={28} className="text-amber-300" />;
      case 'santa':
        return <Gift size={28} className="text-red-400" />;
      case 'star':
      default:
        return <Sparkles size={28} className="text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="glass-panel border border-[#d4af37]/40 p-8 rounded-[24px] max-w-md w-full text-center space-y-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
        >
          <X size={18} />
        </button>

        <div className="inline-flex p-3 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 gold-glow">
          {getIcon()}
        </div>

        <h3 className="text-2xl font-serif text-[#d4af37] font-normal tracking-wide">{title}</h3>

        <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light italic">
          "{message}"
        </p>

        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-amber-500 hover:from-amber-400 hover:to-[#d4af37] text-slate-950 font-semibold text-xs uppercase tracking-[2px] rounded-full transition shadow-lg"
        >
          Keep Exploring ✨
        </button>
      </div>
    </div>
  );
};
