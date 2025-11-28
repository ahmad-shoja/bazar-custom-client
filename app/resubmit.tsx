import { StyleSheet, View } from "react-native";
import { Surface, Text, Button, TextInput } from "react-native-paper";
import { useState, useEffect } from "react";
import { useAccounts } from "@/hooks/useAccounts";
import { Account } from "@/services/storage/types";
import Dropdown from "@/components/Dropdown";
import { updateReportedReviews } from "@/services/updateReportedReviews";
import OutputView from "@/components/OutputView";
import { LogLine } from "@/types";

const Resubmit = () => {
  const { accounts } = useAccounts();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [interval, setInterval] = useState<string>("300");
  const [isRunning, setIsRunning] = useState(false);
  const [nextAction, setNextAction] = useState<number>(0);
  const [outputLines, setOutputLines] = useState<LogLine[]>([]);
  const log = (line: LogLine) => setOutputLines((p) => [...p, line]);

  useEffect(() => {
    let timer: number;
    if (isRunning && nextAction > 0) {
      timer = window.setInterval(() => {
        setNextAction((prev) => prev - 1);
      }, 1000);
    } else if (nextAction === 0 && isRunning && selectedAccount) {
      updateReportedReviews(selectedAccount.token, log).then(() => {
        setNextAction(parseInt(interval) || 300);
      });
    }
    return () => clearInterval(timer);
  }, [isRunning, nextAction, interval, selectedAccount]);

  const handleStartResubmit = () => {
    setIsRunning(true);
    setNextAction(parseInt(interval) || 300);
  };

  const handleStopResubmit = () => {
    setIsRunning(false);
    setNextAction(0);
  };

  return (
    <Surface style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Resubmit Reviews
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Automatically resubmit reviews likely to be rejected (5+ dislikes in reviewing state)
        </Text>

        <View style={styles.accountSection}>
          <Dropdown
            label="Account"
            value={selectedAccount?.id || ""}
            options={[
              { label: "Select an Account", value: "" },
              ...accounts.map((account: Account) => ({
                label: account.phone,
                value: account.id,
              })),
            ]}
            onSelect={(value) => {
              setSelectedAccount(
                accounts.find((account) => account.id === value) || null
              );
            }}
          />
        </View>

        <View style={styles.intervalSection}>
          <TextInput
            label="Interval (seconds)"
            value={interval}
            onChangeText={setInterval}
            keyboardType="numeric"
            style={styles.intervalInput}
          />
        </View>

        <View style={styles.controls}>
          <Button
            mode="contained"
            onPress={handleStartResubmit}
            disabled={isRunning || !selectedAccount}
          >
            Start Resubmit
          </Button>
          <Button
            mode="contained"
            onPress={handleStopResubmit}
            disabled={!isRunning}
          >
            Stop
          </Button>
        </View>

        {isRunning && (
          <Text style={styles.nextAction}>
            Next action in: {nextAction} seconds
          </Text>
        )}
        <View style={styles.outputContainer}>
          <OutputView lines={outputLines} clear={() => setOutputLines([])} />
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    flex: 1,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    opacity: 0.7,
  },
  accountSection: {
    marginTop: 16,
  },
  intervalSection: {
    marginTop: 16,
  },
  intervalInput: {
    width: 200,
  },
  controls: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  nextAction: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
  },
  outputContainer: {
    flex: 1,
    minHeight: 100,
  },
});

export default Resubmit;
