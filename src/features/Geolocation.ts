import { getRecoil } from 'recoil-nexus';

import Geolocation from '@react-native-community/geolocation';
import { locationAtom } from '../store/Atoms';
import { Location } from '../utils/Interfaces';

export const searchLocation = async (keyword: String): Promise<Array<any>> => {
  const loc = getRecoil(locationAtom);
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=${keyword}&location=${loc.latitude}%2C${loc.longitude}&radius=1000&key=AIzaSyCe4_m0Axs6LanGk8u8ZQzX19yiM9ITyDM`,
    );
    const json = await response.json();
    return json.results;
  } catch (error) {
    console.warn(error);
    return Promise.resolve([]);
  }
};

export const getCurrentPosition = async (): Promise<Location> =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => resolve({ latitude, longitude }),
      reject,
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  });

export const geolocationPermissions = async (): Promise<void> =>
  new Promise(resolve => {
    Geolocation.requestAuthorization(resolve);
  });
