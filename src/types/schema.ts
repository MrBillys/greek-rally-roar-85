
export interface Rally {
  _id: string;
  name: string;
  location: string;
  date: string;
  image: any; // Sanity image type
  status: 'upcoming' | 'ongoing' | 'completed';
  description: string;
  specialStages: SpecialStage[];
  slug: {
    current: string;
  };
}

export interface SpecialStage {
  name: string;
  distance: string;
  date: string;
  time: string;
}

export interface Driver {
  _id: string;
  name: string;
  nationality: string;
  car: string;
  team: string;
  image: any; // Sanity image type
  championships: number;
  podiums: number;
  bio: string;
  slug: {
    current: string;
  };
}

export interface RallyResult {
  _id: string;
  stageId: string;
  stageName: string;
  rallyId: string;
  rallyName: string;
  date: string;
  results: DriverResult[];
}

export interface DriverResult {
  position: number;
  driver: string;
  time: string;
  gap: string;
  carNumber: number;
  status: string;
}

export interface OverallStanding {
  _id: string;
  rallyId: string;
  rallyName: string;
  standings: StandingItem[];
}

export interface StandingItem {
  position: number;
  driver: string;
  totalTime: string;
  gap: string;
  carNumber: number;
}
