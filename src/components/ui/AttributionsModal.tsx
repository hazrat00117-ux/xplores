import React from 'react';
import { HelpCircle, X, ShieldCheck, Code, Globe, Sparkles } from 'lucide-react';

interface AttributionsModalProps {
  onClose: () => void;
}

export const AttributionsModal: React.FC<AttributionsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="glass-panel border border-white/20 rounded-[24px] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-[0_30px_90px_rgba(0,0,0,0.8)] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/12 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#d4af37]/15 text-[#d4af37] rounded-xl border border-[#d4af37]/30 gold-glow">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-xl font-serif text-white font-normal tracking-wide">Credits, Sources & Open Source Licenses</h2>
              <p className="text-xs text-white/50 uppercase tracking-wider font-mono">100% Free, Open-Source & Legally Usable Assets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content List */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 max-h-96 overflow-y-auto pr-2">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
            <h3 className="font-semibold text-[#d4af37] flex items-center gap-1.5 uppercase tracking-wider">
              <Globe size={15} /> 3D Graphics Engine & WebGL
            </h3>
            <p className="text-white/70 leading-relaxed font-light">
              Built using <strong>Three.js</strong> (MIT License) and procedural canvas texture synthesis algorithms. Zero external 3D asset downloads required.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
            <h3 className="font-semibold text-[#d4af37] flex items-center gap-1.5 uppercase tracking-wider">
              <Code size={15} /> UI Frameworks & Icons
            </h3>
            <p className="text-white/70 leading-relaxed font-light">
              Powered by <strong>React 19</strong>, <strong>TypeScript</strong>, <strong>Tailwind CSS v4</strong>, <strong>Lucide React Icons</strong> (ISC License), and <strong>Framer Motion / Motion</strong> (MIT License).
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
            <h3 className="font-semibold text-[#d4af37] flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles size={15} /> Audio & Synthesizers
            </h3>
            <p className="text-white/70 leading-relaxed font-light">
              Custom procedural Web Audio API sound synthesis engine for space ambient pads, travel chimes, and celebration fanfare without external copyrighted MP3 files.
            </p>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-amber-500 hover:from-amber-400 hover:to-[#d4af37] text-slate-950 font-semibold text-xs uppercase tracking-[2px] rounded-full transition"
          >
            Close Credits
          </button>
        </div>
      </div>
    </div>
  );
};
