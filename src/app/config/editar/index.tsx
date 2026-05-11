import { useState, useEffect } from "react";
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
import InputEndereco, { Endereco } from "../../../components/InputEndereco";
//import InputTelefone from "../../../components/InputTelefone";
import HeaderBack from "@/src/components/headerBack";
import InputTelefone from "@/src/components/auth/inputtelefone"


// Informacoes firebase
import { auth, db } from "@/src/services/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

export default function EditarConta() {
  const [avatarEscolhido, setAvatarEscolhido] = useState(null);
  const [inputData, setInputData] = useState(new Date());
  const [inputNome, setInputNome] = useState("");
  const [inputUserName, setUserName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputSenha, setInputSenha] = useState("");
  const [inputTelefone, setInputTelefone] = useState("");
  const [inputEndereco, setInputEndereco] = useState({
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    cep: "",
  });
  const [erroTelefone, setErroTelefone] = useState<string | null>(null);


  const [inputSenhaAtual, setInputSenhaAtual] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [mensagemErro, setMensagemErro] = useState("");

  const [usuario, setUsuario] = useState<any>(null);

  

  useEffect(() => {
    async function carregarDados() {
      const uid = auth.currentUser?.uid; // ✅ pega o usuário logado

      if (!uid) return;

      const docRef = doc(db, "usuarios", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUsuario(docSnap.data());
        if (docSnap.exists()) {
          const dados = docSnap.data();
          setUsuario(dados);

          // Pré-popula os campos com os dados salvos
          setInputNome(dados.nome ?? "");
          setUserName(dados.username ?? "");
          setInputEmail(dados.email ?? "");
          setInputTelefone(dados.telefone ?? "");
          setInputEndereco({
            logradouro: dados.logradouro ?? "",
            numero: dados.numero ?? "",
            bairro: dados.bairro ?? "",
            cidade: dados.cidade ?? "",
            cep: dados.cep ?? "",
          });
        }
      }
    }

    carregarDados();
  }, []);

  async function reautenticar(senhaAtual: string) {
    const user = auth.currentUser;
    if (!user || !user.email) return;

    const credential = EmailAuthProvider.credential(user.email, senhaAtual);
    await reauthenticateWithCredential(user, credential);
  }

  async function handleSalvar() {
    setMensagemErro("");
    setIsLoading(true);

    try {
      const uid = auth.currentUser?.uid;
      if (!uid || !auth.currentUser) {
        setMensagemErro("Usuário não autenticado.");
        return;
      }

      // Valida telefone antes de salvar
      const erroTelefoneAtual = validarTelefone(inputTelefone);
      if (erroTelefoneAtual) {
        setErroTelefone(erroTelefoneAtual);
        setIsLoading(false);
        return;
      }

      const emailMudou = inputEmail.trim() !== auth.currentUser.email;
      const senhaMudou = inputSenha.trim().length > 0;

      // ── Reautentica ANTES de mexer em email ou senha ──
      if (emailMudou || senhaMudou) {
        if (!inputSenhaAtual.trim()) {
          setMensagemErro(
            "Digite sua senha atual para alterar email ou senha.",
          );
          return;
        }
        await reautenticar(inputSenhaAtual.trim()); // ✅ chamada aqui
      }

      // ── Valida nova senha se preenchida ──
      if (senhaMudou && inputSenha.trim().length < 8) {
        setMensagemErro("A nova senha deve ter pelo menos 8 caracteres.");
        return;
      }

      // ── Atualiza Firestore ──
      const docRef = doc(db, "usuarios", uid);
      await updateDoc(docRef, {
        nome: inputNome.trim(),
        username: inputUserName.trim(),
        email: inputEmail.trim(),
        telefone: inputTelefone,
        datanascimento: inputData,
        logradouro: inputEndereco.logradouro,
        numero: inputEndereco.numero,
        bairro: inputEndereco.bairro,
        cidade: inputEndereco.cidade,
        cep: inputEndereco.cep,
      });

      // ── Atualiza email no Auth ──
      if (emailMudou) {
        await updateEmail(auth.currentUser, inputEmail.trim());
      }

      // ── Atualiza senha no Auth ──
      if (senhaMudou) {
        await updatePassword(auth.currentUser, inputSenha.trim());
      }

      alert("Dados atualizados com sucesso!");
    } catch (error: any) {
      const mensagens: Record<string, string> = {
        "auth/requires-recent-login": "Sessão expirada. Faça login novamente.",
        "auth/email-already-in-use": "Este email já está em uso.",
        "auth/invalid-email": "Email inválido.",
        "auth/weak-password": "Senha muito fraca.",
        "auth/wrong-password": "Senha atual incorreta.",
        "auth/network-request-failed":
          "Erro de conexão. Verifique sua internet.",
      };
      console.log(error)
      setMensagemErro(
        mensagens[error.code] ?? "Erro ao salvar. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function validarTelefone(valor: string): string | null {
    const apenasNumeros = valor.replace(/\D/g, "");
    if (apenasNumeros.length < 10 || apenasNumeros.length > 11)
      return "Telefone inválido. Use (XX) 9XXXX-XXXX.";
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
       <HeaderBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
       
        <ScrollView
          contentContainerStyle={styles.fundo}
          keyboardShouldPersistTaps="handled"
        >
          
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
              label="Senha atual:"
              placeholder="Digite sua senha atual"
              atualizando={(valor) => setInputSenhaAtual(valor)}
              icon={require("../../../assets/icons/iconecadeado.svg")}
              iconVisibilidade={require("../../../assets/icons/iconeolho.svg")}
              value={inputSenhaAtual}
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
              value={inputTelefone}
              atualizando={(valor) => {
                setInputTelefone(valor);
                setErroTelefone(null); // ✅ limpa ao digitar
              }}
              erro={erroTelefone}
            />

            <InputEndereco
              inputEndereco={inputEndereco}
              atualizando={(patch: Partial<Endereco>) =>
                setInputEndereco((prev) => ({ ...prev, ...patch }))
              }
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
                  <ButtonConfirmar label="Salvar" onClick={handleSalvar} />
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
    gap: 0,
    paddingBottom: 40,
    paddingTop: 0,
  },

  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
     marginTop: 8, 
  },

  main: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    gap: 5,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8, 
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
    alignItems: "center",
  },
  headerContainer: {
  width: "100%",
  paddingTop: 8,
  paddingLeft: 16,
  marginBottom: -10, // ✅ reduz o espaço entre header e logo
},
});
