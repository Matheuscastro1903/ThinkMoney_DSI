import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Component } from "react";
import { useLocalSearchParams, useRouter, Router } from "expo-router";
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

interface GastoCompleto {
  id: string;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
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

// Wrapper funcional para injetar os hooks useRouter e useLocalSearchParams como props
export default function EditarGastoWrapper() {
  const router = useRouter();
  const { gasto } = useLocalSearchParams<{ gasto: string }>();
  return <EditarGasto router={router} gastoJson={gasto as string} />;
}

interface Props {
  router: Router;
  gastoJson: string;
}

interface State {
  title: string;
  tituloEndereco: string;
  inputValor: string;
  inputEndereco: Endereco;
  inputData: Date;
  categoriaSelecionada: string | undefined;
  fixo: boolean;
  erroValor: string | null;
  salvando: boolean;
  excluindo: boolean;
}

class EditarGasto extends Component<Props, State> {
  private gastoOriginal: GastoCompleto | null;

  constructor(props: Props) {
    super(props);

    try {
      this.gastoOriginal = JSON.parse(props.gastoJson);
    } catch {
      this.gastoOriginal = null;
    }

    const g = this.gastoOriginal;
    this.state = {
      title: g?.descricao ?? "",
      tituloEndereco: g?.endereco?.titulo ?? "",
      inputValor: g ? valorParaTexto(g.valor) : "",
      inputEndereco: {
        logradouro: g?.endereco?.logradouro ?? "",
        numero: g?.endereco?.numero ?? "",
        bairro: g?.endereco?.bairro ?? "",
        cidade: g?.endereco?.cidade ?? "",
        cep: g?.endereco?.cep ?? "",
      },
      inputData: g ? new Date(g.data) : new Date(),
      categoriaSelecionada: g?.categoria,
      fixo: g?.fixo ?? false,
      erroValor: null,
      salvando: false,
      excluindo: false,
    };
  }

  validarCEP = () => this.state.inputEndereco.cep.replace(/\D/g, "").length === 8;

  houveMudanca = (): boolean => {
    const g = this.gastoOriginal;
    if (!g) return false;
    const { title, tituloEndereco, inputValor, categoriaSelecionada, fixo, inputData, inputEndereco } = this.state;
    const valorNumerico = parseValor(inputValor);
    return (
      title !== g.descricao ||
      tituloEndereco !== (g.endereco?.titulo ?? "") ||
      valorNumerico !== g.valor ||
      categoriaSelecionada !== g.categoria ||
      fixo !== g.fixo ||
      inputData.getTime() !== new Date(g.data).getTime() ||
      inputEndereco.logradouro !== (g.endereco?.logradouro ?? "") ||
      inputEndereco.numero !== (g.endereco?.numero ?? "") ||
      inputEndereco.bairro !== (g.endereco?.bairro ?? "") ||
      inputEndereco.cidade !== (g.endereco?.cidade ?? "") ||
      inputEndereco.cep !== (g.endereco?.cep ?? "")
    );
  };

  handleSalvar = async () => {
    const g = this.gastoOriginal;
    if (!g) return;

    const { inputValor, categoriaSelecionada, inputData, title, tituloEndereco, fixo, inputEndereco } = this.state;

    if (!categoriaSelecionada) {
      Alert.alert("Atenção", "Selecione uma categoria.");
      return;
    }

    const valorNumerico = parseValor(inputValor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      this.setState({ erroValor: "Informe um valor válido" });
      return;
    }

    if (!this.validarCEP()) {
      Alert.alert("Atenção", "CEP inválido. Informe um CEP com 8 dígitos.");
      return;
    }

    if (!this.houveMudanca()) {
      Alert.alert("Sem alterações", "Nenhum campo foi modificado.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
      return;
    }

    try {
      this.setState({ salvando: true });

      await atualizarGasto(user.uid, g.id, {
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
        { text: "OK", onPress: () => this.props.router.back() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o gasto. Tente novamente.");
    } finally {
      this.setState({ salvando: false });
    }
  };

  handleExcluir = () => {
    const g = this.gastoOriginal;
    if (!g) return;

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
              this.setState({ excluindo: true });
              await excluirGasto(user.uid, g.id);
              this.props.router.back();
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Não foi possível excluir o gasto. Tente novamente.");
            } finally {
              this.setState({ excluindo: false });
            }
          },
        },
      ],
    );
  };

  render() {
    if (!this.gastoOriginal) {
      return (
        <SafeAreaView style={styles.container}>
          <HeaderBack />
        </SafeAreaView>
      );
    }

    const {
      title, inputValor, salvando, excluindo, erroValor,
      fixo, inputEndereco, tituloEndereco, categoriaSelecionada,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderBack />
        <ScrollView>
          <View style={styles.container2}>
            <Text style={styles.title}>Edite seu gasto</Text>
            <Text style={styles.subtitle}>
              Preencha os campos abaixo para editar seus gastos.
            </Text>

            <View style={styles.categorias}>
              <Text>Categorias</Text>
              <View style={styles.categoriasBotoes}>
                {(
                  [
                    { key: "alimentacao", icon: "restaurant", label: "Alimentação" },
                    { key: "transporte", icon: "car", label: "Transporte" },
                    { key: "lazer", icon: "game-controller", label: "Lazer" },
                    { key: "educacao", icon: "school", label: "Educação" },
                  ] as const
                ).map((cat) => (
                  <TouchableOpacity
                    key={cat.key}
                    onPress={() => this.setState({ categoriaSelecionada: cat.key })}
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

            <View style={styles.inputs}>
              <InputTitle
                placeholder="ex: Hamburguer do Marquinhos"
                label="TÍTULO (OPCIONAL)"
                value={title}
                onChangeText={(v) => this.setState({ title: v })}
              />

              <InputValor
                label="VALOR"
                placeholder="Ex: 50,00"
                value={inputValor}
                atualizando={(texto) => {
                  this.setState({ inputValor: texto, erroValor: null });
                }}
                erro={erroValor}
              />

              <InputDate
                label="DATA DO GASTO:"
                onChange={(dataPronta) => this.setState({ inputData: dataPronta })}
              />

              <InputFixo value={fixo} onChange={(v) => this.setState({ fixo: v })} />

              <InputTitle
                placeholder="ex: Barraquinha do seu zé"
                label="TÍTULO DO ENDEREÇO"
                value={tituloEndereco}
                onChangeText={(v) => this.setState({ tituloEndereco: v })}
              />

              <InputEnderecoGasto
                inputEndereco={inputEndereco}
                atualizando={(patch) =>
                  this.setState((prev) => ({
                    inputEndereco: { ...prev.inputEndereco, ...patch },
                  }))
                }
              />
            </View>

            {this.validarCEP() && (
              <Text style={styles.enderecoValidado}>Endereço validado</Text>
            )}

            <TouchableOpacity
              style={[styles.register, salvando && { opacity: 0.6 }]}
              onPress={this.handleSalvar}
              disabled={salvando || excluindo}
            >
              {salvando ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.textRegister}>Salvar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.excluir, excluindo && { opacity: 0.6 }]}
              onPress={this.handleExcluir}
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
}

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
