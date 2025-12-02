import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Comment } from "../../types/posts.types";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "../../store/auth.store";

interface CommentItemProps {
  comment: Comment;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: string) => void;
  onAuthorPress?: (authorId: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onEdit,
  onDelete,
  onAuthorPress,
}) => {
  const user = useAuthStore((state) => state.user);
  const isOwner = user?.id === comment.user.id;

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  const handleDelete = () => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete?.(comment.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onAuthorPress?.(comment.user.id)}
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          {comment.user.avatarUrl ? (
            <Image
              source={{ uri: comment.user.avatarUrl }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {comment.user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => onAuthorPress?.(comment.user.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.authorName}>{comment.user.name}</Text>
          </TouchableOpacity>
          <Text style={styles.timestamp}>{timeAgo}</Text>
        </View>

        <Text style={styles.commentText}>{comment.content}</Text>

        {isOwner && (onEdit || onDelete) && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity
                onPress={() => onEdit(comment)}
                style={styles.actionButton}
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.actionButton}
              >
                <Text style={[styles.actionText, styles.deleteText]}>
                  Delete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  avatar: {
    marginRight: 12,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#8E8E93",
  },
  commentText: {
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    marginTop: 8,
  },
  actionButton: {
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  deleteText: {
    color: "#FF3B30",
  },
});
