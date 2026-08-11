import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { BIRTHDAY_CONFIG } from '../../config/birthday';
import { Sparkles, Heart, ArrowLeft, Volume2 } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface SecretDestinationSceneProps {
  onBack: () => void;
}

export const SecretDestinationScene: React.FC<SecretDestinationSceneProps> = ({ onBack }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. WebGL Celestial Sanctuary Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0518); // Cosmic indigo

    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lights
    const ambient = new THREE.AmbientLight(0xffd700, 0.8);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(0xffa500, 2, 20);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    // 3. Floating Crystalline Heart Sanctuary Island
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    // Island pedestal
    const islandGeo = new THREE.CylinderGeometry(4, 1, 1.5, 32);
    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x2c1a4d,
      roughness: 0.3,
      metalness: 0.6,
    });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.y = -1;
    islandGroup.add(island);

    // Glowing Heart Crystal Mesh
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.1,
      metalness: 0.9,
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.scale.set(2, 2, 2);
    heartMesh.rotation.z = Math.PI;
    heartMesh.position.set(0.5, 2, 0);
    islandGroup.add(heartMesh);

    // Starlight Particles
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 40;
      starPos[i + 1] = (Math.random() - 0.5) * 40;
      starPos[i + 2] = (Math.random() - 0.5) * 40;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffe0b2, size: 0.15, transparent: true });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // Play celebration audio
    soundEngine.playBirthdayCelebrationFanfare();

    // Trigger fireworks confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      islandGroup.rotation.y = time * 0.3;
      heartMesh.position.y = 2 + Math.sin(time * 2) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    const timer = setTimeout(() => setShowLetter(true), 1500);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(timer);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const triggerFireworks = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981'],
    });
    soundEngine.playEasterEggSound();
  };

  return (
    <div className="relative w-full h-full bg-slate-950 text-white overflow-y-auto select-none">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Top Return Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/8 backdrop-blur-2xl rounded-full text-slate-200 hover:text-white transition border border-white/15 shadow-lg text-xs uppercase tracking-wider font-medium"
        >
          <ArrowLeft size={15} /> Return to Globe
        </button>
      </div>

      {/* Letter Container */}
      <div className="relative z-10 min-h-full flex items-center justify-center p-6 py-20">
        {showLetter && (
          <div className="max-w-xl w-full glass-panel border border-[#d4af37]/40 p-8 sm:p-10 rounded-[28px] shadow-[0_0_90px_rgba(212,175,55,0.3)] space-y-6 text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="inline-flex p-3.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 gold-glow">
              <Sparkles size={26} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif text-[#d4af37] font-normal tracking-wide">
              {BIRTHDAY_CONFIG.SPECIAL_TITLE}
            </h1>

            <p className="text-xs sm:text-sm text-white/70 font-serif italic">
              "I'd take you anywhere in the world... because the best part of any journey is who you share it with."
            </p>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-left text-white/85 text-xs sm:text-sm leading-relaxed font-light whitespace-pre-line space-y-4">
              {BIRTHDAY_CONFIG.SPECIAL_MESSAGE}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={triggerFireworks}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#d4af37] via-amber-400 to-[#d4af37] text-slate-950 font-semibold text-xs uppercase tracking-[2px] rounded-full shadow-[0_0_25px_rgba(212,175,55,0.4)] transition transform hover:scale-105"
              >
                <Sparkles size={16} /> Launch Birthday Fireworks! 🎆
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
