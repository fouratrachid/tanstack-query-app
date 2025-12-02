import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Text,
} from "react-native";
import { Button } from "../Button";
import { ErrorMessage } from "../ErrorMessage";
import { CreatePostDto } from "../../types/posts.types";

interface PostFormProps {
  initialValues?: Partial<CreatePostDto>;
  onSubmit: (data: CreatePostDto) => void;
  isSubmitting?: boolean;
  error?: string | null;
  submitLabel?: string;
}

export const PostForm: React.FC<PostFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  error,
  submitLabel = "Create Post",
}) => {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [content, setContent] = useState(initialValues?.content || "");
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl || "");

  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    imageUrl?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (title.trim().length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (content.trim().length < 10) {
      newErrors.content = "Content must be at least 10 characters";
    } else if (content.trim().length > 10000) {
      newErrors.content = "Content must be less than 10,000 characters";
    }

    if (imageUrl.trim() && !isValidUrl(imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const data: CreatePostDto = {
      title: title.trim(),
      content: content.trim(),
      ...(imageUrl.trim() && { imageUrl: imageUrl.trim() }),
    };

    onSubmit(data);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {error && <ErrorMessage message={error} />}

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter post title..."
            placeholderTextColor="#C7C7CC"
            maxLength={200}
            editable={!isSubmitting}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          <Text style={styles.counter}>{title.length}/200</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Content <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              errors.content && styles.inputError,
            ]}
            value={content}
            onChangeText={setContent}
            placeholder="Write your post content..."
            placeholderTextColor="#C7C7CC"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            maxLength={10000}
            editable={!isSubmitting}
          />
          {errors.content && (
            <Text style={styles.errorText}>{errors.content}</Text>
          )}
          <Text style={styles.counter}>{content.length}/10,000</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Image URL (Optional)</Text>
          <TextInput
            style={[styles.input, errors.imageUrl && styles.inputError]}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="https://example.com/image.jpg"
            placeholderTextColor="#C7C7CC"
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
          />
          {errors.imageUrl && (
            <Text style={styles.errorText}>{errors.imageUrl}</Text>
          )}
        </View>

        <Button
          title={submitLabel}
          onPress={handleSubmit}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  required: {
    color: "#FF3B30",
  },
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000000",
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  textArea: {
    minHeight: 150,
    paddingTop: 12,
  },
  counter: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "right",
    marginTop: 4,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
  },
});
