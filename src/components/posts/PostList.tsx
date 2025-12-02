import React from "react";
import {
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { PostCard } from "./PostCard";
import { Post } from "../../types/posts.types";

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onPostPress: (post: Post) => void;
  onAuthorPress?: (authorId: string) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  onLoadMore,
  hasMore = false,
  onPostPress,
  onAuthorPress,
  ListHeaderComponent,
  ListEmptyComponent,
}) => {
  const renderItem = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onPress={() => onPostPress(item)}
      onAuthorPress={
        onAuthorPress ? () => onAuthorPress(item.author.id) : undefined
      }
    />
  );

  const renderFooter = () => {
    if (!isLoading || posts.length === 0) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

    if (ListEmptyComponent) {
      return typeof ListEmptyComponent === "function" ? (
        <ListEmptyComponent />
      ) : (
        ListEmptyComponent
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No posts yet</Text>
        <Text style={styles.emptySubtext}>Be the first to create one!</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        ) : undefined
      }
      onEndReached={hasMore && onLoadMore ? onLoadMore : undefined}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      ListHeaderComponent={ListHeaderComponent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#C7C7CC",
  },
});
