import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Post } from "../../types/posts.types";
import { useToggleLike } from "../../hooks/usePosts";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
  onPress: () => void;
  onAuthorPress?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPress,
  onAuthorPress,
}) => {
  const toggleLikeMutation = useToggleLike();

  const handleLikePress = () => {
    toggleLikeMutation.mutate(post.id);
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={onAuthorPress}
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          {post.author.avatarUrl ? (
            <Image
              source={{ uri: post.author.avatarUrl }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {post.author.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author.name}</Text>
          <Text style={styles.timestamp}>{timeAgo}</Text>
        </View>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.contentText} numberOfLines={3}>
          {post.content}
        </Text>
      </View>

      {/* Image */}
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLikePress}
          disabled={toggleLikeMutation.isPending}
        >
          {toggleLikeMutation.isPending ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <>
              <Text
                style={[
                  styles.actionIcon,
                  post.isLikedByCurrentUser && styles.liked,
                ]}
              >
                {post.isLikedByCurrentUser ? "❤️" : "🤍"}
              </Text>
              <Text style={styles.actionText}>{post.likesCount}</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{post.commentsCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
  },
  avatar: {
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: "#8E8E93",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  contentText: {
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 20,
  },
  postImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F2F2F7",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  liked: {
    color: "#FF3B30",
  },
  actionText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
});
