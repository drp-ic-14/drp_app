import { useRecoilState } from "recoil";
import { dataAtom, uuidAtom } from "../store/Atoms"
import { Task } from "../utils/Interfaces";

export const useData = () => {
  const [data, setData] = useRecoilState(dataAtom);
  return [data, setData];
}