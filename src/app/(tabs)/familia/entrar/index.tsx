import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFamiliaAcoes } from "@/src/hooks/familia/useFamiliaAcoes";

export default function EntrarFamilia() {
  const router = useRouter();
  const { entrarEmFamilia, isLoading } = useFamiliaAcoes()
  const [codigo, setCodigo] = useState("");

  async function handleEntrar() {
    if (!codigo.trim()) return
    const sucesso = await entrarEmFamilia(codigo)
    if (sucesso) {
      router.replace('/(tabs)/familia/home')
    }
    // Erros (código inválido / genérico) são tratados com Alert dentro do hook
  }

  function handleCriarFamilia() {
    router.push("/(tabs)/familia/criar");
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
            value={codigo}
            onChangeText={setCodigo}
            autoCapitalize="characters"
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[styles.confirmarButton, isLoading && styles.buttonDisabled]}
            activeOpacity={0.7}
            onPress={handleEntrar}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.textConfirmarButton}>Confirmar e Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.criarFamiliaButton}
            activeOpacity={0.7}
            onPress={handleCriarFamilia}
            disabled={isLoading}
          >
            <Text style={styles.textCriarFamiliaButton}>
              Criar minha família
            </Text>
          </TouchableOpacity>

          <Text style={{ color: '#787581', fontSize: 13 }}>
            Não tem um código?{" "}
            <Text style={styles.textLink}>
              Peça ao administrador da família.
            </Text>
          </Text>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1252",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },

  header: {
    paddingHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
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
    gap: 16,
  },

  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    fontSize: 18,
    borderRadius: 5,
  },

  confirmarButton: {
    backgroundColor: "#1D1252",
    padding: 20,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.5,
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
    width: "100%",
    alignItems: "center",
  },

  textCriarFamiliaButton: {
    color: "#1D1252",
    fontWeight: "bold",
    fontSize: 18,
  },

  textLink: {
    color: "#1D1252",
    fontWeight: "bold",
  },
});
