export interface Task {
  id: string;
  name: string;
  location: string;
  vicinity: String;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}
