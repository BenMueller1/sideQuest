import React, { useState, useEffect } from 'react';
import { Message } from '@/assets/types/Message';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { Group } from '@/assets/types/Group';
import axios from 'axios';

const BACKEND_URL = "http://localhost:5001";

type IndividualChatViewProps = {
  currentGroupChat: Group;
  onBackPress?: () => void;
}

export default function IndividualChatView({
  currentGroupChat,
  onBackPress,
}: IndividualChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const msgs = currentGroupChat?.messages ?? [];
      setMessages(msgs);
    }
    loadData();
  }, [])

  const sendMessage = async () => {
    if (messageText.trim() === '') return;  // Don't send empty messages

    const result = await axios.post(BACKEND_URL + `/groups/message`, {
      groupId: currentGroupChat.id,
      senderId: 1, // TODO replace with actual user id once we have user session storage
      content: messageText,
    })
    const resultData = result.data;
    const newMessage: Message = {
      id: resultData.id,
      groupId: resultData.groupId,
      userId: resultData.userId,
      content: resultData.content,
      createdAt: resultData.createdAt,
      seenBy: resultData.seenBy,
    };

    // Add new message to the list
    setMessages([...messages, newMessage]);
    setMessageText('');  // Clear the input field after sending
  };

  const renderItem = ({ item }: {item: Message}) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageHeader}>
        <Text style={styles.messageUser}>{item.userId}</Text>{' '}
        <Text style={styles.messageTime}>{formatDistanceToNow(item.createdAt) + ' ago'}</Text>
      </Text>
      <Text style={styles.messageContent}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Group Title */}
      <View style={styles.header}>
        <Text style={styles.groupTitle}>Group Chat</Text>
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
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
