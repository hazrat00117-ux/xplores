import React from 'react';
import { CONTINENTS } from '../../data/continents';
import { DESTINATIONS } from '../../data/destinations';
import { Destination } from '../../types';
import { X, CheckCircle2, Gift, Trophy, Globe, MapPin } from 'lucide-react';

interface JourneyTrackerProps {
  visitedIds: string[];
  onSelectDestination: (dest: Destination) => void;
  onOpenSecret: () => void;
  onClose: () => void;
}

export const JourneyTracker: React.FC<JourneyTrackerProps> = ({
  visitedIds,
  onSelectDestination,
  onOpenSecret,
  onClose,
}) => {
  const totalCount = DESTINATIONS.length;
  const visitedCount = visitedIds.length;

  return (
    <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="glass-panel border border-white/20 rounded-[24px] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-[0_30px_90px_rgba(0,0,0,0.8)] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/12 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-[#d4af37]/15 text-[#d4af37] rounded-2xl border border-[#d4af37]/30 gold-glow">
              <Trophy size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-white font-normal tracking-wide">Your Global Journey</h2>
              <p className="text-xs text-white/50 font-mono uppercase tracking-wider">
                {visitedCount} of {totalCount} World Landmarks Explored
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar & Milestone Dots */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-white/80 font-medium uppercase tracking-wider">
            <span>Overall Exploration</span>
            <span className="text-[#d4af37] font-semibold">{Math.round((visitedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="bg-gradient-to-r from-[#d4af37] via-amber-300 to-[#d4af37] h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(212,175,55,0.6)]"
              style={{ width: `${(visitedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Continents Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-[2px] text-white/40 font-semibold">Continents Checklist</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CONTINENTS.map((cont) => {
              const contDestinations = DESTINATIONS.filter((d) => d.continent === cont.id);
              const contVisited = contDestinations.filter((d) => visitedIds.includes(d.id)).length;
              const isComplete = contVisited === contDestinations.length;

              return (
                <div
                  key={cont.id}
                  className={`p-3.5 rounded-2xl flex items-center justify-between border transition-all duration-300 ${
                    isComplete
                      ? 'bg-[#d4af37]/10 border-[#d4af37]/50'
                      : contVisited > 0
                      ? 'bg-white/8 border-white/15'
                      : 'bg-white/4 border-white/8'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        isComplete ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : contVisited > 0 ? 'bg-[#d4af37] gold-glow' : 'bg-white/20'
                      }`}
                    />
                    <div>
                      <h4 className="text-sm font-medium text-white">{cont.name}</h4>
                      <p className="text-xs text-white/50 font-mono">
                        {contVisited} / {contDestinations.length} places
                      </p>
                    </div>
                  </div>
                  {isComplete && <CheckCircle2 size={18} className="text-emerald-400" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Unlock Climax Button */}
        <div className="pt-2 border-t border-white/10 text-center space-y-3">
          <button
            onClick={() => {
              onClose();
              onOpenSecret();
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#d4af37] via-amber-400 to-[#d4af37] text-slate-950 font-semibold text-xs sm:text-sm uppercase tracking-[2px] rounded-2xl shadow-[0_0_25px_rgba(212,175,55,0.4)] transition duration-300 hover:brightness-110 transform hover:scale-[1.01]"
          >
            <Gift size={18} />
            <span>UNLOCK THE SECRET SANCTUARY ("ONE MORE PLACE...")</span>
          </button>
        </div>
      </div>
    </div>
  );
};
