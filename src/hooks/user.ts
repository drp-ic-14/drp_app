import { useRecoilState } from 'recoil';
import { userAtom } from '../store/Atoms';
import { getUser } from '../api/BackEnd';
import { useUuid } from './login';

export const useUser = (): [any, () => Promise<void>] => {
  const [user, setUser] = useRecoilState(userAtom);
  const uuid = useUuid();

  const updateUser = async () => {
    const user = await getUser(uuid);
    console.log('Fetched:', user);
    setUser(user);
  };

  return [user, updateUser];
};
