import React, { useState, useEffect, useRef } from 'react';
import { Message } from '@/assets/types/Message';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { Group } from '@/assets/types/Group';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';
import { FontAwesome } from '@expo/vector-icons'; // Import for X icon


const BACKEND_URL = "http://localhost:5001";


type IndividualChatViewProps = {
  currentGroupChat: Group;
  onBackPress?: () => void;
  randomKey: number;
}

export default function IndividualChatView({
  currentGroupChat,
  onBackPress,
  randomKey
}: IndividualChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const userId = (useAuth()).userId;
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

  const socketRef = useRef<any>(null); // useRef for persistent socket instance


  // TODO i should be querying for messages from backend on this initial load!
    // TODO shouldn't be passing in from above

  const loadMessages = async () => {
    const result = await axios.get(BACKEND_URL + `/groups/messages/${currentGroupChat.id}`);
    const resultData = result.data;

    const messages: Message[] = resultData.map((message: any) => ({
      id: message.id,
      groupId: message.groupId,
      userId: message.userId,
      content: message.content,
      createdAt: message.createdAt,
      seenBy: message.seenBy ?? [],
    }));

    setMessages(messages);
  }

  // load in all usernames after messages populates
  useEffect(() => {
    console.log('inside useEffect for loading usernames');
    const loadUsernames = async () => {
      console.log('messaged when loading usernames:', JSON.stringify(messages));
      console.log("bm - loadUsernames() message userids", messages.map(msg => msg.userId));

      // Fetch usernames
      const userIds = Array.from(new Set(messages.map(msg => msg.userId)));
      const usernamePromises = userIds.map(async usrId => {
        // console.log('bm - querying for user id:', usrId);
        // console.log('bm - userId:', userId);
        if (usrId === parseInt(userId ?? "-1")) {
          return { userId: usrId, name: 'You' };
        } else if (!usrId) {
          return { userId: usrId, name: 'Unknown User' };
        } else {
          const response = await axios.get(BACKEND_URL + `/user/getUser/${usrId}`);
          return { userId: usrId, name: response.data.name ?? 'Unknown User' };
        }
      });

      const usernameResults = await Promise.all(usernamePromises);

      console.log('bm - loadUsernames() username results:', JSON.stringify(usernameResults));

      const usernameMap: { [key: string]: string } = {};

      for (const { userId: usrId, name } of usernameResults) {
        if (usrId) {
          usernameMap[usrId] = name;
        }
      }

      console.log('bm - loadUsernames() setting username map to ', JSON.stringify(usernameMap));

      setUsernames(usernameMap);
    }
    loadUsernames();
  }, [messages])

  useEffect(() => {
    const loadData = async () => {
      await loadMessages();
      
      setIsLoading(false);
    }
    loadData();
    socketRef.current = io(BACKEND_URL);

    // set up socket on initial load
    console.log('bm - individual_chat_view: Connecting to socket - roomId: ', currentGroupChat.id);
    socketRef.current.emit('join_room', currentGroupChat.id);

    socketRef.current.on('receive_message', (message: any) => {
      console.log('bm - individual_chart_vieww: Received message:', message);
      console.log('bm - individual_chat_view: setting messages to:', JSON.stringify([...messages, message]));
      setMessages((prevMessages) => [...prevMessages, message]);
    })
  
    // clean up socket (no memory leaks)
    return () => {
      socketRef.current.off('receive_message');
      socketRef.current.disconnect();
    };
  }, [currentGroupChat, randomKey]) // TODO usernames only disaply after we delete "currentGroupChat" from this array 

  const sendMessage = async () => {
    if (messageText.trim() === '') return;  // Don't send empty messages

    // const result = await axios.post(BACKEND_URL + `/groups/message`, {
    //   groupId: currentGroupChat.id,
    //   senderId: 1, // TODO replace with actual user id once we have user session storage
    //   content: messageText,
    // })
    // const resultData = result.data;

    console.log(`bm - individual_chat_view: Sending message:, \n - userId: ${userId} \n - groupId: ${currentGroupChat.id} \n - messageText: ${messageText}`);
    socketRef.current.emit('send_message', {
      content: messageText,
      senderId: userId,
      groupId: currentGroupChat.id,
    });

    // const newMessage: Message = {
    //   id: resultData.id,
    //   groupId: resultData.groupId,
    //   userId: resultData.userId,
    //   content: resultData.content,
    //   createdAt: resultData.createdAt,
    //   seenBy: resultData.seenBy,
    // };

    // Add new message to the list
    // setMessages([...messages, newMessage]);
    setMessageText('');  // Clear the input field after sending
  };

  // const renderItem = async ({ item }: {item: Message}) => {
  //   console.log(`bm - rendering message: ${JSON.stringify(item, null, 2)}`);

  //   var userName = ''
  //   if (item.userId == 1) {
  //     userName == 'you'
  //   } else {
  //     const usernameresponse = await axios.get(BACKEND_URL + `/user/${item.userId}`);
  //     console.log('usernameresponse.data' + JSON.stringify(usernameresponse.data));
  //     userName = usernameresponse.data.name ?? 'Unknown User';
  //   }

  //   console.log('bm - attempted username: ' + userName);

  //   return(<View style={styles.messageItem}>
  //     <Text style={styles.messageHeader}>
  //       <Text style={styles.messageUser}>{userName}</Text>{' '}
  //       <Text style={styles.messageTime}>{formatDistanceToNow(item.createdAt) + ' ago'}</Text>
  //     </Text>
  //     <Text style={styles.messageContent}>{item.content}</Text>
  //   </View>);
  // };

  const renderItem = ({ item }: { item: Message }) => {
    const userName = usernames[item.userId] ?? '';
    const createdAt = new Date(item.createdAt); // Ensure createdAt is a Date object

    return (
      <View style={styles.messageItem}>
        <Text style={styles.messageHeader}>
          <Text style={styles.messageUser}>{userName}</Text>{' '}
          <Text style={styles.messageTime}>{formatDistanceToNow(createdAt) + ' ago'}</Text>
        </Text>
        <Text style={styles.messageContent}>{item.content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Group Title */}
      <View style={styles.header}>
        <Text style={styles.groupTitle}>{currentGroupChat.event.title}</Text>
        <TouchableOpacity onPress={onBackPress}>
          <FontAwesome name="times" size={24} color="#fefefe" />  {/* X icon */}
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
      />

      {/* Message Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Ensures title is on the left and X button on the right
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#324C30',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: `#F5F5F5`
  },
  messagesList: {
    padding: 10,
  },
  messageItem: {
    marginBottom: 15,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageUser: {
    fontWeight: 'bold',
    fontSize: 14,
    color: `#639E5C`
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  messageContent: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  textInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#639E5C',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});