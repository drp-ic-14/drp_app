// import { useState, useEffect } from 'react';
// import { useRecoilState } from 'recoil';
// import { useAsyncFn } from 'react-use';

// import { uuidAtom } from '../store/Atoms';
// import { getUuid } from '../utils/Utils';

// const Splash = () => {
//   const [uuid, setUuid] = useState<string | null>(null);
//   const [, setUuid] = useRecoilState(uuidAtom);

//   useEffect(() => {
//     check();
//   }, []);

//   const check = async () => {
//     const id = await getUuid();
//     if (!id) {
//       // setSplash(false);
//       // Failed to get a UUID, show an error
//     } else {
//       setUuid(id);
//       complete();
//     }
//   };
// };

// export default Splash;
