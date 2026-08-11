import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Destination, ContinentId } from '../../types';
import { createProceduralEarthTexture, createProceduralCloudTexture, createProceduralMoonTexture } from '../../utils/earthTexture';

interface Globe3DProps {
  destinations: Destination[];
  visitedIds: string[];
  selectedDestination: Destination | null;
  focusedDestination?: Destination | null;
  selectedContinent?: ContinentId | 'all';
  onSelectDestination: (dest: Destination) => void;
  onMoonClick?: () => void;
  onSantaClick?: () => void;
  stargazingMode?: boolean;
}

const CONTINENT_CENTERS: Record<string, { lat: number; lng: number }> = {
  africa: { lat: 5.0, lng: 20.0 },
  asia: { lat: 34.0, lng: 100.0 },
  europe: { lat: 50.0, lng: 15.0 },
  'north-america': { lat: 40.0, lng: -100.0 },
  'south-america': { lat: -15.0, lng: -60.0 },
  oceania: { lat: -25.0, lng: 135.0 },
  antarctica: { lat: -75.0, lng: 0.0 },
};

export const Globe3D: React.FC<Globe3DProps> = ({
  destinations,
  visitedIds,
  selectedDestination,
  focusedDestination,
  selectedContinent = 'all',
  onSelectDestination,
  onMoonClick,
  onSantaClick,
  stargazingMode = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const moonRef = useRef<THREE.Mesh | null>(null);
  const sleighRef = useRef<THREE.Group | null>(null);
  const markersRef = useRef<Map<string, THREE.Group>>(new Map());
  const constellationLinesRef = useRef<THREE.LineSegments | null>(null);

  const [hoveredDestInfo, setHoveredDestInfo] = React.useState<{ dest: Destination; x: number; y: number } | null>(null);

  // Drag interaction refs
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const targetCameraDistanceRef = useRef(14);
  const currentCameraDistanceRef = useRef(14);

  // Helper: lat/lng to 3D sphere coordinate
  const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, targetCameraDistanceRef.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    sunLight.position.set(20, 10, 15);
    scene.add(sunLight);

    const backLight = new THREE.DirectionalLight(0x3498db, 0.5);
    backLight.position.set(-20, -10, -15);
    scene.add(backLight);

    // 3. Globe Base & Textures
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    const GLOBE_RADIUS = 5;

    // Earth Sphere
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthTexture = createProceduralEarthTexture();
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.6,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // Cloud Atmosphere Layer
    const cloudGeometry = new THREE.SphereGeometry(GLOBE_RADIUS + 0.12, 64, 64);
    const cloudTexture = createProceduralCloudTexture();
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const cloudsMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudsRef.current = cloudsMesh;
    globeGroup.add(cloudsMesh);

    // Outer Glow Halo
    const glowGeometry = new THREE.SphereGeometry(GLOBE_RADIUS + 0.3, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x3498db),
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    globeGroup.add(glowMesh);

    // Starfield Background
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions: number[] = [];
    for (let i = 0; i < 1500; i++) {
      const x = (Math.random() - 0.5) * 300;
      const y = (Math.random() - 0.5) * 300;
      const z = (Math.random() - 0.5) * 300;
      starPositions.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.6, transparent: true, opacity: 0.8 });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // 4. Moon (Easter Egg)
    const moonGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const moonTexture = createProceduralMoonTexture();
    const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture, roughness: 0.8 });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(12, 4, -8);
    moon.userData = { isMoon: true };
    moonRef.current = moon;
    scene.add(moon);

    // 5. Santa's Sleigh / Airplane (Easter Egg)
    const sleighGroup = new THREE.Group();
    const sleighBody = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.6, 8),
      new THREE.MeshBasicMaterial({ color: 0xe74c3c })
    );
    sleighBody.rotation.x = Math.PI / 2;
    sleighGroup.add(sleighBody);

    // Sleigh trail light
    const trail = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xf1c40f })
    );
    sleighGroup.add(trail);
    sleighGroup.userData = { isSanta: true };
    sleighRef.current = sleighGroup;
    globeGroup.add(sleighGroup);

    // 6. Create Destination Pin Markers
    destinations.forEach((dest) => {
      const markerGroup = new THREE.Group();
      const pos = latLngToVector3(dest.lat, dest.lng, GLOBE_RADIUS + 0.1);
      markerGroup.position.copy(pos);

      // Pin core sphere
      const isVisited = visitedIds.includes(dest.id);
      const isSecret = dest.isSecret;
      const pinColor = isSecret ? 0xf1c40f : isVisited ? 0x2ecc71 : 0xe74c3c;

      const pinCore = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        new THREE.MeshBasicMaterial({ color: pinColor })
      );
      markerGroup.add(pinCore);

      // Pulse ring
      const ringGeo = new THREE.RingGeometry(0.16, 0.28, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      markerGroup.add(ringMesh);

      // Invisible enlarged hit sphere for easy clicking & hovering
      const hitMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 12, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      markerGroup.add(hitMesh);

      markerGroup.userData = { destination: dest, ringMesh };
      markersRef.current.set(dest.id, markerGroup);
      globeGroup.add(markerGroup);
    });

    // 7. Mouse Event Listeners for Rotation & Clicking
    const dom = renderer.domElement;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        targetRotationRef.current.y += deltaX * 0.005;
        targetRotationRef.current.x += deltaY * 0.005;

        // Clamp vertical rotation
        targetRotationRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotationRef.current.x));

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
        setHoveredDestInfo(null);
        return;
      }

      // Hover check for destination markers
      const rect = dom.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const markerMeshes: THREE.Object3D[] = [];
      markersRef.current.forEach((group) => {
        markerMeshes.push(...group.children);
      });

      const intersects = raycaster.intersectObjects(markerMeshes, true);
      if (intersects.length > 0) {
        let parentGroup: THREE.Object3D | null = intersects[0].object;
        while (parentGroup && !parentGroup.userData?.destination) {
          parentGroup = parentGroup.parent;
        }
        if (parentGroup?.userData?.destination) {
          dom.style.cursor = 'pointer';
          setHoveredDestInfo({
            dest: parentGroup.userData.destination,
            x: e.clientX,
            y: e.clientY,
          });
          return;
        }
      }

      dom.style.cursor = 'grab';
      setHoveredDestInfo(null);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetCameraDistanceRef.current += e.deltaY * 0.01;
      targetCameraDistanceRef.current = Math.max(7, Math.min(25, targetCameraDistanceRef.current));
    };

    // Raycasting for object selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check Moon click
      if (moonRef.current) {
        const moonIntersects = raycaster.intersectObject(moonRef.current);
        if (moonIntersects.length > 0 && onMoonClick) {
          onMoonClick();
          return;
        }
      }

      // Check Santa click
      if (sleighRef.current) {
        const santaIntersects = raycaster.intersectObjects(sleighRef.current.children);
        if (santaIntersects.length > 0 && onSantaClick) {
          onSantaClick();
          return;
        }
      }

      // Check Destination Marker clicks
      const markerMeshes: THREE.Object3D[] = [];
      markersRef.current.forEach((group) => {
        markerMeshes.push(...group.children);
      });

      const intersects = raycaster.intersectObjects(markerMeshes, true);
      if (intersects.length > 0) {
        let parentGroup: THREE.Object3D | null = intersects[0].object;
        while (parentGroup && !parentGroup.userData?.destination) {
          parentGroup = parentGroup.parent;
        }
        if (parentGroup?.userData?.destination) {
          onSelectDestination(parentGroup.userData.destination);
        }
      }
    };

    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });
    dom.addEventListener('click', handleClick);

    // Touch support
    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x += deltaY * 0.005;

      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    dom.addEventListener('touchstart', handleTouchStart);
    dom.addEventListener('touchmove', handleTouchMove);
    dom.addEventListener('touchend', handleTouchEnd);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth rotation interpolation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      if (!isDraggingRef.current && !selectedDestination) {
        // Slow auto rotation when idle
        targetRotationRef.current.y += 0.001;
      }

      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.x = currentRotationRef.current.x;
        globeGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      // Smooth camera distance interpolation
      currentCameraDistanceRef.current += (targetCameraDistanceRef.current - currentCameraDistanceRef.current) * 0.08;
      if (cameraRef.current) {
        cameraRef.current.position.z = currentCameraDistanceRef.current;
      }

      // Rotate Clouds layer
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y = elapsedTime * 0.03;
      }

      // Orbit Moon
      if (moonRef.current) {
        const moonAngle = elapsedTime * 0.15;
        moonRef.current.position.x = Math.cos(moonAngle) * 14;
        moonRef.current.position.z = Math.sin(moonAngle) * 14;
        moonRef.current.position.y = Math.sin(moonAngle * 0.5) * 4;
      }

      // Orbit Santa sleigh
      if (sleighRef.current) {
        const sleighAngle = elapsedTime * 0.4;
        const pos = latLngToVector3(Math.sin(sleighAngle) * 40, (sleighAngle * 180 / Math.PI) % 360 - 180, 5.6);
        sleighRef.current.position.copy(pos);
      }

      // Pulse marker rings
      markersRef.current.forEach((group) => {
        const ring = group.userData.ringMesh as THREE.Mesh;
        if (ring) {
          const scale = 1 + Math.sin(elapsedTime * 4) * 0.3;
          ring.scale.set(scale, scale, scale);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
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
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('click', handleClick);
      dom.removeEventListener('touchstart', handleTouchStart);
      dom.removeEventListener('touchmove', handleTouchMove);
      dom.removeEventListener('touchend', handleTouchEnd);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [destinations, visitedIds, onSelectDestination, onMoonClick, onSantaClick]);

  // Smooth camera rotation & zoom when selectedContinent changes
  useEffect(() => {
    if (!globeGroupRef.current) return;
    if (selectedContinent && selectedContinent !== 'all' && CONTINENT_CENTERS[selectedContinent]) {
      const { lat, lng } = CONTINENT_CENTERS[selectedContinent];
      const phi = lat * (Math.PI / 180);
      const theta = (-lng - 90) * (Math.PI / 180);

      targetRotationRef.current = { x: phi, y: theta };
      targetCameraDistanceRef.current = 11.5; // Smooth zoom in to highlight continent
    } else if (selectedContinent === 'all') {
      targetCameraDistanceRef.current = 14; // Default camera distance
    }
  }, [selectedContinent]);

  // Smooth camera zoom/fly when focusedDestination or selectedDestination changes
  useEffect(() => {
    const dest = focusedDestination || selectedDestination;
    if (!dest || !globeGroupRef.current) return;

    // Convert lat/lng to target rotation angles to center destination facing camera
    const phi = (dest.lat) * (Math.PI / 180);
    const theta = (-dest.lng - 90) * (Math.PI / 180);

    targetRotationRef.current = { x: phi, y: theta };
    targetCameraDistanceRef.current = 8.8; // Zoom in cinematic close-up facing landmark
  }, [focusedDestination, selectedDestination]);

  // Handle Stargazing Constellation Mode toggle
  useEffect(() => {
    if (!globeGroupRef.current || !sceneRef.current) return;

    if (stargazingMode) {
      // Connect all visited locations with glowing constellation lines
      const linePositions: number[] = [];
      const visitedCoords: THREE.Vector3[] = [];

      destinations.forEach((d) => {
        if (visitedIds.includes(d.id)) {
          visitedCoords.push(latLngToVector3(d.lat, d.lng, 5.15));
        }
      });

      for (let i = 0; i < visitedCoords.length - 1; i++) {
        const p1 = visitedCoords[i];
        const p2 = visitedCoords[i + 1];
        linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      }

      if (linePositions.length > 0) {
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const lineMat = new THREE.LineBasicMaterial({ color: 0xf1c40f, linewidth: 2 });
        const lines = new THREE.LineSegments(lineGeo, lineMat);
        globeGroupRef.current.add(lines);
        constellationLinesRef.current = lines;
      }
    } else {
      if (constellationLinesRef.current && globeGroupRef.current) {
        globeGroupRef.current.remove(constellationLinesRef.current);
        constellationLinesRef.current = null;
      }
    }
  }, [stargazingMode, visitedIds, destinations]);

  return (
    <div className="absolute inset-0 w-screen h-screen z-0 overflow-hidden">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      {hoveredDestInfo && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2 bg-slate-900/90 border border-[#d4af37]/40 backdrop-blur-md rounded-xl shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150"
          style={{ left: hoveredDestInfo.x, top: hoveredDestInfo.y }}
        >
          <div className="text-xs font-semibold text-white font-serif tracking-wide">{hoveredDestInfo.dest.name}</div>
          <div className="text-[10px] text-[#d4af37] tracking-wider uppercase font-medium mt-0.5">
            {hoveredDestInfo.dest.city}, {hoveredDestInfo.dest.country}
          </div>
          <div className="text-[9px] text-white/70 mt-1 font-sans bg-white/10 rounded px-1.5 py-0.5 inline-block">
            Click pin to open 3D site 🏰
          </div>
        </div>
      )}
    </div>
  );
};
