/**
 * Web Audio API procedural sound synthesizer.
 * Provides rich, relaxing, non-intrusive soundscapes without external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime, 0.2);
    }
    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  public playSpaceAmbience() {
    if (this.isMuted || this.ambientOsc1) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(110, this.ctx.currentTime); // A2

      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(164.81, this.ctx.currentTime); // E3 chord

      this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.ambientOsc1.connect(this.ambientGain);
      this.ambientOsc2.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
    } catch {
      // Audio autoplay restrictions catch
    }
  }

  public playTravelChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Pentatonic breeze sequence
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.4); // C6

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // Audio context catch
    }
  }

  public playEasterEggSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C Major arpeggio
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.1, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.3);
      });
    } catch {
      // Audio context catch
    }
  }

  public playHappyBirthdaySong(): void {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // "Happy Birthday to You" full melody pitch sequence
      const notes = [
        // Phrase 1: Happy Birthday to you
        { freq: 261.63, time: 0.0,  dur: 0.25 }, // C4
        { freq: 261.63, time: 0.3,  dur: 0.25 }, // C4
        { freq: 293.66, time: 0.6,  dur: 0.45 }, // D4
        { freq: 261.63, time: 1.1,  dur: 0.45 }, // C4
        { freq: 349.23, time: 1.6,  dur: 0.45 }, // F4
        { freq: 329.63, time: 2.1,  dur: 0.8  }, // E4

        // Phrase 2: Happy Birthday to you
        { freq: 261.63, time: 3.1,  dur: 0.25 }, // C4
        { freq: 261.63, time: 3.4,  dur: 0.25 }, // C4
        { freq: 293.66, time: 3.7,  dur: 0.45 }, // D4
        { freq: 261.63, time: 4.2,  dur: 0.45 }, // C4
        { freq: 392.00, time: 4.7,  dur: 0.45 }, // G4
        { freq: 349.23, time: 5.2,  dur: 0.8  }, // F4

        // Phrase 3: Happy Birthday dear Benedicta
        { freq: 261.63, time: 6.2,  dur: 0.25 }, // C4
        { freq: 261.63, time: 6.5,  dur: 0.25 }, // C4
        { freq: 523.25, time: 6.8,  dur: 0.45 }, // C5
        { freq: 440.00, time: 7.3,  dur: 0.45 }, // A4
        { freq: 349.23, time: 7.8,  dur: 0.45 }, // F4
        { freq: 329.63, time: 8.3,  dur: 0.45 }, // E4
        { freq: 293.66, time: 8.8,  dur: 0.8  }, // D4

        // Phrase 4: Happy Birthday to you!
        { freq: 466.16, time: 9.8,  dur: 0.25 }, // Bb4
        { freq: 466.16, time: 10.1, dur: 0.25 }, // Bb4
        { freq: 440.00, time: 10.4, dur: 0.45 }, // A4
        { freq: 349.23, time: 10.9, dur: 0.45 }, // F4
        { freq: 392.00, time: 11.4, dur: 0.45 }, // G4
        { freq: 349.23, time: 11.9, dur: 1.2  }, // F4
      ];

      notes.forEach(({ freq, time, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Warm music box / marimba wave combination
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0, now + time);
        gain.gain.linearRampToValueAtTime(0.18, now + time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch {
      // Audio context error handle
    }
  }

  public playFireworkSound(): void {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Rocket whistle up
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);

      // Pop explosion noise
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const popNow = this.ctx.currentTime;
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        popOsc.type = 'sawtooth';
        popOsc.frequency.setValueAtTime(120, popNow);
        popOsc.frequency.exponentialRampToValueAtTime(30, popNow + 0.25);

        popGain.gain.setValueAtTime(0.15, popNow);
        popGain.gain.exponentialRampToValueAtTime(0.001, popNow + 0.25);

        popOsc.connect(popGain);
        popGain.connect(this.ctx.destination);
        popOsc.start(popNow);
        popOsc.stop(popNow + 0.25);
      }, 300);
    } catch {
      // Audio catch
    }
  }

  public playBlowCandleSound(): void {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Whoosh sound
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.linearRampToValueAtTime(200, now + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
    } catch {
      // Catch
    }
  }

  public playBirthdayCelebrationFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const melody = [
        { note: 261.63, dur: 0.3 }, // C4
        { note: 261.63, dur: 0.3 }, // C4
        { note: 293.66, dur: 0.5 }, // D4
        { note: 261.63, dur: 0.5 }, // C4
        { note: 349.23, dur: 0.5 }, // F4
        { note: 329.63, dur: 0.8 }, // E4
      ];

      let startTime = this.ctx.currentTime;
      melody.forEach(({ note, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur);

        startTime += dur + 0.05;
      });
    } catch {
      // Audio context catch
    }
  }
}

export const soundEngine = new SoundEngine();
