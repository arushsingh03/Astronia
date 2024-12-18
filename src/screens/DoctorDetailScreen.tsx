import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Medicine } from "../navigation/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DoctorDetailsScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { doctor } = route.params;
  const [selectedMedicines, setSelectedMedicines] = useState<Medicine[]>([]);
  const [availableMedicines, setAvailableMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAssociatedOnly, setShowAssociatedOnly] = useState<boolean>(true);
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [tempSelection, setTempSelection] = useState<Set<string>>(new Set());
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    loadMedicines();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [searchQuery, availableMedicines, selectedMedicines, showAssociatedOnly]);
  useEffect(() => {
    if (filteredMedicines.length === 0) {
      setCurrentIndex(0); // Reset index if no medicines are available
    } else if (currentIndex >= filteredMedicines.length) {
      setCurrentIndex(filteredMedicines.length - 1); // Adjust index to last valid item
    }
  }, [filteredMedicines]);

  const loadMedicines = async () => {
    try {
      const storedMedicines = await AsyncStorage.getItem("medicines");
      const storedSelected = await AsyncStorage.getItem(
        `selectedMedicines_${doctor.id}`
      );

      if (storedMedicines) {
        const parsedMedicines = JSON.parse(storedMedicines);
        setAvailableMedicines(parsedMedicines);

        if (storedSelected) {
          const parsedSelected = JSON.parse(storedSelected);
          setSelectedMedicines(parsedSelected);
        }
      }
    } catch (error) {
      console.error("Error loading medicines:", error);
    }
  };

  const saveSelectedMedicines = async (updatedSelection: Medicine[]) => {
    try {
      await AsyncStorage.setItem(
        `selectedMedicines_${doctor.id}`,
        JSON.stringify(updatedSelection)
      );
    } catch (error) {
      console.error("Error saving selected medicines:", error);
    }
  };

  const filterMedicines = () => {
    const lowerQuery = searchQuery.toLowerCase();
    const medicinesToFilter = showAssociatedOnly
      ? selectedMedicines
      : availableMedicines;

    const filtered = medicinesToFilter.filter((medicine) =>
      medicine.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredMedicines(filtered);
  };

  const toggleTempSelection = (medicineId: string) => {
    setTempSelection((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(medicineId)) {
        newSelection.delete(medicineId);
      } else {
        newSelection.add(medicineId);
      }
      return newSelection;
    });
  };

  const confirmSelection = () => {
    const newSelectedMedicines = availableMedicines.filter((medicine) =>
      tempSelection.has(medicine.id)
    );
    const updatedSelected = [...newSelectedMedicines];

    setSelectedMedicines(updatedSelected);
    saveSelectedMedicines(updatedSelected);

    setTempSelection(new Set());
    setSelectionMode(false);
    setShowAssociatedOnly(true);

    Alert.alert("Selection Updated", "Your selections have been updated.");
  };

  const handleMedicinePress = (medicineIndex: number) => {
    setCurrentIndex(medicineIndex);
    setRotation(0);
    setIsModalVisible(true);
  };

  const handleMedicineLongPress = (medicine: Medicine) => {
    setSelectionMode(true);
    toggleTempSelection(medicine.id);
    Alert.alert("Selection Mode", "You can now select or deselect medicines.");
  };

  const isMedicineSelected = (medicineId: string) => {
    return (
      tempSelection.has(medicineId) ||
      selectedMedicines.some((medicine) => medicine.id === medicineId)
    );
  };

  const isMedicineDeselected = (medicineId: string) => {
    return selectionMode && !isMedicineSelected(medicineId);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setRotation(0);
    }
  };

  const goToNext = () => {
    if (currentIndex < filteredMedicines.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setRotation(0);
    }
  };

  const rotateImage = () => {
    setRotation((prev) => prev + 90);
  };

  return (
    <View style={styles.container}>
      {/* Doctor Profile */}
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
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search medicines..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Medicines List */}
      <View style={styles.medicinesSection}>
        <Text style={styles.sectionTitle}>
          {showAssociatedOnly
            ? "Associated Medicines"
            : "All Available Medicines"}
        </Text>
        <TouchableOpacity
          onPress={() => setShowAssociatedOnly((prev) => !prev)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleButtonText}>
            {showAssociatedOnly ? "Show All Medicines" : "Show Associated Only"}
          </Text>
        </TouchableOpacity>

        {selectionMode && (
          <TouchableOpacity
            onPress={confirmSelection}
            style={[styles.toggleButton, styles.confirmButton]}
          >
            <Text style={styles.toggleButtonText}>Confirm Selection</Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={filteredMedicines}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.medicineItem,
                isMedicineSelected(item.id) && styles.selectedMedicineItem,
                isMedicineDeselected(item.id) && styles.deselectedMedicineItem,
              ]}
              onPress={() => handleMedicinePress(index)}
              onLongPress={() => handleMedicineLongPress(item)}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.medicineThumbnail}
                resizeMode="cover"
              />
              <Text style={styles.medicineName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Modal for Viewing Images */}
      <Modal
        visible={isModalVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => setIsModalVisible(false)}
          >
            <Ionicons name="close-circle" size={35} color="#fff" />
          </TouchableOpacity>

          {filteredMedicines[currentIndex] ? (
            <>
              <Image
                source={{ uri: filteredMedicines[currentIndex]?.image }}
                style={[
                  styles.modalImage,
                  { transform: [{ rotate: `${rotation}deg` }] },
                ]}
                resizeMode="contain"
              />
              <Text style={styles.modalText}>
                {filteredMedicines[currentIndex]?.name}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={goToPrevious}
                  disabled={currentIndex === 0}
                  style={[
                    styles.navButton,
                    currentIndex === 0 && styles.disabledButton,
                  ]}
                >
                  <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={rotateImage}
                  style={styles.navButton}
                >
                  <Ionicons name="refresh" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={goToNext}
                  disabled={currentIndex === filteredMedicines.length - 1}
                  style={[
                    styles.navButton,
                    currentIndex === filteredMedicines.length - 1 &&
                      styles.disabledButton,
                  ]}
                >
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.errorMessage}>No image to display</Text>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  medicineItem: { margin: 5, alignItems: "center" },
  selectedMedicineItem: {
    borderWidth: 2,
    borderColor: "#4CAF50",
    opacity: 0.8, // Makes it visually distinct
  },
  errorMessage: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  deselectedMedicineItem: {
    borderColor: "red",
    borderWidth: 2,
  },
  medicineThumbnail: { width: 80, height: 80 },
  medicineName: { textAlign: "center" },
  confirmButton: { backgroundColor: "#020617", padding: 10 },

  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    marginTop: 15,
    width: "95%",
    alignSelf: "center",
  },
  toggleButton: {
    backgroundColor: "#020617",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  exitSelectionButton: {
    backgroundColor: "#f44336",
  },
  profileContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
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
  medicinesSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  closeIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  modalImage: {
    width: "100%",
    height: "80%",
    borderRadius: 10,
  },
  modalText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "#020617",
    fontWeight: "600",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 1,
  },
});

export default DoctorDetailsScreen;
