export type ContinentId = 
  | 'africa' 
  | 'asia' 
  | 'europe' 
  | 'north-america' 
  | 'south-america' 
  | 'oceania' 
  | 'antarctica';

export type Landmark3DType = 
  | 'eiffel' 
  | 'pyramid' 
  | 'taj-mahal' 
  | 'statue-liberty' 
  | 'colosseum' 
  | 'machu-picchu' 
  | 'sydney-opera' 
  | 'fuji' 
  | 'burj-khalifa' 
  | 'castle' 
  | 'great-wall' 
  | 'bridge' 
  | 'iceberg' 
  | 'temple' 
  | 'waterfall' 
  | 'mountain' 
  | 'nature' 
  | 'sanctuary' 
  | 'generic-wonder';

export interface Destination {
  id: string;
  name: string;
  city: string;
  country: string;
  continent: ContinentId;
  lat: number;
  lng: number;
  description: string;
  story: string;
  landmarkType: Landmark3DType;
  accentColor: string;
  yearBuilt?: string;
  funFact: string;
  isSecret?: boolean;
}

export interface Continent {
  id: ContinentId;
  name: string;
  tagline: string;
  description: string;
  color: string;
  centerLat: number;
  centerLng: number;
  zoomLevel: number;
  iconName: string;
}

export interface VisitedProgress {
  visitedIds: string[];
  unlockedSecret: boolean;
  easterEggsFound: string[];
}
