import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BotaoFotoProps {
  onPress: () => void;
  imagemUri?: string | null; 
}

export default function InputImagem({ onPress, imagemUri }: BotaoFotoProps) {
  return (
    <TouchableOpacity 
      
      style={[styles.container, imagemUri && styles.containerComFoto]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {imagemUri ? (
        
        <View style={styles.imagemContainer}>
          <Image source={{ uri: imagemUri }} style={styles.imagem} />
          
          
          <View style={styles.overlayEdicao}>
            <Ionicons name="pencil" size={20} color="#FFF" />
          </View>
        </View>
      ) : (
      
        <View style={styles.contentVazio}>
          <Ionicons name="camera-outline" size={32} color="#888" />
          <Text style={styles.text}>Escolha uma foto</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  //estilo base
  container: {
    width: '100%',
    height: 250,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ced4da',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20
  },
  //quando tem foto a borda vira solid
  containerComFoto: {
    borderStyle: 'solid',
    borderWidth: 0, 
    backgroundColor: 'transparent',
  },
  
  //quando estiver vazio
  contentVazio: {
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },

  //estado preenchido 
  imagemContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden', // Impede que as pontas quadradas da foto saiam pelo arredondamento
  },
  imagem: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Faz a foto preencher o espaço sem distorcer (tipo CSS object-fit)
  },
  overlayEdicao: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo preto semi-transparente
    padding: 8,
    borderRadius: 20, 
  }
});