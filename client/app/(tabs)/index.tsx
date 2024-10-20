import { StyleSheet, FlatList, View, Modal, Pressable } from "react-native";
import { EventType } from "../../assets/types/Event";
import { events } from "../../assets/dummy";
import {
  Card,
  Text,
  Button,
  Input,
  XStack,
  H4,
  YStack,
  TextArea,
  ScrollView,
} from "tamagui"; // or '@tamagui/core'
import { SafeAreaView } from "react-native-safe-area-context";
// import { PlacesAutoComplete } from "@/components/PlacesAutoComplete";
import { useState } from "react";
import { PlaceSuggestion } from "@/assets/types/PlaceSuggestions";
import AutoCompleteInput from "@/components/AutoCompleteInput";
import { Point } from "react-native-google-places-autocomplete";

type Location = {
  lat: number; // Latitude
  lng: number; // Longitude
};
const renderItem = ({ item }: { item: EventType }) => {
  return (
    <Card style={{ marginBottom: 10, marginHorizontal: 10 }}>
      <Card.Header>
        <Text>{item.title}</Text>
      </Card.Header>
    </Card>
  );
};

export default function HomeScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [eventLocation, setEventLocation] = useState<Point>();
  const [eventDetails, setEventDetails] = useState("");


  const handleSubmit = () => {
    // Handle form submission
    console.log("Event Name:", eventName);
    console.log("Event Location:", eventLocation);
    // Optionally reset the fields
    setEventName("");
    setEventLocation(undefined);
    setEventDetails("");
    setIsOpen(false); // Close the modal after submission
  };


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <Button
        style={styles.floatingButton}
        backgroundColor="black"
        circular
        size={40}
        onPress={() => setIsOpen(true)}
      >
        <Text color="white" style={styles.buttonText}>
          +
        </Text>
      </Button>

      <Modal
        transparent={false}
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Create New Event</Text>

            <YStack>
              <XStack flexWrap="wrap">
                <H4 size={25} themeInverse>
                  I want to{" "}
                </H4>
                <Input
                  style={styles.modalInput}
                  placeholder="slay dragons"
                  value={eventName}
                  onChangeText={setEventName}
                />
                <H4 size={25} themeInverse>
                  {" "}
                  at{" "}
                </H4>
                <AutoCompleteInput updateEventLocation={setEventLocation} updateEventPlace={setEventPlace}/>
               
              </XStack>

              <TextArea
                style={styles.modalTextArea}
                placeholder="Enter more details..."
                onChangeText={setEventDetails}
              />
            </YStack>

            <Button onPress={handleSubmit}>Post Quest!</Button>
          </View>
        </SafeAreaView>
      </Modal>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -30 }],
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  buttonText: {
    fontSize: 24,
    lineHeight: 60,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  modalContent: {
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 24,
    marginBottom: 20,
  },
  modalInput: {
    padding: 0,
    transform: [{ translateY: -5 }],
  },
  modalTextArea: {
    backgroundColor: "#8A5A08",
    minWidth: 300
  },
});
