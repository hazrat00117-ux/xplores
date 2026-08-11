import * as THREE from 'three';

/**
 * Generates high-quality procedural canvas textures for the 3D Earth, Clouds, and Specular maps.
 * Ensures zero external image loading dependency and maximum reliability.
 */

export function createProceduralEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Deep Ocean Base
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#0a192f'); // Polar ocean
  oceanGrad.addColorStop(0.5, '#0d254c'); // Equatorial ocean
  oceanGrad.addColorStop(1, '#0a192f');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle ocean wave texture noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 2, 1);
  }

  // Helper to convert lat/lng to canvas x/y
  const toX = (lng: number) => ((lng + 180) / 360) * canvas.width;
  const toY = (lat: number) => ((90 - lat) / 180) * canvas.height;

  // Helper to draw continent shape
  const drawContinent = (points: [number, number][], color: string, strokeColor = 'rgba(255,255,255,0.15)') => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;

    points.forEach(([lat, lng], idx) => {
      const x = toX(lng);
      const y = toY(lat);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // 2. Simplified Continent Outlines (Landmasses)
  // North America
  drawContinent([
    [70, -165], [70, -60], [50, -55], [45, -65], [25, -80], [15, -90], [10, -80],
    [15, -105], [30, -115], [50, -130], [60, -165]
  ], '#1e3d30'); // Rich pine green

  // South America
  drawContinent([
    [12, -75], [5, -50], [-10, -35], [-23, -43], [-55, -68], [-50, -75], [-18, -70], [0, -80]
  ], '#1a4329'); // Emerald jungle

  // Europe
  drawContinent([
    [70, 10], [70, 40], [60, 30], [45, 35], [36, 36], [36, -10], [43, -9], [50, 0], [60, 5]
  ], '#2a442e');

  // Africa
  drawContinent([
    [37, -10], [37, 32], [12, 44], [-12, 40], [-35, 20], [-34, 18], [5, 9], [15, -17], [30, -10]
  ], '#3d3824'); // Sahara gold / savannah

  // Asia
  drawContinent([
    [75, 60], [70, 170], [60, 160], [50, 140], [35, 120], [22, 115], [10, 105],
    [5, 98], [20, 88], [25, 65], [12, 44], [30, 35], [40, 50], [60, 60]
  ], '#263b28');

  // Oceania / Australia
  drawContinent([
    [-12, 130], [-12, 142], [-25, 153], [-38, 148], [-35, 117], [-20, 114]
  ], '#40321a'); // Outback ochre

  // Antarctica
  drawContinent([
    [-65, -180], [-65, 180], [-90, 180], [-90, -180]
  ], '#e8f4f8', 'rgba(255,255,255,0.4)'); // Polar ice white

  // 3. Grid Lines (Latitude / Longitude subtle aesthetic mesh)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let lng = -180; lng <= 180; lng += 30) {
    const x = toX(lng);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let lat = -90; lat <= 90; lat += 30) {
    const y = toY(lat);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates atmospheric cloud cover texture canvas.
 */
export function createProceduralCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const rx = 20 + Math.random() * 60;
    const ry = 10 + Math.random() * 25;

    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates procedural moon canvas texture.
 */
export function createProceduralMoonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#9aa0a6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Craters
  ctx.fillStyle = 'rgba(50, 50, 50, 0.25)';
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 4 + Math.random() * 16;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
