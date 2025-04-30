import { useColorScheme, View } from "react-native";
import { Menu, Button, Text, useTheme } from "react-native-paper";
import { useState } from "react";

interface Option {
  label: string;
  value: string;
  color?: string;
}

interface DropdownProps {
  label: string;
  value: string;
  options: Option[];
  onSelect: (value: string) => void;
}

const Dropdown = ({ label, value, options, onSelect }: DropdownProps) => {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  const selectedLabel = value
    ? options.find((option) => option.value === value)?.label
    : label;

  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchorPosition="bottom"
        anchor={
          <Button
            onPress={() => setVisible(true)}
            mode="elevated"
            icon="chevron-down"
          >
            {selectedLabel}
          </Button>
        }
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            onPress={() => {
              onSelect(option.value);
              setVisible(false);
            }}
            title={
              <Text style={{ color: option?.color ?? theme.colors.onSurface }}>
                {option.label}
              </Text>
            }
          />
        ))}
      </Menu>
    </View>
  );
};

export default Dropdown;
