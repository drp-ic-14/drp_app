import React, { useEffect } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { RecoilRoot } from 'recoil';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

import { StatusBar } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Splash from './src/screens/Splash';
import Navigation from './src/screens/Navigation';

const App = () => {
  const [splash, setSplash] = React.useState(true);

  const hideSplash = () => {
    setSplash(false);
  };

  useEffect(() => {
    changeNavigationBarColor('#ffffff');
  });

  return (
    <RecoilRoot>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AutocompleteDropdownContextProvider>
          <ApplicationProvider {...eva} theme={eva.light}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            {splash ? <Splash complete={hideSplash} /> : <Navigation />}
          </ApplicationProvider>
        </AutocompleteDropdownContextProvider>
      </GestureHandlerRootView>
    </RecoilRoot>
  );
};

export default App;
