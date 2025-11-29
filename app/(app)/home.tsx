import React from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Button } from "../../src/components/Button";
import { useAuth, useLogout } from "../../src/hooks/useAuth";

export default function HomeScreen() {
  const { user, isLoadingUser } = useAuth();
  const { logout, isLoading: isLoggingOut } = useLogout();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: logout,
        },
      ],
      { cancelable: true }
    );
  };

  if (isLoadingUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.welcomeText}>Welcome!</Text>

        {user && (
          <View style={styles.userInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{user.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>

            {user.createdAt && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Member since:</Text>
                <Text style={styles.value}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Quick Actions</Text>

        <View style={styles.actionItem}>
          <Text style={styles.actionText}>🔐 Your account is secure</Text>
        </View>

        <View style={styles.actionItem}>
          <Text style={styles.actionText}>✅ All systems operational</Text>
        </View>

        <View style={styles.actionItem}>
          <Text style={styles.actionText}>📱 Enjoy your app!</Text>
        </View>
      </View>

      <Button
        title="Logout"
        onPress={handleLogout}
        loading={isLoggingOut}
        variant="secondary"
        style={styles.logoutButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 24,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  userInfo: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  value: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  actionsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  actionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  actionText: {
    fontSize: 15,
    color: "#555",
  },
  logoutButton: {
    marginTop: 8,
  },
});
