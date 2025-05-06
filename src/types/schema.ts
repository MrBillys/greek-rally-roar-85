// Schema types for the rally results platform

// Rally represents a single rally event in the championship
export interface Rally {
  _id: string;
  title: string;                // The full name of the rally
  shortCode: string;            // A short code for the rally (e.g., "Acropolis2023")
  date: string;                 // The start date of the rally
  location: string;             // The location or country where the rally takes place
  status: 'upcoming' | 'in-progress' | 'completed'; // Rally status
  organizer: string;            // Name of the organization hosting the event
  website: string;              // URL of the official rally website
  image?: any;                  // Main image for the rally
  description?: string;         // Description or summary of the rally
  championship?: {              // Link to the championship this rally is part of
    _type: 'reference';
    _ref: string;
  };
  slug: {
    current: string;            // URL slug for the rally
  };
  specialStages?: Stage[];      // List of special stages in the rally
}

// Stage represents a special stage within a rally
export interface Stage {
  _id?: string;
  name: string;                 // The name of the stage (e.g., "SS1 Elatia")
  distance: number;             // Distance of the stage in kilometers
  status: 'completed' | 'cancelled' | 'upcoming'; // Stage status matching Sanity schema
  startTime?: string;           // The start time of the stage (ISO date string)
  date?: string;                // Extracted date part from startTime
  time?: string;                // Extracted time part from startTime
  rally?: {                     // Reference to the rally this stage belongs to
    _type: 'reference';
    _ref: string;
  };
}

// Entry represents a team participating in a rally
export interface Entry {
  _id: string;
  number: number;               // The entry number of the team
  driver: {                     // Reference to the driver
    _type: 'reference';
    _ref: string;
  };
  coDriver: {                   // Reference to the co-driver
    _type: 'reference';
    _ref: string;
  };
  car: {                        // Reference to the car
    _type: 'reference';
    _ref: string;
  };
  team: {                       // Reference to the team
    _type: 'reference';
    _ref: string;
  };
  category: string;             // The car category they compete in (e.g., WRC, R2)
  rally: {                      // Reference to the rally
    _type: 'reference';
    _ref: string;
  };
}

// Driver represents a rally driver
export interface Driver {
  _id: string;
  name: string;                 // Full name of the driver
  birthDate: string;            // Driver's birth date
  nationality: string;          // Nationality of the driver
  photo: any;                   // A photo of the driver
  team?: {                      // Reference to the team the driver belongs to
    _type: 'reference';
    _ref: string;
  };
  bio?: string;                 // Driver biography
  championships?: number;       // Number of championships won
  podiums?: number;             // Number of podium finishes
  slug: {
    current: string;            // URL slug for the driver
  };
}

// CoDriver represents a rally co-driver
export interface CoDriver {
  _id: string;
  name: string;                 // Full name of the co-driver
  birthDate: string;            // Co-driver's birth date
  nationality: string;          // Nationality of the co-driver
  photo: any;                   // A photo of the co-driver
  team?: {                      // Reference to the team the co-driver belongs to
    _type: 'reference';
    _ref: string;
  };
  slug: {
    current: string;            // URL slug for the co-driver
  };
}

// Car represents a rally car
export interface Car {
  _id: string;
  make: string;                 // Manufacturer (e.g., "Ford", "Toyota")
  model: string;                // Model name (e.g., "Fiesta", "Yaris")
  engineCapacity: number;       // Engine size in liters
  year: number;                 // The year of manufacture
  category: string;             // The category or class of the car (e.g., "WRC", "R5")
  image?: any;                  // Image of the car
}

// Team represents a rally team
export interface Team {
  _id: string;
  name: string;                 // Name of the team
  country: string;              // Country of the team
  logo: any;                    // Logo of the team
  drivers?: {                   // List of drivers in the team
    _type: 'reference';
    _ref: string;
  }[];
  cars?: {                      // List of cars used by the team
    _type: 'reference';
    _ref: string;
  }[];
  slug: {
    current: string;            // URL slug for the team
  };
}

// RallyResult represents overall results for a rally
export interface RallyResult {
  _id: string;
  rallyId: string;              // ID of the rally
  rallyName: string;            // Name of the rally
  position: number;             // Final position of the team
  totalTime: string;            // Total time taken for the rally (e.g., "2h 30m 45s")
  gap: string;                  // Time difference to the leader (e.g., "+3m 25s")
  retired: boolean;             // Whether the team retired from the rally
  entry: {                      // Reference to the entry (team)
    _type: 'reference';
    _ref: string;
  };
  date: string;                 // Date of the result
}

// StageResult represents results for each special stage
export interface StageResult {
  _id: string;
  rally: {
    _id: string;
    title: string;
  };
  stage: {
    _id: string;
    name: string;
  };
  date: string; // ISO datetime string
  results: DriverResult[];
}

// Retirement represents information about teams retiring from a rally
export interface Retirement {
  _id: string;
  reason: string;               // Reason for retirement (e.g., "engine failure", "accident")
  rally?: {                     // Reference to the rally
    _type: 'reference';
    _ref: string;
  };
  stage: {                      // The stage during which the team retired
    _type: 'reference';
    _ref: string;
  };
  entry: {                      // The entry (team) that retired
    _type: 'reference';
    _ref: string;
  };
  date: string;                 // Date of retirement
}

// OverallStanding represents championship standings
export interface OverallStanding {
  _id: string;
  rallyId: string;              // ID of the rally
  rallyName: string;            // Name of the rally
  position: number;             // The position in the standings
  points: number;               // Total points accumulated
  entry: {                      // The entry (team) in the standings
    _type: 'reference';
    _ref: string;
  };
  date: string;                 // Date of the standings update
  standings: StandingItem[];    // List of individual standings
}

// StandingItem represents an individual entry in the championship standings
export interface StandingItem {
  position: number;             // Position in the standings
  driver: string;               // Driver name
  totalTime: string;            // Total time
  gap: string;                  // Time gap to leader
  carNumber: number;            // Car number
  points?: number;              // Points for this standing
}

// Championship represents a rally championship season
export interface Championship {
  _id: string;
  name: string;                 // Name of the championship (e.g., "WRC 2023")
  seasonStart: string;          // The start date of the season
  seasonEnd: string;            // The end date of the season
  rallies: {                    // List of rallies in the championship
    _type: 'reference';
    _ref: string;
  }[];
  slug: {
    current: string;            // URL slug for the championship
  };
}

// OnboardLink represents links to onboard videos
export interface OnboardLink {
  _id: string;
  url: string;                  // URL of the onboard video
  driver: {                     // The driver associated with the onboard video
    _type: 'reference';
    _ref: string;
  };
  rally: {                      // The rally in which the video was captured
    _type: 'reference';
    _ref: string;
  };
  stage?: {                     // The stage in which the video was captured
    _type: 'reference';
    _ref: string;
  };
  title?: string;               // Title or description of the video
}

// Penalty represents penalties applied to teams
export interface Penalty {
  _id: string;
  type: string;                 // Type of penalty (e.g., "time penalty", "retirement penalty")
  timeAdded: string;            // Time added due to the penalty (e.g., "+1m 30s")
  reason: string;               // The reason for the penalty
  entry: {                      // The entry (team) that the penalty applies to
    _type: 'reference';
    _ref: string;
  };
  stage?: {                     // The stage to which the penalty applies (if applicable)
    _type: 'reference';
    _ref: string;
  };
  dateApplied: string;          // The date when the penalty was applied
}

// DriverResult represents a single driver result within a RallyResult or StageResult
export interface DriverResult {
  position: number;
  time: string;
  gap: string;
  penalties: string;
  cumulativeTime: string;
  carNumber: number;
  status: 'finished' | 'dnf' | 'dns' | 'retired';

  driver: {
    _id: string;
    name: string;
    nationality?: string;
  };

  coDriver: {
    _id: string;
    name: string;
    nationality?: string;
  };

  car: {
    _id: string;
    make: string;
    model: string;
  };
}
