import React from 'react';
import { Destination } from '../../types';
import { MapPin, Compass, ArrowRight, X, CheckCircle2 } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
  isVisited: boolean;
  onEnter3D: (dest: Destination) => void;
  onClose: () => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  isVisited,
  onEnter3D,
  onClose,
}) => {
  return (
    <div className="absolute top-20 right-6 z-20 w-full max-w-sm glass-panel p-6 shadow-[0_25px_60px_rgba(0,0,0,0.6)] space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-start justify-between border-b border-white/10 pb-3">
        <div>
          <span className="text-xs font-mono uppercase tracking-[1.5px] text-[#d4af37] flex items-center gap-1.5 font-medium">
            <Compass size={13} /> {destination.city}, {destination.country}
          </span>
          <h3 className="text-2xl font-serif text-white mt-1.5 font-normal tracking-wide">{destination.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
        >
          <X size={16} />
        </button>
      </div>

      <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
        {destination.description}
      </p>

      {isVisited && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium uppercase tracking-wider">
          <CheckCircle2 size={13} /> Visited Landmark
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={() => onEnter3D(destination)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 border border-white/80 hover:bg-white hover:text-black text-white font-medium text-xs tracking-[2px] uppercase rounded-full shadow-lg transition-all duration-300 group"
        >
          <span>Begin Flight ✨</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
