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
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button, Theme } from "tamagui";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

type Interest = {
  id: number;
  name: string;
  description: string;
};

export default function ProfileScreen() {
  const { userId } = useAuth();
  const [userData, setUserData] = useState<any>(null); // State to hold user info
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false); // State to track edit mode
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [location, setLocation] = useState<string>(""); // User-friendly location
  const [latitude, setLatitude] = useState<string>(""); // Latitude
  const [longitude, setLongitude] = useState<string>("");
  const [about, setAbout] = useState<string>("");

  const [editedName, setEditedName] = useState<string>("");
  const [editedAge, setEditedAge] = useState<string>("");
  const [editedGender, setEditedGender] = useState<string>("");
  const [editedSelectedInterests, setEditedSelectedInterests] = useState<Interest[]>([]);
  const [editedAbout, setEditedAbout] = useState<string>("");

  const [interests, setInterests] = useState<Interest[]>([]); // All interests from backend
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]); // User-selected interest

  const [errorMessage, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/user/profile/${userId}`
        ); //CHANGE THIS TO USER ID PROP
        const {
          name,
          age,
          gender,
          latitude,
          longitude,
          interests = [],
          about,
        } = response.data;

        setUserData(response.data);
        setName(name);
        setAge(age);
        setGender(gender);
        setSelectedInterests(interests);
        setAbout(about);
        // setLatitude(latitude.toString());
        // setLongitude(longitude.toString());
        //const locationFromCoords = await getLocationFromCoords(latitude, longitude);
        //setLocation(locationFromCoords);
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
  // if (!userData) {
  // return (
  //     <ThemedView style={styles.loadingContainer}>
  //     <ThemedText>Error loading user data</ThemedText>
  //     </ThemedView>
  // );
  // }
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5001/user/edit", {
        userId: userId,
        name: editedName,
        age: editedAge,
        gender: editedGender,
        about: editedAbout,
        latitude: 0,
        longitude: 0,
        interests: selectedInterests,
      });
      setName(editedName);
      setAge(editedAge);
      setGender(editedGender);
      setAbout(editedAbout);
      setUserData({
        ...userData,
        name,
        age,
        gender,
        latitude,
        longitude,
        about,
      }); // Update local state with new values
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  const handleCancel = () => {
    // Revert to original values if cancel is pressed
    setEditedName(name);
    setEditedAge(age);
    setEditedGender(gender);
    setEditedAbout(about);
    setSelectedInterests(editedSelectedInterests);
    setIsEditing(false);
  };
  const handleEdit = () => {
    // Set edited fields to current values when editing starts
    setEditedName(name);
    setEditedAge(age);
    setEditedGender(gender);
    setEditedAbout(about);
    setEditedSelectedInterests(selectedInterests);
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
    <Theme name="dark_alt2">
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: "../../assets/images/icons8-male-user-90.png" }} // Replace with actual avatar image source
              style={styles.avatar}
            />
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
                  <ThemedText style={styles.userText}>
                    Gender: {gender}
                  </ThemedText>
                  {/* <ThemedText style={styles.userText}>Location: {location}</ThemedText> */}
                </>
              )}
            </View>
            {/* Edit/Save Button */}
            {isEditing ? (
              <View style={styles.buttonContainer}>
                <Button style={styles.saveAndCancel} onPress={handleSave}>
                  Save
                </Button>
                <Button style={styles.saveAndCancel} onPress={handleCancel}>
                  Cancel
                </Button>
              </View>
            ) : (
              <Button onPress={handleEdit}>Edit</Button>
            )}
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <ThemedText style={styles.header}>About</ThemedText>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editedAbout}
                  onChangeText={setEditedAbout}
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
                    onPress={() => handleRemoveInterest(interest.id)}
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
        </View>
      </ScrollView>
    </Theme>
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
    marginBottom: 20,
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
