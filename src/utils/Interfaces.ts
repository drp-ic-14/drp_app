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
  id: String;
  name: String;
  tasks: Task[];
  users: User[];
}

export interface User {
  id: String;
  tasks: Task[];
  groups: Group[];
}
