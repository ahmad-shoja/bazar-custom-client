import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  useTheme,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Appbar } from "react-native-paper";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const theme = useTheme();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Stack
          screenOptions={{
            animation: "fade_from_bottom",
            contentStyle: { backgroundColor: theme.colors.background },
            header: ({ navigation, route, options }) => (
              <Appbar.Header>
                {navigation.canGoBack() && (
                  <Appbar.BackAction onPress={() => navigation.goBack()} />
                )}
                <Appbar.Content title={options.title || route.name} />
              </Appbar.Header>
            ),
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              title: "Home",
            }}
          />
          <Stack.Screen
            name="apps"
            options={{
              title: "Applications",
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: "Settings",
            }}
          />
          <Stack.Screen
            name="+not-found"
            options={{
              title: "Not Found",
            }}
          />
        </Stack>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
});
