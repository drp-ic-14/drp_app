import React, { memo, useCallback, useRef, useState } from 'react';
import { Dimensions, Text, Platform } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import * as Icons from 'react-native-heroicons/outline';

import { searchLocation } from '../features/Geolocation';

const LocationAutocomplete = memo(({setLocation}) => {
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(null);
  const dropdownController = useRef(null);

  const searchRef = useRef(null);

  const getSuggestions = useCallback(async q => {
    if (typeof q !== 'string' || q.length < 3) {
      setSuggestionsList(null);
      return;
    }
    setLoading(true);

    const query = q.toLowerCase();
    console.log('Fetching suggestions for ', query);
    const places = await searchLocation(query);

    const suggestions = places.map(
      ({ place_id, name, vicinity, geometry }) => ({
        id: place_id,
        title: `${name}, ${vicinity}`,
        geometry,
      }),
    );

    console.log('Got suggestions', suggestions);
    setSuggestionsList(suggestions);

    setLoading(false);
  }, []);

  const onClearPress = useCallback(() => {
    setSuggestionsList(null);
  }, []);

  const onOpenSuggestionsList = useCallback(isOpened => {}, []);

  return (
    <AutocompleteDropdown
      ref={searchRef}
      controller={controller => {
        dropdownController.current = controller;
      }}
      direction={Platform.select({ ios: 'down' })}
      dataSet={suggestionsList}
      onChangeText={getSuggestions}
      onSelectItem={item => {
        item && setLocation(item);
      }}
      debounce={600}
      suggestionsListMaxHeight={Dimensions.get('window').height * 0.2}
      onClear={onClearPress}
      onOpenSuggestionsList={onOpenSuggestionsList}
      loading={loading}
      useFilter={false}
      textInputProps={{
        placeholder: 'Location...',
        autoCorrect: false,
        autoCapitalize: 'none',
        style: {
          color: '#0F172A',
        },
      }}
      inputContainerStyle={{
        backgroundColor: '#E5E5E5',
        borderRadius: 12,
        paddingLeft: 8,
        paddingRight: 4,
      }}
      suggestionsListContainerStyle={{
        backgroundColor: '#E5E5E5',
        borderRadius: 12,
      }}
      containerStyle={{ flexGrow: 1, flexShrink: 1 }}
      renderItem={item => (
        <Text style={{ color: '#0F172A', padding: 15 }}>{item.title}</Text>
      )}
      ClearIconComponent={<Icons.XCircleIcon stroke="#0F172A" />}
      inputHeight={50}
      showChevron={false}
      closeOnBlur
    />
  );
});

export default LocationAutocomplete;
