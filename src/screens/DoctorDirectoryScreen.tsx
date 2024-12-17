import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Doctor, Medicine } from "../navigation/types";

const DoctorDirectoryScreen: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Form state
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "DoctorDirectory">
    >();

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const storedDoctors = await AsyncStorage.getItem("doctors");
      if (storedDoctors) {
        setDoctors(JSON.parse(storedDoctors));
      }
    } catch (error) {
      console.error("Error loading doctors:", error);
    }
  };

  const saveDoctors = async (updatedDoctors: Doctor[]) => {
    try {
      await AsyncStorage.setItem("doctors", JSON.stringify(updatedDoctors));
    } catch (error) {
      console.error("Error saving doctors:", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Needed", "Please allow access to your photos.");
      return;
    }

    // Validate input fields
    if (!doctorName.trim()) {
      Alert.alert("Error", "Please enter doctor's name");
      return;
    }
    if (!specialty.trim()) {
      Alert.alert("Error", "Please enter doctor's specialty");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Error", "Please enter doctor's address");
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter doctor's phone number");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newDoctor: Doctor = {
        id: Date.now().toString(),
        name: doctorName.trim(),
        specialty: specialty.trim(),
        address: address.trim(),
        phoneNumber: phoneNumber.trim(),
        image: result.assets[0].uri,
        medicines: [], // Initialize with empty medicines array
      };

      const updatedDoctors = [...doctors, newDoctor].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setDoctors(updatedDoctors);
      saveDoctors(updatedDoctors);

      // Reset form
      setDoctorName("");
      setSpecialty("");
      setAddress("");
      setPhoneNumber("");
      setIsModalVisible(false);
    }
  };

  const deleteDoctor = async (id: string) => {
    const updatedDoctors = doctors.filter((doctor) => doctor.id !== id);
    setDoctors(updatedDoctors);
    saveDoctors(updatedDoctors);
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate("DoctorDetails", { doctor: item })}
    >
      <Image source={{ uri: item.image }} style={styles.doctorImage} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        <Text style={styles.doctorContact}>{item.phoneNumber}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            "Delete Doctor",
            "Are you sure you want to delete this doctor?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Delete",
                onPress: () => deleteDoctor(item.id),
                style: "destructive",
              },
            ]
          );
        }}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Doctor Directory</Text>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add Doctor</Text>
          </TouchableOpacity>

          <FlatList
            data={filteredDoctors}
            keyExtractor={(item) => item.id}
            renderItem={renderDoctor}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No doctors added yet</Text>
              </View>
            }
          />

          <Modal transparent visible={isModalVisible} animationType="slide">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContainer}>
                <ScrollView
                  contentContainerStyle={styles.modalContent}
                  keyboardShouldPersistTaps="handled"
                >
                  <Text style={styles.modalTitle}>Add New Doctor</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Doctor's Name"
                    value={doctorName}
                    onChangeText={setDoctorName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Specialty"
                    value={specialty}
                    onChangeText={setSpecialty}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                    multiline
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={pickImage}
                  >
                    <Text style={styles.modalButtonText}>Pick Image</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f8f8f8" },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#020617",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    padding: 10,
  },
  doctorImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  doctorInfo: {
    paddingHorizontal: 10,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  doctorSpecialty: {
    color: "gray",
    fontSize: 16,
  },
  doctorContact: {
    color: "#020617",
    fontSize: 16,
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: "#f87171",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  deleteButtonText: { color: "#fff", fontWeight: "bold" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: { fontSize: 18, color: "gray" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  modalButton: {
    backgroundColor: "#020617",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  cancelButton: { backgroundColor: "red" },
});

export default DoctorDirectoryScreen;
