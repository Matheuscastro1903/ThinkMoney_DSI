import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatMessageProps {
  text: string;
  isChatbot: boolean;
}

export default function ChatMessage({ text, isChatbot }: ChatMessageProps) {
  return (
    <View style={[
      styles.bubble, 
      isChatbot ? styles.ia : styles.user
    ]}>
      <Text style={[
        styles.text,
        { color: isChatbot ? "#1D1252" : "#FFF" } // Texto branco para o usuário, escuro para IA
      ]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    marginTop: 20, 
    borderRadius: 15,
    padding: 15,
  },
  text: {
    lineHeight: 20,
    fontSize: 15,
  },
  ia: {
    backgroundColor: "#e9e9e9",
    marginLeft: 20,
    marginRight: 80,
    borderBottomLeftRadius: 2, // Detalhe de design: ponta do balão
  },
  user: {
    backgroundColor: "#1D1252",
    marginLeft: 80,
    marginRight: 20,
    borderBottomRightRadius: 2, // Detalhe de design: ponta do balão
  },
});



