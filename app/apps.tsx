import { StyleSheet, Text, View } from "react-native";

const Apps = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Apps</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  container: {
    flex: 1,
  },
});
export default Apps;
