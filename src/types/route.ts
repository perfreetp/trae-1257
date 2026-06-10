export interface RouteStop {
  id: string;
  name: string;
  exhibitId?: string;
  location: string;
  duration: string;
  description: string;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  duration: string;
  distance: string;
  exhibitCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  coverImage: string;
  tags: string[];
  isWheelchairAccessible?: boolean;
  isRecommended?: boolean;
  stops: RouteStop[];
}

export interface RoutePoint {
  id: string;
  name: string;
  description?: string;
  x: number;
  y: number;
  floor: number;
  type: 'exhibit' | 'service' | 'restroom' | 'exit' | 'entrance';
}

export interface CrowdInfo {
  location: string;
  level: 'normal' | 'moderate' | 'crowded';
  count: number;
  capacity: number;
}
