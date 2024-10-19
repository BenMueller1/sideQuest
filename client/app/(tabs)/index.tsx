import { StyleSheet, FlatList, View, Modal } from "react-native";
import { EventType, InterestType } from "../../assets/types/Event";
import { events } from "../../assets/dummy";
import { Button, Card, Text } from "tamagui"; // or '@tamagui/core'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import axios from "axios";

const renderItem = ({ item }: { item: EventType }) => {
  return (
    <Card style={{ marginBottom: 10, marginHorizontal: 10 }}>
      <Card.Header>
        <Text>{item.title}</Text>
      </Card.Header>
    </Card>
  );
};

const BACKEND_URL = "http://localhost:5001";

export default function HomeScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<EventType[]>([]);

  // pull all events from backend on load
  async function fetchEvents() {
    try {
      console.log('bm - fetchEvents');
      const response = await axios.get(BACKEND_URL + "/events/all");
      const responseData = response.data;
      const eventsFromResponse = responseData.map((event: any) => {
        const interests = responseData.interests?.map((interest: any): InterestType => ({
          id: interest?.id,
          name: interest?.name,
          description: interest?.description,
        }));
        return {
          id: event.id,
          createdAt: event.createdAt ?? null,
          title: event.title ?? "",
          description: event.description ?? "",
          latitude: event.latitude ?? 0,
          longitude: event.longitude ?? 0,
          capacity: event.capacity ?? 5,
          interests: event.interests ?? [],
        }
      });
      setEvents(eventsFromResponse);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);  // Handle any errors
    }
  }

  // runs on load
  useEffect(() => {
    fetchEvents();
  }, []);

  if (isLoading) {
    return null; 
  }

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
        transparent={true}
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Hello World!</Text>
            <Button onPress={() => setIsOpen(false)}>
              <Text>Close</Text>
            </Button>
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
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    backgroundColor: "white", // Set a background color for visibility
  },
  modalContent: {
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 24,
    marginBottom: 20, // Space between text and button
  },
});
