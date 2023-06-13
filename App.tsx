import React, { useState, useEffect } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { StatusBar } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Splash from './src/screens/Splash';
import Navigation from './src/screens/Navigation';
import LocationProvider from './src/components/LocationProvider';
import { BACK_END_WS } from './src/api/Constants';

// Initialize Apollo Client
const wsLink = new GraphQLWsLink(
  createClient({
    url: `${BACK_END_WS}/graphql`,
  }),
);

const client = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache(),
});

const App = () => {
  const [splash, setSplash] = useState(true);

  const hideSplash = () => {
    setSplash(false);
  };

  useEffect(() => {
    changeNavigationBarColor('#ffffff');
  });

  return (
    <RecoilRoot>
      <RecoilNexus />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ApolloProvider client={client}>
          <AutocompleteDropdownContextProvider>
            <ApplicationProvider {...eva} theme={eva.light}>
              <StatusBar barStyle="dark-content" backgroundColor="white" />
              {splash ? <Splash complete={hideSplash} /> : <Navigation />}
              <LocationProvider />
            </ApplicationProvider>
          </AutocompleteDropdownContextProvider>
        </ApolloProvider>
      </GestureHandlerRootView>
    </RecoilRoot>
  );
};

export default App;
