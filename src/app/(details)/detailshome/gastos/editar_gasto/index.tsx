import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from "react-native";
import { Component, useEffect } from "react";
import { useLocalSearchParams, useRouter, Router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBack from "@/src/components/headerBack";
import { Ionicons } from "@expo/vector-icons";

import InputTitle from "@/src/components/details/gastos/inputtitle2/page";
import InputValor from "@/src/components/details/gastos/inputvalor/page";
import InputEndereco from "@/src/components/InputEndereco";
import { useEndereco } from "@/src/hooks/useEndereco";
import { Endereco } from "../../../../../models/endereco";
import InputDate from "@/src/components/auth/inputdata";
import InputFixo from "@/src/components/details/gastos/inputfixo/page";

import {
  atualizarGasto,
  excluirGasto,
} from "../../../../../services/gastosService";
import { geocodificarEndereco } from "../../../../../services/geocodingService";
import { auth } from "../../../../../services/firebaseConfig";
import { Gasto } from "@/src/models/gasto";

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
  const params = useLocalSearchParams<{ gasto: string; context?: string; familiaId?: string }>();
  const endereco = useEndereco();

  useEffect(() => {
    try {
      const g = JSON.parse(params.gasto as string);
      if (g?.endereco) {
        endereco.inicializar({
          cep: g.endereco.cep ?? '',
          logradouro: g.endereco.logradouro ?? '',
          bairro: g.endereco.bairro ?? '',
          cidade: g.endereco.cidade ?? '',
          numero: g.endereco.numero ?? '',
        });
      }
    } catch {}
  }, []);

  return <EditarGasto router={router} gastoJson={params.gasto as string} context={params.context} familiaId={params.familiaId} endereco={endereco} />;
}

interface Props {
  router: Router;
  gastoJson: string;
  context?: string;
  familiaId?: string;
  endereco?: ReturnType<typeof useEndereco>
}

interface State {
  title: string;
  tituloEndereco: string;
  inputValor: string;
  inputData: Date;
  categoriaSelecionada: string | undefined;
  fixo: boolean;
  erroValor: string | null;
  salvando: boolean;
  excluindo: boolean;
  incluirEndereco: boolean;
}

class EditarGasto extends Component<Props, State> {
  private gastoOriginal: Gasto | null;

  constructor(props: Props) {
    super(props);

    try {
      this.gastoOriginal = JSON.parse(props.gastoJson);
    } catch {
      this.gastoOriginal = null;
    }

    const g = this.gastoOriginal;
    this.state = {
      title: g?.titulo ?? "",
      tituloEndereco: g?.endereco?.titulo ?? "",
      inputValor: g ? valorParaTexto(g.valor) : "",
      inputData: g ? new Date(g.data) : new Date(),
      categoriaSelecionada: g?.categoria,
      fixo: g?.fixo ?? false,
      erroValor: null,
      salvando: false,
      excluindo: false,
      incluirEndereco: !!g?.endereco?.logradouro,
    };
  }

  validarCEP = () => (this.props.endereco?.cep?.replace(/\D/g, '').length ?? 0) === 8;

  houveMudanca = (): boolean => {
    const g = this.gastoOriginal;
    if (!g) return false;
    const { title, tituloEndereco, inputValor, categoriaSelecionada, fixo, inputData } = this.state;
    const valorNumerico = parseValor(inputValor);
    const tituloOriginal = g.titulo ?? "";
    const enderecoOriginalFoiPreenchido = !!g.endereco?.logradouro;
    const e = this.props.endereco!

    if (
      title !== tituloOriginal ||
      valorNumerico !== g.valor ||
      categoriaSelecionada !== g.categoria ||
      fixo !== g.fixo ||
      inputData.getTime() !== new Date(g.data).getTime() ||
      this.state.incluirEndereco !== enderecoOriginalFoiPreenchido
    ) {
      return true;
    }

    if (this.state.incluirEndereco) {
      if (
        tituloEndereco !== (g.endereco?.titulo ?? "") ||
        e?.logradouro !== (g.endereco?.logradouro ?? "") ||
        e?.numero !== (g.endereco?.numero ?? "") ||
        e?.bairro !== (g.endereco?.bairro ?? "") ||
        e?.cidade !== (g.endereco?.cidade ?? "") ||
        e?.cep !== (g.endereco?.cep ?? "")
      ) {
        return true;
      }
    }

    return false;
  };

  handleSalvar = async () => {
    const g = this.gastoOriginal;
    if (!g) return;

    const { inputValor, categoriaSelecionada, inputData, title, tituloEndereco, fixo } = this.state;
    const e = this.props.endereco!
    if (!categoriaSelecionada) {
      Alert.alert("Atenção", "Selecione uma categoria.");
      return;
    }

    const valorNumerico = parseValor(inputValor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      this.setState({ erroValor: "Informe um valor válido" });
      return;
    }

    if (this.state.incluirEndereco) {
      if (!this.validarCEP()) {
        Alert.alert("Atenção", "CEP inválido. Informe um CEP com 8 dígitos.");
        return;
      }
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

      let enderecoObj = undefined;

      if (this.state.incluirEndereco) {
        const enderecoMudou =
          e.logradouro !== (g.endereco?.logradouro ?? "") ||
          e.numero !== (g.endereco?.numero ?? "") ||
          e.cidade !== (g.endereco?.cidade ?? "") ||
          e.cep !== (g.endereco?.cep ?? "");

        const coordenadas = enderecoMudou
          ? await geocodificarEndereco(e.logradouro, e.numero, e.bairro, e.cidade, e.cep)
          : null;

        enderecoObj = new Endereco(
          e.logradouro,
          e.numero,
          e.bairro,
          e.cidade,
          e.cep,
          tituloEndereco,
          coordenadas?.latitude ?? (g.endereco as any)?.latitude,
          coordenadas?.longitude ?? (g.endereco as any)?.longitude
        );

        if (this.state.incluirEndereco) {
          if (!this.validarCEP()) {
            Alert.alert("Atenção", "CEP inválido. Informe um CEP com 8 dígitos.");
            return;
          }
          if (this.props.endereco?.erroCep) {
            Alert.alert("Atenção", "CEP não encontrado. Verifique o CEP informado.");
            return;
          }
        }
      }

      const novoGasto = new Gasto(
        title,
        categoriaSelecionada,
        valorNumerico,
        inputData,
        fixo,
        undefined,
        g.status,
        enderecoObj,
        g.criador // Mantém o criador original
      );

      const { context, familiaId } = this.props;

      await atualizarGasto(user.uid, g.id as string, novoGasto, context === 'familia' ? familiaId : undefined);

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
              
              const { context, familiaId } = this.props;
              await excluirGasto(user.uid, g.id as string, context === 'familia' ? familiaId : undefined);
              
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
      fixo, tituloEndereco, categoriaSelecionada, incluirEndereco
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

              <View style={styles.toggleContainer}>
                <View style={styles.toggleHeader}>
                  <Text style={styles.toggleTitle}>Adicionar local (Opcional)</Text>
                  <Switch 
                    value={incluirEndereco} 
                    onValueChange={(v) => this.setState({ incluirEndereco: v })} 
                    trackColor={{ false: "#E2E8F0", true: "#34D399" }}
                    thumbColor={"#ffffff"}
                  />
                </View>
                <Text style={styles.toggleDica}>📍 Dica: Adicione o local para visualizar este gasto no seu Mapa</Text>
              </View>

              {incluirEndereco && (
                <>
                  <InputTitle
                    placeholder="ex: Barraquinha do seu zé"
                    label="TÍTULO DO ENDEREÇO"
                    value={tituloEndereco}
                    onChangeText={(v) => this.setState({ tituloEndereco: v })}
                  />

                 <InputEndereco
                  cep={this.props.endereco!.cep}
                  setCep={this.props.endereco!.setCep}
                  logradouro={this.props.endereco!.logradouro}
                  setLogradouro={this.props.endereco!.setLogradouro}
                  numero={this.props.endereco!.numero}
                  setNumero={this.props.endereco!.setNumero}
                  bairro={this.props.endereco!.bairro}
                  setBairro={this.props.endereco!.setBairro}
                  cidade={this.props.endereco!.cidade}
                  setCidade={this.props.endereco!.setCidade}
                  buscando={this.props.endereco!.buscando}
                  erroCep={this.props.endereco!.erroCep}
                />
                </>
              )}
            </View>


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
    width: '100%',
  },
  categoriasBotoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    width: "100%",
    justifyContent: "flex-start",
    gap: 8,
  },
  categoriaBox: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    width: 70,
    alignItems: "center",
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
  toggleContainer: {
    marginTop: 20,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  toggleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleTitle: {
    fontWeight: 'bold',
    color: '#1D1252',
    fontSize: 14,
  },
  toggleDica: {
    marginTop: 8,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
});
