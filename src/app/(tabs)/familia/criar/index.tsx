// arquivo destinado a guardar a "primeira tela da família"
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useState } from "react";

import { useRouter } from "expo-router";

import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Familia() {
  const router = useRouter();
  const [familyName, setFamilyName] = useState("");

  function gerarCodigo() {
    return;
  }

  function copiarCodigo() {
    return;
  }

  function entrarEmFamilia() {
    // Deve haver antes uma verificação se o código foi gerado corretamente e se a família foi criada no banco de dados do Firebase, mas como isso ainda não foi implementado, a função apenas redireciona para a tela inicial da família.
    // Esse futuro método pode herdar o método de entrar em família do objeto da classe Usuário (Implementação futura)
    router.push("./home");
    return;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.familyIcon}>
          <MaterialIcons name="family-restroom" size={50} color="#000000" />
        </View>

        <Text style={styles.title}>Criar Família</Text>
      </View>

      <View style={styles.inputCodeContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite um nome para a família"
          placeholderTextColor="#dfdbeb"
          keyboardType="default"
          value={familyName}
          onChangeText={setFamilyName}
        />

        <TouchableOpacity
          style={styles.gerarCodigoButton}
          activeOpacity={0.7}
          onPress={gerarCodigo}
        >
          <Text style={styles.textGerarCodigoButton}>
            Gerar código de família
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.codeContainer}>
        <View style={styles.codeContentContainer}>
          <Text style={styles.codeTitle}>Código de Acesso da Família</Text>

          <Text style={styles.codeText}>THKM-X7R2-89</Text>

          <View style={styles.infoCodeContainer}>
            <MaterialIcons name="info-outline" size={18} color="#1D1252" />
            <Text style={styles.infoCodeText}>
              Compartilhe este código com quem deseja convidar para o grupo.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.copiarCodigoFamiliaButton}
          activeOpacity={0.7}
          onPress={copiarCodigo}
        >
          <MaterialIcons name="content-copy" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.prontoButton}
        activeOpacity={0.7}
        onPress={entrarEmFamilia}
      >
        <Text style={styles.textProntoButton}>Pronto</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },

  familyIcon: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
  },

  inputCodeContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    margin: 20,
    borderRadius: 30,
    padding: 30,
    gap: 20,
  },

  input: {
    width: "100%",
    borderColor: "#dfdbeb",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 20,
    fontSize: 18,
  },

  gerarCodigoButton: {
    backgroundColor: "#1D1252",
    padding: 20,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    color: "white",
  },

  textGerarCodigoButton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  codeContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 20,
  },

  codeContentContainer: {
    flex: 1,
    minWidth: 0,
    gap: 12,
  },

  codeTitle: {
    fontWeight: "regular",
    textTransform: "uppercase",
    fontSize: 12,
  },

  codeText: {
    fontSize: 24,
    fontWeight: "bold",
  },

  infoCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  infoCodeText: {
    fontSize: 11,
    flex: 1,
    flexShrink: 1,
  },

  copiarCodigoFamiliaButton: {
    backgroundColor: "#1D1252",
    padding: 8,
    borderRadius: 5,
    flexShrink: 0,
    alignSelf: "flex-start",
  },

  prontoButton: {
    backgroundColor: "#1D1252",
    borderColor: "#ffffff",
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
  },

  textProntoButton: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
