import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Text,
  SafeAreaView,
} from "react-native";
import Modal from 'react-modal';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button, Theme, XStack } from "tamagui";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";



Modal.setAppElement('#root');
import AutoCompleteInput from "@/components/AutoCompleteInput";

type Interest = {
  id: number;
  name: string;
  description: string;
};
type Location = {
  lat: number; // Latitude
  lng: number; // Longitude
};
export default function ProfileScreen() {
  const { userId } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false); // State to track edit mode
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [hometown, setHometown] = useState<string>(""); // User-friendly location
  const [homeLocation, setHomeLocation] = useState<Location>();
  const [about, setAbout] = useState<string>("");
  const [interests, setInterests] = useState<Interest[]>([]); // All interests from backend
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]); // User-selected interest

  const [errorMessage, setMessage] = useState<string>("");
  
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/user/profile/${userId}`
      ); //CHANGE THIS TO USER ID PROP
      const {
        name,
        age,
        gender,
        hometown,
        interests = [],
        about,
      } = response.data;

      setName(name);
      setAge(age);
      setGender(gender);
      setSelectedInterests(interests);
      setAbout(about);
      setHometown(hometown);

      if(name == null) {
        openModal();
        console.log("ghelp")
      }
      
    } catch (error) {
      console.error("Error fetching data", error);
    }
    try {
      const response = await axios.get(
        "http://localhost:5001/user/interests"
      );
      setInterests(response.data);
    } catch (error) {
      console.error("Error fetching interests", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ThemedView>
    );
  }
  let xorInterests = interests.filter(
    (o1: { id: number }) => !selectedInterests.some((o2) => o1.id === o2.id)
  );

  const handleSave = async () => {
    console.log(selectedInterests.length);

    try {
      await axios.post("http://localhost:5001/user/edit", {
        userId: userId,
        name: name,
        age: age,
        gender: gender,
        about: about,
        hometown: hometown,
        latitude: homeLocation?.lat,
        longitude: homeLocation?.lng,
        interests: selectedInterests,
      });

     fetchUserData();
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  //callback for cancel button press
  const handleCancel = () => {
    fetchUserData();
    setIsEditing(false);
  };
  //callback for edit button press
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleAddInterest = (id: number) => {
    if (selectedInterests.length < 6) {
      const interestToAdd = interests.find((interest) => interest.id === id);
      if (interestToAdd) {
        if (!selectedInterests.some((interest) => interest.id === id)) {
          setSelectedInterests((prevSelected) => [
            ...prevSelected,
            interestToAdd,
          ]);
          setMessage("");
        }
      }
    } else {
      setMessage("You cannot add more than 6 activities.");
    }
  };

  const handleRemoveInterest = (id: number) => {
    const interestToRemove = interests.find((interest) => interest.id === id);
    if (selectedInterests.length < 7) {
      setMessage("");
    }
    if (interestToRemove) {
      if (selectedInterests.some((interest) => interest.id === id)) {
        setSelectedInterests((prevSelected) =>
          prevSelected.filter((interest) => interest.id !== id)
        );
      }
    }
  };

  return (
    <SafeAreaView>
      <Theme name="dark_alt2">
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.profileRow}>
            <Image
              source={require('../../assets/images/user.png')} // Replace with actual avatar image source
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              {isEditing ? (
                <>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                    placeholderTextColor="#888"
                  />
                  <TextInput
                    style={styles.input}
                    value={age}
                    onChangeText={setAge}
                    placeholder="Age"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.input}
                    value={gender}
                    onChangeText={setGender}
                    placeholder="Gender"
                    placeholderTextColor="#888"
                  />
                 <AutoCompleteInput updateEventLocation={setHomeLocation} updateEventPlace={setHometown}></AutoCompleteInput>
                </>
              ) : (
                <>
                  <ThemedText style={styles.userText}>Name: {name}</ThemedText>
                  <ThemedText style={styles.userText}>Age: {age}</ThemedText>
                  <ThemedText style={styles.userText}>Gender: {gender}</ThemedText>
                  <ThemedText style={styles.userText}>Hometown: {hometown} </ThemedText>
                </>
              )}
            </View>
            </View>
            {/* Edit/Save Button */}
            {isEditing ? (
              <XStack style={styles.buttonContainer}>
                <View style={{width:180}}></View>
                <Button style={styles.saveAndCancel} onPress={handleSave}>
                  Save
                </Button>
                <Button style={styles.saveAndCancel} onPress={handleCancel}>
                  Cancel
                </Button>
              </XStack>
            ) : (
              <Button onPress={handleEdit}>Edit</Button>
            )}
          </View>
            <ThemedText>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Modal"
                style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)',
                    flexDirection:"column",
                    justifyContent:'center',
                    alignItems:'center',

                },
                }}
            >
                <h2>Fill out your personal info!</h2>
                <Button onPress={closeModal}>Ok!</Button>
            </Modal>
            </ThemedText>
          {/* About Section */}
          <View style={styles.section}>
            <ThemedText style={styles.header}>About</ThemedText>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={about}
                  onChangeText={setAbout}
                  placeholder="About me"
                  placeholderTextColor="#888"
                ></TextInput>
              </>
            ) : (
              <>
                <ThemedText style={styles.userText}>{about}</ThemedText>
              </>
            )}
          </View>

          {/* Interests Section */}
          <View style={styles.section}>
            <ThemedText style={styles.header}>Interests</ThemedText>
            <View style={styles.interestContainer}>
              <View style={styles.rowInterests}>
                {selectedInterests.map((interest) => (
                  <TouchableOpacity
                    key={interest.id}
                    style={styles.interestButton}
                    onPress={() => {if(isEditing) handleRemoveInterest(interest.id)}}
                  >
                    <Text style={styles.interestText}>{interest.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {isEditing && (
                <>
                  <View style={styles.separatorContainer}>
                    {errorMessage ? (
                      <Text style={{ color: "red" }}>{errorMessage}</Text>
                    ) : null}
                    <View style={styles.separator} />
                  </View>
                  <View style={styles.rowInterests}>
                    {xorInterests.map((interest) => (
                      <TouchableOpacity
                        key={interest.id}
                        style={styles.interestButton}
                        onPress={() => handleAddInterest(interest.id)}
                      >
                        <Text style={styles.interestText}>{interest.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Recent Section */}
          <View style={styles.section}>
            <ThemedText style={styles.header}>Recent</ThemedText>
            {/* You can add recent activities content here */}
          </View>

      </ScrollView>
    </Theme>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  interestContainer: {
    flex: 1,
    paddingTop: 5,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  button: {
    width: 59,
    height: 30,
    fontSize: 12,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#324C30",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#324C30",
  },
  section: {
    marginBottom: 20,
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    padding: 5,
    marginBottom: 10,
    marginRight: 5,
    color: "#324C30",
  },
  buttonContainer: {
    flexDirection: "column", // Stack buttons vertically
    alignItems: "center", // Align buttons to the start (you can change this to 'center' or 'flex-end' as needed)
    marginTop: 10, // Add some space above the buttons
  },
  saveAndCancel: {
    marginVertical: 5,
  },
  interestButton: {
    backgroundColor: "#314b2f",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 25,
    width: "auto",
    alignItems: "center",
  },
  interestText: {
    color: "#669d62",
    justifyContent: "center",
    textAlign: "center",
  },
  selectedInterests: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    marginBottom: 10,
  },
  rowInterests: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  removeText: {
    marginLeft: 5,
    color: "red",
    fontWeight: "bold",
  },
  interestList: {
    paddingVertical: 20,
  },
  interestItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC",
    flex: 1,
  },
});