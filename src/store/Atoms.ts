import { atom } from 'recoil';

export const locationAtom = atom({
  key: 'location',
  default: { longitude: 0, latitude: 0 },
});

export const uuidAtom = atom<string>({
  key: 'uuid',
  default: '',
});
