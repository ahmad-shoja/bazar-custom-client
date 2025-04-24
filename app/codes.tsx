import { StyleSheet, View } from "react-native";
import {
  Surface,
  Text,
  FAB,
  List,
  Portal,
  Modal,
  TextInput,
  Button,
  Checkbox,
} from "react-native-paper";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "react-native-paper";
import { useToast } from "@/contexts/ToastContext";
import { useCodes } from "@/hooks/useCodes";
import { useApp } from "@/hooks/useApps";

const Codes = () => {
  const { appId } = useLocalSearchParams();
  const { app } = useApp(appId as string);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [code, setCode] = useState("");
  const { showToast } = useToast();
  const theme = useTheme();
  const [isEnemyCode, setIsEnemyCode] = useState(false);
  const { addCode, codes, removeCodes } = useCodes(appId as string);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const handleAddCode = () => {
    setIsAddModalVisible(true);
    setCode("");
    setIsEnemyCode(false);
  };

  const handleSubmit = () => {
    if (!code) {
      showToast("Please fill in all fields", "error");
      return;
    }
    addCode({
      code,
      type: isEnemyCode ? "enemy" : "mine",
      appId: appId as string,
    });

    setIsAddModalVisible(false);
    setCode("");
    setIsEnemyCode(false);
    showToast("Code added successfully");
  };

  const handleDeleteSelected = () => {
    removeCodes(selectedCodes);
    setSelectedCodes([]);
    showToast("Codes deleted successfully");
  };

  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">{app?.name} Codes</Text>
        {selectedCodes.length > 0 && (
          <Button mode="contained" onPress={handleDeleteSelected}>
            Delete Selected
          </Button>
        )}
      </View>

      <List.Section>
        {codes.map((code) => (
          <List.Item
            onPress={() => {
              setSelectedCodes((prev) =>
                prev.includes(code.id)
                  ? prev.filter((id) => id !== code.id)
                  : [...prev, code.id]
              );
            }}
            key={code.id}
            title={
              <Text style={{ color: code.type === "enemy" ? "red" : "green" }}>
                {code.code}
              </Text>
            }
            left={(props) => <List.Icon {...props} icon="code-braces" />}
            right={(props) => <List.Icon {...props} icon="delete" />}
            style={[
              selectedCodes.includes(code.id) && {
                backgroundColor: theme.colors.primaryContainer,
              },
            ]}
          />
        ))}
      </List.Section>

      <FAB icon="plus" style={styles.fab} onPress={handleAddCode} />

      <Portal>
        <Modal
          visible={isAddModalVisible}
          onDismiss={() => setIsAddModalVisible(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text variant="headlineSmall">Add New Code</Text>
          <TextInput
            label="Code"
            value={code}
            onChangeText={setCode}
            style={styles.input}
          />
          <View style={styles.input}>
            <Checkbox.Item
              label="Enemy Code"
              status={isEnemyCode ? "checked" : "unchecked"}
              onPress={() => setIsEnemyCode(!isEnemyCode)}
            />
          </View>
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => {
                setIsAddModalVisible(false);
                setCode("");
                setIsEnemyCode(false);
              }}
            >
              Cancel
            </Button>
            <Button mode="contained" onPress={handleSubmit}>
              Add Code
            </Button>
          </View>
        </Modal>
      </Portal>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modal: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  input: {
    marginVertical: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});

export default Codes;
