import { StyleSheet, View } from "react-native";
import { Surface, Text, Button, TextInput, useTheme } from "react-native-paper";
import { useState, useEffect } from "react";
import { useApps } from "@/hooks/useApps";
import { useCodes } from "@/hooks/useCodes";
import { App, Code } from "@/services/storage/types";
import Dropdown from "@/components/Dropdown";
import { report } from "@/services/report";
import OutputView from "@/components/OutputView";
import { LogLine } from "@/types";

interface Operation {
  app: App | null;
  code: Code | null;
}

const Operations = () => {
  const { apps, refresh: refreshApps } = useApps();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [interval, setInterval] = useState<string>("60");
  const [isRunning, setIsRunning] = useState(false);
  const [nextAction, setNextAction] = useState<number>(0);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [selectedCode, setSelectedCode] = useState<Code | null>(null);
  const { codes, refresh: refreshCodes } = useCodes(selectedApp?.id);
  const theme = useTheme();
  const [outputLines, setOutputLines] = useState<LogLine[]>([]);
  const log = (line: LogLine) => setOutputLines((p) => [...p, line]);

  useEffect(() => {
    refreshApps();
  }, []);

  useEffect(() => {
    if (selectedApp?.id) {
      refreshCodes();
    }
  }, [selectedApp]);

  useEffect(() => {
    let timer: number;
    if (isRunning && nextAction > 0) {
      timer = window.setInterval(() => {
        setNextAction((prev) => prev - 1);
      }, 1000);
    } else if (nextAction === 0 && isRunning) {
      for (const op of operations) {
        if (op.app?.id && op.code?.code) {
          report(op.app.id, op.code.code, log);
        }
      }
      setNextAction(parseInt(interval) || 60);
    }
    return () => clearInterval(timer);
  }, [isRunning, nextAction, interval, operations]);

  const appList = [
    { label: "Select an App", value: "" },
    ...apps.map((app: App) => ({
      label: app.name,
      value: app.id,
    })),
  ];

  const codeList = [
    { label: "Select a Code", value: "" },
    ...codes.map((code: Code) => ({
      label: `${code.code}`,
      value: code.id,
      color: code.type === "enemy" ? "red" : "green",
    })),
  ];

  const handleAddOperation = () => {
    if (selectedApp && selectedCode) {
      setOperations([...operations, { app: selectedApp, code: selectedCode }]);
      setSelectedApp(null);
      setSelectedCode(null);
    }
  };

  const handleStartReport = () => {
    setIsRunning(true);
    setNextAction(parseInt(interval) || 60);
  };

  const handleStopReport = () => {
    setIsRunning(false);
    setNextAction(0);
  };

  return (
    <Surface style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Operations
        </Text>

        <View style={styles.operationsList}>
          {operations.map((op, index) => (
            <View
              key={index}
              style={[
                styles.operationItem,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <View style={styles.operationContent}>
                <Text>App: {op.app?.name}</Text>
                <Text>Code: {op.code?.code}</Text>
              </View>
              <Button
                mode="text"
                onPress={() => {
                  setOperations(operations.filter((_, i) => i !== index));
                }}
                icon="delete"
                compact
              >
                {""}
              </Button>
            </View>
          ))}
        </View>

        <View style={styles.addSection}>
          <View style={styles.dropdowns}>
            <Dropdown
              label="App"
              value={selectedApp?.id || ""}
              options={appList}
              onSelect={(value) => {
                setSelectedApp(apps.find((app) => app.id === value) || null);
              }}
            />
            <Dropdown
              label="Code"
              value={selectedCode?.id || ""}
              options={codeList}
              onSelect={(value) => {
                setSelectedCode(
                  codes.find((code) => code.id === value) || null
                );
              }}
            />
          </View>
          <Button
            mode="contained"
            onPress={handleAddOperation}
            disabled={!selectedApp || !selectedCode}
          >
            Add Operation
          </Button>
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
            onPress={handleStartReport}
            disabled={isRunning || operations.length === 0}
          >
            Start Report
          </Button>
          <Button
            mode="contained"
            onPress={handleStopReport}
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
    marginBottom: 16,
  },
  operationsList: {
    gap: 8,
  },
  operationItem: {
    padding: 8,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  operationContent: {
    flex: 1,
  },
  addSection: {
    gap: 16,
  },
  dropdowns: {
    flexDirection: "row",
    gap: 8,
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

export default Operations;
