import { PlaceSuggestion } from "@/assets/types/PlaceSuggestions";

interface AutocompleteProps {
  input: string,
  suggestions_callback: (suggestions: PlaceSuggestion[]) => void,
  user_location?: {
    lat: number,
    lng: number
  }
  
}
export async function PlacesAutoComplete(props : AutocompleteProps) {
  // @ts-ignore
  const { Place, AutocompleteSessionToken, AutocompleteSuggestion } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
  const {user_location, suggestions_callback,input} = props
  // Add an initial request body.
  const request = {
      input: input,
      locationBias: user_location ? {radius: 100, center: user_location} : null,
      includedPrimaryTypes: ["city"],
      language: "en-US",
      region: "us",
  };

  const token = new AutocompleteSessionToken();
  // Add the token to the request.
  // @ts-ignore
  request.sessionToken = token;
  // Fetch autocomplete suggestions.
  const { suggestions }: { suggestions: PlaceSuggestion[] } = 
  await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
  suggestions_callback(suggestions);

 

  // let place = suggestions[0].placePrediction.toPlace(); 
  // await place.fetchFields({
  //     fields: ['displayName', 'formattedAddress'],
  // });

  // const placeInfo = document.getElementById("prediction") as HTMLElement;
  // placeInfo.textContent = 'First predicted place: ' + place.displayName + ': ' + place.formattedAddress;

}

