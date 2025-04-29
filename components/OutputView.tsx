import { LogLine } from "@/types";
import { useEffect, useRef } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";

const OutputView = ({
  lines,
  clear,
}: {
  lines: LogLine[];
  clear: () => void;
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [lines]);
  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 1000,
        }}
      >
        <Button mode="text" compact onPress={clear} icon="delete">
          Clear
        </Button>
      </View>
      <ScrollView style={styles.scrollView} ref={scrollViewRef}>
        {lines.map((line, index) => (
          <Text
            key={index}
            style={[
              styles.line,
              line.color ? { color: line.color } : undefined,
            ]}
          >
            {line.text}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 8,
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  line: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#ffffff",
    marginVertical: 2,
  },
});

export default OutputView;
