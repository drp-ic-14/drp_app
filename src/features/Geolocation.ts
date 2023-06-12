import { getRecoil } from 'recoil-nexus';

import Geolocation from '@react-native-community/geolocation';
import { locationAtom } from '../store/Atoms';
import { Location } from '../utils/Interfaces';

export const searchLocation = async (query: String): Promise<Array<any>> => {
  const loc = getRecoil(locationAtom);
  try {
    const response = await fetch(
      `http://drp-14-server.herokuapp.com/api/search_location?query=${query}&latitude=${loc.latitude}&longitude=${loc.longitude}`,
    );

    const json = await response.json();
    return json.results;
  } catch (error) {
    console.error('Failed places API request');
    console.error(error);
    return Promise.resolve([]);
  }
};

export const getCurrentPosition = async (): Promise<Location> =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => resolve({ latitude, longitude }),
      reject,
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  });

export const geolocationPermissions = async (): Promise<void> =>
  new Promise(resolve => {
    Geolocation.requestAuthorization(resolve);
  });
