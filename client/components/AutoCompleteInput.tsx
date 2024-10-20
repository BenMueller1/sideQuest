import React from 'react';
import { GooglePlacesAutocomplete, Point } from 'react-native-google-places-autocomplete';
import { StyleSheet } from 'react-native';

interface props {
    updateEventPlace : React.Dispatch<React.SetStateAction<string>>,
    updateEventLocation : React.Dispatch<React.SetStateAction<Point | undefined>>
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
        const location  = details?.geometry.location;
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
    backgroundColor: '#324C30',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
  textInput: {
    height: 40, // Match height with other inputs
    paddingLeft: 10,
    borderColor: 'gray', // Match border color
    backgroundColor: '#324C30',
    color: '#FFFFFF',
  },
  listView: {
    backgroundColor: 'white', // Make sure dropdown background matches
    maxHeight: 200, // Optional: limit height of suggestions
  },
});

export default AutoCompleteInput;
