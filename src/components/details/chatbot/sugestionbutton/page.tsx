import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SuggestionButtonProps {
  text: string;
  onClick: (value: string) => void;
}

export default function SuggestionButton({ text, onClick }: SuggestionButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.buttonSugestions} 
      activeOpacity={0.7}
      onPress={() => onClick(text)} //quando for pressionado puxe afunção que será passada e mande o 
      //texto que está autoamticametne como parâmetro
    >
      <Text style={styles.textSugestions}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonSugestions: {
    backgroundColor: "#F0F0F0", // Exemplo de cor de fundo, ajuste conforme seu design
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  textSugestions: {
    color: "#1D1252",
    fontSize: 14,
    fontWeight: "500",
  },
});