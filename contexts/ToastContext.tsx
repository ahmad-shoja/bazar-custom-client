import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar } from "react-native-paper";

type ToastType = "success" | "error";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("success");

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      setMessage(message);
      setType(type);
      setVisible(true);
    },
    []
  );

  const onDismiss = useCallback(() => setVisible(false), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={3000}
        action={{
          label: "Dismiss",
          onPress: onDismiss,
        }}
        style={type === "error" ? { backgroundColor: "#B00020" } : undefined}
      >
        {message}
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
