import Geolocation from '@react-native-community/geolocation';
import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { Location } from '../utils/Interfaces';
import { locationAtom } from '../store/Atoms';
import { getCurrentPosition } from '../features/Geolocation';

export const useLocation = (): [Location, () => Promise<void>] => {
  const [location, setLocation] = useRecoilState(locationAtom);

  const update = async () => {
    const { longitude, latitude } = await getCurrentPosition();
    setLocation({ longitude, latitude });
  };

  return [location, update];
};

export const useSetupLocation = (): boolean => {
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useRecoilState(locationAtom);
  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      ({ coords: { longitude, latitude } }) => {
        console.log('Found loc', longitude, latitude);
        setLocation({ longitude, latitude });
        setLoading(false);
      },
      e => {
        console.log(e);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
      },
    );

    return () => {
      console.log('Cleanup location watch');
      Geolocation.clearWatch(watchId);
    };
  }, []);

  return loading;
};
