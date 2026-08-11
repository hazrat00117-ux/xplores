import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles, Volume2, Mic, MicOff, Heart, Gift, X, RefreshCw } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthday';
import { soundEngine } from '../../utils/audio';

interface BirthdayCakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerFireworks: () => void;
}

export const BirthdayCakeModal: React.FC<BirthdayCakeModalProps> = ({
  isOpen,
  onClose,
  onTriggerFireworks,
}) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [isMicActive, setIsMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [hasBlownWish, setHasBlownWish] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Play birthday song
  const handlePlaySong = () => {
    setIsPlayingSong(true);
    soundEngine.playHappyBirthdaySong();
    setTimeout(() => setIsPlayingSong(false), 13000);
  };

  // Start microphone listener for blowing
  const startMicListener = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsMicActive(true);
      setMicPermissionDenied(false);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Average low-mid blow noise volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setMicVolume(avg);

        // Threshold for blowing out candle (blow noise creates a burst)
        if (avg > 45 && candlesLit) {
          extinguishCandles();
        } else {
          animFrameRef.current = requestAnimationFrame(checkVolume);
        }
      };

      checkVolume();
    } catch {
      setMicPermissionDenied(true);
      setIsMicActive(false);
    }
  };

  const stopMic = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
    setIsMicActive(false);
  };

  const extinguishCandles = () => {
    setCandlesLit(false);
    setHasBlownWish(true);
    soundEngine.playBlowCandleSound();
    soundEngine.playBirthdayCelebrationFanfare();
    onTriggerFireworks();
    stopMic();
  };

  const relightCandles = () => {
    setCandlesLit(true);
    setHasBlownWish(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopMic();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto no-scrollbar">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative max-w-lg w-full bg-slate-900/90 border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(212,175,55,0.25)] text-center space-y-6 overflow-hidden my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
          >
            <X size={18} />
          </button>

          {/* Birthday Header Title */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-[11px] font-mono uppercase tracking-widest">
              <Gift size={13} />
              Happy Birthday {BIRTHDAY_CONFIG.HER_NAME}! ✨
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-white font-semibold pt-2">
              Make a Wish & Blow the Candles! 🎂
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-light italic">
              "Blow into your microphone or tap the cake below to extinguish your candles!"
            </p>
          </div>

          {/* Interactive Birthday Song Player */}
          <div className="flex justify-center">
            <button
              onClick={handlePlaySong}
              disabled={isPlayingSong}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs uppercase tracking-widest font-semibold transition-all shadow-lg ${
                isPlayingSong
                  ? 'bg-[#d4af37] text-slate-950 border-[#d4af37] animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:border-[#d4af37]'
              }`}
            >
              <Volume2 size={16} className={isPlayingSong ? 'animate-spin' : 'text-[#d4af37]'} />
              <span>{isPlayingSong ? 'Playing Birthday Song 🎵...' : 'Play Birthday Song 🎵'}</span>
            </button>
          </div>

          {/* 🎂 3D Animated Birthday Cake Display */}
          <div
            onClick={candlesLit ? extinguishCandles : undefined}
            className="relative cursor-pointer py-6 flex flex-col items-center justify-center group"
            title={candlesLit ? 'Tap or Blow to Extinguish Candles!' : 'Candles Blown Out!'}
          >
            {/* Flames & Smoke */}
            <div className="flex justify-center gap-4 mb-1 relative z-10">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  {candlesLit ? (
                    <motion.div
                      animate={{ scale: [1, 1.25, 0.95, 1.2, 1], y: [0, -2, 1, -1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 + i * 0.1 }}
                      className="text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]"
                    >
                      <Flame size={28} className="fill-amber-400 text-amber-500 animate-pulse" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 1, y: 0, scale: 0.8 }}
                      animate={{ opacity: 0, y: -24, scale: 1.5 }}
                      transition={{ duration: 1.5 }}
                      className="text-white/60 font-mono text-xs italic font-bold"
                    >
                      ☁️ smoke
                    </motion.div>
                  )}
                  {/* Candle Wax Sticks */}
                  <div className="w-2.5 h-10 bg-gradient-to-b from-amber-200 to-amber-400 rounded-t-sm shadow-md border-x border-amber-500/30" />
                </div>
              ))}
            </div>

            {/* Cake Tiers */}
            <div className="w-48 sm:w-56 h-12 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 rounded-t-2xl shadow-xl border-t border-white/40 relative flex items-center justify-center">
              <div className="text-xs font-serif italic text-slate-900 font-bold tracking-wider">
                Happy Birthday {BIRTHDAY_CONFIG.HER_NAME} ❤️
              </div>
            </div>
            <div className="w-56 sm:w-64 h-14 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 rounded-b-2xl shadow-2xl border-t-2 border-pink-400/50 flex items-center justify-center">
              <div className="text-[10px] text-amber-900 font-mono tracking-widest uppercase">
                {BIRTHDAY_CONFIG.BIRTHDAY} • CELEBRATION
              </div>
            </div>

            {/* Cake Plate Base */}
            <div className="w-64 sm:w-72 h-3 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-full shadow-2xl mt-1" />
          </div>

          {/* Blow / Microphone Status */}
          <div className="space-y-3">
            {candlesLit ? (
              <div className="space-y-2">
                <button
                  onClick={isMicActive ? stopMic : startMicListener}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium uppercase tracking-wider transition ${
                    isMicActive
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-white/5 hover:bg-white/12 border-white/20 text-white/80'
                  }`}
                >
                  {isMicActive ? <Mic size={14} className="animate-pulse text-emerald-400" /> : <MicOff size={14} />}
                  <span>{isMicActive ? 'Microphone Active (Blow Now!)' : 'Enable Mic Blow Detection 🎙️'}</span>
                </button>

                {isMicActive && (
                  <div className="max-w-xs mx-auto space-y-1">
                    <div className="flex justify-between text-[10px] text-white/60 font-mono">
                      <span>Blow Power Level:</span>
                      <span>{Math.round(micVolume)} / 45</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-75"
                        style={{ width: `${Math.min(100, (micVolume / 50) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {micPermissionDenied && (
                  <p className="text-[11px] text-amber-300/90 italic">
                    Mic access not available — simply tap or click the cake above to blow out the candles!
                  </p>
                )}

                <p className="text-[11px] text-white/50 italic">
                  💡 Tip: On mobile devices, tap the cake directly or blow into the phone mic!
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#d4af37]/15 border border-[#d4af37]/40 rounded-2xl p-4 space-y-2 text-left"
              >
                <div className="flex items-center gap-2 text-[#d4af37] font-semibold text-sm">
                  <Sparkles size={16} />
                  <span>WISH GRANTED! Happy Birthday Benedicta! 🎉</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-light italic">
                  {BIRTHDAY_CONFIG.SPECIAL_MESSAGE.split('\n\n')[1]}
                </p>
                <div className="pt-2 flex justify-between items-center">
                  <button
                    onClick={relightCandles}
                    className="inline-flex items-center gap-1 text-[11px] text-white/60 hover:text-white underline transition"
                  >
                    <RefreshCw size={12} />
                    <span>Relight Candles</span>
                  </button>
                  <button
                    onClick={onTriggerFireworks}
                    className="px-3 py-1 bg-[#d4af37] text-black font-semibold text-xs rounded-full shadow hover:bg-amber-300 transition"
                  >
                    Launch Fireworks 🎆
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
