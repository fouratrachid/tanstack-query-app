import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  usePost,
  useDeletePost,
  useToggleLike,
} from "../../../src/hooks/usePosts";
import {
  useInfiniteComments,
  useCreateComment,
  useDeleteComment,
} from "../../../src/hooks/useComments";
import { CommentList } from "../../../src/components/comments/CommentList";
import { CommentForm } from "../../../src/components/comments/CommentForm";
import { useAuthStore } from "../../../src/store/auth.store";
import { formatDistanceToNow } from "date-fns";

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);

  const { data: post, isLoading: isLoadingPost, error } = usePost(id);
  const deleteMutation = useDeletePost();
  const toggleLikeMutation = useToggleLike();

  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchComments,
  } = useInfiniteComments(id);

  const createCommentMutation = useCreateComment();
  const deleteCommentMutation = useDeleteComment();

  const comments = commentsData?.pages.flatMap((page) => page.data) ?? [];
  const isOwner = user?.id === post?.author.id;

  const handleLikePress = () => {
    if (!post) return;
    toggleLikeMutation.mutate(post.id);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteMutation.mutate(id, {
              onSuccess: () => {
                Alert.alert("Success", "Post deleted successfully");
                router.back();
              },
              onError: () => {
                Alert.alert("Error", "Failed to delete post");
              },
            });
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push(`/posts/edit/${id}`);
  };

  const handleCommentSubmit = (content: string) => {
    createCommentMutation.mutate(
      { postId: id, data: { content } },
      {
        onSuccess: () => {
          refetchComments();
        },
        onError: () => {
          Alert.alert("Error", "Failed to post comment");
        },
      }
    );
  };

  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(
      { commentId, postId: id },
      {
        onSuccess: () => {
          refetchComments();
        },
        onError: () => {
          Alert.alert("Error", "Failed to delete comment");
        },
      }
    );
  };

  if (isLoadingPost) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load post</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Post Content */}
          <View style={styles.postCard}>
            {/* Header */}
            <View style={styles.header}>
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

              {isOwner && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={handleEdit}
                    style={styles.actionButton}
                  >
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={styles.actionButton}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Title */}
            <Text style={styles.title}>{post.title}</Text>

            {/* Content */}
            <Text style={styles.contentText}>{post.content}</Text>

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
                style={styles.footerButton}
                onPress={handleLikePress}
                disabled={toggleLikeMutation.isPending}
              >
                <Text
                  style={[
                    styles.actionIcon,
                    post.isLikedByCurrentUser && styles.liked,
                  ]}
                >
                  {post.isLikedByCurrentUser ? "❤️" : "🤍"}
                </Text>
                <Text style={styles.actionText}>{post.likesCount}</Text>
              </TouchableOpacity>

              <View style={styles.footerButton}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionText}>{post.commentsCount}</Text>
              </View>
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              Comments ({post.commentsCount})
            </Text>

            {comments.length > 0 ? (
              comments.map(
                (comment) => (
                  console.log(comment),
                  (
                    <View key={comment.id} style={styles.commentWrapper}>
                      <View style={styles.commentAvatar}>
                        {comment.author?.avatarUrl ? (
                          <Image
                            source={{ uri: comment.author.avatarUrl }}
                            style={styles.commentAvatarImage}
                          />
                        ) : (
                          <View style={styles.commentAvatarPlaceholder}>
                            <Text style={styles.commentAvatarText}>
                              {comment.author?.name?.charAt(0).toUpperCase() ||
                                "?"}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.commentContent}>
                        <Text style={styles.commentAuthor}>
                          {comment.author?.name || "Unknown User"}
                        </Text>
                        <Text style={styles.commentText}>
                          {comment.content}
                        </Text>
                        <Text style={styles.commentTime}>
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </Text>
                        {user?.id === comment.author?.id && (
                          <TouchableOpacity
                            onPress={() => handleDeleteComment(comment.id)}
                          >
                            <Text style={styles.deleteCommentText}>Delete</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )
                )
              )
            ) : (
              <Text style={styles.noComments}>
                No comments yet. Be the first!
              </Text>
            )}

            {hasNextPage && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                <Text style={styles.loadMoreText}>
                  {isFetchingNextPage ? "Loading..." : "Load More"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <CommentForm
          onSubmit={handleCommentSubmit}
          isSubmitting={createCommentMutation.isPending}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  postCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    marginRight: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
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
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 16,
  },
  editText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  deleteText: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    color: "#3C3C43",
    lineHeight: 24,
    marginBottom: 16,
  },
  postImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  liked: {
    color: "#FF3B30",
  },
  actionText: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },
  commentsSection: {
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 16,
  },
  commentWrapper: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentAvatar: {
    marginRight: 12,
  },
  commentAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  commentAvatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 20,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
    color: "#8E8E93",
  },
  deleteCommentText: {
    fontSize: 12,
    color: "#FF3B30",
    marginTop: 4,
  },
  noComments: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    paddingVertical: 24,
  },
  loadMoreButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  loadMoreText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
