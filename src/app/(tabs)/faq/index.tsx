import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const FAQ = [
  {
    id: "1",
    pergunta: "Como crio minha conta?",
    resposta:
      'Na tela inicial, toque em "Crie sua conta", preencha seus dados e escolha seu avatar.',
  },
  {
    id: "2",
    pergunta: "Esqueci minha senha. O que faço?",
    resposta:
      'Na tela de login, toque em "Esqueci a senha" e informe seu e-mail para receber o link de redefinição.',
  },
  {
    id: "3",
    pergunta: "Como registro um novo gasto?",
    resposta:
      'Na tela Home, toque em "REGISTRAR NOVO GASTO", informe valor, categoria e descrição.',
  },
  {
    id: "4",
    pergunta: "O que são as Metas Pessoais?",
    resposta:
      "São objetivos financeiros que você define com valor e prazo. Você contribui ao longo do tempo e acompanha o progresso.",
  },
  {
    id: "5",
    pergunta: "Para que servem os Lembretes?",
    resposta:
      "Para você não esquecer contas a vencer. Cadastre nome, valor e data de vencimento.",
  },
  {
    id: "6",
    pergunta: "Como funciona o grupo Família?",
    resposta:
      "Na aba Família, crie um grupo e compartilhe o código FAM-XXXX com os membros que deseja incluir.",
  },
  {
    id: "7",
    pergunta: "Minha senha fica salva no app?",
    resposta:
      "Não. O ThinkMoney usa Firebase Authentication — sua senha nunca é armazenada em texto puro.",
  },
];

function CardFaq({
  pergunta,
  resposta,
}: {
  pergunta: string;
  resposta: string;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.card, aberto && styles.cardAberto]}
      onPress={() => setAberto(!aberto)}
      activeOpacity={0.8}
    >
      <View style={styles.cardTopo}>
        <Text style={styles.pergunta}>{pergunta}</Text>
        <Ionicons
          name={aberto ? "chevron-up" : "chevron-down"}
          size={24}
          color="#94A3B8"
        />
      </View>
      {aberto && <Text style={styles.resposta}>{resposta}</Text>}
    </TouchableOpacity>
  );
}

export default function Faq() {
  return (
    <ScrollView
      style={styles.fundo}
      contentContainerStyle={styles.scroll}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.suporte}>
        <Text style={styles.titulo}>ChatBot</Text>
        <Link href="/chatbot" asChild>
          <TouchableOpacity style={styles.botaoPrimario} activeOpacity={0.85}>
            <Ionicons name="chatbubble" size={20} color="#1D1252" />
            <Text style={styles.botaoPrimarioTexto}>Chatbot</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <Text style={styles.titulo}>Perguntas Frequentes</Text>

      <Text style={styles.subtitulo}>
        Dúvidas? Encontre aqui as respostas para as perguntas mais comuns sobre
        o ThinkMoney.
      </Text>

      {FAQ.map((item) => (
        <CardFaq
          key={item.id}
          pergunta={item.pergunta}
          resposta={item.resposta}
        />
      ))}

      <View style={styles.suporte}>
        <Text style={styles.suporteTexto}>
          Ainda tem dúvidas? Entre em contato com nosso suporte!
        </Text>
        <Text style={styles.suporteSubtitulo}>Fale conosco</Text>

        <TouchableOpacity style={styles.botaoSecundario} activeOpacity={0.85}>
          <Text style={styles.botaoSecundarioTexto}>E-mail</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: "#1D1252",
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 100,
    gap: 12,
  },

  titulo: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 44,
    letterSpacing: -0.9,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 16,
    color: "#867DC1",
    lineHeight: 24,
    marginBottom: 8,
  },

  // Card accordion
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  cardAberto: {
    borderLeftWidth: 3,
    borderLeftColor: "#4ADE80",
  },
  cardTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  pergunta: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1D1252",
    lineHeight: 20,
  },
  resposta: {
    marginTop: 10,
    fontSize: 13,
    color: "#484550",
    lineHeight: 20,
  },

  // Seção suporte
  suporte: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 24,
    gap: 16,
    marginTop: 8,
  },
  suporteTitulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 30,
  },
  suporteTexto: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 22,
  },
  suporteSubtitulo: {
    fontSize: 14,
    color: "#867DC1",
    lineHeight: 22,
    marginTop: -4,
  },
  botaoPrimario: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 10,
  },
  botaoPrimarioTexto: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1D1252",
  },
  botaoSecundario: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 10,
  },
  botaoSecundarioTexto: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
