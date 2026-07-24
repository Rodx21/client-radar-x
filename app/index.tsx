import { Redirect } from "expo-router";

// Entry route; immediately redirects to the Home tab.
export default function Index() {
  return <Redirect href="/(drawer)/(tabs)/inicio" />;
}
