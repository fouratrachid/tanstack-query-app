import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to login by default
  // The useAuth hook will handle navigation to home if already authenticated
  return <Redirect href="/(auth)/login" />;
}
