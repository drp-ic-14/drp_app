import { atom } from 'recoil';
import { Task } from '../utils/Interfaces';

export const locationAtom = atom({
  key: 'location',
  default: { longitude: 0, latitude: 0 },
});

export const uuidAtom = atom<string>({
  key: 'uuid',
  default: '',
});

export const userAtom = atom({
  key: 'user',
  default: {
    id: '',
    tasks: [],
    groups: [],
  },
});

export const lastNotifiedAtom = atom<Map<string, number>>({
  key: 'last-notified',
  default: new Map<string, number>(),
});
