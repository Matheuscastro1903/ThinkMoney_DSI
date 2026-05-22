import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export async function pegarFotoDaGaleria(): Promise<string | null> {
  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (!resultado.canceled) {
    return resultado.assets[0].uri;
  }
  
  return null;
}

export async function tirarFotoCamera(): Promise<string | null> {
  const permissao = await ImagePicker.requestCameraPermissionsAsync();
  
  if (!permissao.granted) {
    Alert.alert("Aviso", "Precisamos de permissão para abrir a câmera.");
    return null;
  }

  const resultado = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (!resultado.canceled) {
    return resultado.assets[0].uri;
  }
  
  return null;
}