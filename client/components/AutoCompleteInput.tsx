import React from 'react';
import { GooglePlacesAutocomplete, Point } from 'react-native-google-places-autocomplete';
import { StyleSheet } from 'react-native';
type Location = {
    lat: number; // Latitude
    lng: number; // Longitude
  };
interface props {
    updateEventPlace : React.Dispatch<React.SetStateAction<string>>,
    updateEventLocation : React.Dispatch<React.SetStateAction<Location | undefined>>
}
const AutoCompleteInput = (props : props) => {
    const {updateEventPlace, updateEventLocation} = props;
  return (
    <GooglePlacesAutocomplete
      placeholder='the castle'
      fetchDetails
      onPress={(data, details) => {
        // Handle selected place
        console.log(data);
        const mainText = data.structured_formatting.main_text;
        updateEventPlace(mainText);
        const location = details?.geometry.location as any as Location;
        updateEventLocation(location);
      }}
      query={{
        key: process.env.GOOGLE_MAPS_API,
        language: 'en',
      }}
      styles={{
        container: styles.autocompleteContainer,
        textInputContainer: styles.textInputContainer,
        textInput: styles.textInput,
        listView: styles.listView,
      }}
    />
  );
};

const styles = StyleSheet.create({
  autocompleteContainer: {
    marginVertical: 10, // Add vertical margin for spacing
    minWidth: 300,
    color: '#FFFFFF',
  },
  textInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
  },
  textInput: {
    height: 40, // Match height with other inputs
    paddingLeft: 10,
    borderColor: 'gray', // Match border color
    backgroundColor: '#FFFFFF',
    color: '#324C30',
  },
  listView: {
    backgroundColor: '#DED190', // Make sure dropdown background matches
    maxHeight: 200, // Optional: limit height of suggestions
  },
  row: {
    backgroundColor: '#DED190'
  }
});

export default AutoCompleteInput;
