// arquivo destinado a guardar a "primeira tela da família"
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";

export default function Familia() {
  const router = useRouter();

  function abrirSaibaMaisFamilia() {
    return;
  }

  function entrarEmFamilia() {
    return;
  }

  function criarFamilia() {
    router.push("../criar");
    return;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.familyIcon}>
          <MaterialIcons name="family-restroom" size={50} color="#000000" />
        </View>

        <Text style={styles.title}>Bem Vindo À Gestão Familiar</Text>

        <Text style={styles.subtitle}>
          Você ainda não faz parte de um grupo familiar. Conecte-se com seus
          entes queridos para gerir o patrimônio em conjunto.
        </Text>
      </View>

      <View style={styles.body}>
        <TextInput
          style={styles.input}
          placeholder="Digite o código da família"
          placeholderTextColor="#787581"
          keyboardType="default"
        />

        <TouchableOpacity
          style={styles.confirmarButton}
          activeOpacity={0.7}
          onPress={entrarEmFamilia}
        >
          <Text style={styles.textConfirmarButton}>Confirmar e Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.criarFamiliaButton}
          activeOpacity={0.7}
          onPress={criarFamilia}
        >
          <Text style={styles.textCriarFamiliaButton}>Criar minha família</Text>
        </TouchableOpacity>

        <Text>
          Não tem um código?{" "}
          <Text style={styles.textLink} onPress={abrirSaibaMaisFamilia}>
            Saiba mais.
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1252",
    justifyContent: "center",
  },

  header: {
    paddingHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    marginBottom: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 10,
  },

  familyIcon: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },

  body: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    margin: 20,
    borderRadius: 30,
    padding: 30,
  },

  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    fontSize: 18,
  },

  confirmarButton: {
    backgroundColor: "#1D1252",
    padding: 20,
    borderRadius: 5,
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
    color: "white",
  },

  textConfirmarButton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  criarFamiliaButton: {
    borderColor: "#1D1252",
    borderWidth: 1,
    padding: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
    color: "#1D1252",
  },

  textCriarFamiliaButton: {
    color: "#1D1252",
    fontWeight: "bold",
    fontSize: 18,
  },

  textLink: {
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
});
