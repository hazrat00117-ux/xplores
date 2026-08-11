import { Continent } from '../types';

export const CONTINENTS: Continent[] = [
  {
    id: 'africa',
    name: 'Africa',
    tagline: 'Where the journey begins.',
    description: 'Golden deserts, roaring waterfalls, ancient pyramids, and vibrant wilderness under infinite skies.',
    color: '#e67e22',
    centerLat: 0.0,
    centerLng: 20.0,
    zoomLevel: 2.5,
    iconName: 'Compass'
  },
  {
    id: 'asia',
    name: 'Asia',
    tagline: 'A world of color, movement and wonder.',
    description: 'Sacred temples, majestic snow peaks, neon skylines, and centuries of rich history.',
    color: '#e74c3c',
    centerLat: 34.0,
    centerLng: 100.0,
    zoomLevel: 2.3,
    iconName: 'Sparkles'
  },
  {
    id: 'europe',
    name: 'Europe',
    tagline: 'Old cities. New memories.',
    description: 'Cobblestone alleyways, fairytale castles, romantic canals, and timeless architecture.',
    color: '#3498db',
    centerLat: 54.0,
    centerLng: 15.0,
    zoomLevel: 2.8,
    iconName: 'Landmark'
  },
  {
    id: 'north-america',
    name: 'North America',
    tagline: 'Wild landscapes and infinite horizons.',
    description: 'Towering granite canyons, vibrant metropolises, glacial lakes, and coastal coastal beauty.',
    color: '#2ecc71',
    centerLat: 40.0,
    centerLng: -100.0,
    zoomLevel: 2.4,
    iconName: 'Mountain'
  },
  {
    id: 'south-america',
    name: 'South America',
    tagline: 'Mountains, mysteries and vibrant beats.',
    description: 'Ancient citadel ruins in the clouds, lush Amazon rainforests, and thunderous waterfalls.',
    color: '#f1c40f',
    centerLat: -15.0,
    centerLng: -60.0,
    zoomLevel: 2.4,
    iconName: 'Sun'
  },
  {
    id: 'oceania',
    name: 'Oceania',
    tagline: 'Islands, reefs and deep blue waters.',
    description: 'Turquoise lagoons, iconic harbor architecture, coral gardens, and volcanic peaks.',
    color: '#1abc9c',
    centerLat: -25.0,
    centerLng: 135.0,
    zoomLevel: 2.6,
    iconName: 'Waves'
  },
  {
    id: 'antarctica',
    name: 'Antarctica',
    tagline: 'Silences of ice and ancient white light.',
    description: 'Crystalline glaciers, pristine icebergs, glowing auroras, and untamed polar wilderness.',
    color: '#9b59b6',
    centerLat: -82.0,
    centerLng: 0.0,
    zoomLevel: 2.2,
    iconName: 'Snowflake'
  }
];
