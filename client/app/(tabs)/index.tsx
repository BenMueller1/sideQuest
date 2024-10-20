import { StyleSheet, FlatList, View, Modal, Text, Button, TouchableOpacity, Touchable } from "react-native";
import { EventType, InterestType } from "../../assets/types/Event";
import { EmbarkationType } from "../../assets/types/Embarkation";
import { events } from "../../assets/dummy";
import type { CardProps } from 'tamagui'
import { Button as TamaGuiButton, Text as TamaGuiText } from 'tamagui'
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesome } from '@expo/vector-icons'; // Import from @expo/vector-icons


const BACKEND_URL = "http://localhost:5001";

export default function HomeScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<EventType[]>([]);

  // null means no event is currently extended
  const [extendedEventId, setExtendedEventId] = useState<number | null>(null);

  const [isUserEnrolledInSelectedEvent, setIsUserEnrolledInSelectedEvent] = useState(false);
  const [currentUserEmbarkations, setCurrentUserEmbarkations] = useState<EmbarkationType[]>([]);

  // pull all events from backend on load
  async function fetchEvents() {
    try {
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
          interests: interests ?? [],
        }
      });
      setEvents(eventsFromResponse);
    } catch (error) {
      console.error('Error:', error);  // Handle any errors
    }
  }

  async function fetchEmbarkations() {
    try {
      const userId = 1; // TODO: get user ID from auth context
      const response = await axios.get(BACKEND_URL + `/user/embarkations/${userId}`);
      const responseData = response.data;
      const embarkationsFromResponse = responseData.map((embarkation: any) => {
        return {
          id: embarkation.id,
          userId: embarkation.userId,
          eventId: embarkation.eventId,
        }
      });
      setCurrentUserEmbarkations(embarkationsFromResponse);
    } catch (error) {
      console.error('Error:', error);  // Handle any errors
    }
  }

  // fetch all data on initial load
  useEffect(() => {
    const fetchData = async () => {
      await fetchEvents();
      await fetchEmbarkations();
      setIsLoading(false);
    }
    fetchData();
  }, []);


  // check whether the user is enrolled in the selected event
  useEffect(() => {
    if (extendedEventId) {
      setIsUserEnrolledInSelectedEvent(currentUserEmbarkations.some((embarkation) => embarkation.eventId === extendedEventId));
    }
  }, [extendedEventId, currentUserEmbarkations, events]);

  // const { userId, eventId, timeslots } = req.body;
  // const joinEvent = async (eventId: number) => {

  // })

  // Render each event card
  const renderExpandedItem = ({ item }: { item: EventType }) => {
    return (
      <TouchableOpacity onPress={() => {
        setExtendedEventId(null);
      }}>
        <View style={styles.expandedCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.cardCapacityContainer}>
              <Text style={styles.cardCapacity}>{item.capacity}</Text>
              <FontAwesome name="user" size={16} color="#f0f0f0" />
            </View>
          </View>
          <Text style={styles.cardDescription}>{item.description}</Text>

          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => isUserEnrolledInSelectedEvent ? unjoinEvent(item.id) : joinEvent(item.id)}
          >
            <Text style={styles.joinButtonText}>{isUserEnrolledInSelectedEvent ? ("Unjoin") : ("Join")}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: EventType }) => {
    return (
      <TouchableOpacity onPress={() => {
        setExtendedEventId(item.id);
      }}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.cardCapacityContainer}>
              <Text style={styles.cardCapacity}>{item.capacity}</Text>
              <FontAwesome name="user" size={16} color="#f0f0f0" /> {/* User icon from @expo/vector-icons */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const renderListItem = ({ item }: { item: EventType }) => {
    if (item.id === extendedEventId) {
      return renderExpandedItem({ item });
    } else {
      return renderItem({ item });
    }
  }

  const unjoinEvent = async (eventId: number) => {
    try {
      const emarkIdToDelete = currentUserEmbarkations.find((embarkation) => embarkation.eventId === eventId)?.id;
      const response = await axios.delete(BACKEND_URL + `/events/embark/${emarkIdToDelete}`)

      fetchEmbarkations();

    } catch (error) {
      console.error('Error:', error);  // Handle any errors
    }
  }

  const joinEvent = async (eventId: number) => {
    try {
      const userId = 1; // TODO: get user ID from auth context
      const response = await axios.post(BACKEND_URL + `/events/embark`, {
        userId,
        eventId,
      });
      
      fetchEmbarkations();
    } catch (error) {
      console.error('Error:', error);  // Handle any errors
    }
  }
  
  if (isLoading) {
    return null; 
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderListItem}
      />

      <TamaGuiButton
        style={styles.floatingButton}
        backgroundColor="black"
        circular
        size={40}
        onPress={() => setIsOpen(true)}
      >
        <TamaGuiText color="white" style={styles.buttonText}>
          +
        </TamaGuiText>
      </TamaGuiButton>

      <Modal
        transparent={true}
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Hello World!</Text>
            <TamaGuiButton onPress={() => setIsOpen(false)}>
              <Text>Close</Text>
            </TamaGuiButton>
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
  card: {
    fontFamily: 'Arial',  // Use system font
    backgroundColor: '#639E5C',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  expandedCard: {
    fontFamily: 'Arial',  // Use system font
    backgroundColor: '#639E5C',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f0f0f0',
  },
  cardDescription: {
    fontSize: 14,
    color: '#f0f0f0',
    marginTop: 5,
    marginBottom: 5,
  },
  cardCapacity: {
    fontSize: 12,
    color: '#f0f0f0',
    marginRight: 5,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCapacityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collapseButton: {
    marginTop: 10,
    backgroundColor: '#333',
  },
  collapseButtonContainer: {
    alignSelf: 'flex-start',  // Align the button to the left
    marginTop: 5,
  },
  joinButton: {
    backgroundColor: '#f0f0f0',  // Light gray background
    paddingVertical: 5,          // Smaller vertical padding
    paddingHorizontal: 10,       // Standard horizontal padding
    borderRadius: 5,             // Rounded corners
    alignSelf: 'flex-start',     // Align the button to the left
    marginVertical: 5,
  },
  joinButtonText: {
    color: '#639E5C',            // Green text color
    fontSize: 12,                // Smaller font size
    fontWeight: 'bold',
  },
});
