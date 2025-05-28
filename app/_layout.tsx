import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Walkthrough from "./walkthrough";
import { StatusBar } from "expo-status-bar";
import { customLightTheme, customDarkTheme } from "../utils/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/context/themeContext";

export default function Layout() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(
    colorScheme === "dark" ? customDarkTheme : customLightTheme,
  );
  const [showWalkthrough, setShowWalkthrough] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem("themePreference");
      if (savedTheme) {
        setTheme(savedTheme === "dark" ? customDarkTheme : customLightTheme);
      } else {
        setTheme(colorScheme === "dark" ? customDarkTheme : customLightTheme);
      }

      const seen = await AsyncStorage.getItem("seenWalkthrough");
      setShowWalkthrough(seen !== "true");
    })();
  }, [colorScheme]);

  if (showWalkthrough === null) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PaperProvider>
          <StatusBar style={theme === customDarkTheme ? "light" : "dark"} />
          {showWalkthrough ? <Walkthrough /> : <Slot />}
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
