import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { PostForm } from "../../../src/components/posts/PostForm";
import {
  useCreatePost,
  useUpdatePost,
  usePost,
} from "../../../src/hooks/usePosts";
import { CreatePostDto } from "../../../src/types/posts.types";

export default function CreateEditPostScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = !!id;

  // Fetch existing post if editing
  const { data: existingPost, isLoading } = usePost(id || "", {
    enabled: isEditMode,
  });

  const createMutation = useCreatePost({
    onSuccess: (newPost) => {
      Alert.alert("Success", "Post created successfully!", [
        {
          text: "OK",
          onPress: () => router.replace(`/posts/${newPost.id}`),
        },
      ]);
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to create post"
      );
    },
  });

  const updateMutation = useUpdatePost({
    onSuccess: (updatedPost) => {
      Alert.alert("Success", "Post updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to update post"
      );
    },
  });

  const handleSubmit = (data: CreatePostDto) => {
    if (isEditMode && id) {
      updateMutation.mutate({ postId: id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  if (isEditMode && isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>{/* Loading state */}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PostForm
        initialValues={
          isEditMode && existingPost
            ? {
                title: existingPost.title,
                content: existingPost.content,
                imageUrl: existingPost.imageUrl || undefined,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error?.message}
        submitLabel={isEditMode ? "Update Post" : "Create Post"}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
