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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList, Medicine } from "../navigation/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const DirectoryScreen: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medicineName, setMedicineName] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Directory">>();

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const storedMedicines = await AsyncStorage.getItem("medicines");
        if (storedMedicines) {
          setMedicines(JSON.parse(storedMedicines));
        }
      } catch (error) {
        console.error("Error loading medicines:", error);
      }
    };
    loadMedicines();
  }, []);

  const saveMedicines = async (updatedMedicines: Medicine[]) => {
    try {
      await AsyncStorage.setItem("medicines", JSON.stringify(updatedMedicines));
    } catch (error) {
      console.error("Error saving medicines:", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Needed", "Please allow access to your photos.");
      return;
    }

    if (!medicineName.trim()) {
      Alert.alert("Error", "Please enter a medicine name");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newMedicine: Medicine = {
        id: Date.now().toString(),
        name: medicineName.trim(),
        category: "Pharmacy",
        image: result.assets[0].uri,
      };

      const updatedMedicines = [...medicines, newMedicine].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setMedicines(updatedMedicines);
      saveMedicines(updatedMedicines);

      setMedicineName("");
      setIsModalVisible(false);
    }
  };

  const toggleImageSelection = (imageUri: string) => {
    setSelectedImages((prev) =>
      prev.includes(imageUri)
        ? prev.filter((uri) => uri !== imageUri)
        : [...prev, imageUri]
    );
  };

  const proceedWithSelectedImages = () => {
    if (selectedImages.length === 0) {
      Alert.alert("Error", "Please select at least one image");
      return;
    }
    const selectedMedicines = medicines.filter((medicine) =>
      selectedImages.includes(medicine.image)
    );
    navigation.navigate("SelectedImages", { selectedMedicines });
  };

  const deleteMedicine = async (id: string) => {
    const updatedMedicines = medicines.filter((medicine) => medicine.id !== id);
    setMedicines(updatedMedicines);
    saveMedicines(updatedMedicines);
  };

  const renderMedicine = ({ item }: { item: Medicine }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.itemTouchable}
        onPress={() => toggleImageSelection(item.image)}
      >
        <Image source={{ uri: item.image }} style={styles.medicineImage} />
        <View style={styles.medicineInfo}>
          <Text style={styles.medicineName}>{item.name}</Text>
          <Text style={styles.medicineCategory}>{item.category}</Text>
        </View>
        {selectedImages.includes(item.image) && (
          <View style={styles.selectedOverlay}>
            <Text style={styles.selectedText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            "Delete Medicine",
            "Are you sure you want to delete this medicine?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Delete",
                onPress: () => deleteMedicine(item.id),
                style: "destructive",
              },
            ]
          );
        }}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Astronia</Text>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add Medicine</Text>
          </TouchableOpacity>

          <FlatList
            data={filteredMedicines}
            keyExtractor={(item) => item.id}
            renderItem={renderMedicine}
            numColumns={2}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No medicines added yet</Text>
              </View>
            }
          />

          {selectedImages.length > 0 && (
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={proceedWithSelectedImages}
            >
              <Text style={styles.proceedButtonText}>
                Proceed ({selectedImages.length} selected)
              </Text>
            </TouchableOpacity>
          )}

          <Modal transparent visible={isModalVisible} animationType="slide">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Add New Medicine</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Medicine Name"
                    value={medicineName}
                    onChangeText={setMedicineName}
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
                </View>
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
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    paddingBottom: 10,
  },
  itemTouchable: {
    flex: 1,
  },
  medicineImage: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  medicineInfo: { padding: 10 },
  medicineName: { fontWeight: "bold", fontSize: 16 },
  medicineCategory: { color: "gray" },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  selectedText: { fontSize: 30, color: "white", fontWeight: "bold" },
  deleteButton: {
    backgroundColor: "#f87171",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: 8,
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
    width: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
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
  proceedButton: {
    backgroundColor: "#020617",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  proceedButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default DirectoryScreen;
