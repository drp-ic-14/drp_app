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

export const dataAtom = atom<Task[]>({
  key: 'data',
  default: []
})
