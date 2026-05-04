import { cadastrarUsuario } from "@/src/services/authService";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ADICIONADO: SafeAreaView

import ButtonConfirmar from "@/src/components/auth/buttonaction";
import EscolhaAvatar from "@/src/components/auth/escolhaavantar";
import InputDate from "@/src/components/auth/inputdata";
import InputSenha from "@/src/components/auth/inputsenha";
import InputLogin from "../../../components/auth/inputlogin";
import InputRenda from "@/src/components/auth/inputrenda";

// Criação de componentes para inputs de endereço e mais informacoes pessoais
import InputTelefone from "@/src/components/auth/inputtelefone";
import InputProfissao from "@/src/components/auth/inputprofissao";
import InputLogradouro from "@/src/components/auth/inputlogradouro";
import InputNumero from "@/src/components/auth/inputnumero";
import InputBairro from "@/src/components/auth/inputbairro";
import InputCidade from "@/src/components/auth/inputcidade";
import InputCep from "@/src/components/auth/inputcep";
import { Ionicons } from "@expo/vector-icons";

interface CadastroUsuario {
  nome: string;
  email: string;
  senha: string;
  datanascimento: string;
  username: string; // formato "YYYY-MM-DD"
  renda: string;
  telefone: string;
  profissao: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
}

export default function Cadastro() {
  const [avatarEscolhido, setAvatarEscolhido] = useState(
    "../../assets/images/avatarcapivara.png",
  );

  const [inputNome, setInputNome] = useState("");
  const [inputUserName, setUserName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputSenha, setInputSenha] = useState("");
  const [inputSenhaConfirmada, setInputSenhaConfirmada] = useState("");
  const [inputData, setInputData] = useState<Date | null>(null);
  const [inputRenda, setInputRenda] = useState(""); // adição de espaço para renda

  const [inputTelefone, setInputTelefone] = useState("");
  const [inputProfissao, setInputProfissao] = useState("");
  const [inputLogradouro, setInputLogradouro] = useState("");
  const [inputNumero, setInputNumero] = useState("");
  const [inputBairro, setInputBairro] = useState("");
  const [inputCidade, setInputCidade] = useState("");
  const [inputCep, setInputCep] = useState("");

  // Estados de erro

  const [erroProfissao, setErroProfissao] = useState<string | null>(null);
  const [erroTelefone, setErroTelefone] = useState<string | null>(null);
  const [erroLogradouro, setErroLogradouro] = useState<string | null>(null);
  const [erroNumero, setErroNumero] = useState<string | null>(null);
  const [erroBairro, setErroBairro] = useState<string | null>(null);
  const [erroCidade, setErroCidade] = useState<string | null>(null);
  const [erroCep, setErroCep] = useState<string | null>(null);

  const [erroRenda, setErroRenda] = useState<string | null>(null);

  const [termosAceitos, setTermosAceitos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [mensagemErro, setMensagemErro] = useState("");

  async function handleCadastro() {
    setMensagemErro("");

    const nome = inputNome.trim();
    const userName = inputUserName.trim();
    const email = inputEmail.trim();
    const senha = inputSenha.trim();
    const senhaConfirmada = inputSenhaConfirmada.trim();

    if (
      nome === "" ||
      userName === "" ||
      email === "" ||
      senha === "" ||
      senhaConfirmada === "" ||
      inputData === null
    ) {
      setMensagemErro("Preencha todos os campos para continuar.");
      return;
    }

    const erroRendaAtual = validarRenda(inputRenda);
    if (erroRendaAtual) {
      setErroRenda(erroRendaAtual);
      return; // para o fluxo se renda for inválida
    }

    if (!termosAceitos) {
      setMensagemErro("Você precisa aceitar os termos para continuar.");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      setMensagemErro("O email deve ser um endereço do Gmail.");
      return;
    }

    if (senha.length < 8) {
      setMensagemErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (senha !== senhaConfirmada) {
      setMensagemErro("As senhas não coincidem.");
      return;
    }

    const erroProfissaoAtual = validarProfissao(inputProfissao);
    const erroTelefoneAtual = validarTelefone(inputTelefone);
    const erroLogradouroAtual = validarLogradouro(inputLogradouro);
    const erroNumeroAtual = validarNumero(inputNumero);
    const erroBairroAtual = validarBairro(inputBairro);
    const erroCidadeAtual = validarCidade(inputCidade);
    const erroCepAtual = validarCep(inputCep);

    if (
      erroProfissaoAtual ||
      erroTelefoneAtual ||
      erroLogradouroAtual ||
      erroNumeroAtual ||
      erroBairroAtual ||
      erroCidadeAtual ||
      erroCepAtual
    ) {
      setErroProfissao(erroProfissaoAtual);
      setErroTelefone(erroTelefoneAtual);
      setErroLogradouro(erroLogradouroAtual);
      setErroNumero(erroNumeroAtual);
      setErroBairro(erroBairroAtual);
      setErroCidade(erroCidadeAtual);
      setErroCep(erroCepAtual);
      return;
    }

    setIsLoading(true);
    try {
      const dadosUsuario: CadastroUsuario = {
        nome,
        email,
        senha,
        username: userName,
        datanascimento: inputData.toISOString().split("T")[0], // "YYYY-MM-DD"
        renda: inputRenda,
        telefone: inputTelefone,
        profissao: inputProfissao,
        logradouro: inputLogradouro,
        numero: inputNumero,
        bairro: inputBairro,
        cidade: inputCidade,
        cep: inputCep,
      };
      await cadastrarUsuario(dadosUsuario);
      router.replace("/(auth)/cadastro-sucesso");
    } catch (error: any) {
      // traduz os erros mais comuns do firebase
      const mensagens: Record<string, string> = {
        "auth/email-already-in-use": "Este email já está cadastrado",
        "auth/invalid-email": "Email inválido",
        "auth/weak-password": "Senha muito fraca",
        "auth/network-request-failed": "Erro de conexão. Verfique sua internet",
      };

      setMensagemErro(
        mensagens[error.code] ?? "Erro ao cadastrar. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function validarRenda(valor: string): string | null {
    const apenasNumeros = valor.replace(/\D/g, "");

    if (!apenasNumeros || apenasNumeros === "000") {
      return "Informe um valor válido";
    }

    const numero = parseInt(apenasNumeros) / 100;

    if (numero > 999999.99) {
      return "Valor muito alto";
    }

    return null;
  }

  function validarProfissao(valor: string): string | null {
    if (valor.trim().length < 3) return "Informe uma profissão válida.";
    if (valor.trim().length > 50) return "Profissão muito longa.";
    return null;
  }

  function validarTelefone(valor: string): string | null {
    const apenasNumeros = valor.replace(/\D/g, "");
    if (apenasNumeros.length < 10 || apenasNumeros.length > 11)
      return "Telefone inválido. Use (XX) 9XXXX-XXXX.";
    return null;
  }

  function validarLogradouro(valor: string): string | null {
    if (valor.trim().length < 3) return "Informe um logradouro válido.";
    return null;
  }

  function validarNumero(valor: string): string | null {
    if (valor.trim() === "") return "Informe o número.";
    if (!/^\d+[A-Za-z]?$/.test(valor.trim())) return "Número inválido.";
    return null;
  }

  function validarBairro(valor: string): string | null {
    if (valor.trim().length < 2) return "Informe um bairro válido.";
    return null;
  }

  function validarCidade(valor: string): string | null {
    if (valor.trim().length < 2) return "Informe uma cidade válida.";
    return null;
  }

  function validarCep(valor: string): string | null {
    const apenasNumeros = valor.replace(/\D/g, "");
    if (apenasNumeros.length !== 8) return "CEP deve ter 8 dígitos.";
    return null;
  }

  // Funcao para definir um padrão correto para o telefone
  function mascaraTelefone(valor: string): string {
    const nums = valor.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 10)
      return nums.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    return nums.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }

  // Funcao para definir um padrao correto para o cep
  function mascaraCep(valor: string): string {
    const nums = valor.replace(/\D/g, "").slice(0, 8);
    return nums.replace(/(\d{5})(\d{0,3})/, "$1-$2");
  }

  return (
    // ADICIONADO: SafeAreaView por fora — respeita notch, câmera e barras do sistema
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* ScrollView por dentro — permite rolar quando o conteúdo ultrapassar a tela */}
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
              <Text style={styles.mainFrase}>Crie sua conta</Text>
              <Text style={styles.subFrase}>
                Inicie sua jornada com o ThinkMoney
              </Text>
            </View>

            <EscolhaAvatar onChange={(avatar) => setAvatarEscolhido(avatar)} />

            <View style={styles.containercadastro}>
              <InputLogin
                label="Digite seu Nome completo:"
                placeholder="Ex: Matheus de Castro"
                atualizando={(valor) => setInputNome(valor)}
                icon={require("../../../assets/icons/iconeusuario.svg")}
                value={inputNome}
              />

              <InputLogin
                label="Digite seu Username:"
                placeholder="Ex: Castro_07"
                atualizando={(valor) => setUserName(valor)}
                icon={require("../../../assets/icons/iconeusuario.svg")}
                value={inputUserName}
              />

              <InputLogin
                label="Digite seu Email:"
                placeholder="Ex: matheuzinho1903@gmail.com"
                atualizando={(valor) => setInputEmail(valor)}
                icon={require("../../../assets/icons/iconeusuario.svg")}
                value={inputEmail}
              />

              <InputSenha
                label="Digite sua Senha"
                placeholder="Ex:123456"
                atualizando={(valor) => setInputSenha(valor)}
                icon={require("../../../assets/icons/iconecadeado.svg")}
                iconVisibilidade={require("../../../assets/icons/iconeolho.svg")}
                value={inputSenha}
              />

              <InputSenha
                label="Confirme sua Senha:"
                placeholder="Ex:123456"
                atualizando={(valor) => setInputSenhaConfirmada(valor)}
                icon={require("../../../assets/icons/iconeescudo.svg")}
                iconVisibilidade={require("../../../assets/icons/iconeolho.svg")}
                value={inputSenhaConfirmada}
              />
              <InputDate
                label="Data de nascimento:"
                icon={require("../../../assets/icons/iconedata.svg")}
                onChange={(dataPronta) => setInputData(dataPronta)}
              ></InputDate>

              <InputRenda
                label="Digite sua Renda média"
                placeholder="Ex: 3.000"
                //atualizando={(valor) => setInputRenda(valor)}
                icon={require("../../../assets/icons/iconecadeado.svg")}
                iconVisibilidade={require("../../../assets/icons/iconeolho.svg")}
                value={inputRenda}
                atualizando={(texto) => {
                  setInputRenda(texto);
                  setErroRenda(null); // limpa o erro enquanto digita
                }}
                erro={erroRenda}
              />

              {/* ── Dados Profissionais ── */}
              <InputProfissao
                value={inputProfissao}
                atualizando={(valor) => {
                  setInputProfissao(valor);
                  setErroProfissao(null);
                }}
                erro={erroProfissao}
              />

              <InputTelefone
                value={inputTelefone}
                atualizando={(valor) => {
                  setInputTelefone(valor);
                  setErroTelefone(null);
                }}
                erro={erroTelefone}
              />

              {/* Grid de endereço */}
              <View style={styles.enderecoGrid}>
                <View style={styles.enderecoLinha}>
                  <View style={styles.campoLogradouro}>
                    <InputLogradouro
                      value={inputLogradouro}
                      atualizando={(valor) => {
                        setInputLogradouro(valor);
                        setErroLogradouro(null);
                      }}
                      erro={erroLogradouro}
                      style={{ flex: 1 }}
                    />
                  </View>
                  <View style={styles.campoNumero}>
                    <InputNumero
                      value={inputNumero}
                      atualizando={(valor) => {
                        setInputNumero(valor);
                        setErroNumero(null);
                      }}
                      erro={erroNumero}
                      style={{ flex: 1 }}
                    />
                  </View>
                </View>

                <View style={styles.enderecoLinha}>
                  <View style={styles.campoBairro}>
                    <InputBairro
                      value={inputBairro}
                      atualizando={(valor) => {
                        setInputBairro(valor);
                        setErroBairro(null);
                      }}
                      erro={erroBairro}
                      style={{ flex: 1 }}
                    />
                  </View>
                  <View style={styles.campoCidade}>
                    <InputCidade
                      value={inputCidade}
                      atualizando={(valor) => {
                        setInputCidade(valor);
                        setErroCidade(null);
                      }}
                      erro={erroCidade}
                      style={{ flex: 1 }}
                    />
                  </View>
                </View>

                <InputCep
                  value={inputCep}
                  atualizando={(valor) => {
                    setInputCep(valor);
                    setErroCep(null);
                  }}
                  erro={erroCep}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setTermosAceitos(!termosAceitos)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  termosAceitos && styles.checkboxMarcado,
                ]}
              >
                {termosAceitos && <Text style={styles.checkmark}>✓</Text>}
              </View>

              <Text style={styles.checkboxLabel}>
                Eu concordo com os Termos de Serviço e a Política de Privacidade
                da ThinkMoney.
              </Text>
            </TouchableOpacity>

            <View style={{ gap: 10, alignItems: "center" }}>
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
                <ButtonConfirmar label="Cadastrar" onClick={handleCadastro} />
              )}
            </View>
          </View>

          <View style={styles.containerlinklogin}>
            <Text style={{ color: "#867DC1" }}>Já tem uma conta?</Text>
            <Link href={"/(auth)/login"} asChild>
              <TouchableOpacity>
                <Text style={styles.textlinklogin}>Faça login</Text>
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
  // flex:1 para ocupar toda a tela — backgroundColor aqui evita flash branco no SafeArea
  safeArea: {
    flex: 1,
    backgroundColor: "#1D1252",
  },

  fundo: {
    flexGrow: 1, // flexGrow:1 necessário para ScrollView expandir corretamente
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#1D1252",
    width: "100%",
    gap: 16,
    paddingBottom: 40, // respiro no final ao scrollar
    paddingTop: 8, // Ajuste: sobe o bloco principal com os inputs
  },

  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },

  main: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    gap: 20,
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

  containercadastro: {
    width: "100%", // ✅ adicione isso
    alignContent: "center",
    justifyContent: "center",
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    flexShrink: 0,
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
    flex: 1,
  },

  containerlinklogin: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
  },

  textlinklogin: {
    color: "white",
    fontWeight: "bold",
  },
  erroInput: {
    color: "red",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 4,
    marginLeft: 4,
  },
  enderecoGrid: {
    width: "100%",
  },

  enderecoLinha: {
    flexDirection: "row",
    gap: 0, // gap controlado pelos próprios filhos via margin do InputLogin
  },

  campoLogradouro: {
    flex: 3, // ocupa 75% da linha
  },

  campoNumero: {
    flex: 2, // ocupa 25% da linha
  },

  campoBairro: {
    flex: 1, // 50% da linha
  },

  campoCidade: {
    flex: 1, // 50% da linha
  },
});
