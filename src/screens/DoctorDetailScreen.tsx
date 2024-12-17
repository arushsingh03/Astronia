import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Doctor, Medicine } from "../navigation/types";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";

const DoctorDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "DoctorDetails">>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { doctor } = route.params;
  const [selectedMedicines, setSelectedMedicines] = useState<Medicine[]>(
    doctor.medicines || []
  );
  const [availableMedicines, setAvailableMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const storedMedicines = await AsyncStorage.getItem("medicines");
      if (storedMedicines) {
        setAvailableMedicines(JSON.parse(storedMedicines));
      }
    } catch (error) {
      console.error("Error loading medicines:", error);
    }
  };

  const toggleMedicineSelection = (medicine: Medicine) => {
    const isSelected = selectedMedicines.some((m) => m.id === medicine.id);

    if (isSelected) {
      // Remove medicine
      setSelectedMedicines((prev) => prev.filter((m) => m.id !== medicine.id));
    } else {
      // Add medicine
      setSelectedMedicines((prev) => [...prev, medicine]);
    }
  };

  const saveMedicinesForDoctor = async () => {
    try {
      // Load current doctors
      const storedDoctors = await AsyncStorage.getItem("doctors");
      if (storedDoctors) {
        const doctors: Doctor[] = JSON.parse(storedDoctors);

        // Find and update the current doctor
        const updatedDoctors = doctors.map((d) =>
          d.id === doctor.id ? { ...d, medicines: selectedMedicines } : d
        );

        // Save updated doctors
        await AsyncStorage.setItem("doctors", JSON.stringify(updatedDoctors));

        Alert.alert("Success", "Medicines saved for this doctor");
      }
    } catch (error) {
      console.error("Error saving medicines for doctor:", error);
      Alert.alert("Error", "Could not save medicines");
    }
  };

  const handleCallDoctor = () => {
    Linking.openURL(`tel:${doctor.phoneNumber}`);
  };

  const renderMedicine = ({ item }: { item: Medicine }) => {
    const isSelected = selectedMedicines.some((m) => m.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.medicineItem, isSelected && styles.selectedMedicineItem]}
        onPress={() => toggleMedicineSelection(item)}
      >
        <Image source={{ uri: item.image }} style={styles.medicineThumbnail} />
        <View style={styles.medicineDetails}>
          <Text style={styles.medicineName}>{item.name}</Text>
          <Text style={styles.medicineCategory}>{item.category}</Text>
        </View>
        {isSelected && (
          <View style={styles.selectedOverlay}>
            <Text style={styles.selectedText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
        {/* Doctor Profile Section */}
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>

          <View style={styles.contactActions}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleCallDoctor}
            >
              <Ionicons name="call" size={20} color="white" />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: "#3b82f6" }]}
              onPress={() => {
                // You can implement SMS or email functionality here
                Alert.alert(
                  "Coming Soon",
                  "Contact method not implemented yet"
                );
              }}
            >
              <Ionicons name="chatbubble" size={20} color="white" />
              <Text style={styles.contactButtonText}>Message</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactInfoRow}>
              <Ionicons name="location" size={20} color="#020617" />
              <Text style={styles.contactText}>{doctor.address}</Text>
            </View>
            <View style={styles.contactInfoRow}>
              <Ionicons name="call" size={20} color="#020617" />
              <Text style={styles.contactText}>{doctor.phoneNumber}</Text>
            </View>
          </View>
        </View>

        {/* Medicines Section */}
        <View style={styles.medicinesSection}>
          <Text style={styles.sectionTitle}>Associated Medicines</Text>

          <FlatList
            data={availableMedicines}
            keyExtractor={(item) => item.id}
            renderItem={renderMedicine}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No medicines available</Text>
            }
          />

          {selectedMedicines.length > 0 && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveMedicinesForDoctor}
            >
              <Text style={styles.saveButtonText}>
                Save Associated Medicines ({selectedMedicines.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  profileContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  doctorImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#020617",
  },
  doctorName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  doctorSpecialty: {
    fontSize: 18,
    color: "gray",
    marginBottom: 15,
  },
  contactActions: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  contactButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
  },
  contactInfo: {
    width: "100%",
    paddingHorizontal: 20,
  },
  contactInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
    flexWrap: "wrap",
    flex: 1,
  },
  medicinesSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  medicineItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  selectedMedicineItem: {
    backgroundColor: "#e6f2ff",
  },
  medicineThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  medicineCategory: {
    color: "gray",
  },
  selectedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  selectedText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#020617",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DoctorDetailsScreen;
