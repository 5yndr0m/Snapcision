import { Slot } from "expo-router";
import { Provider } from "react-native-paper"

export default function RootLayout() {
  return (
    <Provider>
      <Slot />
    </Provider>
  );
}
