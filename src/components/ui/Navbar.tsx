import React from 'react';
import { Volume2, VolumeX, Sparkles, Map, Gift, HelpCircle, Sun, CloudRain, CloudSnow, Zap, Flame, Compass } from 'lucide-react';
import { GlobalWeatherMode } from './GlobalWeatherOverlay';
import { BIRTHDAY_CONFIG } from '../../config/birthday';

interface NavbarProps {
  visitedCount: number;
  totalCount: number;
  isMuted: boolean;
  weatherMode: GlobalWeatherMode;
  onSelectWeatherMode: (mode: GlobalWeatherMode) => void;
  onToggleSound: () => void;
  onOpenJourney: () => void;
  onOpenSecret: () => void;
  onOpenAttributions: () => void;
  onOpenCakeModal: () => void;
  onOpenTutorial: () => void;
  onTriggerFireworks: () => void;
  stargazingMode: boolean;
  onToggleStargazing: () => void;
  unlockedSecret: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  visitedCount,
  totalCount,
  isMuted,
  weatherMode,
  onSelectWeatherMode,
  onToggleSound,
  onOpenJourney,
  onOpenSecret,
  onOpenAttributions,
  onOpenCakeModal,
  onOpenTutorial,
  onTriggerFireworks,
  stargazingMode,
  onToggleStargazing,
  unlockedSecret,
}) => {
  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none flex-wrap gap-2">
      {/* Brand Title */}
      <div className="flex items-center gap-3 bg-white/8 backdrop-blur-2xl border border-white/15 px-4 py-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] pointer-events-auto">
        <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] gold-glow animate-pulse" />
        <h1 className="text-base sm:text-lg font-serif italic tracking-[2px] font-semibold text-white">
          DIKITA X'PLORES
        </h1>
        <span className="text-[10px] text-[#d4af37] uppercase tracking-widest font-mono hidden md:inline border-l border-white/15 pl-3">
          For {BIRTHDAY_CONFIG.HER_NAME} ✨
        </span>
      </div>

      {/* Global Weather Mode Bar (Affects Whole App) */}
      <div className="flex items-center bg-white/8 backdrop-blur-2xl p-1 rounded-full border border-white/15 shadow-lg pointer-events-auto">
        <button
          onClick={() => onSelectWeatherMode('clear')}
          className={`px-2.5 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-wider transition flex items-center gap-1 ${
            weatherMode === 'clear' ? 'bg-[#d4af37]/25 text-[#d4af37] gold-glow' : 'text-white/60 hover:text-white'
          }`}
          title="Clear Sunshine Weather"
        >
          <Sun size={13} />
          <span className="hidden sm:inline">Clear</span>
        </button>
        <button
          onClick={() => onSelectWeatherMode('rain')}
          className={`px-2.5 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-wider transition flex items-center gap-1 ${
            weatherMode === 'rain' ? 'bg-blue-500/30 text-blue-300' : 'text-white/60 hover:text-white'
          }`}
          title="Rainy Weather"
        >
          <CloudRain size={13} />
          <span className="hidden sm:inline">Rain</span>
        </button>
        <button
          onClick={() => onSelectWeatherMode('snow')}
          className={`px-2.5 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-wider transition flex items-center gap-1 ${
            weatherMode === 'snow' ? 'bg-sky-200/25 text-sky-100' : 'text-white/60 hover:text-white'
          }`}
          title="Snowy Weather"
        >
          <CloudSnow size={13} />
          <span className="hidden sm:inline">Snow</span>
        </button>
        <button
          onClick={() => onSelectWeatherMode('storm')}
          className={`px-2.5 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-wider transition flex items-center gap-1 ${
            weatherMode === 'storm' ? 'bg-[#d4af37]/25 text-[#d4af37]' : 'text-white/60 hover:text-white'
          }`}
          title="Thunderstorm Weather"
        >
          <Zap size={13} />
          <span className="hidden sm:inline">Storm</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto flex-wrap">
        {/* Birthday Cake & Blow Candle Modal Trigger */}
        <button
          onClick={onOpenCakeModal}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-[#d4af37] text-slate-950 font-bold px-3 py-1.5 sm:py-2 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-all text-xs uppercase tracking-wider"
          title="Blow Candle & Make a Birthday Wish"
        >
          <Flame size={14} className="fill-slate-950 text-slate-950 animate-bounce" />
          <span className="inline">Blow Candle 🎂</span>
        </button>

        {/* Fireworks Launch Button */}
        <button
          onClick={onTriggerFireworks}
          className="p-2 sm:p-2.5 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-full text-amber-300 hover:text-amber-200 hover:bg-white/12 transition-all duration-300 shadow-lg"
          title="Launch Fireworks 🎆"
        >
          <Sparkles size={15} className="text-[#d4af37]" />
        </button>

        {/* Game Tutorial Walkthrough Trigger */}
        <button
          onClick={onOpenTutorial}
          className="flex items-center gap-1 bg-white/8 backdrop-blur-2xl border border-white/15 px-3 py-1.5 sm:py-2 rounded-full text-slate-200 hover:text-white hover:border-[#d4af37]/60 hover:bg-white/12 transition text-xs font-medium uppercase tracking-wider"
          title="How to Play / Game Tutorial"
        >
          <Compass size={14} className="text-[#d4af37]" />
          <span className="hidden sm:inline">Tutorial</span>
        </button>

        {/* Journey Progress Button */}
        <button
          onClick={onOpenJourney}
          className="flex items-center gap-1.5 bg-white/8 backdrop-blur-2xl border border-white/15 px-3 py-1.5 sm:py-2 rounded-full text-slate-200 hover:text-white hover:border-[#d4af37]/60 hover:bg-white/12 transition-all duration-300 shadow-lg text-xs font-medium uppercase tracking-wider"
        >
          <Map size={14} className="text-[#d4af37]" />
          <span>
            {visitedCount} / {totalCount}
          </span>
        </button>

        {/* Constellation Stargazing Mode Toggle */}
        <button
          onClick={onToggleStargazing}
          className={`p-2 sm:p-2.5 rounded-full border backdrop-blur-2xl transition-all duration-300 shadow-lg ${
            stargazingMode
              ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] gold-glow'
              : 'bg-white/8 border-white/15 text-slate-300 hover:text-white hover:bg-white/12'
          }`}
          title="Stargazing Constellation Mode"
        >
          <Sparkles size={15} />
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 sm:p-2.5 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-full text-slate-300 hover:text-white hover:bg-white/12 transition-all duration-300 shadow-lg"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-[#d4af37]" />}
        </button>

        {/* Secret Destination Button */}
        {unlockedSecret && (
          <button
            onClick={onOpenSecret}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#d4af37] to-amber-500 hover:from-amber-400 hover:to-[#d4af37] text-slate-950 font-semibold px-3.5 py-1.5 sm:py-2 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 text-xs uppercase tracking-wider animate-bounce"
          >
            <Gift size={14} />
            <span className="hidden sm:inline">One More Place...</span>
          </button>
        )}

        {/* Attributions & Credits */}
        <button
          onClick={onOpenAttributions}
          className="p-2 sm:p-2.5 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-full text-slate-300 hover:text-white hover:bg-white/12 transition-all duration-300 shadow-lg"
          title="Credits & Sources"
        >
          <HelpCircle size={15} />
        </button>
      </div>
    </header>
  );
};


