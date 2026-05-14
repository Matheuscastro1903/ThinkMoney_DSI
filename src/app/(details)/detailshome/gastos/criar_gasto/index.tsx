import {
  Text, View, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator,
} from "react-native";
import { Component } from "react";
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

import { criarGasto } from "../../../../../services/gastosService";
import { auth } from "../../../../../services/firebaseConfig";

interface State {
  title: string;
  tituloEndereco: string;
  inputValor: string;
  inputEndereco: Endereco;
  inputData: Date;
  categoriaSelecionada: string;
  erroValor: string | null;
  salvando: boolean;
  erroTitle: string | null;
  errosEndereco: { logradouro: string; numero: string; bairro: string; cidade: string };
  fixo: boolean;
}

export default class Criar extends Component<{}, State> {
  state: State = {
    title: "",
    tituloEndereco: "",
    inputValor: "",
    inputEndereco: { logradouro: "", numero: "", bairro: "", cidade: "", cep: "" },
    inputData: new Date(),
    categoriaSelecionada: "",
    erroValor: null,
    salvando: false,
    erroTitle: null,
    errosEndereco: { logradouro: "", numero: "", bairro: "", cidade: "" },
    fixo: false,
  };

  validarCEP = () => {
    const cep = this.state.inputEndereco.cep.replace(/\D/g, "");
    return cep.length === 8;
  };

  parseValor = (texto: string): number => {
    const limpo = texto.replace(/\./g, "").replace(",", ".").replace(/[^0-9.]/g, "");
    return parseFloat(limpo);
  };

  handleRegistrar = async () => {
    const {
      title, categoriaSelecionada, inputValor, inputEndereco,
      inputData, tituloEndereco, fixo,
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

    const novosErros = {
      logradouro: inputEndereco.logradouro.trim() ? "" : "Campo obrigatório",
      numero:     inputEndereco.numero.trim()     ? "" : "Campo obrigatório",
      bairro:     inputEndereco.bairro.trim()     ? "" : "Campo obrigatório",
      cidade:     inputEndereco.cidade.trim()     ? "" : "Campo obrigatório",
    };
    this.setState({ errosEndereco: novosErros });
    if (Object.values(novosErros).some((e) => e !== "")) return;

    if (!this.validarCEP()) {
      Alert.alert("Atenção", "CEP inválido. Informe um CEP com 8 dígitos.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
      return;
    }

    try {
      this.setState({ salvando: true });

      await criarGasto(user.uid, {
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

      Alert.alert("Sucesso", "Gasto registrado!");
      this.setState({
        title: "",
        tituloEndereco: "",
        inputValor: "",
        inputEndereco: { logradouro: "", numero: "", bairro: "", cidade: "", cep: "" },
        categoriaSelecionada: "",
        inputData: new Date(),
        erroValor: null,
        errosEndereco: { logradouro: "", numero: "", bairro: "", cidade: "" },
        erroTitle: null,
      });
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
      fixo, inputEndereco, errosEndereco, tituloEndereco, categoriaSelecionada,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderBack />
        <ScrollView>
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
                placeholder="ex: Hamburguer do Marquinhos"
                label="TÍTULO"
                value={title}
                onChangeText={(v) => this.setState({ title: v })}
                erro={erroTitle}
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
                erros={errosEndereco}
                atualizando={(patch) => {
                  this.setState((prev) => ({
                    inputEndereco: { ...prev.inputEndereco, ...patch },
                    errosEndereco: {
                      ...prev.errosEndereco,
                      ...Object.fromEntries(Object.keys(patch).map((k) => [k, ""])),
                    },
                  }));
                }}
              />
            </View>

            {this.validarCEP() && (
              <Text style={styles.enderecoValidado}>Endereço validado</Text>
            )}

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
    marginRight: 10,
  },
  categoriasBotoes: {
    flexDirection: "row",
    marginTop: 8,
    width: "100%",
    justifyContent: "flex-start",
  },
  box1: {
    backgroundColor: "#1D1252",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    width: 70,
    alignItems: "center",
    marginRight: 8,
  },
  box2: {
    backgroundColor: "#1D1252",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    width: 70,
    alignItems: "center",
    marginRight: 8,
  },
  box3: {
    backgroundColor: "#1D1252",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    width: 70,
    alignItems: "center",
    marginRight: 8,
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
});
