export interface Task {
  id: string;
  name: string;
  location: string;
  vicinity: String;
  latitude: number;
  longitude: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Group {
  id: string;
  name: string;
  tasks: Task[];
  users: User[];
}

export interface User {
  id: string;
  tasks: Task[];
  groups: Group[];
}
