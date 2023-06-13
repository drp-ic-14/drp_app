import { useRecoilState } from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { uuidAtom } from '../store/Atoms';
import { checkId, createUser } from '../api/BackEnd';

export const loadUuidFromAsync = async (): Promise<string | undefined> => {
  try {
    const uuid = await AsyncStorage.getItem('@uuid');
    if (uuid) return uuid;
  } catch {
    // undefined
  }
};

export const handleNoUuid = async (uuid: string): Promise<void> => {
  if (await checkId(uuid)) {
    console.log('no uuid handled - id exists, log in');
  } else {
    console.log('no uuid handled - creating new');
    await createUser(uuid);
    console.log('no uuid handled - created new');
  }
};

export const useUuid = () => {
  const [uuid] = useRecoilState(uuidAtom);
  return uuid;
};
