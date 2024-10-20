import { StyleSheet, FlatList, View, Modal, Text, Button, TouchableOpacity, Touchable } from "react-native";
import { events } from "../../assets/dummy";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesome } from '@expo/vector-icons'; // Import from @expo/vector-icons
import { Group } from "../../assets/types/Group";
import { Message } from "../../assets/types/Message";
import { EventType, InterestType } from "../../assets/types/Event";
import { formatDistanceToNow } from 'date-fns';


const BACKEND_URL = "http://localhost:5001";

export default function ChatPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<Group | null>(null);
  
  const [userGroups, setUserGroups] = useState<Group[]>([]);

  const fetchCurrentUserGroups = async () => {
    try {
      const userId = 1; // TODO replace with actual user id once we have user session storage

      // fetch groups
      const groupResponseData = (await axios.get(BACKEND_URL + `/groups/user/${userId}`)).data;

      console.log(`bm - groupResponseData: ${groupResponseData}`);

      const groups: Group[] = await Promise.all(groupResponseData.map(async (groupData: any) => {
        console.log(`bm - groupData: ${groupData}`);
        console.log('bm - making event request to', BACKEND_URL + `/events/${groupData.eventId}`);
        const event: any = (await axios.get(BACKEND_URL + `/events/${groupData.eventId}`)).data;

        const group: Group = {
          id: groupData.id,
          event: {
            id: event.id,
            createdAt: event.createdAt ?? null,
            title: event.title ?? "",
            description: event.description ?? "",
            latitude: event.latitude ?? 0,
            longitude: event.longitude ?? 0,
            capacity: event.capacity ?? 5,
            interests: event.interests ?? [],
          },
          users: groupData.users?.map((user: any) => user.id) ?? [],
          messages: groupData.messages?.map((message: any) => ({
            id: message.id,
            groupId: message.groupId,
            userId: message.userId,
            content: message.content,
            createdAt: message.createdAt,
            seenBy: message.seenBy?.map((user: any) => user.id) ?? [],
          })) ?? [],
        }

        return group;
      }));

      // order groups by most recent message
      // if a group has no messages, it should be at the bottom
      groups.sort((a: Group, b: Group) => {
        const aLastMessage = a.messages.length > 0 ? a.messages[a.messages.length - 1].createdAt : new Date(0);
        const bLastMessage = b.messages.length > 0 ? b.messages[b.messages.length - 1].createdAt : new Date(0);
        return bLastMessage.getTime() - aLastMessage.getTime();
      });

      console.log('bm  HERE???')
      console.log(`bm - groups: ${JSON.stringify(groups, null, 2)}`);

      setUserGroups(groups);
    } catch(e) {
      console.error('Error:', e);
    }
  }

  const handleChatPress = (groupId: number) => {

  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchCurrentUserGroups();
      setIsLoading(false);
    }
    fetchData();
  }, [])

  const renderItem = ({ item }: { item: Group }) => {
    const event = item.event;
    const userId = 1; // TODO replace with actual user id once we have user session storage
    const unseenMessagesCount = item.messages.filter((message: Message) => !message.seenBy.includes(userId)).length;
    const formattedDateString = item.messages.length > 0
      ? formatDistanceToNow(new Date(item.messages[item.messages.length - 1].createdAt), { addSuffix: true })
      : '';

    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item.id)}>
        <View>
          <Text style={styles.chatName}>{event.title}</Text>
          <Text style={styles.lastMessage}>
            {unseenMessagesCount > 0 ? `${unseenMessagesCount} new messages` : formattedDateString}
          </Text>
        </View>
        <Text style={styles.chatTime}>{formattedDateString}</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) { return; }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={userGroups}
        keyExtractor={(item: any) => {
          return item.id.toString()
        }}
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