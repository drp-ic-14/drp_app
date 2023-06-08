export interface Task {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  lastNotified?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}
