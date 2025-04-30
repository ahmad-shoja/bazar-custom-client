import { View } from "react-native";

import { useApps } from "@/hooks/useApps";
import { useState } from "react";
import { App, Code } from "@/services/storage/types";
import Dropdown from "./Dropdown";
import { useCodes } from "@/hooks/useCodes";
import { Button } from "react-native-paper";
import OutputView from "./OutputView";
import { dislike, like } from "@/services/like";
import { LogLine } from "@/types";
import { router } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { getReviewRepository } from "@/api/repository/reviews";
import { report } from "@/services/report";

const Main = () => {
  const { apps } = useApps();
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [selectedCode, setSelectedCode] = useState<Code | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const { codes } = useCodes(selectedApp?.id);
  const [outputLines, setOutputLines] = useState<LogLine[]>([]);

  const log = (line: LogLine) => setOutputLines((p) => [...p, line]);
  const handleReport = async () => {
    if (!selectedApp || !selectedCode) {
      return log({ text: "Please select both app and code!", color: "red" });
    }

    setIsLiking(true);
    try {
      await report(selectedApp.id, selectedCode?.code, log);
    } finally {
      setIsLiking(false);
    }
  };

  const handleLike = async () => {
    if (!selectedApp || !selectedCode) {
      return log({ text: "Please select both app and code!", color: "red" });
    }

    setIsLiking(true);
    try {
      await like(selectedApp.id, selectedCode?.code, log);
    } finally {
      setIsLiking(false);
    }
  };
  const handleDislike = async () => {
    if (!selectedApp || !selectedCode) {
      return log({ text: "Please select both app and code!", color: "red" });
    }
    setIsLiking(true);
    try {
      await dislike(selectedApp.id, selectedCode?.code, log);
    } finally {
      setIsLiking(false);
    }
  };

  const appList = [
    { label: "Select an App", value: "" },
    ...apps.map((app: App) => ({
      label: app.name,
      value: app.id,
    })),
  ];

  const codeList = [
    { label: "Select Related Codes", value: "" },
    ...codes.map((code: Code) => ({
      label: `${code.code}`,
      value: code.id,
      color: code.type === "enemy" ? "red" : "green",
    })),
  ];

  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        flexGrow: 1,
      }}
    >
      <View
        style={{
          gap: 16,
          display: "flex",
          width: "100%",
          flexWrap: "wrap",
          flexDirection: "row",
        }}
      >
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
            setSelectedCode(codes.find((code) => code.id === value) || null);
          }}
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
          marginTop: 16,
        }}
      >
        <Button
          mode="contained"
          buttonColor="orange"
          onPress={handleReport}
          disabled={
            !selectedApp || !selectedCode || selectedCode?.type === "friendly"
          }
        >
          Report
        </Button>
        <Button
          mode="contained"
          buttonColor="skyblue"
          onPress={handleLike}
          loading={isLiking}
          disabled={
            isLiking ||
            !selectedApp ||
            !selectedCode ||
            selectedCode?.type === "enemy"
          }
        >
          Like
        </Button>
        <Button
          mode="contained"
          buttonColor="pink"
          onPress={handleDislike}
          loading={isLiking}
          disabled={
            isLiking ||
            !selectedApp ||
            !selectedCode ||
            selectedCode?.type === "friendly"
          }
        >
          Dislike
        </Button>
      </View>
      <OutputView lines={outputLines} clear={() => setOutputLines([])} />
    </View>
  );
};

export default Main;
