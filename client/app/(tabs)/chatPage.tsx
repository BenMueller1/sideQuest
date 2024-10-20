import { StyleSheet, FlatList, View, Modal, Text, Button, TouchableOpacity, Touchable } from "react-native";
import { events } from "../../assets/dummy";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesome } from '@expo/vector-icons'; // Import from @expo/vector-icons
import { Group } from "../../assets/types/Group";
import { Message } from "../../assets/types/Message";
import { EventType, InterestType } from "../../assets/types/Event";

const BACKEND_URL = "http://localhost:5001";

export default function ChatPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<Group | null>(null);
  
  const [groups, setGroups] = useState<Group[]>([]);

  const fetchCurrentUserGroups = async () => {
    try {
      // fetch groups


      // for each group, parse the messages into my message types then parse the group itself


      // also parse the event up here instead
      // const event: EventType = {
      //   id: eventResponseData.id,
      //   createdAt: eventResponseData.createdAt ?? null,
      //   title: eventResponseData.title ?? "",
      //   description: eventResponseData.description ?? "",
      //   latitude: eventResponseData.latitude ?? 0,
      //   longitude: eventResponseData.longitude ?? 0,
      //   capacity: eventResponseData.capacity ?? 5,
      //   interests: eventResponseData.interests ?? [],
      // }
    } catch(e) {
      console.error('Error:', e);
    }
  }

  const handleChatPress = (groupId: number) => {

  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchCurrentUserGroups();
    }
    fetchData();
  })

  const renderItem = async ({ group }: { group: Group }) => {
    const eventResponseData = ((await axios.get(BACKEND_URL + `/events/${group.eventId}`)).data);
    

    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(group.id)}>
        <View>
          <Text style={styles.chatName}>{event.title}</Text>
          <Text style={styles.lastMessage}>
            {group.newMessages > 0 ? `${group.newMessages} new messages` : group.lastMessage}
          </Text>
        </View>
        <Text style={styles.chatTime}>{group.time}</Text>
      </TouchableOpacity>
    )
};

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatList: {
    padding: 10,
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
});