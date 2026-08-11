import * as THREE from 'three';
import { Landmark3DType } from '../../types';

/**
 * Builds custom procedural Three.js 3D meshes for all 70 world landmark types.
 * Pure Three.js geometry composition for optimal 60fps performance without external 3D asset downloads.
 */

export function buildProceduralLandmarkMesh(type: Landmark3DType, accentColor = '#f39c12'): THREE.Group {
  const group = new THREE.Group();

  const primaryMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentColor),
    roughness: 0.3,
    metalness: 0.4,
  });

  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // Warm golden stone
    roughness: 0.7,
    metalness: 0.1,
  });

  const marbleMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5f5f0,
    roughness: 0.15,
    metalness: 0.05,
  });

  const iceMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd4f1f9,
    transmission: 0.8,
    roughness: 0.1,
    ior: 1.31,
    transparent: true,
    opacity: 0.9,
  });

  const copperMaterial = new THREE.MeshStandardMaterial({
    color: 0x27ae60, // Oxidation patina green
    roughness: 0.5,
    metalness: 0.3,
  });

  switch (type) {
    case 'eiffel': {
      // 4 lattice base legs
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, 3, 6), primaryMaterial);
        leg.position.set(Math.cos(angle) * 1.5, 1.5, Math.sin(angle) * 1.5);
        leg.rotation.z = Math.cos(angle) * -0.3;
        leg.rotation.x = Math.sin(angle) * 0.3;
        group.add(leg);
      }
      // Mid platform
      const midPlatform = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.3, 2.5), primaryMaterial);
      midPlatform.position.y = 3;
      group.add(midPlatform);

      // Mid tower legs
      const midTower = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 3, 8), primaryMaterial);
      midTower.position.y = 4.5;
      group.add(midTower);

      // Top platform
      const topPlatform = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 1.5), primaryMaterial);
      topPlatform.position.y = 6;
      group.add(topPlatform);

      // Spire spire
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.6, 4, 8), primaryMaterial);
      spire.position.y = 8;
      group.add(spire);

      // Beacon light tip
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      beacon.position.y = 10;
      group.add(beacon);
      break;
    }

    case 'pyramid': {
      // Step pyramid
      const base = new THREE.Mesh(new THREE.ConeGeometry(4, 3.5, 4), stoneMaterial);
      base.rotation.y = Math.PI / 4;
      base.position.y = 1.75;
      group.add(base);

      // Golden Capstone (Pyramidion)
      const capstone = new THREE.Mesh(
        new THREE.ConeGeometry(1.2, 1, 4),
        new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.1, metalness: 0.9 })
      );
      capstone.rotation.y = Math.PI / 4;
      capstone.position.y = 3.25;
      group.add(capstone);
      break;
    }

    case 'taj-mahal': {
      // Main square marble pedestal
      const base = new THREE.Mesh(new THREE.BoxGeometry(5, 1, 5), marbleMaterial);
      base.position.y = 0.5;
      group.add(base);

      // Main mausoleum body
      const body = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.5, 3.5), marbleMaterial);
      body.position.y = 2.25;
      group.add(body);

      // Main central onion dome
      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 16), marbleMaterial);
      dome.scale.set(1, 1.3, 1);
      dome.position.y = 4.8;
      group.add(dome);

      // Finial spire on dome
      const finial = new THREE.Mesh(
        new THREE.ConeGeometry(0.2, 1.2, 8),
        new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8 })
      );
      finial.position.y = 6.4;
      group.add(finial);

      // 4 Minarets at corners
      const minaretCoords = [
        [-2.2, -2.2], [2.2, -2.2], [-2.2, 2.2], [2.2, 2.2]
      ];
      minaretCoords.forEach(([x, z]) => {
        const minaret = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 4.5, 16), marbleMaterial);
        minaret.position.set(x, 2.75, z);
        group.add(minaret);

        const miniDome = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), marbleMaterial);
        miniDome.position.set(x, 5.1, z);
        group.add(miniDome);
      });
      break;
    }

    case 'statue-liberty': {
      // Star fort base
      const fort = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.5, 1, 8), stoneMaterial);
      fort.position.y = 0.5;
      group.add(fort);

      // Stone Pedestal
      const pedestal = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 1.5), stoneMaterial);
      pedestal.position.y = 2.25;
      group.add(pedestal);

      // Copper Statue Body
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 3, 12), copperMaterial);
      body.position.y = 5;
      group.add(body);

      // Crown & Rays
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), copperMaterial);
      head.position.y = 6.7;
      group.add(head);

      // Torch Arm & Flame
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5), copperMaterial);
      arm.position.set(0.6, 7.2, 0);
      arm.rotation.z = -0.3;
      group.add(arm);

      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.25, 0.8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffaa00 })
      );
      flame.position.set(0.8, 8.1, 0);
      group.add(flame);
      break;
    }

    case 'colosseum': {
      // Tiered oval amphitheater
      for (let ring = 0; ring < 3; ring++) {
        const radius = 3 - ring * 0.3;
        const coliseumRing = new THREE.Mesh(
          new THREE.TorusGeometry(radius, 0.4, 8, 32),
          stoneMaterial
        );
        coliseumRing.rotation.x = Math.PI / 2;
        coliseumRing.position.y = ring * 0.8 + 0.4;
        group.add(coliseumRing);
      }
      break;
    }

    case 'machu-picchu': {
      // Mountain terrace tiers
      for (let i = 0; i < 4; i++) {
        const terrace = new THREE.Mesh(
          new THREE.BoxGeometry(5 - i * 0.9, 0.6, 4 - i * 0.7),
          new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.8 })
        );
        terrace.position.y = i * 0.6 + 0.3;
        terrace.position.x = (i % 2 === 0 ? 0.2 : -0.2);
        group.add(terrace);
      }
      // Ancient stone structures
      const hut = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.8), stoneMaterial);
      hut.position.set(0, 2.8, 0);
      group.add(hut);
      break;
    }

    case 'sydney-opera': {
      // Harbour water platform base
      const waterBase = new THREE.Mesh(
        new THREE.BoxGeometry(6, 0.4, 4),
        new THREE.MeshStandardMaterial({ color: 0x1a365d, roughness: 0.1 })
      );
      waterBase.position.y = 0.2;
      group.add(waterBase);

      // Shell sails
      const sailCoords = [-1.5, -0.5, 0.5, 1.5];
      sailCoords.forEach((x, i) => {
        const sail = new THREE.Mesh(
          new THREE.ConeGeometry(0.8 + (i % 2) * 0.2, 2.2 + (i % 2) * 0.5, 4),
          marbleMaterial
        );
        sail.rotation.y = Math.PI / 4;
        sail.rotation.z = -0.4;
        sail.position.set(x, 1.5, (i % 2) * 0.3);
        group.add(sail);
      });
      break;
    }

    case 'fuji':
    case 'mountain': {
      // Volcanic Mountain Cone
      const mountain = new THREE.Mesh(
        new THREE.ConeGeometry(4, 4.5, 32),
        new THREE.MeshStandardMaterial({ color: 0x3d4852, roughness: 0.9 })
      );
      mountain.position.y = 2.25;
      group.add(mountain);

      // Snow cap
      const snowCap = new THREE.Mesh(
        new THREE.ConeGeometry(1.8, 2, 32),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
      );
      snowCap.position.y = 3.5;
      group.add(snowCap);
      break;
    }

    case 'burj-khalifa': {
      // Ultra-tall tiered glass spire
      const tiers = [
        { radius: 1.2, height: 2 },
        { radius: 0.9, height: 2 },
        { radius: 0.6, height: 2.5 },
        { radius: 0.3, height: 2.5 }
      ];

      let currentY = 0;
      tiers.forEach((t) => {
        const tier = new THREE.Mesh(
          new THREE.CylinderGeometry(t.radius * 0.8, t.radius, t.height, 6),
          new THREE.MeshPhysicalMaterial({
            color: 0x90caf9,
            roughness: 0.1,
            metalness: 0.8,
            transparent: true,
            opacity: 0.85
          })
        );
        tier.position.y = currentY + t.height / 2;
        currentY += t.height;
        group.add(tier);
      });

      // Spire tip needle
      const spire = new THREE.Mesh(
        new THREE.ConeGeometry(0.1, 3, 6),
        new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 })
      );
      spire.position.y = currentY + 1.5;
      group.add(spire);
      break;
    }

    case 'castle': {
      // Central keep
      const keep = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 2), stoneMaterial);
      keep.position.y = 1.5;
      group.add(keep);

      // 4 Corner Towers with conical roof tops
      const towerCoords = [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]];
      towerCoords.forEach(([x, z]) => {
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4, 16), stoneMaterial);
        tower.position.set(x, 2, z);
        group.add(tower);

        const roof = new THREE.Mesh(
          new THREE.ConeGeometry(0.5, 1.5, 16),
          new THREE.MeshStandardMaterial({ color: 0x2980b9, roughness: 0.4 })
        );
        roof.position.set(x, 4.75, z);
        group.add(roof);
      });
      break;
    }

    case 'great-wall': {
      // Winding parapet blocks
      for (let i = -3; i <= 3; i++) {
        const wallSegment = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1.2),
          stoneMaterial
        );
        wallSegment.position.set(i * 0.9, Math.sin(i * 0.5) * 0.4 + 0.5, i * 0.3);
        group.add(wallSegment);
      }
      // Watchtower in center
      const tower = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 1.6), stoneMaterial);
      tower.position.y = 1.1;
      group.add(tower);
      break;
    }

    case 'bridge': {
      // Bridge roadway deck
      const deck = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 1), primaryMaterial);
      deck.position.y = 1.5;
      group.add(deck);

      // 2 Suspension Towers
      [-1.5, 1.5].forEach((x) => {
        const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 4, 8), primaryMaterial);
        pylon.position.set(x, 2, 0);
        group.add(pylon);
      });
      break;
    }

    case 'iceberg': {
      // Crystalline Iceberg
      const iceberg = new THREE.Mesh(new THREE.DodecahedronGeometry(2.5, 1), iceMaterial);
      iceberg.position.y = 1.5;
      group.add(iceberg);
      break;
    }

    case 'waterfall':
    case 'nature':
    case 'temple':
    case 'sanctuary':
    case 'generic-wonder':
    default: {
      // Elegant crystalline/tiered temple structure default
      const base = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.5, 0.8, 8), stoneMaterial);
      base.position.y = 0.4;
      group.add(base);

      const pillars = 6;
      for (let i = 0; i < pillars; i++) {
        const angle = (i * Math.PI * 2) / pillars;
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 2, 8), marbleMaterial);
        pillar.position.set(Math.cos(angle) * 1.4, 1.8, Math.sin(angle) * 1.4);
        group.add(pillar);
      }

      const roof = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.5, 8), primaryMaterial);
      roof.position.y = 3.5;
      group.add(roof);
      break;
    }
  }

  return group;
}
