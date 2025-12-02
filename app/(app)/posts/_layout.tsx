import { Stack } from "expo-router";

export default function PostsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Posts",
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "Create Post",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Post Details",
        }}
      />
    </Stack>
  );
}
