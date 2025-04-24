import { View } from "react-native";

import { useApps } from "@/hooks/useApps";
import { router } from "expo-router";
import { useState } from "react";
import { App, Code } from "@/storage/types";
import { useTheme } from "@react-navigation/native";
import Dropdown from "./Dropdown";
import { useCodes } from "@/hooks/useCodes";
import { Button } from "react-native-paper";

const Main = () => {
  const { apps } = useApps();
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [selectedCode, setSelectedCode] = useState<Code | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const { codes } = useCodes(selectedApp?.id);

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
    })),
  ];

  const actionList = [
    { label: "Select an Action", value: "" },
    { label: "Like", value: "like" },
    { label: "Report", value: "report" },
  ];

  return (
    <View style={{ width: "100%", display: "flex" }}>
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
        <Button mode="contained" buttonColor="pink" onPress={() => {}}>
          Report
        </Button>
        <Button mode="contained" buttonColor={"skyblue"} onPress={() => {}}>
          Like
        </Button>
      </View>
    </View>
  );
};

export default Main;
