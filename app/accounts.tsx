import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
const Accounts = () => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Accounts</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  container: {
    flex: 1,
    backdropFilter: "red",
  },
});
export default Accounts;
