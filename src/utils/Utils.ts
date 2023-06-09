import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACK_END_URL } from '../api/Constants';

// acos(sin(lat1)*sin(lat2)+cos(lat1)*cos(lat2)*cos(lon2-lon1))*6371
export const distance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

export const sleep = (time: any) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), time);
  });

export const getUuid = async (): Promise<string> => {
  try {
    const uuid = await AsyncStorage.getItem('@uuid');
    if (uuid) return uuid;
  } catch {
    // Handled by fall through
  }

  const response = await fetch(`${BACK_END_URL}/api/generate_id`);

  if (response.ok) {
    const { id }: { id: string } = await response.json();
    console.log('Fetched new UUID: ', id);

    await AsyncStorage.setItem('@uuid', id);
    return id;
  }

  throw new Error('Failed to get UUID');
};
