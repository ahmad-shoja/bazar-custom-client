import { View } from "react-native";
import { Menu, Button } from "react-native-paper";
import { useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  value: string;
  options: Option[];
  onSelect: (value: string) => void;
}

const Dropdown = ({ label, value, options, onSelect }: DropdownProps) => {
  const [visible, setVisible] = useState(false);

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
            title={option.label}
          />
        ))}
      </Menu>
    </View>
  );
};

export default Dropdown;
