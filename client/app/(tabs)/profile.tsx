import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, ActivityIndicator, TextInput} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button, Theme} from "tamagui";
import axios from 'axios';

export default function ProfileScreen() {
    const [userData, setUserData] = useState<any>(null);  // State to hold user info
    const [loading, setLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false); // State to track edit mode
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [location, setLocation] = useState<string>(''); // User-friendly location
    const [latitude, setLatitude] = useState<string>(''); // Latitude
    const [longitude, setLongitude] = useState<string>('');


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/profile/1')
                const { name, age, gender, latitude, longitude } = response.data;

                setUserData(response.data);
                setName("John");
                setAge(age);
                setGender(gender);
                setLatitude(latitude.toString());
                setLongitude(longitude.toString());
                
                //const locationFromCoords = await getLocationFromCoords(latitude, longitude);
                //setLocation(locationFromCoords);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (loading) {
        return (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </ThemedView>
        );
      }
    // if (!userData) {
    // return (
    //     <ThemedView style={styles.loadingContainer}>
    //     <ThemedText>Error loading user data</ThemedText>
    //     </ThemedView>
    // );
    // }
    const handleSave = async () => {
        try {
          await axios.post('http://localhost:5000/edit', {
            userId:1,
            name,
            age,
            gender,
            latitude:0,
            longitude:0
          });
          setUserData({ ...userData, name, age, gender, latitude, longitude }); // Update local state with new values
          setIsEditing(false); // Exit edit mode
        } catch (error) {
          console.error('Error updating user data:', error);
        }
      };

  return (
    <Theme>
        <View style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileRow}>
            {/* Avatar */}
            <Image
            source={{ uri: '../../assets/images/icons8-male-user-90.png' }} // Replace with actual avatar image source
            style={styles.avatar}
            />
            {/* User Info */}
            <View style={styles.userInfo}>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Name"
              />
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Age"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                value={gender}
                onChangeText={setGender}
                placeholder="Gender"
              />
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Location"
              />
            </>
          ) : (
            <>
              <ThemedText style={styles.userText}>Name: {name}</ThemedText>
              <ThemedText style={styles.userText}>Age: {age}</ThemedText>
              <ThemedText style={styles.userText}>Gender: {gender}</ThemedText>
              <ThemedText style={styles.userText}>Location: {location}</ThemedText>
            </>
          )}
        </View>
        {/* Edit/Save Button */}
        {isEditing ? (
        <>
            <Button onPress={handleSave}>Save</Button>
        </>   
        ) : (
          <Button onPress={() => setIsEditing(true)}>Edit</Button>
        )}
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
            <ThemedText style={styles.header}>Interests</ThemedText>
            {/* You can add interests content here */}
        </View>

        {/* Recent Section */}
        <View style={styles.section}>
            <ThemedText style={styles.header}>Recent</ThemedText>
            {/* You can add recent activities content here */}
        </View>
        </View>
    </Theme>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  button: {
    width:59,
    height:30,
    fontSize: 12,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userText: {
    fontSize: 16,
    marginBottom: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    padding: 5,
    marginBottom: 10,
  },
});
