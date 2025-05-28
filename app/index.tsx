import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View>
         <Text>Home Page</Text>
         <Link href="./settings">
           Go to Settings
         </Link>
       </View>
  );
}
