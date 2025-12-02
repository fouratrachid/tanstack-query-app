import React from "react";
import {
  FlatList,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { CommentItem } from "./CommentItem";
import { Comment } from "../../types/posts.types";

interface CommentListProps {
  comments: Comment[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: string) => void;
  onAuthorPress?: (authorId: string) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  onLoadMore,
  hasMore = false,
  onEdit,
  onDelete,
  onAuthorPress,
  ListHeaderComponent,
}) => {
  const renderItem = ({ item }: { item: Comment }) => (
    <CommentItem
      comment={item}
      onEdit={onEdit}
      onDelete={onDelete}
      onAuthorPress={onAuthorPress}
    />
  );

  const renderFooter = () => {
    if (!isLoading || comments.length === 0) return null;
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

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No comments yet</Text>
        <Text style={styles.emptySubtext}>
          Be the first to leave a comment!
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={comments}
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
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#C7C7CC",
  },
});
