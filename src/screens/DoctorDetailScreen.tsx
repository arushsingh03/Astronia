import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, Doctor, Medicine } from "../navigation/types";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DoctorDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "DoctorDetails">>();
  const navigation = useNavigation();

  const { doctor } = route.params;
  const [selectedMedicines, setSelectedMedicines] = useState<Medicine[]>(
    doctor.medicines || []
  );
  const [availableMedicines, setAvailableMedicines] = useState<Medicine[]>([]);
  const [showAssociatedOnly, setShowAssociatedOnly] = useState<boolean>(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);

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

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setRotation(0);
    setIsModalVisible(true);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setRotation(0);
    }
  };

  const goToNext = () => {
    if (currentIndex < selectedMedicines.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setRotation(0);
    }
  };

  const rotateImage = () => {
    setRotation((prev) => prev + 90);
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
          numColumns={3}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.medicineItem}
              onPress={() => openModal(index)} // Open image modal
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

      {/* Modal for Viewing and Rotating Image */}
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

          {/* Image with Rotation */}
          <Image
            source={{ uri: selectedMedicines[currentIndex].image }}
            style={[
              styles.modalImage,
              { transform: [{ rotate: `${rotation}deg` }] },
            ]}
            resizeMode="contain"
          />
          <Text style={styles.modalText}>
            {selectedMedicines[currentIndex].name}
          </Text>

          {/* Bottom Navigation for Previous, Rotate, and Next */}
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

            <TouchableOpacity onPress={rotateImage} style={styles.navButton}>
              <Ionicons name="refresh" size={20} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goToNext}
              disabled={currentIndex === selectedMedicines.length - 1}
              style={[
                styles.navButton,
                currentIndex === selectedMedicines.length - 1 &&
                  styles.disabledButton,
              ]}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  medicineItem: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    width: "30%",
  },
  medicineThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: "bold",
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
  }
});

export default DoctorDetailsScreen;
