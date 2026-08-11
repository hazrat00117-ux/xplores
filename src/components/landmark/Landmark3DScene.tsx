import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Destination } from '../../types';
import { buildProceduralLandmarkMesh } from './proceduralModels';
import { RotateCw, Camera, Sun, Moon, Sparkles, ArrowLeft, Info, Compass, CloudRain, CloudSnow, Zap } from 'lucide-react';
import { soundEngine } from '../../utils/audio';
import { GlobalWeatherMode } from '../ui/GlobalWeatherOverlay';

interface Landmark3DSceneProps {
  destination: Destination;
  globalWeatherMode: GlobalWeatherMode;
  onSelectWeatherMode: (mode: GlobalWeatherMode) => void;
  onBack: () => void;
}

type LightingMode = 'sunset' | 'night' | 'day' | 'aurora';

export const Landmark3DScene: React.FC<Landmark3DSceneProps> = ({
  destination,
  globalWeatherMode,
  onSelectWeatherMode,
  onBack,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const landmarkGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  const [autoRotate, setAutoRotate] = useState(true);
  const [lightingMode, setLightingMode] = useState<LightingMode>('sunset');
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const weatherModeRef = useRef<GlobalWeatherMode>(globalWeatherMode);
  weatherModeRef.current = globalWeatherMode;

  // Drag & Pointer controls
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 12);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting Setup based on LightingMode
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.5);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    // 3. Ground Cobblestone / Pedestal Base
    const groundGeo = new THREE.CylinderGeometry(8, 8.5, 0.4, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: destination.continent === 'antarctica' ? 0xe8f4f8 : 0x2c3e50,
      roughness: 0.8,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.y = -0.2;
    scene.add(groundMesh);

    // 4. Build 3D Procedural Landmark Mesh
    const landmarkMesh = buildProceduralLandmarkMesh(destination.landmarkType, destination.accentColor);
    landmarkGroupRef.current = landmarkMesh;
    scene.add(landmarkMesh);

    // 5. Dynamic Environmental Weather Particles
    const particleCount = 800;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = Math.random() * 12;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    scene.add(particles);

    // Play travel chime
    soundEngine.playTravelChime();

    // 6. Pointer & Mouse & Touch interaction for rotation in ANY direction
    const dom = renderer.domElement;

    const handlePointerDown = (clientX: number, clientY: number) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!isDraggingRef.current) return;
      const deltaX = clientX - previousMousePositionRef.current.x;
      const deltaY = clientY - previousMousePositionRef.current.y;

      // Rotate in any direction (Yaw & Pitch)
      targetRotationRef.current.y += deltaX * 0.008;
      targetRotationRef.current.x += deltaY * 0.008;

      // Clamp vertical pitch tilt to prevent flips
      targetRotationRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotationRef.current.x));

      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    // Mouse listeners
    const handleMouseDown = (e: MouseEvent) => handlePointerDown(e.clientX, e.clientY);
    const handleMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const handleMouseUp = () => handlePointerUp();

    // Touch listeners
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => handlePointerUp();

    // Mouse wheel zoom
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (cameraRef.current) {
        cameraRef.current.position.z += e.deltaY * 0.01;
        cameraRef.current.position.z = Math.max(6, Math.min(22, cameraRef.current.position.z));
      }
    };

    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('touchstart', handleTouchStart, { passive: true });
    dom.addEventListener('touchmove', handleTouchMove, { passive: true });
    dom.addEventListener('touchend', handleTouchEnd);
    dom.addEventListener('wheel', handleWheel, { passive: false });

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (landmarkGroupRef.current) {
        // Auto rotation when idle
        if (autoRotate && !isDraggingRef.current) {
          targetRotationRef.current.y += 0.004;
        }

        // Smooth interpolation for 3D rotation in any direction
        currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;
        currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;

        landmarkGroupRef.current.rotation.x = currentRotationRef.current.x;
        landmarkGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      // Animate dynamic weather particles (Rain, Snow, Clear Embers)
      if (particlesRef.current) {
        const mode = weatherModeRef.current;
        const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const array = posAttr.array as Float32Array;

        for (let i = 0; i < array.length; i += 3) {
          if (mode === 'rain') {
            array[i + 1] -= 0.35; // Fast rain drop velocity
            array[i] += 0.02; // Slanted wind effect
          } else if (mode === 'snow') {
            array[i + 1] -= 0.03; // Gentle floating snow drop velocity
            array[i] += Math.sin(time * 2 + i) * 0.015; // Gentle flutter
          } else {
            // Clear sky ambient embers / blossoms
            array[i + 1] -= 0.01;
            array[i] += Math.cos(time + i) * 0.005;
          }

          // Reset to top when passing ground plane
          if (array[i + 1] < 0) {
            array[i + 1] = 12;
            array[i] = (Math.random() - 0.5) * 20;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('touchstart', handleTouchStart);
      dom.removeEventListener('touchmove', handleTouchMove);
      dom.removeEventListener('touchend', handleTouchEnd);
      dom.removeEventListener('wheel', handleWheel);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [destination, autoRotate]);

  // Update particle material styling whenever globalWeatherMode changes
  useEffect(() => {
    if (!particlesRef.current) return;
    const mat = particlesRef.current.material as THREE.PointsMaterial;

    if (globalWeatherMode === 'rain' || globalWeatherMode === 'storm') {
      mat.color.setHex(0x90caf9); // Rain translucent blue
      mat.size = 0.12;
      mat.opacity = 0.8;
    } else if (globalWeatherMode === 'snow') {
      mat.color.setHex(0xffffff); // Pure white snow
      mat.size = 0.22;
      mat.opacity = 0.9;
    } else {
      // Clear mode: warm golden embers or cherry blossom pink for Fuji
      if (destination.id === 'mount-fuji') {
        mat.color.setHex(0xffb7c5);
      } else {
        mat.color.setHex(0xf1c40f);
      }
      mat.size = 0.14;
      mat.opacity = 0.6;
    }
  }, [globalWeatherMode, destination]);

  // Update lighting mode background & colors
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    switch (lightingMode) {
      case 'sunset':
        scene.background = new THREE.Color(0x3a1c40); // Deep purple sunset
        break;
      case 'night':
        scene.background = new THREE.Color(0x0a1128); // Midnight blue
        break;
      case 'aurora':
        scene.background = new THREE.Color(0x032b2b); // Emerald aurora
        break;
      case 'day':
      default:
        scene.background = new THREE.Color(0x87ceeb); // Sky blue
        break;
    }
  }, [lightingMode]);

  // Photo Capture Function
  const handleCapturePhoto = () => {
    if (rendererRef.current) {
      const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
      setCapturedPhoto(dataUrl);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-white overflow-hidden select-none">
      {/* 3D WebGL Canvas as Full Page Fill Background */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0" />

      {/* Top Header Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto flex-wrap gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/8 backdrop-blur-2xl rounded-full text-slate-200 hover:text-white hover:bg-white/12 transition border border-white/15 shadow-lg text-xs font-medium uppercase tracking-wider"
        >
          <ArrowLeft size={15} />
          Return to Globe
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Dynamic Weather Overlay Switcher */}
          <div className="flex items-center bg-white/8 backdrop-blur-2xl p-1 rounded-full border border-white/15 shadow-lg">
            <button
              onClick={() => onSelectWeatherMode('clear')}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition ${
                globalWeatherMode === 'clear' ? 'bg-[#d4af37]/25 text-[#d4af37] gold-glow' : 'text-white/60 hover:text-white'
              }`}
              title="Clear Sky"
            >
              <Sun size={14} className="inline mr-1" /> Clear
            </button>
            <button
              onClick={() => onSelectWeatherMode('rain')}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition ${
                globalWeatherMode === 'rain' ? 'bg-blue-500/30 text-blue-300' : 'text-white/60 hover:text-white'
              }`}
              title="Rain Particle Effect"
            >
              <CloudRain size={14} className="inline mr-1" /> Rain
            </button>
            <button
              onClick={() => onSelectWeatherMode('snow')}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition ${
                globalWeatherMode === 'snow' ? 'bg-sky-200/25 text-sky-100' : 'text-white/60 hover:text-white'
              }`}
              title="Snow Particle Effect"
            >
              <CloudSnow size={14} className="inline mr-1" /> Snow
            </button>
            <button
              onClick={() => onSelectWeatherMode('storm')}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition ${
                globalWeatherMode === 'storm' ? 'bg-purple-500/30 text-purple-300' : 'text-white/60 hover:text-white'
              }`}
              title="Thunderstorm Effect"
            >
              <Zap size={14} className="inline mr-1" /> Storm
            </button>
          </div>

          {/* Lighting Mode Switcher */}
          <div className="flex items-center bg-white/8 backdrop-blur-2xl p-1 rounded-full border border-white/15 shadow-lg">
            <button
              onClick={() => setLightingMode('sunset')}
              className={`p-2 rounded-full transition ${lightingMode === 'sunset' ? 'bg-[#d4af37]/25 text-[#d4af37] gold-glow' : 'text-white/60 hover:text-white'}`}
              title="Sunset Mode"
            >
              <Sun size={15} />
            </button>
            <button
              onClick={() => setLightingMode('night')}
              className={`p-2 rounded-full transition ${lightingMode === 'night' ? 'bg-indigo-500/30 text-indigo-300' : 'text-white/60 hover:text-white'}`}
              title="Night Mode"
            >
              <Moon size={15} />
            </button>
            <button
              onClick={() => setLightingMode('aurora')}
              className={`p-2 rounded-full transition ${lightingMode === 'aurora' ? 'bg-emerald-500/30 text-emerald-300' : 'text-white/60 hover:text-white'}`}
              title="Aurora Mode"
            >
              <Sparkles size={15} />
            </button>
          </div>

          {/* Auto-rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 bg-white/8 backdrop-blur-2xl rounded-full border border-white/15 transition shadow-lg ${autoRotate ? 'text-[#d4af37] gold-glow' : 'text-white/60 hover:text-white'}`}
            title="Auto Rotate 3D Model"
          >
            <RotateCw size={15} className={autoRotate ? 'animate-spin-slow' : ''} />
          </button>

          {/* Screenshot / Postcard Capture */}
          <button
            onClick={handleCapturePhoto}
            className="p-2.5 bg-white/8 backdrop-blur-2xl rounded-full border border-white/15 text-slate-200 hover:text-white hover:bg-white/12 transition shadow-lg"
            title="Take Postcard Photo"
          >
            <Camera size={15} />
          </button>

          {/* Info Panel Toggle */}
          <button
            onClick={() => setShowInfoPanel(!showInfoPanel)}
            className={`p-2.5 bg-white/8 backdrop-blur-2xl rounded-full border border-white/15 transition shadow-lg ${showInfoPanel ? 'text-amber-300' : 'text-white/60 hover:text-white'}`}
            title="Toggle Information"
          >
            <Info size={15} />
          </button>
        </div>
      </div>

      {/* Floating Info Panel */}
      {showInfoPanel && (
        <div className="absolute bottom-6 left-6 right-6 md:left-8 md:right-auto md:max-w-md glass-panel p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7)] z-10 space-y-4 border border-white/20">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-xs uppercase tracking-[2px] text-[#d4af37] font-medium flex items-center gap-1.5">
                <Compass size={13} /> {destination.city}, {destination.country}
              </span>
              <h2 className="text-2xl font-serif text-white mt-1 font-normal tracking-wide">{destination.name}</h2>
            </div>
            {destination.yearBuilt && (
              <span className="text-[11px] px-3 py-1 bg-white/10 rounded-full text-white/70 font-mono">
                {destination.yearBuilt}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light italic">
            "{destination.story}"
          </p>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-xs text-white/80 space-y-1">
            <span className="font-semibold text-[#d4af37] block uppercase tracking-wider">✨ Did You Know?</span>
            <p className="font-light">{destination.funFact}</p>
          </div>
        </div>
      )}

      {/* Captured Postcard Modal */}
      {capturedPhoto && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-30">
          <div className="bg-slate-900 border border-white/20 p-6 rounded-2xl max-w-lg w-full text-center space-y-4 shadow-2xl">
            <h3 className="text-xl font-serif text-amber-300">Your Postcard from {destination.name}</h3>
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <img src={capturedPhoto} alt="3D Landmark Postcard" className="w-full h-auto" />
              <div className="absolute bottom-2 right-3 text-xs text-white/80 font-serif italic">
                Her World ✨ {destination.name}
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <a
                href={capturedPhoto}
                download={`${destination.id}-postcard.png`}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm rounded-full transition"
              >
                Download Postcard
              </a>
              <button
                onClick={() => setCapturedPhoto(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-full transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
