export type PlaceSuggestion = {
    placePrediction: {
      place: string;
      placeId: string;
      text: {
        text: string;
        matches: Array<{
          startOffset?: number;
          endOffset: number;
        }>;
      };
      structuredFormat: {
        mainText: {
          text: string;
          matches: Array<{
            startOffset?: number;
            endOffset: number;
          }>;
        };
        secondaryText: {
          text: string;
        };
      };
      types: string[];
    };
  };
  
