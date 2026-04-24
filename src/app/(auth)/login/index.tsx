import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform
} from "react-native"; // ADICIONADO: ScrollView
import { SafeAreaView } from "react-native-safe-area-context"; // ADICIONADO: SafeAreaView

import ButtonConfirmar from "@/src/components/auth/buttonaction";
import InputSenha from "@/src/components/auth/inputsenha";
import { Link, useRouter } from "expo-router";
import InputLogin from "../../../components/auth/inputlogin";
import { loginUsuario } from "@/src/services/authService";

import HeaderBack from "@/src/components/headerBack";

export default function Login() {
  const router = useRouter();
  const [manterConectado, setManterConectado] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputSenha, setInputSenha] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [isloading, setIsLoading] = useState(false);

  async function handleLogin() {
    console.log("🔥 handleLogin foi chamado");
    setMensagemErro("");

    const email = inputEmail.trim();
    console.log("📩 Email:", email);
    console.log("🔒 Senha:", inputSenha);

    if (email === "" || inputSenha === "") {
      setMensagemErro("Preencha todos os campos para continuar.");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      setMensagemErro("O email deve ser um endereço do Gmail.");
      return;
    }

    if (inputSenha.length < 8) {
      setMensagemErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    
    console.log("🚀 Iniciando processo de login...");
    setIsLoading(true);
   try {
      console.log("Chamando firebase...")
      const user = await loginUsuario({
        email: email,
        senha: inputSenha,
      })
      
      console.log("✅ Login realizado com sucesso!");
      console.log("👤 Usuário:", user);
      console.log("🆔 UID:", user.uid);
      console.log("📧 Email Firebase:", user.email);

      router.push("/(tabs)/home");
    } catch (error: any) {

      console.log("❌ ERRO NO LOGIN");
      console.log("Código:", error.code);
      console.log("Mensagem:", error.message);
     // tratamento básico (já resolve 90% dos casos)
     if(error.code === "auth/user-not-found") {
        setMensagemErro("Usuário não encontrado.")
     } else if (error.code === "auth/wrong-password") {
      setMensagemErro("Senha incorreta.")
     } else if(error.code === "auth/invalid-email") {
      setMensagemErro("Email inválido.")
     } else {
      setMensagemErro("Erro ao fazer login")
     }
    } finally {
      console.log("🏁 Finalizou tentativa de login");
      setIsLoading(false)
    }
  }



  return (
    // ADICIONADO: SafeAreaView por fora — respeita notch, câmera e barras do sistema
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
        {/* ScrollView por dentro — permite rolar caso necessário */}
        <ScrollView 
        contentContainerStyle={styles.fundo}
        keyboardShouldPersistTaps="handled"
        >
          <View style={{ width: "100%", marginBottom: -40 }}>
            <HeaderBack />
          </View>
          <Image
            source={require("../../../assets/images/logothinkmoney.png")}
            style={styles.logo}
          />
          <View style={styles.main}>
            <View>
              <InputLogin
                label="Digite seu email"
                placeholder="nome@gmail.com"
                atualizando={(valor) => setInputEmail(valor)}
                icon={require("../../../assets/icons/iconeusuario.svg")}
                value={inputEmail}
              />
              <InputSenha
                label="Digite sua senha"
                placeholder="Digite sua senha"
                atualizando={(valor) => setInputSenha(valor)}
                icon={require("../../../assets/icons/iconecadeado.svg")}
                iconVisibilidade={require("../../../assets/icons/iconeolho.svg")}
                value={inputSenha}
              />
              <View style={styles.esqueceusenha}>
                <Link href={"/(auth)/esqueci-senha"} asChild>
                  <TouchableOpacity>
                    <Text style={styles.textesqueceu}>Esqueci a senha</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setManterConectado(!manterConectado)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  manterConectado && styles.checkboxMarcado,
                ]}
              >
                {manterConectado && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Me mantenha conectado</Text>
            </TouchableOpacity>
            <View style={{ gap: 10 }}>
              {mensagemErro && (
                <Text style={{ color: "red", textAlign: "center" }}>
                  {mensagemErro}
                </Text>
              )}
              {isloading ? (
                <ActivityIndicator size="large" color="#1D1252" />
              ) : (
                <ButtonConfirmar label="Entrar" onClick={handleLogin} />
              )}
            </View>
          </View>
          <View style={styles.containerlinkcadastro}>
            <Text style={{ color: "#867DC1" }}>Novo por aqui ?</Text>
            <Link href={"/(auth)/cadastro"} asChild>
              <TouchableOpacity>
                <Text style={styles.textlinkcadastro}>Crie sua conta</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ADICIONADO: estilo exclusivo do SafeAreaView
  // backgroundColor aqui evita flash branco nas bordas do dispositivo
  safeArea: {
    flex: 1,
    backgroundColor: "#1D1252",
  },

  fundo: {
    flexGrow: 1, // MUDANÇA: flexGrow:1 no lugar de height:'100%' — necessário para ScrollView expandir corretamente
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#1D1252",
    width: "100%",
    gap: 30,
    paddingBottom: 40, // ADICIONADO: respiro no final ao scrollar
    paddingTop: 20, // ADICIONADO: respiro no topo após a SafeArea
  },

  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },

  main: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    gap: 30,
    width: "90%", // ADICIONADO: largura relativa para não bater nas laterais
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 10,
    alignSelf: "flex-start",
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  checkboxMarcado: {
    backgroundColor: "#0D7FF2",
  },

  checkmark: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },

  checkboxLabel: {
    fontSize: 13,
    color: "#484550",
    fontWeight: "500",
  },

  esqueceusenha: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  textesqueceu: {
    fontWeight: "bold",
  },

  containerlinkcadastro: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
  },

  textlinkcadastro: {
    color: "white",
    fontWeight: "bold",
  },
});
