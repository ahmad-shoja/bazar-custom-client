import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Button, Text, useTheme, Chip, Checkbox } from "react-native-paper";
import { useState, useCallback, memo } from "react";

interface Option {
  label: string;
  value: string;
  color?: string;
}

interface MultiSelectDropdownProps {
  label: string;
  values: string[];
  options: Option[];
  onSelect: (values: string[]) => void;
}

const MultiSelectDropdown = ({
  label,
  values,
  options,
  onSelect,
}: MultiSelectDropdownProps) => {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  const selectedOptions = options.filter((option) => values.includes(option.value));

  const handleToggle = useCallback(
    (value: string) => {
      const newValues = values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value];
      onSelect(newValues);
    },
    [values, onSelect]
  );

  const handleRemoveChip = useCallback(
    (value: string) => {
      onSelect(values.filter((v) => v !== value));
    },
    [values, onSelect]
  );

  return (
    <View style={styles.container}>
      <Button
        onPress={() => setVisible(true)}
        mode="elevated"
        icon="chevron-down"
        style={styles.button}
      >
        {selectedOptions.length > 0
          ? `${selectedOptions.length} selected`
          : label}
      </Button>

      {selectedOptions.length > 0 && (
        <View style={styles.chipsContainer}>
          {selectedOptions.map((option) => (
            <Chip
              key={option.value}
              onClose={() => handleRemoveChip(option.value)}
              style={styles.chip}
            >
              {option.label}
            </Chip>
          ))}
        </View>
      )}

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
            onStartShouldSetResponder={() => true}
          >
            <ScrollView
              style={styles.scrollView}
              nestedScrollEnabled
              showsVerticalScrollIndicator
            >
              {options.map((option) => {
                const isSelected = values.includes(option.value);
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      isSelected && {
                        backgroundColor: theme.colors.primaryContainer,
                      },
                    ]}
                    onPress={() => handleToggle(option.value)}
                  >
                    <Checkbox
                      status={isSelected ? "checked" : "unchecked"}
                      onPress={() => handleToggle(option.value)}
                    />
                    <Text
                      style={{
                        color: option?.color ?? theme.colors.onSurface,
                        marginLeft: 8,
                        flex: 1,
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
    flexDirection: "column",
    gap: 8,
  },
  button: {
    alignSelf: "flex-start",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  chip: {
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    width: 300,
    maxHeight: 400,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollView: {
    maxHeight: 400,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default memo(MultiSelectDropdown);

