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
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  PinchGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
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
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [tempSelection, setTempSelection] = useState<Set<string>>(new Set());
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [showAllImages, setShowAllImages] = useState<boolean>(true);
  const [scale] = useState(new Animated.Value(1));

  useEffect(() => {
    loadMedicines();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [searchQuery, availableMedicines, showAllImages]);

  useEffect(() => {
    if (filteredMedicines.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= filteredMedicines.length) {
      setCurrentIndex(filteredMedicines.length - 1);
    }
  }, [filteredMedicines]);

  const loadMedicines = async () => {
    try {
      const storedMedicines = await AsyncStorage.getItem("medicines");
      const storedSelected = await AsyncStorage.getItem(
        `selectedMedicines_${doctor.id}`
      );
      const storedTempSelection = await AsyncStorage.getItem(
        `tempSelection_${doctor.id}`
      );

      if (storedMedicines) {
        const parsedMedicines = JSON.parse(storedMedicines);
        setAvailableMedicines(parsedMedicines);
      }

      if (storedSelected) {
        const parsedSelected = JSON.parse(storedSelected);
        setSelectedMedicines(parsedSelected);
        setFilteredMedicines(parsedSelected);
      }

      if (storedTempSelection) {
        const parsedTempSelection = JSON.parse(storedTempSelection);
        setTempSelection(new Set(parsedTempSelection));
      }
    } catch (error) {
      console.error("Error loading medicines:", error);
    }
  };

  const saveTempSelection = async (selection: Set<string>) => {
    try {
      await AsyncStorage.setItem(
        `tempSelection_${doctor.id}`,
        JSON.stringify(Array.from(selection))
      );
    } catch (error) {
      console.error("Error saving temp selection:", error);
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
    let medicinesSource =
      showAllImages || selectionMode ? availableMedicines : selectedMedicines;

    const filtered = medicinesSource.filter((medicine) =>
      medicine.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredMedicines(filtered);
  };

  const toggleMedicineSelection = (medicineId: string) => {
    if (!selectionMode) {
      const medicineIndex = filteredMedicines.findIndex(
        (m) => m.id === medicineId
      );
      handleMedicineView(medicineIndex);
      return;
    }

    setTempSelection((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(medicineId)) {
        newSelection.delete(medicineId);
      } else {
        newSelection.add(medicineId);
      }
      saveTempSelection(newSelection);
      return newSelection;
    });
  };

  const handleMedicineView = (medicineIndex: number) => {
    setCurrentIndex(medicineIndex);
    setRotation(0);
    scale.setValue(1);
    setIsModalVisible(true);
  };

  const selectAll = () => {
    const newSelection = new Set(
      filteredMedicines.map((medicine) => medicine.id)
    );
    setTempSelection(newSelection);
    saveTempSelection(newSelection);
  };

  const deselectAll = () => {
    setTempSelection(new Set());
    saveTempSelection(new Set());
  };

  const confirmSelection = () => {
    const newSelectedMedicines = availableMedicines.filter((medicine) =>
      tempSelection.has(medicine.id)
    );
    setSelectedMedicines(newSelectedMedicines);
    saveSelectedMedicines(newSelectedMedicines);
    setSelectionMode(false);
    setShowAllImages(false);
    setFilteredMedicines(newSelectedMedicines);
    Alert.alert("Success", "Medicine associations updated successfully");
  };

  const toggleSelectionMode = () => {
    if (!selectionMode) {
      setTempSelection(
        new Set(selectedMedicines.map((medicine) => medicine.id))
      );
      setShowAllImages(true);
    } else {
      setShowAllImages(false);
      setTempSelection(
        new Set(selectedMedicines.map((medicine) => medicine.id))
      );
    }
    setSelectionMode(!selectionMode);
    filterMedicines();
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setRotation(0);
      scale.setValue(1);
    }
  };

  const goToNext = () => {
    if (currentIndex < filteredMedicines.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setRotation(0);
      scale.setValue(1);
    }
  };

  const rotateImage = () => {
    setRotation((prev) => prev + 90);
  };

  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: true }
  );

  const onPinchHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  };

  const renderModalContent = () => (
    <GestureHandlerRootView style={styles.modalContainer}>
      <TouchableOpacity
        style={styles.closeIcon}
        onPress={() => {
          setIsModalVisible(false);
          scale.setValue(1);
        }}
      >
        <Ionicons name="close-circle" size={35} color="#fff" />
      </TouchableOpacity>

      {filteredMedicines[currentIndex] && (
        <>
          <PinchGestureHandler
            onGestureEvent={onPinchGestureEvent}
            onHandlerStateChange={onPinchHandlerStateChange}
          >
            <Animated.View style={styles.imageWrapper}>
              <Animated.Image
                source={{ uri: filteredMedicines[currentIndex].image }}
                style={[
                  styles.modalImage,
                  {
                    transform: [{ rotate: `${rotation}deg` }, { scale: scale }],
                  },
                ]}
                resizeMode="contain"
              />
            </Animated.View>
          </PinchGestureHandler>

          <Text style={styles.modalText}>
            {filteredMedicines[currentIndex].name}
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
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={rotateImage} style={styles.navButton}>
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
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </GestureHandlerRootView>
  );

  return (
    <View style={styles.container}>
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

      <View style={styles.controlsContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search medicines..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => {
              setShowAllImages(!showAllImages);
              filterMedicines();
            }}
            style={[styles.actionButton, showAllImages && styles.activeButton]}
          >
            <Text style={styles.buttonText}>
              {showAllImages ? "Show Selected" : "Show All"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleSelectionMode}
            style={[styles.filterButton, selectionMode && styles.activeButton]}
          >
            <Ionicons name="filter" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {selectionMode && (
          <View style={styles.selectionControls}>
            <TouchableOpacity
              onPress={selectAll}
              style={styles.selectionButton}
            >
              <Text style={styles.buttonText}>Select All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={deselectAll}
              style={styles.deselectButton}
            >
              <Text style={styles.buttonText}>Deselect All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmSelection}
              style={styles.confirmButton}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={filteredMedicines}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.medicineItem,
              selectionMode &&
                tempSelection.has(item.id) &&
                styles.selectedMedicineItem,
              !selectionMode &&
                selectedMedicines.some((m) => m.id === item.id) &&
                styles.associatedMedicineItem,
            ]}
            onPress={() => toggleMedicineSelection(item.id)}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.medicineThumbnail}
              resizeMode="cover"
            />
            <Text style={styles.medicineName}>{item.name}</Text>
            {selectionMode && tempSelection.has(item.id) && (
              <View style={styles.selectedOverlay}>
                <Ionicons name="checkmark-circle" size={24} color="#28a745" />
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={isModalVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => {
          setIsModalVisible(false);
          scale.setValue(1);
        }}
      >
        {renderModalContent()}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    textAlign: "center",
  },
  profileContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 1,
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
  controlsContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#0056b3",
  },
  filterButton: {
    backgroundColor: "#020617",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  selectionControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
  selectionButton: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  deselectButton: {
    backgroundColor: "#020617",
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  medicineItem: {
    flex: 1 / 3,
    margin: 5,
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedMedicineItem: {
    borderWidth: 1.5,
    borderColor: "#28a745",
  },
  associatedMedicineItem: {
    borderWidth: 1.5,
    borderColor: "#020617",
  },
  medicineThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  medicineName: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 12,
  },
  selectedOverlay: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  exitSelectionButton: {
    backgroundColor: "#f44336",
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
    marginBottom: 25,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
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
  imageWrapper: {
    width: "100%",
    height: 700,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(97, 97, 97, 0.2)", 
    marginVertical: 10,
    borderRadius: 8,
  },
});

export default DoctorDetailsScreen;
