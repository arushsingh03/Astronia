import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Doctor } from "../navigation/types";

const DoctorDirectoryScreen: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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

  const deleteDoctor = async (id: string) => {
    const updatedDoctors = doctors.filter((doctor) => doctor.id !== id);
    setDoctors(updatedDoctors);
    saveDoctors(updatedDoctors);
  };

  const addDoctor = () => {
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

    const newDoctor: Doctor = {
      id: Date.now().toString(),
      name: doctorName.trim(),
      specialty: specialty.trim(),
      address: address.trim(),
      phoneNumber: phoneNumber.trim(),
      medicines: [],
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
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => navigation.navigate("DoctorDetails", { doctor: item })}
    >
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.doctorSpecialty} numberOfLines={1}>
          {item.specialty}
        </Text>
        <Text style={styles.doctorContact} numberOfLines={1}>
          {item.phoneNumber}
        </Text>
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
      <Text style={styles.screenTitle}>Doctor Profile</Text>

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
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
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
                    onPress={addDoctor}
                  >
                    <Text style={styles.modalButtonText}>Add Doctor</Text>
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

const windowWidth = Dimensions.get("window").width;
const itemWidth = (windowWidth - 30) / 2; // 30 accounts for padding and gap

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
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
    marginBottom: 15,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  gridItem: {
    width: itemWidth,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    padding: 8,
  },
  doctorInfo: {
    paddingHorizontal: 5,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  doctorSpecialty: {
    color: "gray",
    fontSize: 14,
  },
  doctorContact: {
    color: "#020617",
    fontSize: 14,
    marginTop: 3,
  },
  deleteButton: {
    backgroundColor: "#0369a1",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: "flex-end",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
  },
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
    alignSelf: "center",
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
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "red",
  },
});

export default DoctorDirectoryScreen;
