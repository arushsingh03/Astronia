import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SelectedImagesScreenProps } from "../navigation/types";

const SelectedImagesScreen: React.FC<SelectedImagesScreenProps> = ({
  route,
}) => {
  const { selectedMedicines } = route.params;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalVisible(true);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < selectedMedicines.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Image Grid */}
      <FlatList
        data={selectedMedicines}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => openModal(index)}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.medicineName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        numColumns={2}
      />

      {/* Modal for viewing images */}
      <Modal
        visible={isModalVisible}
        transparent={false} // Full-screen modal
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: selectedMedicines[currentIndex].image }}
            style={styles.modalImage}
            resizeMode="contain" 
          />
          <Text style={styles.modalText}>
            {selectedMedicines[currentIndex].name}
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

            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
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
    padding: 15,
    backgroundColor: "#f7f8fa",
  },
  imageContainer: {
    width: "48%",
    margin: 6,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  medicineName: {
    padding: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)", 
    padding: 20,
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
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "#020617",
    fontWeight: "600",
  },
  closeText: {
    fontSize: 18,
    color: "#ff4d4d",
    fontWeight: "600",
    textAlign: "center",
    marginHorizontal: 25,
  },
});

export default SelectedImagesScreen;
