import { StyleSheet, View } from "react-native";
import { Surface, Text } from "react-native-paper";

const Apps = () => {
  return (
    <Surface style={styles.container}>
      <Text variant="headlineMedium">Apps</Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Apps;
