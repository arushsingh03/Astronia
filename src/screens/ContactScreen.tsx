import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ContactScreen: React.FC = () => {
  const contactDetails = {
    phone: "+91 9918072158",
    email: "rajvendra.singh.knp@gmail.com",
    address: "Saket Nagar, Kanpur 208014, IN",
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1516826435551-36a8a09e4526?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1lZGljaW5lfGVufDB8fDB8fHww",
      }}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Contact Information</Text>

        <View style={styles.contactItem}>
          <Ionicons name="call" size={24} color="#2563eb" />
          <Text style={styles.contactText}>{contactDetails.phone}</Text>
        </View>

        <View style={styles.contactItem}>
          <Ionicons name="mail" size={24} color="#2563eb" />
          <Text style={styles.contactText}>{contactDetails.email}</Text>
        </View>

        <View style={styles.contactItem}>
          <Ionicons name="location" size={24} color="#2563eb" />
          <Text style={styles.contactText}>{contactDetails.address}</Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get in Touch</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    width: "90%",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#020617",
    marginBottom: 30,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    textAlign: "center",
  },
  contactText: {
    fontSize: 18,
    color: "#020617",
    marginLeft: 10,
    fontWeight: "500",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ContactScreen;
