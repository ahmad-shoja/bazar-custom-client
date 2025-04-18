import { StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";

const Settings = () => {
  return (
    <Surface style={styles.container}>
      <Text variant="headlineMedium">Settings</Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Settings;
