

import HeaderBack from "@/src/components/headerBack";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {KeyboardAvoidingView,Platform,ScrollView,StyleSheet,Text,TextInput,View,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderBot } from "@/src/components/details/chatbot/headerbot/page";
import { useState, useRef } from "react";
import ButtonSendMensage from "@/src/components/details/chatbot/buttonsendmensage/page";
import SuggestionButton from "@/src/components/details/chatbot/sugestionbutton/page";
import { ControllerChatBot } from "@/src/hooks/ControllerChatbot";
import ChatMessage from "@/src/components/details/chatbot/message/page";

interface Mensagem {
  id: string;
  text: string;
  sender: string; //user ou bot
}

export default function ChatBot() {
  const scrollViewRef = useRef<ScrollView>(null); // Criando o "gancho"
  
  //guarda a última mensagem
  const [mensagematual, setMensagemAtual] = useState('');
  const [Isloading, setIsLoading] = useState(false);
  //guarda todas as mensagens,enviadas e recebidas
  //será um array de dicionarios
  const [arrayMensagens, setArrayMensagens] = useState<Mensagem[]>([]);

  //text?: não deixa a obrigatoriadade de passar prâemtro,fazendo com que consiga usar
  //a mesam função para a mesnagem enviada e sugestão
  async function ConexaoApi(text: string) {
    let mensagemEnviada = text;
    
    if (text) {
      //se for enviada pela sugestões
      mensagemEnviada = text;
    } else {
      //se for enviada pelo botão de enviar
      mensagemEnviada = mensagematual;
    }
    
    //só passa da verificação se não estiver vazio
    //.trim remove espaços em branco-->se tiver só espaço branco=false-->!false=true retorna nada
    if (!mensagemEnviada.trim()) return;

    setMensagemAtual('');

    //Ativa o feedback visual de carregamento
    setIsLoading(true);

    //adicionando a mensagem da pessoa na lista
    const idMensagemEnviada = Math.random().toString(36).slice(2, 9);
    const dicionario_mensagem = {
      "id": idMensagemEnviada,
      "text": mensagemEnviada,
      "sender": "user"
    };
    setArrayMensagens(prev => ([...prev, dicionario_mensagem]));
    
    try {
      const apiresposta = await ControllerChatBot(mensagemEnviada);
      setArrayMensagens(prev => ([...prev, apiresposta]));
    } catch (error) {
      console.log("erro na conexão com o controller");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 
        
        - behavior: 'padding' no iOS faz a tela "encolher" por baixo, 'height' no Android redimensiona a janela.
        - keyboardVerticalOffset: É a "folga" para o cabeçalho. 
        
      */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} 
      >
        <View style={{ width: "100%", marginBottom: 0, zIndex: 10 }}>
          <HeaderBack />
        </View>

        {/* MENSAGENS FLEXÍVEIS */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          /*flexGrow: 1 garante que o conteúdo ocupe a tela toda 
             e responda corretamente ao empurrão do teclado sem sumir. */
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24, paddingTop: 10 }}
          keyboardShouldPersistTaps="handled"
          //quando mudar,scrollaar automaticamente para o fim
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/*CABEÇALHO DO ROBÔ*/}
          <HeaderBot/>

          {/**Mensagem padrão do robo(apenas escrito) */}
          <View style={styles.chat}>
            <View style={styles.ia}>
              <Text style={{ lineHeight: 20 }}>
                Olá! Como posso ajudar sua vida financeira hoje?
                Você pode me perguntar sobre qualquer assunto relacionado o âmbito financeiro
              </Text>
            </View>

            {/**Mensagens enviadas e recebidas pela (chat real) */}
            {arrayMensagens.map((item) => (
              <ChatMessage
                key={item.id} //id servirá para controlar quem já ta aparecendo e que mfalta aparecer
                text={item.text}
                isChatbot={item.sender === "chatbot"}
              />
            ))}
          </View>
        </ScrollView>

        
        <View style={styles.sugestao}>
          <SuggestionButton text="Como investir?" onClick={ConexaoApi} />
          <SuggestionButton text="O que é inflação?" onClick={ConexaoApi} />
          <SuggestionButton text="Como calcular o juros?" onClick={ConexaoApi} />
        </View>

        {/* FOOTER FIXO NA BASE */}
        <View style={styles.footerContainer}>
          <View style={styles.footer}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Escreva sua mensagem..."
                style={styles.input}
                placeholderTextColor="#94A3B8"
                onChangeText={setMensagemAtual}
                value={mensagematual} //mostrar como está ficando a escrita
              />

              <ButtonSendMensage 
                onClick={ConexaoApi} 
                textoParaEnviar={mensagematual} 
                isLoading={Isloading} 
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  chat: {
    paddingBottom: 20,
  },
  ia: {
    marginTop: 32,
    backgroundColor: "#e9e9e9",
    borderRadius: 15,
    marginLeft: 30,
    marginRight: 100,
    padding: 20,
  },
  sugestao: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF", // Garante que as sugestões tenham fundo sólido ao subir
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    marginLeft: 10,
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, // 💡 Ajuste fino para não colar na base do iPhone
  },
  footer: {
    backgroundColor: "#e9e9e9",
    borderRadius: 40,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});