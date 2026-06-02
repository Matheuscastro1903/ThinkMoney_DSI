import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBack from "@/src/components/headerBack";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import InputImagem from "@/src/components/details/metas/inputimagem";
import { pegarFotoDaGaleria } from "@/src/scripts/getImage";
import { tirarFotoCamera } from "@/src/scripts/getImage";
import InputDate from "@/src/components/details/metas/inputdata";
import { Link, useLocalSearchParams, useRouter } from "expo-router";

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

export default function Edit() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    string | null
  >(null);
  const [idImagemAntiga, setIdImagemAntiga] = useState<string | null>(null);
  const [imagemUrl, setImagemUrl] = useState<string | null>(null);
  const [uriImagem, setUriImagem] = useState<string | null>(null);
  const [capital, setCapital] = useState("");
  const [nomeMeta, setNomeMeta] = useState("");
  const [data, setData] = useState<Date | null>(null);
  const [descricao, setDescricao] = useState("");
  const [valorPoupado, setValorPoupado] = useState(0);
  const [valorTotalMeta, setValorTotalMeta] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAporteLoading, setIsAporteLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [valorAporte, setValorAporte] = useState("");

  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  async function choosePhoto() {
    const fotoEscolhida = await pegarFotoDaGaleria();
    setUriImagem(fotoEscolhida);
  }

  async function takePhoto() {
    const fotoEscolhida = await tirarFotoCamera();
    setUriImagem(fotoEscolhida);
  }

  function abrirMenuDeOpcoes() {
    Alert.alert("Adicionar Foto", "Escolha a origem da imagem:", [
      { text: "Abrir Galeria", onPress: choosePhoto },
      { text: "Tirar Foto", onPress: takePhoto },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "white" }]}>
      <View style={{ marginTop: -100 }}>
        <HeaderBack />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container2}>
          <Text style={styles.title}>Refine seu amanhã</Text>
          <Text style={styles.subtitle}>
            Atualize os detalhes do seu objetivo familiar para manter o
            planejamento em dia com a sua realidade
          </Text>
        </View>

        <View style={styles.card}>
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
            imagemUri={uriImagem || imagemUrl}
            onPress={abrirMenuDeOpcoes}
          />

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

          <InputDate
            label="Data de realização:"
            onChange={(dataNova) => setData(dataNova)}
            valorInicial={data}
            style={{ width: "98%", marginLeft: 1}}
          ></InputDate>

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

          <View style={styles.separator} />

          <Text style={styles.labelSection}>GUARDAR DINHEIRO</Text>

          <Text style={styles.progressInfo}>
            Você já guardou{" "}
            <Text style={styles.progressHighlight}>
              R${" "}
              {valorPoupado.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </Text>{" "}
            de R${" "}
            {valorTotalMeta.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.currencyPrefix}>R$</Text>
            <TextInput
              style={styles.inputText}
              placeholder="0,00"
              placeholderTextColor="#BBBBBB"
              keyboardType="numeric"
              value={valorAporte}
              onChangeText={(texto) => setValorAporte(formatarMoeda(texto))}
            />
          </View>

          <TouchableOpacity
            style={[styles.buttonAporte, isAporteLoading && { opacity: 0.7 }]}
            activeOpacity={0.85}
            disabled={isAporteLoading || isFetching}
          >
            {isAporteLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.buttonText}>Adicionar valor</Text>
                <Ionicons name="trending-up" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={[styles.button, isLoading && { opacity: 0.7 }]}
            activeOpacity={0.85}
            disabled={isLoading || isFetching}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.buttonText}>Salvar alterações</Text>
                <Ionicons name="pencil-outline" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button2}
            activeOpacity={0.85}
            disabled={isFetching}
          >
            <Text style={styles.buttonText}>Excluir Meta</Text>
            <Ionicons name="trash-outline" size={20} color="white" />
          </TouchableOpacity>

          <Link href={"/"} asChild>
            <TouchableOpacity style={styles.cancelar}>
              <Text style={styles.textocancelar}>Cancelar</Text>
            </TouchableOpacity>
          </Link>

          <Text style={styles.footerText}>
            THINKMONEY SECURE INFRASTRUCTURE
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  button: {
    backgroundColor: "#1D1252",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    marginBottom: 16,
  },
  button2: {
    backgroundColor: "red",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    marginBottom: 16,
  },
  cancelar: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  textocancelar: {},
  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: "#BBBBBB",
    letterSpacing: 1,
  },
  card:{
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  separator: {
    height: 1,
    backgroundColor: "#F0F0F5",
    marginVertical: 20,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonAporte: {
    backgroundColor: "#34D399",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  progressInfo: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 12,
  },
  progressHighlight: {
    color: "#34D399",
    fontWeight: "bold",
  },
  container2: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#1D1252",
    marginTop: 8,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: "center",
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 0,
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
  inputText: {
    flex: 1,
    fontSize: 14,
    color: "#1D1252",
  },
  currencyPrefix: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1D1252",
    marginRight: 8,
  },
  inputMultiline: {
    alignItems: "flex-start",
    minHeight: 80,
    paddingTop: 12,
  },
});
