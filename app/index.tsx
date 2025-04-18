import { StyleSheet, View } from "react-native";
import { Card, Text, useTheme, TouchableRipple } from "react-native-paper";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Home = () => {
  const theme = useTheme();

  return (
    <View style={styles.tilesContainer}>
      <Tile
        icon="account-group"
        label="Accounts"
        onPress={() => router.push("/accounts")}
      />
      <Tile icon="apps" label="Apps" onPress={() => router.push("/apps")} />
      <Tile
        icon="cog"
        label="Settings"
        onPress={() => router.push("/settings")}
      />
    </View>
  );
};

const Tile = ({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
}) => {
  const theme = useTheme();

  return (
    <TouchableRipple
      onPress={onPress}
      style={styles.tile}
      rippleColor={theme.colors.primaryContainer}
      borderless={true}
    >
      <Card style={styles.card} mode="elevated" theme={{ roundness: 1 }}>
        <Card.Content style={styles.tileContent}>
          <MaterialCommunityIcons
            name={icon as any}
            size={32}
            color={theme.colors.primary}
          />
          <Text
            variant="titleMedium"
            style={[styles.tileText, { color: theme.colors.onSurface }]}
          >
            {label}
          </Text>
        </Card.Content>
      </Card>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  tilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 50,
    padding: 20,
  },
  tile: {
    width: "30%",
    aspectRatio: 1,
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 4,
  },
  card: {
    flex: 1,
  },
  tileContent: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  tileText: {
    textAlign: "center",
    fontSize: 14,
  },
});

export default Home;
