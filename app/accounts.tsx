import { StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";
const Accounts = () => {
  return (
    <Surface style={styles.container}>
      <Text variant="headlineMedium">Accounts</Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Accounts;
