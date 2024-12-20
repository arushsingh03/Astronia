import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  PinchGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SelectedImagesScreenProps } from "../navigation/types";

const SelectedImagesScreen: React.FC<SelectedImagesScreenProps> = ({
  route,
}) => {
  const { selectedMedicines } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);

  const scale = new Animated.Value(1);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setRotation(0);
    scale.setValue(1);
    setIsModalVisible(true);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setRotation(0);
      scale.setValue(1);
    }
  };

  const goToNext = () => {
    if (currentIndex < selectedMedicines.length - 1) {
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
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => setIsModalVisible(false)}
        >
          <Ionicons name="close-circle" size={35} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={rotateImage} style={styles.rotateButton}>
          <Ionicons name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <PinchGestureHandler
        onGestureEvent={onPinchGestureEvent}
        onHandlerStateChange={onPinchHandlerStateChange}
      >
        <Animated.View style={styles.imageWrapper}>
          <Animated.Image
            source={{ uri: selectedMedicines[currentIndex].image }}
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
    </GestureHandlerRootView>
  );

  return (
    <View style={styles.container}>
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

      <Modal
        visible={isModalVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        {renderModalContent()}
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 20,
    paddingBottom: 10,
  },
  closeIcon: {
    marginLeft: 20,
  },
  rotateButton: {
    marginRight: 20,
  },
  imageWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
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
});

export default SelectedImagesScreen;
