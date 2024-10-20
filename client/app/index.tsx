import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, Alert, View, Modal } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Button, Theme, H3, SizableText, Card, Text } from "tamagui";
import axios from "axios";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import QuizQuestion from "@/components/QuizQuestion";
import { useAuth } from "@/hooks/useAuth";



interface AnswerDictionary {
  [key: number]: number;
}

export default function SignUpScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginEmail, setLoginEmail] = useState<string>(""); // New state for login email
  const [loginPassword, setLoginPassword] = useState<string>(""); // New state for login password
  const { login } = useAuth();

  const [showQuizInstructions, setShowQuizInstructions] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionNum, setQuestionNum] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswerDictionary>({});

  const [userId, setUserId] = useState<number | undefined>(undefined);

  const [signUpMessage, setSignUpMessage] = useState<string>("");
  const [loginMessage, setLoginMessage] = useState<string>("");

  const handleSignUp = async (): Promise<void> => {
    if (!email || !password) {
      setSignUpMessage("Email and password are required!");
      return;
    } else if (!validateEmail(email)) {
      setSignUpMessage("Please enter a valid email.");
      return;
    }

    try {
      // Make a POST request to your Express server
      const response = await axios.post(`http://localhost:5001/user/signup`, {
        email,
        password,
      });

      // Handle the response from the backend
      console.log(response.status);
      if (response.status === 409) {
        setSignUpMessage("This email already exists.");
      } else if (response.status === 200) {
        setEmail("");
        setPassword("");
        setUserId(response.data.id);
        login(response.data.id);
        handleQuiz();
      }
    } catch (error: any) {
      // Handle any errors from the server or network
      if (error.response.status === 409) {
        setSignUpMessage("This email already exists.");
      }
      else {
        setSignUpMessage("An error occurred during sign-up.")
      }
    }
  };

  const handleLogin = async (): Promise<void> => {
    if (!loginEmail || !loginPassword) {
      setLoginMessage("Email and password are required!");
      return;
    }
    try {
      // Make a POST request to your Express server
      const response = await axios.post(`http://localhost:5001/user/login`, {
        email: loginEmail,
        password: loginPassword,
      });

      // Handle the response from the backend
      if (response.status === 200) {

        setLoginEmail("");
        setLoginPassword("");
        login(response.data.id);
        router.replace("/(tabs)");

        // handleQuiz();
      } else {
        setLoginEmail("");
        setLoginPassword("");
      }
    } catch (error: any) {
      // Handle any errors from the server or network
      if(error.response.status === 404) {
        setLoginMessage("User with this email not found.");
      }
      else if (error.response.status === 403) {
        setLoginMessage("Incorrect password")
      }
      else {
        setLoginMessage("An error occurred during sign-up.");
      }
    }
  };

  const handleQuiz = async (): Promise<void> => {
    const response = await axios.get(`http://localhost:5001/user/quiz`);

    setQuestions(response.data);

    setQuestionNum(0);

    setShowQuizInstructions(true);
  };

  const handleQuestionChoice = async (
    questionId: number,
    option: number
  ): Promise<void> => {
    setAnswers((prevState) => ({
      ...prevState,
      [questionId]: option,
    }));

    if (questionNum >= questions.length - 1) {
      setShowQuiz(false);
      setShowQuizResults(true);
    } else {
      setQuestionNum(questionNum + 1);
    }
  };

  useEffect(() => {
    if (showQuizResults) {
      const submitQuizResults = async () => {
        const response = await axios.post(`http://localhost:5001/user/quiz`, {
          userId: userId,
          answers,
        });
      };
      submitQuizResults();
    }
  }, [showQuizResults]);

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
        {signUpMessage ? (
                      <Text style={{ color: "red", paddingBottom: 5 }}>{signUpMessage}</Text>
                    ) : null}
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
          placeholder="Email"
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
        {loginMessage ? (
                      <Text style={{ color: "red", paddingBottom: 5 }}>{loginMessage}</Text>
                    ) : null}
        <Button onPress={handleLogin} style={styles.button}>
          Log In
        </Button>
      </View>

      <Modal transparent={true} visible={showQuizInstructions}>
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalText}>
            To complete your registration, please do our personality quiz to
            help us match you with people to SideQuest with! </Text>
            <Text style={styles.modalText}>
            Answer each of the
            following questions on a scale of 1-5, 1 being "strongly disagree"
            and 5 being "strongly agree".
          </Text>
          <Button
            onPress={() => {
              setShowQuizInstructions(false);
              setShowQuiz(true);
            }}
          >
            Start Here!
          </Button>
        </SafeAreaView>
      </Modal>

      <Modal transparent={true} visible={showQuiz}>
        <SafeAreaView style={styles.modalContainer}>
          <QuizQuestion
            question={questions[questionNum]}
            handleQuestionChoice={handleQuestionChoice}
          ></QuizQuestion>
        </SafeAreaView>
      </Modal>

      <Modal transparent={true} visible={showQuizResults}>
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Thanks for doing the quiz! This will help us match you with
            like-minded individuals for side quests.
          </Text>
          <Button
            onPress={async () => {
              router.replace("/(tabs)");
            }}
          >
            Go to Home
          </Button>
        </SafeAreaView>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    backgroundColor: "white", // Set a background color for visibility
  },
  modalText: {
    fontSize: 24,
    marginBottom: 20, // Space between text and button
    marginRight: 25,
    marginLeft: 25,
    color: "#324C30",
    textAlign:"center",
  },
});