import { useRecoilState } from 'recoil';
import { uuidAtom } from '../store/Atoms';

export const useUuid = () => {
  const [uuid] = useRecoilState(uuidAtom);
  return uuid;
};
