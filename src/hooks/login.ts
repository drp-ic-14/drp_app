import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { checkId, createUser } from '../api/BackEnd';
import { uuidAtom } from '../store/Atoms';

export enum LoginState {
  LOADING,
  INPUT,
  DONE,
}

export const loadUuidFromAsync = async (): Promise<string | undefined> => {
  try {
    const uuid = await AsyncStorage.getItem('@uuid');
    if (uuid) return uuid;
  } catch {
    // undefined
  }
  return undefined;
};

export const useLogin = (): [
  LoginState,
  string,
  (uuid: string) => Promise<void>,
] => {
  const [state, setState] = useState(LoginState.LOADING);
  const [error, setError] = useState('');
  const [, setUuid] = useRecoilState(uuidAtom);

  const postLogin = async (uuid: string) => {
    setUuid(uuid);
    await AsyncStorage.setItem('@uuid', uuid);
  };

  const login = async () => {
    const uuid = await loadUuidFromAsync();
    if (uuid && (await checkId(uuid))) {
      console.log('loaded', uuid);
      await postLogin(uuid);
      setState(LoginState.DONE);
    } else {
      setState(LoginState.INPUT);
    }
  };

  const create = async (uuid: string) => {
    try {
      setError('');
      setState(LoginState.LOADING);
      const created = await createUser(uuid);
      if (created) {
        await postLogin(uuid);
        setState(LoginState.DONE);
      } else {
        setState(LoginState.INPUT);
        setError('Username is already taken or invalid!');
      }
    } catch {
      setState(LoginState.INPUT);
      setError('An unknown error occured, please try again!');
    }
  };

  useEffect(() => {
    login();
  }, []);

  return [state, error, create];
};

export const useUuid = () => {
  const [uuid] = useRecoilState(uuidAtom);
  return uuid;
};
