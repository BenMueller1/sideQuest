import { ExpoRoot } from 'expo-router';
import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const PlacesAutocomplete = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder='Search'
      onPress={(data, details = null) => {
        console.log(data, details);
      }}
      query={{
        key: process.env.GOOGLE_MAPS_API,
        language: 'en',
      }}
    />
  );
};

export default PlacesAutocomplete;