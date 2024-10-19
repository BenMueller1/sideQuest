import React, { useState } from 'react';
import { StyleSheet, TextInput, Alert, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button, Theme, H3, SizableText} from 'tamagui';


export default function SignUpScreen() {
  const [username, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginUsername, setLoginEmail] = useState<string>(''); // New state for login email
  const [loginPassword, setLoginPassword] = useState<string>(''); // New state for login password

  const handleSignUp = (): void => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'All fields are required!');
    } else if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email!');
    } else { //gotta check username not already taken in backend
      Alert.alert('Success', 'You have signed up!');
    }
  };
  const handleLogin = (): void => {
    if (!loginUsername || !loginPassword) {
      Alert.alert('Error', 'Email and password are required!');
    }
    else {
      Alert.alert('Success', 'You have logged in!');
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
                <SizableText size='$4'>Sign up below</SizableText>
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
                placeholder="Username"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
            />
            <Button onPress={handleSignUp} style={styles.button}>Sign Up</Button>
            <View style={styles.separatorContainer}>
                <View style={styles.separator} />
                    <ThemedText style={styles.separatorText}>Or Continue With</ThemedText>
                <View style={styles.separator} />
            </View>

            <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#888"
            value={loginUsername}
            onChangeText={setLoginEmail}
            />
            <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={loginPassword}
            onChangeText={setLoginPassword}
            />
            <Button onPress={handleLogin} style={styles.button}>Log In</Button>
        </View>
    </Theme>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:15
  },
  heading: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  input: {
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginHorizontal: 100,
    borderRadius: 25
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
    flex: 1,
  },
  separatorText: {
    marginHorizontal: 10,
  },
});