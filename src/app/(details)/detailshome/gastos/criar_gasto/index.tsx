import {
  Text, View, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator,
} from "react-native";
import { useState } from "react";
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

export default function Criar() {
  const [title, setTitle] = useState("");
  const [tituloEndereco, setTituloEndereco] = useState(""); 
  const [inputValor, setInputValor] = useState("");
  const [inputEndereco, setInputEndereco] = useState<Endereco>({
    logradouro: "", numero: "", bairro: "", cidade: "", cep: "",
  });
  const [inputData, setInputData] = useState<Date>(new Date());
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [erroValor, setErroValor] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erroTitle, setErroTitle] = useState<string | null>(null);
  

  const [errosEndereco, setErrosEndereco] = useState({
  logradouro: "", numero: "", bairro: "", cidade: "",
});

  const [fixo, setFixo] = useState(false);

  const validarCEP = () => {
    const cep = inputEndereco.cep.replace(/\D/g, "");
    return cep.length === 8;
  };

  // Converte "1.234,56" -> 1234.56
  const parseValor = (texto: string): number => {
    const limpo = texto.replace(/\./g, "").replace(",", ".").replace(/[^0-9.]/g, "");
    return parseFloat(limpo);
  };

  async function handleRegistrar() {

    if (!title.trim()) {
    setErroTitle("Campo obrigatório");
    return;
  }
    if (!categoriaSelecionada) {
      Alert.alert("Atenção", "Selecione uma categoria.");
      return;
    }
    const valorNumerico = parseValor(inputValor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setErroValor("Informe um valor válido");
      return;


    }

    // Validação dos campos obrigatórios do endereço
    const novosErros = {
      logradouro: inputEndereco.logradouro.trim() ? "" : "Campo obrigatório",
      numero:     inputEndereco.numero.trim()     ? "" : "Campo obrigatório",
      bairro:     inputEndereco.bairro.trim()     ? "" : "Campo obrigatório",
      cidade:     inputEndereco.cidade.trim()     ? "" : "Campo obrigatório",
    };
    setErrosEndereco(novosErros);
    if (Object.values(novosErros).some((e) => e !== "")) return;

    if (!validarCEP()) {
      Alert.alert("Atenção", "CEP inválido. Informe um CEP com 8 dígitos.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
      return;
    }

    try {
      setSalvando(true);
       

      await criarGasto(user.uid, {
        valor: valorNumerico,
        data: inputData,
        descricao: title,
        categoria: categoriaSelecionada,
        fixo: fixo, // ajuste se adicionar a opção na UI
        endereco: {
          titulo: tituloEndereco,
          ...inputEndereco,
        },
      });

      Alert.alert("Sucesso", "Gasto registrado!");
      // limpa o formulário
      setTitle("");
      setTituloEndereco("");
      setInputValor("");
      setInputEndereco({ logradouro: "", numero: "", bairro: "", cidade: "", cep: "" });
      setCategoriaSelecionada("");
      setInputData(new Date());
      setErroValor(null);
      setErrosEndereco({ logradouro: "", numero: "", bairro: "", cidade: "" });
      setErroTitle(null);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível registrar o gasto. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

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
                onPress={() => setCategoriaSelecionada("alimentacao")}
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
                  color={
                    categoriaSelecionada === "alimentacao" ? "white" : "black"
                  }
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
                onPress={() => setCategoriaSelecionada("transporte")}
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
                  color={
                    categoriaSelecionada === "transporte" ? "white" : "black"
                  }
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
                onPress={() => setCategoriaSelecionada("lazer")}
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
                onPress={() => setCategoriaSelecionada("educacao")}
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
                  color={
                    categoriaSelecionada === "educacao" ? "white" : "black"
                  }
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
              onChangeText={setTitle}
              erro={erroTitle}
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
              value={tituloEndereco}            // <-- corrigido
              onChangeText={setTituloEndereco}  // <-- corrigido
            />

            <InputEnderecoGasto
               inputEndereco={inputEndereco}
                erros={errosEndereco}                          
                atualizando={(patch) => {
                  setInputEndereco((prev) => ({ ...prev, ...patch }));
                  // Limpa o erro do campo assim que o usuário começa a digitar
                  setErrosEndereco((prev) => ({
                    ...prev,
                    ...Object.fromEntries(Object.keys(patch).map((k) => [k, ""])),
                  }));
                }}
            />
          </View>

          {validarCEP() && (
            <Text style={styles.enderecoValidado}>Endereço validado</Text>
          )}

          <TouchableOpacity
            style={[styles.register, salvando && { opacity: 0.6 }]}
            onPress={handleRegistrar}
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

