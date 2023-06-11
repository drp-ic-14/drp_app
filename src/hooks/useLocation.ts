import Geolocation from '@react-native-community/geolocation';
import { atom, useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { Location } from '../utils/Interfaces';

const locationAtom = atom({
  key: 'location',
  default: { longitude: 0, latitude: 0 },
});

export const useLocation = (): [Location, () => void] => {
  const [location, setLocation] = useRecoilState(locationAtom);

  const update = () => {
    Geolocation.getCurrentPosition(
      ({ coords: { longitude, latitude } }) =>
        setLocation({ longitude, latitude }),
      () => {},
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
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
      e => {console.log(e)},
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
      },
    );

    return () => {
      console.log("Cleanup");
      Geolocation.clearWatch(watchId);
    };
  }, []);

  return loading;
};
