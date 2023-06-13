import { SetterOrUpdater, useRecoilState } from 'recoil';
import { dataAtom, uuidAtom } from '../store/Atoms';
import { Task } from '../utils/Interfaces';

export const useData = (): [Task[], SetterOrUpdater<Task[]>] => {
  const [data, setData] = useRecoilState(dataAtom);
  return [data, setData];
};
