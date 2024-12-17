import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define the Medicine interface
export interface Medicine {
  id: string;
  name: string;
  category: string;
  image: string;
}

// Define the RootStackParamList
export type RootStackParamList = {
  Home: undefined;
  Directory: undefined;
  SelectedImages: { 
    selectedMedicines: Medicine[]; 
  };
  Contact: undefined;
};

// Create type definitions for screen props
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type DirectoryScreenProps = NativeStackScreenProps<RootStackParamList, 'Directory'>;
export type SelectedImagesScreenProps = NativeStackScreenProps<RootStackParamList, 'SelectedImages'>;
export type ContactScreenProps = NativeStackScreenProps<RootStackParamList, 'Contact'>;