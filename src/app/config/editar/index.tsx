import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ADICIONADO: SafeAreaView

import ButtonConfirmar from "@/src/components/auth/buttonaction";
import EscolhaAvatar from "@/src/components/auth/escolhaavantar";
import InputDate from "@/src/components/auth/inputdata";
import InputSenha from "@/src/components/auth/inputsenha";
import InputLogin from "../../../components/auth/inputlogin";
import InputEndereco from "../../../components/InputEndereco";
import InputTelefone from "../../../components/InputTelefone";
import HeaderBack from "@/src/components/headerBack";

export default function EditarConta() {
  const [avatarEscolhido, setAvatarEscolhido] = useState(null);
  const [inputData, setInputData] = useState(new Date());
  const [inputNome, setInputNome] = useState("");
  const [inputUserName, setUserName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputSenha, setInputSenha] = useState("");
  const [inputTelefone, setInputTelefone] = useState("");
  const [inputEndereco, setInputEndereco] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [mensagemErro, setMensagemErro] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.fundo}
          keyboardShouldPersistTaps="handled"
        > 
          <HeaderBack/>
          <Image
            source={require("../../../assets/images/logothinkmoney.png")}
            style={styles.logo}
          />

          <View style={styles.main}>
            <View>
              <Text style={styles.mainFrase}>Edite sua conta</Text>
              <Text style={styles.subFrase}>
                Atualize suas informações no ThinkMoney
              </Text>
            </View>

            <EscolhaAvatar onChange={(avatar) => setAvatarEscolhido(avatar)} />

            <InputLogin
              label="Nome Completo:"
              placeholder="Nome salvo no banco de dados"
              atualizando={(valor) => setInputNome(valor)}
              icon={require("../../../assets/icons/iconeusuario.svg")}
              value={inputNome}
            />

            <InputLogin
              label="Username:"
              placeholder="Username salvo no banco de dados"
              atualizando={(valor) => setUserName(valor)}
              icon={require("../../../assets/icons/iconeusuario.svg")}
              value={inputUserName}
            />

            <InputLogin
              label="Email:"
              placeholder="Email salvo no banco de dados"
              atualizando={(valor) => setInputEmail(valor)}
              icon={require("../../../assets/icons/iconeusuario.svg")}
              value={inputEmail}
            />

            <InputSenha
              label="Senha"
              placeholder="Digite sua nova senha"
              atualizando={(valor) => setInputSenha(valor)}
              icon={require("../../../assets/icons/iconecadeado.svg")}
              iconVisibilidade={require("../../../assets/icons/iconeolho.svg")}
              value={inputSenha}
            />

            <InputDate
              label="Data de nascimento:"
              icon={require("../../../assets/icons/iconedata.svg")}
              onChange={(dataPronta) => setInputData(dataPronta)}
            />

            <InputTelefone
              atualizando={(telefone) => setInputTelefone(telefone)}
            />

            <InputEndereco
              atualizando={(endereco) => setInputEndereco(endereco)}
            />

            <View style={styles.aviso}>
              {mensagemErro && (
                <Text style={{ color: "red", textAlign: "center" }}>
                  {mensagemErro}
                </Text>
              )}

              {isLoading ? (
                <Text style={{ color: "#1D1252", fontWeight: "bold" }}>
                  Carregando...
                </Text>
              ) : (
                <View style={{ width: "100%", paddingTop: 20 }}>
                  <ButtonConfirmar label="Salvar" onClick={() => {}} />
                </View>
              )}
            </View>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1D1252",
    height: "100%",
  },

  fundo: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#1D1252",
    width: "100%",
    gap: 16,
    paddingBottom: 40,
    paddingTop: 8,
  },

  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },

  main: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    gap: 5,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },

  mainFrase: {
    color: "#1D1252",
    fontSize: 24,
    fontWeight: "bold",
  },

  subFrase: {
    color: "#575F67",
    fontSize: 16,
  },

  aviso: {
    gap: 10,
    alignItems: "center"
  }
});
