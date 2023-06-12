import { useState } from 'react';
import { useAsync } from 'react-use';

import { useFetchUuid } from './uuid';
import { useLocation } from './location';
import { geolocationPermissions } from '../features/Geolocation';
import { notificationPermissions } from '../features/Notifier';
import { sleep } from '../utils/Utils';

export const useSplash = (): [
  string,
  boolean,
  Error | undefined,
] => {
  const [status, setStatus] = useState('');
  const [, , errorUuid, updateUuid] = useFetchUuid();
  const [, updateLoc] = useLocation();

  const setup = async () => {
    setStatus('Getting user account');
    await updateUuid();
    await sleep(300);
    setStatus('Getting permissions');
    await geolocationPermissions();
    await notificationPermissions();
    await sleep(300);
    setStatus('Getting location');
    await updateLoc();
    await sleep(300);
  };

  const { loading, error: error } = useAsync(setup);

  return [status, loading, error];
};
