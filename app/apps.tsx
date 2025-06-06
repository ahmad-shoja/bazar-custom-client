import { StyleSheet, View, ScrollView } from "react-native";
import {
  Surface,
  Text,
  FAB,
  List,
  Portal,
  Modal,
  TextInput,
  Button,
} from "react-native-paper";
import { useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { App } from "@/services/storage/types";
import { useApps } from "@/hooks/useApps";
import { useTheme } from "react-native-paper";
import { router, useNavigation } from "expo-router";

const Apps = () => {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [appId, setAppId] = useState("");
  const [appName, setAppName] = useState("");
  const { showToast } = useToast();
  const { apps, addApp, removeApps } = useApps();
  const theme = useTheme();
  const handleAddApp = () => {
    setIsAddModalVisible(true);
  };

  const handleDeleteSelected = () => {
    removeApps(selectedApps);
    setSelectedApps([]);
    showToast("Selected apps deleted successfully");
  };

  const handleSubmit = () => {
    if (!appId || !appName) {
      showToast("Please fill in all fields", "error");
      return;
    }

    const newApp = {
      name: appName,
      id: appId,
    };

    addApp(newApp);
    setIsAddModalVisible(false);
    setAppId("");
    setAppName("");
    showToast("App added successfully");
  };

  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Apps</Text>
        {selectedApps.length > 0 && (
          <Button mode="contained" onPress={handleDeleteSelected}>
            Delete Selected
          </Button>
        )}
      </View>

      <ScrollView style={styles.scrollView}>
        <List.Section>
          {apps.map((app) => (
            <List.Item
              key={app.id}
              title={app.name}
              description={app.id}
              left={(props) => <List.Icon {...props} icon="application" />}
              right={(props) => <List.Icon {...props} icon="delete" />}
              onLongPress={() => {
                setSelectedApps((prev) =>
                  prev.includes(app.id)
                    ? prev.filter((id) => id !== app.id)
                    : [...prev, app.id]
                );
              }}
              onPress={() => {
                router.push({
                  pathname: "/codes",
                  params: { appId: app.id },
                });
              }}
              style={[
                selectedApps.includes(app.id) && styles.selectedItem,
                {
                  backgroundColor: selectedApps.includes(app.id)
                    ? theme.colors.primaryContainer
                    : undefined,
                },
              ]}
            />
          ))}
        </List.Section>
      </ScrollView>

      <FAB icon="plus" style={styles.fab} onPress={handleAddApp} />

      <Portal>
        <Modal
          visible={isAddModalVisible}
          onDismiss={() => setIsAddModalVisible(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text variant="headlineSmall">Add New App</Text>
          <TextInput
            label="Name"
            value={appName}
            onChangeText={setAppName}
            style={styles.input}
          />
          <TextInput
            label="Package Name"
            value={appId}
            onChangeText={setAppId}
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => {
                setIsAddModalVisible(false);
                setAppId("");
                setAppName("");
              }}
            >
              Cancel
            </Button>
            <Button mode="contained" onPress={handleSubmit}>
              Add App
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
  selectedItem: {
    backgroundColor: "#e0e0e0",
  },
  scrollView: {
    flex: 1,
  },
});

export default Apps;
