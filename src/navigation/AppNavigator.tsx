import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, StatusBar } from "react-native";

import { RootStackParamList } from "./types";
import HomeScreen from "../screens/HomeScreen";
import ContactScreen from "../screens/ContactScreen";
import DirectoryScreen from "../screens/DirectoryScreen";
import SelectedImagesScreen from "../screens/SelectedImagesScreen";
import DoctorDirectoryScreen from "../screens/DoctorDirectoryScreen";
import DoctorDetailsScreen from "../screens/DoctorDetailScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="default" backgroundColor="#020617" />

    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="Directory"
        component={DirectoryScreen}
        options={{
          title: "Medicine Directory",
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="SelectedImages"
        component={SelectedImagesScreen}
        options={{
          title: "View Selected Medicines",
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          title: "Contact",
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="DoctorDirectory"
        component={DoctorDirectoryScreen}
        options={{
          title: "Doctor Directory",
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="DoctorDetails"
        component={DoctorDetailsScreen}
        options={{
          title: "Doctor Details",
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerShown: false, // Hide the default header since we have a custom back button
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "#020617",
    elevation: 0,
    shadowOpacity: 0,
    paddingTop: 10,
  },
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export default AppNavigator;
