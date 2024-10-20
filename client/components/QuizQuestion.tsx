import React from "react";
import { Button, Text } from "tamagui";
import { StyleSheet, View } from "react-native";

type Props = {
  question: any;
  handleQuestionChoice: (questionId: number, option: number) => Promise<void>;
};

export default function QuizQuestion({
  question,
  handleQuestionChoice,
}: Props) {
  return (
    <View style={styles.modalContent}>
      <Text style={styles.questionText}>
        {question.questionNumber}. {question.question}
      </Text>
      <Button
        style={styles.option}
        onPress={() => {
          handleQuestionChoice(question.id, 1);
        }}
      >
        <Text>1 &#40;Strongly disagree&#41;</Text>
      </Button>
      <Button
        style={styles.option}
        onPress={() => {
          handleQuestionChoice(question.id, 2);
        }}
      >
        <Text>2</Text>
      </Button>
      <Button
        style={styles.option}
        onPress={() => {
          handleQuestionChoice(question.id, 3);
        }}
      >
        <Text>3</Text>
      </Button>
      <Button
        style={styles.option}
        onPress={() => {
          handleQuestionChoice(question.id, 4);
        }}
      >
        <Text>4</Text>
      </Button>
      <Button
        style={styles.option}
        onPress={() => {
          handleQuestionChoice(question.id, 5);
        }}
      >
        <Text>5 &#40;Strongly agree&#41;</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
    alignItems: "center",
  },
  questionText: {
    fontSize: 24,
    color: "#324C30",
  },
  option: {
    height: 24,
    padding: 20,
    width: "80%",
    marginVertical: 10,
  },
});
