import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useState, useCallback, memo } from "react";

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

  const handleSelect = useCallback(
    (value: string) => {
      onSelect(value);
      setVisible(false);
    },
    [onSelect]
  );

  return (
    <View style={styles.container}>
      <Button
        onPress={() => setVisible(true)}
        mode="elevated"
        icon="chevron-down"
      >
        {selectedLabel}
      </Button>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View
            style={[
              styles.dropdownContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <ScrollView
              style={styles.scrollView}
              nestedScrollEnabled
              showsVerticalScrollIndicator
            >
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.option}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text
                    style={{ color: option?.color ?? theme.colors.onSurface }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    width: 200,
    maxHeight: 300,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollView: {
    maxHeight: 300,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
});

export default memo(Dropdown);
