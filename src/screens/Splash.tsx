import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useRecoilState } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { useSplash } from '../hooks/splash';
import Login from './Login';
import { uuidAtom } from '../store/Atoms';
import { loadUuidFromAsync } from '../hooks/uuid';
import { checkId } from '../api/BackEnd';

type SplashProps = {
  complete: () => void;
};

const Splash = ({ complete }: SplashProps) => {
  const [status, loading, error] = useSplash();
  const [login, setLogin] = useState(false);

  const handleLogin = async (uuid: string) => {
    setRecoil(uuidAtom, uuid);
    setLogin(true);
  };

  useEffect(() => {
    const loadId = async () => {
      const id = await loadUuidFromAsync();
      if (id) {
        console.log(`id ${id} found in async`);
        if (await checkId(id)) {
          console.log(`id ${id} is valid.`);
          await handleLogin(id);
        } else {
          console.log(`id ${id} is invalid.`);
        }
      }
    };

    loadId();
  }, []);

  useEffect(() => {
    if (!loading && login && !error) {
      complete();
    }
  }, [loading, login, error]);

  return (
    <View className="bg-white flex-1 justify-center items-center gap-y-12">
      <Text className="text-6xl text-slate-800 font-bold text-center">
        DRP 🥶
      </Text>
      {login ? (
        loading ? (
          <View className="flex-row justify-center items-center space-x-4">
            <ActivityIndicator size="large" color="#1e293b" className="" />
            <Text className="text-lg text-slate-900">{status}</Text>
          </View>
        ) : (
          !!error && (
            <View className="bg-rose-600/10 w-10/12 rounded-md align-base border border-rose-600 p-3 justify-center">
              <View className="flex-row justify-between">
                <Text
                  className="text-base text-slate-800 text-center"
                  style={{
                    includeFontPadding: false,
                    textAlignVertical: 'center',
                  }}
                >
                  <Text className="font-bold">Setup error: </Text>
                  {error.message}
                </Text>
              </View>
            </View>
          )
        )
      ) : (
        <Login submitLogin={handleLogin} />
      )}
    </View>
  );
};

export default Splash;
