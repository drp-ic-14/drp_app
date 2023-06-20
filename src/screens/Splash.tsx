import React, { useEffect, useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { useSplash } from '../hooks/splash';
import Login from '../components/Login';
import { LoginState, useLogin } from '../hooks/login';

type SplashProps = {
  complete: () => void;
};

const Splash = ({ complete }: SplashProps) => {
  const [status, loading, error] = useSplash();
  const [login, loginError, create] = useLogin();

  useEffect(() => {
    if (!loading && login === LoginState.DONE && !error) {
      complete();
    }
  }, [status, loading, error, login, loginError]);

  const display = useMemo(() => {
    if (loading) {
      return (
        <View className="flex-row justify-center items-center space-x-4">
          <ActivityIndicator size="large" color="#1e293b" className="" />
          <Text className="text-lg text-slate-900">{status}</Text>
        </View>
      );
    }

    if (error) {
      return (
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
      );
    }

    if (login !== LoginState.DONE) {
      return <Login state={login} error={loginError} create={create} />;
    }

    return null;
  }, [status, loading, error, login, loginError]);

  return (
    <View className="bg-white flex-1 justify-center items-center space-y-12">
      <Text className="text-6xl text-slate-800 font-bold text-center">
        TasksOnTheGo
      </Text>
      {display}
    </View>
  );
};

export default Splash;
