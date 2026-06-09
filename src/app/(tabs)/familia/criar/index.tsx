import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
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
import { useFamiliaAcoes } from "@/src/hooks/familia/useFamiliaAcoes";

export default function CriarFamilia() {
  const router = useRouter();
  const { criarFamilia, isLoading } = useFamiliaAcoes()
  const [familyName, setFamilyName] = useState("");
  // codigoGerado é preenchido após criação bem-sucedida; null = família ainda não criada.
  const [codigoGerado, setCodigoGerado] = useState<string | null>(null);

  async function handleGerarCodigo() {
    if (!familyName.trim()) return
    const novoId = await criarFamilia(familyName)
    if (!novoId) return // erro já tratado dentro do hook (Alert)

    // Armazena o código localmente para exibir na UI.
    // O familiaId real já foi gravado no perfil do usuário pelo hook.
    setCodigoGerado(novoId)
  }

  function handlePronto() {
    // Navegação liberada somente após criação bem-sucedida
    if (!codigoGerado) return
    router.replace('/(tabs)/familia/home')
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "center" }}
      >
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
            editable={!codigoGerado} // bloqueia edição após criação
          />

          <TouchableOpacity
            style={[styles.gerarCodigoButton, (isLoading || !!codigoGerado) && styles.buttonDisabled]}
            activeOpacity={0.7}
            onPress={handleGerarCodigo}
            disabled={isLoading || !!codigoGerado}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.textGerarCodigoButton}>
                {codigoGerado ? 'Família criada!' : 'Gerar código de família'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.codeContainer}>
          <View style={styles.codeContentContainer}>
            <Text style={styles.codeTitle}>Código de Acesso da Família</Text>

            <Text style={styles.codeText}>
              {codigoGerado ?? '— — — — — —'}
            </Text>

            <View style={styles.infoCodeContainer}>
              <MaterialIcons name="info-outline" size={18} color="#1D1252" />
              <Text style={styles.infoCodeText}>
                Compartilhe este código com quem deseja convidar para o grupo.
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.prontoButton, !codigoGerado && styles.buttonDisabled]}
          activeOpacity={0.7}
          onPress={handlePronto}
          disabled={!codigoGerado}
        >
          <Text style={styles.textProntoButton}>Pronto</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
  },

  buttonDisabled: {
    opacity: 0.5,
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
    textTransform: "uppercase",
    fontSize: 12,
  },

  codeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D1252",
    letterSpacing: 2,
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
