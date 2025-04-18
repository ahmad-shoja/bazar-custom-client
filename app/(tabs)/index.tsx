import React, { useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import * as Haptics from "expo-haptics";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function HomeScreen() {
  const [birthDate, setBirthDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [age, setAge] = useState<{
    years: number;
    months: number;
    days: number;
  } | null>(null);

  const calculateAge = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    setAge({ years, months, days });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Age Calculator" />
        <Card.Content>
          <Text style={styles.label}>Select your birth date:</Text>
          <Button
            mode="outlined"
            onPress={() => setShowPicker(true)}
            style={styles.dateButton}
          >
            {birthDate.toLocaleDateString()}
          </Button>

          {showPicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
            />
          )}

          <Button
            mode="contained"
            onPress={calculateAge}
            style={styles.calculateButton}
          >
            Calculate Age
          </Button>

          {age && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                Your age is: {age.years} years, {age.months} months, and{" "}
                {age.days} days
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  dateButton: {
    marginBottom: 16,
  },
  calculateButton: {
    marginTop: 8,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e3f2fd",
    borderRadius: 4,
  },
  resultText: {
    fontSize: 16,
    textAlign: "center",
  },
});
