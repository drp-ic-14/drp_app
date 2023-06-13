import { useState } from 'react';
import { useAsync } from 'react-use';

import { PERMISSIONS, check } from 'react-native-permissions';
import { Platform } from 'react-native';
import { useLocation } from './location';
import { geolocationPermissions } from '../features/Geolocation';
import { notificationPermissions } from '../features/Notifier';
import { sleep } from '../utils/Utils';

export const useSplash = (): [string, boolean, Error | undefined] => {
  const [status, setStatus] = useState('');
  const [, updateLoc] = useLocation();

  const setup = async () => {
    setStatus('Getting permissions');
    if (Platform.OS === 'ios') {
      const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (status != 'granted') {
        await geolocationPermissions();
      }
    } else {
      await geolocationPermissions();
    }
    await notificationPermissions();
    await sleep(300);

    setStatus('Getting location');
    await updateLoc();
    await sleep(300);
  };

  const { loading, error } = useAsync(setup);

  return [status, loading, error];
};
