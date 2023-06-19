import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRecoilState } from "recoil";
import { notificationRadiusAtom } from "../store/Atoms";
import { setRecoil } from "recoil-nexus";

const loadNotificationRadiusFromAsync = async (): Promise<number | undefined> => {
  try {
    const prox = await AsyncStorage.getItem('@prox');
    if (prox) return parseInt(prox);
  } catch {
    // undefined
  }
  return undefined;
};

export const initNotificationRadius = async (): Promise<void> => {
  let prox = await loadNotificationRadiusFromAsync();
  if (!prox) prox = 100;
  console.log("Load proximity info from async.")
  setRecoil(notificationRadiusAtom, prox);
}