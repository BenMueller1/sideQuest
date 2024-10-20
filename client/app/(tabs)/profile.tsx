import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, ActivityIndicator, TextInput, FlatList, TouchableOpacity, ScrollView, Text} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button, Theme} from "tamagui";
import axios from 'axios';

type Interest = {
    id: number;
    name: string;
    description: string;
  };

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

    const [editedName, setEditedName] = useState<string>('');
    const [editedAge, setEditedAge] = useState<string>('');
    const [editedGender, setEditedGender] = useState<string>('');

    const [interests, setInterests] = useState<Interest[]>([]);  // All interests from backend
    const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);  // User-selected interest
  
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/user/profile/1')
                const { name, age, gender, latitude, longitude, interests } = response.data;

                setUserData(response.data);
                setName(name);
                setAge(age);
                setGender(gender);
                setSelectedInterests(interests);
                console.log(interests)
                // setLatitude(latitude.toString());
                // setLongitude(longitude.toString());
                //const locationFromCoords = await getLocationFromCoords(latitude, longitude);
                //setLocation(locationFromCoords);
            } catch (error) {
                console.error("Error fetching data", error);
            } 
            try {
                const response = await axios.get('http://localhost:5001/user/interests');
                setInterests(response.data);
              } catch (error) {
                console.error('Error fetching interests', error);
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
          await axios.post('http://localhost:5001/user/edit', {
            userId:1,
            name: editedName,
            age: editedAge,
            gender: editedGender,
            latitude:0,
            longitude:0
          });
          setName(editedName);
          setAge(editedAge);
          setGender(editedGender);
          setUserData({ ...userData, name, age, gender, latitude, longitude }); // Update local state with new values
          setIsEditing(false); // Exit edit mode
        } catch (error) {
          console.error('Error updating user data:', error);
        }
      };
      const handleCancel = () => {
        // Revert to original values if cancel is pressed
        setEditedName(name);
        setEditedAge(age);
        setEditedGender(gender);
        setIsEditing(false);
      };
      const handleEdit = () => {
        // Set edited fields to current values when editing starts
        setEditedName(name);
        setEditedAge(age);
        setEditedGender(gender);
        setIsEditing(true);
      };

  return (
    <Theme name="dark_alt2">
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
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Name"
                placeholderTextColor="#888"
              />
              <TextInput
                style={styles.input}
                value={editedAge}
                onChangeText={setEditedAge}
                placeholder="Age"
                placeholderTextColor="#888"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                value={editedGender}
                onChangeText={setEditedGender}
                placeholder="Gender"
                placeholderTextColor="#888"
              />
              {/* <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Location"
              /> */}
            </>
          ) : (
            <>
              <ThemedText style={styles.userText}>Name: {name}</ThemedText>
              <ThemedText style={styles.userText}>Age: {age}</ThemedText>
              <ThemedText style={styles.userText}>Gender: {gender}</ThemedText>
              {/* <ThemedText style={styles.userText}>Location: {location}</ThemedText> */}
            </>
          )}
        </View>
        {/* Edit/Save Button */}
        {isEditing ? (
            <View style={styles.buttonContainer}>
                <Button onPress={handleSave}>Save</Button>
                <Button onPress={handleCancel}>Cancel</Button>
            </View>
            ) : (
                <Button onPress={handleEdit}>Edit</Button>
            )}
        </View>

        {/* About Section */}
        <View style={styles.section}>
            <ThemedText style={styles.header}>About</ThemedText>
            
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
            <ThemedText style={styles.header}>Interests</ThemedText>
                <View style={styles.interestContainer}>
                <ScrollView stickyHeaderIndices={[0]} style={styles.selectedInterests}>
                    <View style={styles.rowInterests}>
                        {selectedInterests.map((interest) => (
                            <TouchableOpacity
                                key={interest.id}
                                style={styles.interestButton}>
                                <Text style={styles.interestText}>{interest.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.rowInterests}>
                        {interests.map((interest) => (
                            <TouchableOpacity
                                key={interest.id}
                                style={styles.interestButton}>
                                <Text style={styles.interestText}>{interest.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
                        
 
                        {/* <ScrollView horizontal>
                            {selectedInterests.map((interest) => (
                                <View key={interest} style={styles.selectedItem}>
                                    <ThemedText>{interest}</ThemedText>
                                    <TouchableOpacity onPress={() => handleRemoveInterest(interest)}>
                                        <ThemedText style={styles.removeText}>x</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView> */}
                    
                </View>
            {/* <View style={styles.container}>
                <View style={styles.selectedHeader}>
                </View>
                <FlatList
                data={interests}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                    style={styles.interestItem}
                    onPress={() => handleSelectInterest(item)}
                    disabled={selectedInterests.includes(item)}  // Disable if already selected
                    >
                    <ThemedText>{item}</ThemedText>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.interestList}
                />
            </View> */}
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
  interestContainer: {
    flex: 1,
    paddingTop: 5,
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
    color: "#324C30",
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#324C30",
  },
  section: {
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    padding: 5,
    marginBottom: 10,
    marginRight:5,
    color: "#324C30",
  },
  buttonContainer: {
    flexDirection: 'column', // Stack buttons vertically
    alignItems: 'flex-start', // Align buttons to the start (you can change this to 'center' or 'flex-end' as needed)
    marginTop: 10, // Add some space above the buttons
  },
  interestButton: {
    backgroundColor: '#314b2f',
    paddingHorizontal:10,
    paddingVertical: 10,
    marginHorizontal:5,
    marginVertical:5,
    borderRadius: 25,
    width: 'auto',
    alignItems: 'center',
  },
  interestText: {
    color:'#669d62',
    justifyContent:'center',
    textAlign:'center',
  },
  selectedInterests: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    marginBottom: 10,
  },
  rowInterests: {
    flexDirection:'row',
    flexWrap:'wrap',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  removeText: {
    marginLeft: 5,
    color: 'red',
    fontWeight: 'bold',
  },
  interestList: {
    paddingVertical: 20,
  },
  interestItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
});
