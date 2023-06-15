import { getRecoil } from 'recoil-nexus';

import Geolocation from '@react-native-community/geolocation';
import { locationAtom } from '../store/Atoms';
import { Location } from '../utils/Interfaces';
import { BACK_END_URL } from '../api/Constants';
import { PERMISSIONS, request } from 'react-native-permissions';
import { PermissionsAndroid, Platform } from 'react-native';

export const searchLocation = async (query: String): Promise<Array<any>> => {
  const loc = getRecoil(locationAtom);
  try {
    const response = await fetch(
      `${BACK_END_URL}/api/search_location?query=${query}&latitude=${loc.latitude}&longitude=${loc.longitude}`,
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
        enableHighAccuracy: true,
        timeout: 30000,
        // maximumAge: 1000,
      },
    );
  });

export const geolocationPermissions = async (): Promise<void> => {
  // await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
  return new Promise(resolve => {
    Geolocation.requestAuthorization(async () => {
      if (Platform.OS !== 'ios') {
        console.log('req bg perm');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: 'Background Location Access Required',
            message: 'This App needs to Access your background location',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log('bg perm => ', granted);
      }
      resolve();
    });
  });
};
