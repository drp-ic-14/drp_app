import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useAsyncFn } from 'react-use';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { uuidAtom } from '../store/Atoms';
import { sleep } from '../utils/Utils';
import { BACK_END_URL } from '../api/Constants';

const loadUuid = async (): Promise<string> => {
  try {
    const uuid = await AsyncStorage.getItem('@uuid');
    if (uuid) return uuid;
  } catch {
    // Handled by fall through
  }

  const response = await fetch(`${BACK_END_URL}/api/generate_id`);

  if (response.ok) {
    const { id }: { id: string } = await response.json();
    console.log('Fetched new UUID: ', id);

    await AsyncStorage.setItem('@uuid', id);
    return id;
  }

  throw new Error('Failed to get UUID');
};

export const useFetchUuid = (): [
  string,
  boolean,
  Error | undefined,
  () => Promise<void>,
] => {
  const [uuid, setUuid] = useRecoilState(uuidAtom);

  const [{ loading, error }, update] = useAsyncFn(async () => {
    const id = await loadUuid();
    setUuid(id);
  });

  // useEffect(() => {
  //   update();
  // }, []);

  return [uuid, loading, error, update];
};

export const useUuid = () => {
  const [uuid] = useRecoilState(uuidAtom);
  return uuid;
};
