import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useSplash } from '../hooks/splash';

type SplashProps = {
  complete: () => void;
};

const Splash = ({ complete }: SplashProps) => {
  const [status, loading, error] = useSplash();

  useEffect(() => {
    if (!loading && !error) {
      complete();
    }
  }, [loading, error]);

  return (
    <View className="bg-white flex-1 justify-center items-center gap-y-12">
      <Text className="text-6xl text-slate-800 font-bold text-center">
        DRP 🥶
      </Text>
      {loading ? (
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
              {/* <TouchableOpacity className="bg-rose-600/10 p-1 rounded-md border border-rose-600/40">
                <Icons.ArrowPathRoundedSquareIcon fill="#1e293b" />
              </TouchableOpacity> */}
            </View>
          </View>
        )
      )}
    </View>
  );
};

export default Splash;
