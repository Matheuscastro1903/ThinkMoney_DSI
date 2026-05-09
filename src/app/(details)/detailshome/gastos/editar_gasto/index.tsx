import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBack from "@/src/components/headerBack";
import { Ionicons } from "@expo/vector-icons";

import InputTitle from "@/src/components/details/gastos/inputtitle2/page";
import InputValor from "@/src/components/details/gastos/inputvalor/page";
import InputEnderecoGasto, {
  Endereco,
} from "@/src/components/details/gastos/inputendereco/page";
import InputDate from "@/src/components/auth/inputdata";
import InputFixo from "@/src/components/details/gastos/inputfixo/page";

import {
  atualizarGasto,
  excluirGasto,
} from "../../../../../services/gastosService";
import { auth } from "../../../../../services/firebaseConfig";

// ── Tipo ──────────────────────────────────────────────────────────────────────

interface GastoCompleto {
  id: string;
  descricao: string;
  categoria: string;
  valor: number;
  data: string; // ISO string vindo do JSON de params
  fixo: boolean;
  endereco?: {
    titulo?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    cep?: string;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseValor(texto: string): number {
  const limpo = texto
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");
  return parseFloat(limpo);
}

function valorParaTexto(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function EditarGasto() {
  const router = useRouter();
  const { gasto: gastoJson } = useLocalSearchParams<{ gasto: string }>();

  const gastoOriginal = useMemo<GastoCompleto | null>(() => {
    if (!gastoJson) return null;
    try {
      return JSON.parse(gastoJson as string);
    } catch {
      return null;
    }
  }, [gastoJson]);

  // ── States inicializados com os dados existentes ──
  const [title, setTitle] = useState(gastoOriginal?.descricao ?? "");
  const [tituloEndereco, setTituloEndereco] = useState(
    gastoOriginal?.endereco?.titulo ?? "",
  );
  const [inputValor, setInputValor] = useState(
    gastoOriginal ? valorParaTexto(gastoOriginal.valor) : "",
  );
  const [inputEndereco, setInputEndereco] = useState<Endereco>({
    logradouro: gastoOriginal?.endereco?.logradouro ?? "",
    numero: gastoOriginal?.endereco?.numero ?? "",
    bairro: gastoOriginal?.endereco?.bairro ?? "",
    cidade: gastoOriginal?.endereco?.cidade ?? "",
    cep: gastoOriginal?.endereco?.cep ?? "",
  });
  const [inputData, setInputData] = useState<Date>(
    gastoOriginal ? new Date(gastoOriginal.data) : new Date(),
  );
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(
    gastoOriginal?.categoria,
  );
  const [fixo, setFixo] = useState<boolean>(gastoOriginal?.fixo ?? false);
  const [erroValor, setErroValor] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  if (!gastoOriginal) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderBack />
      </SafeAreaView>
    );
  }

  // Validações

  const validarCEP = () => inputEndereco.cep.replace(/\D/g, "").length === 8;

  function houveMudanca(): boolean {
    if (!gastoOriginal) return false;
    const valorNumerico = parseValor(inputValor);
    return (
      title !== gastoOriginal.descricao ||
      tituloEndereco !== (gastoOriginal.endereco?.titulo ?? "") ||
      valorNumerico !== gastoOriginal.valor ||
      categoriaSelecionada !== gastoOriginal.categoria ||
      fixo !== gastoOriginal.fixo ||
      inputData.getTime() !== new Date(gastoOriginal.data).getTime() ||
      inputEndereco.logradouro !== (gastoOriginal.endereco?.logradouro ?? "") ||
      inputEndereco.numero !== (gastoOriginal.endereco?.numero ?? "") ||
      inputEndereco.bairro !== (gastoOriginal.endereco?.bairro ?? "") ||
      inputEndereco.cidade !== (gastoOriginal.endereco?.cidade ?? "") ||
      inputEndereco.cep !== (gastoOriginal.endereco?.cep ?? "")
    );
  }

  // ── Salvar ────────────────────────────────────────────────────────────────

  async function handleSalvar() {
    if (!gastoOriginal) return;
    if (!categoriaSelecionada) {
      Alert.alert("Atenção", "Selecione uma categoria.");
      return;
    }

    const valorNumerico = parseValor(inputValor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setErroValor("Informe um valor válido");
      return;
    }

    if (!validarCEP()) {
      Alert.alert("Atenção", "CEP inválido. Informe um CEP com 8 dígitos.");
      return;
    }

    // Nada mudou — não faz chamada, avisa o usuário e sai
    if (!houveMudanca()) {
      Alert.alert("Sem alterações", "Nenhum campo foi modificado.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
      return;
    }

    try {
      setSalvando(true);

      await atualizarGasto(user.uid, gastoOriginal.id, {
        valor: valorNumerico,
        data: inputData,
        descricao: title,
        categoria: categoriaSelecionada,
        fixo,
        endereco: {
          titulo: tituloEndereco,
          ...inputEndereco,
        },
      });

      Alert.alert("Sucesso", "Gasto atualizado!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro",
        "Não foi possível atualizar o gasto. Tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  }

  // ── Excluir ───────────────────────────────────────────────────────────────

  function handleExcluir() {
    if (!gastoOriginal) return;
    Alert.alert(
      "Excluir gasto",
      "Tem certeza que deseja excluir este gasto? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
              setExcluindo(true);
              await excluirGasto(user.uid, gastoOriginal?.id ?? "");
              router.back();
            } catch (error) {
              console.error(error);
              Alert.alert(
                "Erro",
                "Não foi possível excluir o gasto. Tente novamente.",
              );
            } finally {
              setExcluindo(false);
            }
          },
        },
      ],
    );
  }

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack />
      <ScrollView>
        <View style={styles.container2}>
          <Text style={styles.title}>Edite seu gasto</Text>
          <Text style={styles.subtitle}>
            Preencha os campos abaixo para editar seus gastos.
          </Text>

          {/* Categorias */}
          <View style={styles.categorias}>
            <Text>Categorias</Text>
            <View style={styles.categoriasBotoes}>
              {(
                [
                  {
                    key: "alimentacao",
                    icon: "restaurant",
                    label: "Alimentação",
                  },
                  { key: "transporte", icon: "car", label: "Transporte" },
                  { key: "lazer", icon: "game-controller", label: "Lazer" },
                  { key: "educacao", icon: "school", label: "Educação" },
                ] as const
              ).map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => setCategoriaSelecionada(cat.key)}
                  style={[
                    styles.categoriaBox,
                    categoriaSelecionada === cat.key
                      ? styles.categoriaAtiva
                      : styles.categoriaInativa,
                  ]}
                >
                  <Ionicons
                    name={cat.icon}
                    size={20}
                    color={categoriaSelecionada === cat.key ? "white" : "black"}
                    style={styles.categoriaIcon}
                  />
                  <Text
                    style={[
                      styles.categoriaText,
                      categoriaSelecionada === cat.key
                        ? styles.textoAtivo
                        : styles.textoInativo,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Inputs */}
          <View style={styles.inputs}>
            <InputTitle
              placeholder="ex: Hamburguer do Marquinhos"
              label="TÍTULO (OPCIONAL)"
              value={title}
              onChangeText={setTitle}
            />

            <InputValor
              label="VALOR"
              placeholder="Ex: 50,00"
              value={inputValor}
              atualizando={(texto) => {
                setInputValor(texto);
                setErroValor(null);
              }}
              erro={erroValor}
            />

            <InputDate
              label="DATA DO GASTO:"
              onChange={(dataPronta) => setInputData(dataPronta)}
            />

            <InputFixo value={fixo} onChange={setFixo} />

            <InputTitle
              placeholder="ex: Barraquinha do seu zé"
              label="TÍTULO DO ENDEREÇO"
              value={tituloEndereco}
              onChangeText={setTituloEndereco}
            />

            <InputEnderecoGasto
              inputEndereco={inputEndereco}
              atualizando={(patch) =>
                setInputEndereco((prev) => ({ ...prev, ...patch }))
              }
            />
          </View>

          {validarCEP() && (
            <Text style={styles.enderecoValidado}>Endereço validado</Text>
          )}

          {/* Salvar */}
          <TouchableOpacity
            style={[styles.register, salvando && { opacity: 0.6 }]}
            onPress={handleSalvar}
            disabled={salvando || excluindo}
          >
            {salvando ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.textRegister}>Salvar</Text>
            )}
          </TouchableOpacity>

          {/* Excluir */}
          <TouchableOpacity
            style={[styles.excluir, excluindo && { opacity: 0.6 }]}
            onPress={handleExcluir}
            disabled={salvando || excluindo}
          >
            {excluindo ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.textRegister}>Excluir Gasto</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Estilos (inalterados) ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1D1252" },
  container2: {
    backgroundColor: "white",
    borderRadius: 15,
    marginLeft: 15,
    marginRight: 15,
    padding: 40,
    gap: 5,
  },
  title: {
    color: "#1D1252",
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "left",
  },
  subtitle: { color: "grey" },
  categorias: {
    flexDirection: "column",
    gap: 8,
    marginTop: 25,
    marginRight: 10,
  },
  categoriasBotoes: {
    flexDirection: "row",
    marginTop: 8,
    width: "100%",
    justifyContent: "flex-start",
  },
  categoriaBox: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    width: 70,
    alignItems: "center",
    marginRight: 8,
  },
  categoriaIcon: { marginBottom: 6 },
  categoriaText: {
    textAlign: "center",
    fontSize: 12,
    includeFontPadding: false,
  },
  inputs: {},
  register: {
    backgroundColor: "#1D1252",
    borderRadius: 20,
    padding: 10,
    marginTop: 45,
  },
  excluir: {
    backgroundColor: "red",
    borderRadius: 20,
    padding: 10,
    marginTop: 12,
  },
  textRegister: { color: "white", textAlign: "center", fontWeight: "bold" },
  categoriaAtiva: { backgroundColor: "#1D1252" },
  categoriaInativa: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#1D1252",
  },
  textoAtivo: { color: "white" },
  textoInativo: { color: "black" },
  enderecoValidado: {
    color: "green",
    fontWeight: "bold",
    marginTop: 30,
    textAlign: "center",
  },
});
