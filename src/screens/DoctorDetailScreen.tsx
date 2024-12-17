import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
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
  const [showAssociatedOnly, setShowAssociatedOnly] = useState<boolean>(false);

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
      setSelectedMedicines((prev) => prev.filter((m) => m.id !== medicine.id));
    } else {
      setSelectedMedicines((prev) => [...prev, medicine]);
    }
  };

  const saveMedicinesForDoctor = async () => {
    try {
      const storedDoctors = await AsyncStorage.getItem("doctors");
      if (storedDoctors) {
        const doctors: Doctor[] = JSON.parse(storedDoctors);

        const updatedDoctors = doctors.map((d) =>
          d.id === doctor.id ? { ...d, medicines: selectedMedicines } : d
        );

        await AsyncStorage.setItem("doctors", JSON.stringify(updatedDoctors));
        Alert.alert("Success", "Associated medicines saved!");

        setAvailableMedicines(selectedMedicines);
        setShowAssociatedOnly(true);
      }
    } catch (error) {
      console.error("Error saving medicines:", error);
      Alert.alert("Error", "Failed to save medicines");
    }
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
      <ScrollView>
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
              onPress={() => Linking.openURL(`tel:${doctor.phoneNumber}`)}
            >
              <Ionicons name="call" size={20} color="white" />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Medicines Section */}
        <View style={styles.medicinesSection}>
          <Text style={styles.sectionTitle}>
            {showAssociatedOnly
              ? "Associated Medicines"
              : "Select Medicines to Associate"}
          </Text>

          <FlatList
            data={availableMedicines}
            keyExtractor={(item) => item.id}
            renderItem={renderMedicine}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No medicines available</Text>
            }
          />

          {!showAssociatedOnly && selectedMedicines.length > 0 && (
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  profileContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  doctorImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  doctorSpecialty: {
    fontSize: 16,
    color: "gray",
  },
  contactActions: {
    marginVertical: 10,
  },
  contactButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  contactButtonText: {
    color: "#fff",
    marginLeft: 5,
  },
  medicinesSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  medicineItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  selectedMedicineItem: {
    borderWidth: 2,
    borderColor: "#2563eb",
  },
  medicineThumbnail: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 10,
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  medicineCategory: {
    fontSize: 14,
    color: "gray",
  },
  saveButton: {
    backgroundColor: "#020617",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
    marginVertical: 20,
  },
  selectedOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedText: {
    fontSize: 20,
    color: "#2563eb",
  },
});

export default DoctorDetailsScreen;
