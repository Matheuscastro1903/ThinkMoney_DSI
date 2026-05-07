import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function HeaderBot() {
  return (
    <View style={styles.int}>
      <View style={styles.logo}>
        <MaterialCommunityIcons
          name="robot"
          size={30}
          style={styles.icon}
        />
      </View>
      
      <Text style={styles.title}>Olá, sou o Din$</Text>
      
      <Text style={styles.subtitle}>
        Sua inteligência artificial para gestão de patrimônio e
        investimentos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  int: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 6,
    marginTop: 0,
  },
  logo: {
    backgroundColor: "#e9e9e9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: 64,
    marginBottom: 10,
    marginTop: 4,
  },
  icon: {
    color: "#1D1252",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: "#333",
    lineHeight: 22,
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
});