import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { checkId, createUser, getUser, generateUuid } from '../api/BackEnd';
import { userAtom, uuidAtom } from '../store/Atoms';

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

const verifyUsername = (username: string) => {
  // TODO: split rules and return exact error
  const regex = /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
  const valid = regex.test(username);
  console.log(`${username} is ${valid ? "valid" : "invalid"}`)
  return valid;
}

export const useLogin = (): [
  LoginState,
  string,
  (uuid: string) => Promise<void>,
] => {
  const [state, setState] = useState(LoginState.LOADING);
  const [error, setError] = useState('');
  const [, setUuid] = useRecoilState(uuidAtom);
  const [, setUser] = useRecoilState(userAtom);

  const postLogin = async (uuid: string) => {
    setUuid(uuid);
    await AsyncStorage.setItem('@uuid', uuid);
    const user = await getUser(uuid);
    console.log('Fetched:', user);
    setUser(user);
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
      if (uuid === '') {
        // blank input - generate uuid
        uuid = await generateUuid();
        await postLogin(uuid);
      } else {
        // verify username is allowed and send to back-end to create user
        if (verifyUsername(uuid)) {
          const created = await createUser(uuid);
          console.log(`create ${uuid}`)
          if (created) {
            await postLogin(uuid);
            setState(LoginState.DONE);
          } else {
            setState(LoginState.INPUT);
            setError('Username is already taken!'); // TODO: write message on valid usernames
          }
        } else {
          setState(LoginState.INPUT);
          setError('Username is invalid!\nUsername must contain 5-20 alphanumeric, underscore or dot characters.\nUsername cannot start or end with an underscore or dot.');
        }
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
