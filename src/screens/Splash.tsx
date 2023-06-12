import React, { useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAsync } from 'react-use';
import * as Icons from 'react-native-heroicons/solid';

import { useFetchUuid } from '../hooks/uuid';
import { notificationPermissions } from '../features/Notifier';
import { geolocationPermissions } from '../features/Geolocation';
import { useLocation } from '../hooks/location';

type SplashProps = {
  complete: () => void;
};

const Splash = ({ complete }: SplashProps) => {
  const [uuid, uuidLoading, error, update] = useFetchUuid();
  const [, updateLoc] = useLocation();

  const setup = async () => {
    await geolocationPermissions();
    await notificationPermissions();
    await updateLoc();
  };

  const { loading: setupLoading } = useAsync(setup);

  const loading = useMemo(
    () => uuidLoading || setupLoading,
    [uuidLoading, setupLoading],
  );

  useEffect(() => {
    if (!loading && !error && uuid) {
      complete();
    }
  }, [loading, error, uuid]);

  return (
    <View className="bg-white flex-1 justify-center items-center gap-y-12">
      <Text className="text-6xl text-slate-800 font-bold text-center">
        DRP 🥶
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1e293b" className="" />
      ) : error ? (
        <View className="bg-rose-600/10 w-10/12 rounded-md align-base border border-rose-600 p-3 justify-center">
          <View className="flex-row justify-between">
            <Text
              className="text-base text-slate-800 text-center"
              style={{ includeFontPadding: false, textAlignVertical: 'center' }}
            >
              <Text className="font-bold">Setup error: </Text>
              {error.message}
            </Text>
            <TouchableOpacity
              className="bg-rose-600/10 p-1 rounded-md border border-rose-600/40"
              onPress={update}
            >
              <Icons.ArrowPathRoundedSquareIcon fill="#1e293b" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="bg-cyan-800/10 w-10/12 rounded-md align-base border border-cyan-800 p-3 justify-center">
          <View className="flex-row justify-between">
            <Text
              className="text-base text-slate-800"
              style={{ includeFontPadding: false, textAlignVertical: 'center' }}
            >
              Got UUID: {uuid}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Splash;
