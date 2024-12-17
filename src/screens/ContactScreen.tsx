import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";

const ContactScreen: React.FC = () => {
  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert("Please fill all fields");
      return;
    }

    // Handle the submission logic here, for now, we're just alerting
    Alert.alert("Message Submitted");

    // Reset fields after submission
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1710954097426-a84fcb7afaa5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGxhbnN8ZW58MHx8MHx8fDA%3D",
      }}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Contact Us</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          keyboardType="email-address"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Your Message"
          multiline
          numberOfLines={4}
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: "100%",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#fff",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#020617",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ContactScreen;
