import React, { useState, useEffect } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { RecoilRoot } from 'recoil';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

import { StatusBar } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Splash from './src/screens/Splash';
import Navigation from './src/screens/Navigation';
import LocationProvider from './src/components/LocationProvider';

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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AutocompleteDropdownContextProvider>
          <ApplicationProvider {...eva} theme={eva.light}>
            <LocationProvider />
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            {splash ? <Splash complete={hideSplash} /> : <Navigation />}
          </ApplicationProvider>
        </AutocompleteDropdownContextProvider>
      </GestureHandlerRootView>
    </RecoilRoot>
  );
};

export default App;

// import React, { useMemo } from 'react';
// import { View, StyleSheet } from 'react-native';
// import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// const App = () => {
//   // variables
//   const snapPoints = useMemo(() => ['25%'], []);

//   // renders
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <View style={styles.container}>
//         <BottomSheet snapPoints={snapPoints} keyboardBlurBehavior='restore' >
//           <View style={styles.contentContainer}>
//             <BottomSheetTextInput value="Awesome 🎉" style={styles.textInput} />
//           </View>
//         </BottomSheet>
//       </View>
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     backgroundColor: 'grey',
//   },
//   textInput: {
//     alignSelf: 'stretch',
//     marginHorizontal: 12,
//     marginBottom: 12,
//     padding: 12,
//     borderRadius: 12,
//     backgroundColor: 'grey',
//     color: 'white',
//     textAlign: 'center',
//   },
//   contentContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
// });

// export default App;
