import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1710954097426-a84fcb7afaa5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGxhbnN8ZW58MHx8MHx8fDA%3D" }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to PillKeeper</Text>
        <Text style={styles.subtitle}>
          Your trusted source for managing and identifying medicines.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Directory" as never)}
        >
          <Text style={styles.buttonText}>Go to Directory</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate("Contact" as never)}
        >
          <Text style={styles.buttonTextSecondary}>Contact Us</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: "100%",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#d9d9d9",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#020617",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSecondary: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    borderColor: "#020617",
    borderWidth: 1,
  },
  buttonTextSecondary: {
    color: "#020617",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HomeScreen;
