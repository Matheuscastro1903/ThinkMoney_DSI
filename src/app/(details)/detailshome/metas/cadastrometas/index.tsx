import { Ionicons } from "@expo/vector-icons";
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


import InputImagem from "@/src/components/details/metas/inputimagem";
import * as Crypto from 'expo-crypto';
import { Meta } from "@/src/models/meta";
import usuarioService from "@/src/services/usuarioService";
import { SafeAreaView } from "react-native-safe-area-context"; // Importação mantida

import HeaderBack from "@/src/components/headerBack";
import { useRouter, useLocalSearchParams } from "expo-router";
import { metasService } from "@/src/services/metasService";
import { auth } from "@/src/services/firebaseConfig";
import InputDate from "@/src/components/details/metas/inputdata";

import { pegarFotoDaGaleria } from "@/src/scripts/getImage";
import { tirarFotoCamera } from "@/src/scripts/getImage";

import { prepararImagemParaUpload } from "@/src/scripts/prepararImagemUpload";
import { StorageService } from "@/src/services/storageService";

const CATEGORIAS = [
  { key: "viagem", label: "Viagem", icon: "airplane" },
  { key: "casa", label: "Casa", icon: "home" },
  { key: "carro", label: "Carro", icon: "car" },
  { key: "reserva", label: "Reserva", icon: "wallet" },
];

const formatarMoeda = (valor: string) => {
  const apenasNumeros = valor.replace(/\D/g, "");
  if (apenasNumeros === "") return "";
  const valorDecimal = parseFloat(apenasNumeros) / 100;
  return valorDecimal.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function AddMeta() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const familiaId = params.familiaId as string | undefined;
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [nomeMeta, setNomeMeta] = useState("");
  const [capital, setCapital] = useState("");
  const [data, setData] = useState<Date | null>(null);
  const [descricao, setDescricao] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  
  const [uriImagem,setUriImagem]=useState<string | null>(null);


  async function choosePhoto(){
    const fotoEscolhida= await pegarFotoDaGaleria()
    setUriImagem(fotoEscolhida)
    

  }

  async function takePhoto(){
    const fotoEscolhida= await tirarFotoCamera()
    setUriImagem(fotoEscolhida)
    
  }
  
  function abrirMenuDeOpcoes(){
    Alert.alert(
      "Adicionar Foto",
      "Escolha a origem da imagem:",
      [
        { text: "Abrir Galeria", onPress: choosePhoto },
        { text: "Tirar Foto", onPress: takePhoto },
        { text: "Cancelar", style: "cancel" } // O botão de cancelar fecha o menu sozinho
      ]
    );
  };

  const handleSalvarMeta = async () => {
    const camposFaltando = [];
    if (!categoriaSelecionada) camposFaltando.push("Categoria");
    if (!nomeMeta) camposFaltando.push("Nome da Meta");
    if (!capital) camposFaltando.push("Capital Necessário");
    if (!data) camposFaltando.push("Data de Realização");

    if (camposFaltando.length > 0) {
      Alert.alert("Atenção", `Por favor, preencha os seguintes campos obrigatórios: ${camposFaltando.join(", ")}.`);
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    const valorFormatado = parseFloat(capital.replace(/\./g, "").replace(",", "."));
    
    if (isNaN(valorFormatado) || valorFormatado <= 0) {
      Alert.alert("Atenção", "Insira um valor numérico válido (ex: 1500,00).");
      return;
    }

    setIsLoading(true);
    
    try {
      let idImagemGerado: string | null = null;
      if (uriImagem) {
        idImagemGerado = Crypto.randomUUID();
        
        //convertendo imagem para formato para ser lido no uri
        const preparo = await prepararImagemParaUpload(uriImagem);
        
        if (!preparo.sucesso || !preparo.arquivoConvertido) {
          Alert.alert("Erro", "Não foi possível processar a imagem da galeria.");
          setIsLoading(false);
          return;
        }

        //função de salvar no Supabase
        const upload = await StorageService(idImagemGerado, preparo.arquivoConvertido);

        //tratando caso de erro na requisição de upload
        if (!upload.sucesso) {
          console.log("DETALHES DO ERRO SUPABASE:", JSON.stringify(upload.erro, null, 2));
          Alert.alert("Erro", "Não foi possível enviar a foto para a nuvem.");
          setIsLoading(false);
          return; 
        }
      }

      let criadorObj = undefined;
      if (familiaId) {
        const dadosUsuario = await usuarioService.buscarDadosUsuario(userId);
        if (dadosUsuario) {
          criadorObj = dadosUsuario;
        }
      }

      const novaMeta = new Meta(
        nomeMeta,
        valorFormatado,
        0, // valorPoupado inicial
        data!,
        categoriaSelecionada!,
        undefined, // id
        descricao,
        idImagemGerado,
        criadorObj
      );

      //salva na firebase centralizando a lógica (subcoleção individual ou array da família)
      await metasService.criar(userId, novaMeta, familiaId);

      Alert.alert("Sucesso", "Sua meta foi criada!");
      router.back();

    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar sua meta.");
    } finally {
      setIsLoading(false);
    }
  }

  return (

    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >

        <HeaderBack />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Título */}
          <Text style={styles.title}>Construa o amanhã,{"\n"}hoje.</Text>

          {/* Subtítulo */}
          <Text style={styles.subtitle}>
            Defina objetivos claros irá você chegar{"\n"}muito mais longe do que
            imagina
          </Text>

          {/* Card principal */}
          <View style={styles.card}>
            {/* Tipo de Meta */}
            <Text style={styles.labelSection}>TIPO DE META</Text>
            <View style={styles.gridContainer}>
              {CATEGORIAS.map((cat) => {
                const ativo = categoriaSelecionada === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.categoryCard,
                      ativo && styles.categoryCardActive,
                    ]}
                    onPress={() => setCategoriaSelecionada(cat.key)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={30}
                      color={ativo ? "#FFFFFF" : "#1D1252"}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        ativo && styles.categoryTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <InputImagem
            onPress={abrirMenuDeOpcoes}
            imagemUri={uriImagem}
            ></InputImagem>

            {/* Nome da Meta */}
            <Text style={styles.label}>NOME DA META</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputText}
                placeholder="Ex: Viagem para a Europa"
                placeholderTextColor="#BBBBBB"
                value={nomeMeta}
                onChangeText={setNomeMeta}
              />
            </View>

            {/* Capital Necessário */}
            <Text style={styles.label}>CAPITAL NECESSÁRIO</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencyPrefix}>R$</Text>
              <TextInput
                style={styles.inputText}
                placeholder="0,00"
                placeholderTextColor="#BBBBBB"
                keyboardType="numeric"
                value={capital}
                onChangeText={(texto) => setCapital(formatarMoeda(texto))}
              />
            </View>

            {/* Data de Realização */}
            
              
              <InputDate
                              label="Data de realização:"
                              
                              onChange={(dataPronta) => setData(dataPronta)}
                            ></InputDate>
            

            {/* Descrição */}
            <Text style={styles.label}>DESCRIÇÃO (OPCIONAL)</Text>
            <View style={[styles.inputWrapper, styles.inputMultiline]}>
              <TextInput
                style={[styles.inputText, { flex: 1 }]}
                placeholder={"Ex: Viagem de 10 anos de\ncasados"}
                placeholderTextColor="#BBBBBB"
                multiline
                numberOfLines={3}
                value={descricao}
                onChangeText={setDescricao}
              />
            </View>

            {/* Botão */}
            <TouchableOpacity 
              style={[styles.button, isLoading && { opacity: 0.7 }]} 
              activeOpacity={0.85}
              onPress={handleSalvarMeta}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.buttonText}>
                    {familiaId ? "Criar Meta Familiar" : "Criar Meta Pessoal"}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>

            {/* Botão para cancelar */}
            <TouchableOpacity style={styles.cancelar} onPress={() => router.back()}>
              <Text style={styles.textocancelar}>Cancelar</Text>
            </TouchableOpacity>

            {/* Footer */}
            <Text style={styles.footerText}>
              THINKMONEY SECURE INFRASTRUCTURE
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF", // MODIFICADO: Definida cor de fundo para a área segura (ajuste conforme seu design)
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#0A0A0A",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  // ... resto dos estilos mantidos
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 0, // ADICIONADO: Um pequeno respiro entre o Header e o conteúdo inicial (Badge/Título)
  },
  badge: {
    backgroundColor: "#D6D0F0",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  badgeText: {
    color: "#1D1252",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1D1252",
    marginTop: 14,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
    lineHeight: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  labelSection: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1D1252",
    letterSpacing: 1,
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  categoryCard: {
    width: "47%",
    paddingVertical: 20,
    backgroundColor: "#F0F0F5",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  categoryCardActive: {
    backgroundColor: "#1D1252",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1D1252",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#888",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F8",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  inputMultiline: {
    alignItems: "flex-start",
    minHeight: 80,
    paddingTop: 12,
  },
  currencyPrefix: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1D1252",
    marginRight: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: "#1D1252",
  },
  button: {
    backgroundColor: "#1D1252",
    borderRadius: 14,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: "#BBBBBB",
    letterSpacing: 1,
  },
  cancelar: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  textocancelar: {},
});