import { useFamiliaAcoes } from "@/src/hooks/familia/useFamiliaAcoes";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    setCodigoGerado(novoId.codigo_convite)
  }

  async function copiarCodigo() {
    if (!codigoGerado) return
    await Clipboard.setStringAsync(codigoGerado)
    Alert.alert('Sucesso', 'Código copiado para a área de transferência!')
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

          <View style={styles.codeCard}>
            <View style={styles.codeRow}>
              <View style={styles.codeInfo}>
                <Text style={styles.codeLabel}>CÓDIGO DE ACESSO DA FAMÍLIA</Text>
                <Text style={styles.codeValue}>{codigoGerado ?? '— — — — — —'}</Text>
              </View>
              <TouchableOpacity style={styles.copyButton} onPress={copiarCodigo} activeOpacity={0.7} disabled={!codigoGerado}>
                <Ionicons name="copy-outline" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <View style={styles.codeHint}>
              <Ionicons name="information-circle-outline" size={14} color="rgba(72,69,80,0.8)" />
              <Text style={styles.codeHintText}>
                Compartilhe este código com quem deseja convidar para o grupo.
              </Text>
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

  codeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 25,
    marginHorizontal: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(201,196,209,0.1)',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  codeInfo: {
    gap: 4,
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#484550',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  codeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D1252',
    letterSpacing: 2.4,
  },
  copyButton: {
    backgroundColor: '#1D1252',
    borderRadius: 8,
    padding: 12,
  },
  codeHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  codeHintText: {
    fontSize: 11,
    color: 'rgba(72,69,80,0.8)',
    lineHeight: 16.5,
    flex: 1,
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
