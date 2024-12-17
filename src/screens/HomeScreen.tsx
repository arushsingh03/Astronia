import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types"; 
const HomeScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ImageBackground
      source={{
        uri: "https://plus.unsplash.com/premium_photo-1671721438260-1adb3749253f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Logo Image */}
        <Image
          source={{
            uri: "https://i.imgur.com/2daYbzq.png",
          }}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title and Subtitle */}
        <Text style={styles.title}>Welcome to Astronia</Text>
        <Text style={styles.subtitle}>
          Your trusted source for managing and identifying medicines.
        </Text>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Directory")}
        >
          <Text style={styles.buttonText}>Medicine Directory</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("DoctorDirectory")}
        >
          <Text style={styles.buttonText}>Doctor Directory</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate("Contact")}
        >
          <Text style={styles.buttonTextSecondary}>Contact</Text>
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
  logo: {
    width: 120, // Adjust width as needed
    height: 120, // Adjust height as needed
    marginBottom: 20,
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
