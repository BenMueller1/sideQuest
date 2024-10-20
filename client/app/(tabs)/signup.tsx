import React, { useState } from "react";
import { StyleSheet, TextInput, Alert, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Button, Theme, H3, SizableText } from "tamagui";
import axios from "axios";
// import 'dotenv/config';

export default function SignUpScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginEmail, setLoginEmail] = useState<string>(""); // New state for login email
  const [loginPassword, setLoginPassword] = useState<string>(""); // New state for login password

  const handleSignUp = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    } else if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email!");
      return;
    }

    try {
      // Make a POST request to your Express server
      const response = await axios.post(`http://localhost:5000/user/signup`, {
        email,
        password,
      });

      // Handle the response from the backend
      if (response.status === 409) {
        Alert.alert("Error", "This email already exists.");
      }
      if (response.status === 200) {
        Alert.alert("Success", response.data.message);
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      // Handle any errors from the server or network
      Alert.alert("Error", "An error occurred during sign-up.");
    }
  };
  const handleLogin = async (): Promise<void> => {
    if (!loginEmail || !loginPassword) {
      Alert.alert("Error", "Email and password are required!");
      return;
    }
    try {
      // Make a POST request to your Express server
      const response = await axios.post(`http://localhost:5000/user/login`, {
        email: loginEmail,
        password: loginPassword,
      });

      // Handle the response from the backend
      if (response.status === 200) {
        Alert.alert("Success", response.data.message);
        setLoginEmail("");
        setLoginPassword("");
      }
    } catch (error) {
      // Handle any errors from the server or network
      Alert.alert("Error", "An error occurred during sign-up.");
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <Theme name="dark_alt2">
      <View style={styles.container}>
        <View style={styles.heading}>
          <H3>Welcome!</H3>
          <SizableText size="$4">Sign up below</SizableText>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <Button onPress={handleSignUp} style={styles.button}>
          Sign Up
        </Button>
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <ThemedText style={styles.separatorText}>Or Continue With</ThemedText>
          <View style={styles.separator} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={loginEmail}
          onChangeText={setLoginEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={loginPassword}
          secureTextEntry={true}
          onChangeText={setLoginPassword}
        />
        <Button onPress={handleLogin} style={styles.button}>
          Log In
        </Button>
      </View>
    </Theme>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  heading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 50,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    backgroundColor: "#FFFFFF",
  },
  button: {
    marginHorizontal: 100,
    borderRadius: 25,
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
  separatorText: {
    marginHorizontal: 10,
    color: "#324C30",
  },
});
