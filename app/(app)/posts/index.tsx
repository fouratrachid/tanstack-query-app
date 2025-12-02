import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PostList } from "@/components/posts/PostList";
import { useInfinitePosts } from "@/hooks/usePosts";
import { usePostsStore } from "@/store/posts.store";
import { Post } from "@/types/posts.types";

export default function PostsScreen() {
  const router = useRouter();
  const { sortBy, sortOrder, filterUserId } = usePostsStore();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts({
    sortBy,
    order: sortOrder,
    ...(filterUserId && { userId: filterUserId }),
    limit: 10,
  });

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  const handlePostPress = (post: Post) => {
    router.push(`/posts/${post.id}`);
  };

  const handleCreatePress = () => {
    router.push("/posts/create");
  };

  const handleFilterPress = () => {
    router.push("/posts/filters");
  };

  if (isError) {
    Alert.alert("Error", error?.message || "Failed to load posts");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Posts</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleFilterPress}
          >
            <Text style={styles.iconText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreatePress}
          >
            <Text style={styles.createButtonText}>+ New</Text>
          </TouchableOpacity>
        </View>
      </View>

      <PostList
        posts={posts}
        isLoading={isLoading && !isFetchingNextPage}
        isRefreshing={false}
        onRefresh={refetch}
        onLoadMore={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        hasMore={hasNextPage}
        onPostPress={handlePostPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  iconText: {
    fontSize: 20,
  },
  createButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
