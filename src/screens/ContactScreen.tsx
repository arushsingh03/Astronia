import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

const ContactScreen: React.FC = () => {
  const [showOptions, setShowOptions] = useState(false);

  const contactDetails = {
    phone: "+91 9918072158",
    email: "rajvendra.singh.knp@gmail.com",
    address: "Saket Nagar, Kanpur 208014, IN",
  };

  const handleCall = () => {
    Linking.openURL(`tel:${contactDetails.phone}`).catch((err) =>
      console.error("Error opening dialer", err)
    );
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${contactDetails.email}`).catch((err) =>
      console.error("Error opening email app", err)
    );
  };

  const handleGetInTouchPress = () => {
    setShowOptions(!showOptions);
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

        {/* Toggle button for call/mail options */}
        <TouchableOpacity style={styles.button} onPress={handleGetInTouchPress}>
          <Text style={styles.buttonText}>Get in Touch</Text>
        </TouchableOpacity>

        {showOptions && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionButton} onPress={handleCall}>
              <Ionicons name="call" size={24} color="#fff" />
              <Text style={styles.optionText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={handleEmail}>
              <Ionicons name="mail" size={24} color="#fff" />
              <Text style={styles.optionText}>Email</Text>
            </TouchableOpacity>
          </View>
        )}
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
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "auto",
    marginTop: 20,
    alignSelf: "center",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "#4b9cf6",
    borderRadius: 8,
    alignSelf: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    flex: 1,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default ContactScreen;
