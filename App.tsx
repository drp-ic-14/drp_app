import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { RecoilRoot } from 'recoil';

import Splash from './src/screens/Splash';
import Navigation from './src/screens/Navigation';

const App = () => {
  const [splash, setSplash] = React.useState(true);

  const hideSplash = () => {
    setSplash(false);
  };

  return (
    <RecoilRoot>
      <ApplicationProvider {...eva} theme={eva.light}>
        {splash ? <Splash complete={hideSplash} /> : <Navigation />}
      </ApplicationProvider>
    </RecoilRoot>
  );
};

export default App;
