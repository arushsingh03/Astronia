import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define the Medicine interface
export interface Medicine {
  id: string;
  name: string;
  category: string;
  image: string;
}

// Update the Doctor type to match your requirements
export type Doctor = {
  id: string;
  name: string;
  specialty: string;  // Added specialty
  address: string;
  phoneNumber: string;  // Changed from phone to phoneNumber for consistency
  image: string;
  medicines?: Medicine[];  // Optional array of associated medicines
};

// Expand RootStackParamList to include new routes
export type RootStackParamList = {
  Home: undefined;
  Directory: undefined;
  SelectedImages: {
    selectedMedicines: Medicine[];
  };
  Contact: undefined;
  DoctorDirectory: undefined;  // New route for doctor directory
  DoctorDetails: {             // New route for doctor details
    doctor: Doctor;
  };
};

// Create type definitions for screen props
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type DirectoryScreenProps = NativeStackScreenProps<RootStackParamList, 'Directory'>;
export type SelectedImagesScreenProps = NativeStackScreenProps<RootStackParamList, 'SelectedImages'>;
export type ContactScreenProps = NativeStackScreenProps<RootStackParamList, 'Contact'>;

// Add new screen prop types
export type DoctorDirectoryScreenProps = NativeStackScreenProps<RootStackParamList, 'DoctorDirectory'>;
export type DoctorDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'DoctorDetails'>;