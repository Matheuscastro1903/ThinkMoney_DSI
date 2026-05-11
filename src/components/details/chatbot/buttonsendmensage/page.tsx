import React from 'react';
import { TouchableOpacity, ActivityIndicator,StyleSheet, View } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface ButtonSendMensageProps {
  onClick: (texto: string) => void;  //passando uma função que irá chamar a requiisição
  textoParaEnviar: string;         //texto passado para a requisiçãp
  isLoading: boolean;              //controla quando desabilita o botão
}

export default function ButtonSendMensage({ onClick, textoParaEnviar, isLoading }: ButtonSendMensageProps) {
  return (
    <TouchableOpacity 
      style={styles.sendButton} 
      activeOpacity={0.7} 
      //Executa a função passando o texto do input, mas trava se estiver carregando(isLoading=false-->!false=true)
      
      onPress={() => !isLoading && onClick(textoParaEnviar)}
      disabled={isLoading}
    >
      <View style={styles.box}>
        {isLoading ? (
          // Spinner branco para contrastar com o fundo escuro
          <ActivityIndicator size="small" color="white" />
        ) : (
          // Ícone original com tamanho 16 e cor branca
          <Ionicons name="send" size={16} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sendButton: {
    padding: 6,
  },
  box: {
    backgroundColor: "#1D1252",
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32, // Garante que o círculo não mude de tamanho no loading
    minHeight: 32,
  },
});