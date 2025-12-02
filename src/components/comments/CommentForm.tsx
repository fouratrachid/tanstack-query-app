import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
  placeholder?: string;
  initialValue?: string;
  onCancel?: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  isSubmitting = false,
  placeholder = "Write a comment...",
  initialValue = "",
  onCancel,
}) => {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (trimmed.length === 0 || trimmed.length > 1000) return;

    onSubmit(trimmed);
    setContent("");
  };

  const isValid = content.trim().length > 0 && content.trim().length <= 1000;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        {onCancel && (
          <View style={styles.header}>
            <Text style={styles.editingText}>Editing comment</Text>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={content}
            onChangeText={setContent}
            placeholder={placeholder}
            placeholderTextColor="#C7C7CC"
            multiline
            maxLength={1000}
            editable={!isSubmitting}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!isValid || isSubmitting) && styles.sendButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>

        {content.length > 900 && (
          <Text style={styles.counter}>{content.length}/1000</Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  editingText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  cancelText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    color: "#000000",
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
  },
  sendButtonDisabled: {
    backgroundColor: "#C7C7CC",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  counter: {
    fontSize: 11,
    color: "#8E8E93",
    textAlign: "right",
    marginTop: 4,
  },
});
