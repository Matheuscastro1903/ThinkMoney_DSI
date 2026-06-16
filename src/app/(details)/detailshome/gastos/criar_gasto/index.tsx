import {
  Text, View, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Switch
} from "react-native";
import { Component } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBack from "@/src/components/headerBack";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from 'expo-router';
import InputTitle from "@/src/components/details/gastos/inputtitle2/page";
import InputValor from "@/src/components/details/gastos/inputvalor/page";

import { Endereco } from "../../../../../models/endereco";
import InputEndereco from "@/src/components/InputEndereco";
import { useEndereco } from "@/src/hooks/useEndereco";

import InputDate from "@/src/components/auth/inputdata";
import InputFixo from "@/src/components/details/gastos/inputfixo/page";

import { criarGasto } from "../../../../../services/gastosService";
import { geocodificarEndereco } from "../../../../../services/geocodingService";
import { auth } from "../../../../../services/firebaseConfig";
import usuarioService from "@/src/services/usuarioService";
import { Gasto } from "@/src/models/gasto";

interface State {
  title: string;
  tituloEndereco: string;
  inputValor: string;
  inputData: Date;
  categoriaSelecionada: string;
  erroValor: string | null;
  salvando: boolean;
  erroTitle: string | null;
  fixo: boolean;
  incluirEndereco: boolean;
}

export default function CriarWithRouter(props: any) {
  const router = useRouter();
  const params = useLocalSearchParams<{ context?: string; familiaId?: string }>();
  const endereco = useEndereco();
  return <Criar {...props} router={router} context={params.context} familiaId={params.familiaId} endereco={endereco} />;
}

export class Criar extends Component<{ router?: any; context?: string; familiaId?: string; endereco?: ReturnType<typeof useEndereco> }, State> {
  state: State = {
    title: "",
    tituloEndereco: "",
    inputValor: "",
    inputData: new Date(),
    categoriaSelecionada: "",
    erroValor: null,
    salvando: false,
    erroTitle: null,
    fixo: false,
    incluirEndereco: false,
  };
  
  validarCEP = () => {
  return this.props.endereco?.cep?.length === 8;
  };

  parseValor = (texto: string): number => {
    const limpo = texto.replace(/\./g, "").replace(",", ".").replace(/[^0-9.]/g, "");
    return parseFloat(limpo);
  };

  handleRegistrar = async () => {
    const {
      title, categoriaSelecionada, inputValor,
      inputData, tituloEndereco, fixo, incluirEndereco,
    } = this.state;

    if (!title.trim()) {
      this.setState({ erroTitle: "Campo obrigatório" });
      return;
    }
    if (!categoriaSelecionada) {
      Alert.alert("Atenção", "Selecione uma categoria.");
      return;
    }
    const valorNumerico = this.parseValor(inputValor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      this.setState({ erroValor: "Informe um valor válido" });
      return;
    }

    if (incluirEndereco) {
      const e = this.props.endereco!;
      if (!e.cep || e.cep.length < 8) {
        Alert.alert("Atenção", "CEP inválido. Informe um CEP com 8 dígitos.");
        return;
      }

      if (e.erroCep) {
        Alert.alert("Atenção", "CEP não encontrado. Verifique o CEP informado.");
        return;
      }
      
      if (!e.numero.trim()) {
        Alert.alert("Atenção", "Informe o número do endereço.");
        return;
      }
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
      return;
    }

    try {
      this.setState({ salvando: true });

      let enderecoObj = undefined;

      if (incluirEndereco) {
        const e = this.props.endereco!;
        const coordenadas = await geocodificarEndereco(e.logradouro, e.numero, e.bairro, e.cidade, e.cep);
        enderecoObj = new Endereco(e.logradouro, e.numero, e.bairro, e.cidade, e.cep, tituloEndereco, coordenadas?.latitude, coordenadas?.longitude);
      }

      const novoGasto = new Gasto(
        title,
        categoriaSelecionada,
        valorNumerico,
        inputData,
        fixo,
        undefined,
        undefined,
        enderecoObj
      );

      const { context, familiaId } = this.props;

      if (context === 'familia' && familiaId) {
        const dadosUsuario = await usuarioService.buscarDadosUsuario(user.uid);
        if (dadosUsuario) {
          novoGasto.criador = dadosUsuario;
        }
        await criarGasto(user.uid, novoGasto, familiaId);
        this.props.router.replace('/(tabs)/familia/dados');
      } else {
        await criarGasto(user.uid, novoGasto);
        this.props.router.back();
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível registrar o gasto. Tente novamente.");
    } finally {
      this.setState({ salvando: false });
    }
  };

  render() {
    const {
      title, inputValor, salvando, erroTitle, erroValor,
      fixo, tituloEndereco, categoriaSelecionada, incluirEndereco
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderBack />

        <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.container2}>
            <Text style={styles.title}>Registre seu gasto</Text>
            <Text style={styles.subtitle}>
              Preencha os campos abaixo para registrar seus gastos.
            </Text>

            <View style={styles.categorias}>
              <Text>Categorias</Text>
              <View style={styles.categoriasBotoes}>

                <TouchableOpacity
                  onPress={() => this.setState({ categoriaSelecionada: "alimentacao" })}
                  style={[
                    styles.box1,
                    categoriaSelecionada === "alimentacao"
                      ? styles.categoriaAtiva
                      : styles.categoriaInativa,
                  ]}
                >
                  <Ionicons
                    name="restaurant"
                    size={20}
                    color={categoriaSelecionada === "alimentacao" ? "white" : "black"}
                    style={styles.categoriaIcon}
                  />
                  <View>
                    <Text
                      style={[
                        styles.categoriaText,
                        categoriaSelecionada === "alimentacao"
                          ? styles.textoAtivo
                          : styles.textoInativo,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Alimentação
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.setState({ categoriaSelecionada: "transporte" })}
                  style={[
                    styles.box2,
                    categoriaSelecionada === "transporte"
                      ? styles.categoriaAtiva
                      : styles.categoriaInativa,
                  ]}
                >
                  <Ionicons
                    name="car"
                    size={20}
                    color={categoriaSelecionada === "transporte" ? "white" : "black"}
                    style={styles.categoriaIcon}
                  />
                  <View>
                    <Text
                      style={[
                        styles.categoriaText,
                        categoriaSelecionada === "transporte"
                          ? styles.textoAtivo
                          : styles.textoInativo,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Transporte
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.setState({ categoriaSelecionada: "lazer" })}
                  style={[
                    styles.box3,
                    categoriaSelecionada === "lazer"
                      ? styles.categoriaAtiva
                      : styles.categoriaInativa,
                  ]}
                >
                  <Ionicons
                    name="game-controller"
                    size={20}
                    color={categoriaSelecionada === "lazer" ? "white" : "black"}
                    style={styles.categoriaIcon}
                  />
                  <View>
                    <Text
                      style={[
                        styles.categoriaText,
                        categoriaSelecionada === "lazer"
                          ? styles.textoAtivo
                          : styles.textoInativo,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Lazer
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.setState({ categoriaSelecionada: "educacao" })}
                  style={[
                    styles.box4,
                    categoriaSelecionada === "educacao"
                      ? styles.categoriaAtiva
                      : styles.categoriaInativa,
                  ]}
                >
                  <Ionicons
                    name="school"
                    size={20}
                    color={categoriaSelecionada === "educacao" ? "white" : "black"}
                    style={styles.categoriaIcon}
                  />
                  <View>
                    <Text
                      style={[
                        styles.categoriaText,
                        categoriaSelecionada === "educacao"
                          ? styles.textoAtivo
                          : styles.textoInativo,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Educação
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputs}>
              <InputTitle
                placeholder="ex:Hamburguer"
                label="TÍTULO"
                value={title}
                onChangeText={(v) => this.setState({ title: v })}
                erro={erroTitle}
                maxLength={50}
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
                    placeholder="ex:Vivências UFRPE"
                    label="TÍTULO DO ENDEREÇO"
                    value={tituloEndereco}
                    onChangeText={(v) => this.setState({ tituloEndereco: v })}
                    maxLength={50}
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
              onPress={this.handleRegistrar}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.textRegister}>Registrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1252",
  },
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
  subtitle: {
    color: "grey",
  },
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
  box1: {
    backgroundColor: "#1D1252",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    width: 70,
    alignItems: "center",
  },
  box2: {
    backgroundColor: "#1D1252",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    width: 70,
    alignItems: "center",
  },
  box3: {
    backgroundColor: "#1D1252",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    width: 70,
    alignItems: "center",
  },
  box4: {
    backgroundColor: "#1D1252",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    width: 70,
    alignItems: "center",
  },
  categoriaIcon: {
    marginBottom: 6,
  },
  categoriaText: {
    color: "white",
    textAlign: "center",
    fontSize: 12,
    includeFontPadding: false,
  },
  inputs: {},
  register: {
    backgroundColor: "#1D1252",
    borderRadius: 20,
    padding: 10,
    marginTop: 35,
  },
  textRegister: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  categoriaAtiva: {
    backgroundColor: "#1D1252",
  },
  categoriaInativa: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#1D1252",
  },
  textoAtivo: {
    color: "white",
  },
  textoInativo: {
    color: "black",
  },
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
