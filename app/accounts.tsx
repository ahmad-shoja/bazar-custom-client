import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
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
import { reqOtp, verifyOtp } from "@/api/auth";
import { useAccounts } from "@/hooks/useAccounts";
import { ScrollView } from "react-native";

const Accounts = () => {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpPhase, setIsOtpPhase] = useState(false);
  const { accounts, addAccount, removeAccounts } = useAccounts();
  const { showToast } = useToast();
  const theme = useTheme();

  const handleAddAccount = () => {
    setIsAddModalVisible(true);
  };

  const handleDeleteSelected = () => {
    removeAccounts(selectedAccounts);
    setSelectedAccounts([]);
    showToast("Selected accounts deleted successfully");
  };

  const handleSubmit = () => {
    if (!isOtpPhase) {
      reqOtp(phoneNumber)
        .then((res) => {
          setIsOtpPhase(true);
          showToast("OTP sent to your phone number");
          setIsOtpPhase(true);
        })
        .catch((e) => {
          showToast(e, "error");
        });
    } else {
      verifyOtp(phoneNumber, otpCode)
        .then((res) => {
          const newAccount = {
            id: phoneNumber,
            phone: phoneNumber,
            token: res.token,
            refreshToken: res.refreshToken,
          };
          addAccount(newAccount);
          setIsAddModalVisible(false);
          setIsOtpPhase(false);
          setPhoneNumber("");
          setOtpCode("");
          showToast("Account added successfully", "success");
        })
        .catch((e) => {
          showToast(e, "error");
        });
    }
  };

  const handleReset = () => {
    setIsOtpPhase(false);
    setPhoneNumber("");
    setOtpCode("");
  };

  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Accounts</Text>
        {selectedAccounts.length > 0 && (
          <Button mode="contained" onPress={handleDeleteSelected}>
            Delete Selected
          </Button>
        )}
      </View>

      <ScrollView>
        <List.Section>
          {accounts.map((account) => (
            <List.Item
              key={account.id}
              title={account.phone}
              left={(props) => <List.Icon {...props} icon="account" />}
              right={(props) => <List.Icon {...props} icon="delete" />}
              onPress={() => {
                setSelectedAccounts((prev) =>
                  prev.includes(account.id)
                    ? prev.filter((id) => id !== account.id)
                    : [...prev, account.id]
                );
              }}
              style={[
                selectedAccounts.includes(account.id) && styles.selectedItem,
                {
                  backgroundColor: selectedAccounts.includes(account.id)
                    ? theme.colors.primaryContainer
                    : undefined,
                },
              ]}
            />
          ))}
        </List.Section>
      </ScrollView>
      <FAB icon="plus" style={styles.fab} onPress={handleAddAccount} />

      <Portal>
        <Modal
          visible={isAddModalVisible}
          onDismiss={() => setIsAddModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="headlineSmall">Add New Account</Text>
          <TextInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            disabled={isOtpPhase}
            style={styles.input}
          />
          {isOtpPhase && (
            <TextInput
              label="OTP Code"
              value={otpCode}
              onChangeText={setOtpCode}
              keyboardType="number-pad"
              style={styles.input}
            />
          )}
          <View style={styles.modalButtons}>
            <Button mode="outlined" onPress={handleReset}>
              Reset
            </Button>
            <Button mode="contained" onPress={handleSubmit}>
              {isOtpPhase ? "Verify" : "Send OTP"}
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
});

export default Accounts;
