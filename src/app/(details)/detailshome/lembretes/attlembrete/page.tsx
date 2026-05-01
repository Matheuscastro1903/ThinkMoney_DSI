import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import InputDateLembretes from "@/src/components/details/lembretes/inputDataLembretes/page";
import ButtonDeletarLembretes from "@/src/components/details/lembretes/buttondell/page";
import ButtonConfirmar from "@/src/components/details/lembretes/buttonlembretes/page";
import SelectField from "@/src/components/details/lembretes/campoescolha/page";
import InputTexto from "@/src/components/details/lembretes/campoinput/page.";
import HeaderBack from "@/src/components/headerBack";
import { auth } from "@/src/services/firebaseConfig";
import { atualizarLembrete, excluirLembrete } from "@/src/services/lembretesService";

export default function TelaUpdateLembrete() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [inputNomeGasto, setInputNomeGasto] = useState(
    (params.titulo as string) || "",
  );
  const [escolhaGastos, setEscolhaGastos] = useState(
    (params.categoria as string) || "",
  );
  const [valorGasto, setValorGasto] = useState((params.valor as string) || "");
  const [data, setData] = useState<Date | null>(null);
  const [descricao, setDescricao] = useState((params.descricao as string) || "");

  const opcoesGastos = [
    { value: "ENTRETENIMENTO", label: "Entretenimento" },
    { value: "MORADIA", label: "Moradia" },
    { value: "TRANSPORTE", label: "Transporte" },
    { value: "FIXOS", label: "Contas Fixas" },
    { value: "OUTROS", label: "Outros" },
  ];

  async function handleAtualizar() {
    const user = auth.currentUser;
    const id = params.id as string;
    if (!user || !id) return;

    await atualizarLembrete(user.uid, id, {
      nomeGasto: inputNomeGasto,
      categoria: escolhaGastos,
      valor: parseFloat(valorGasto.replace(",", ".")),
      ...(data ? { vencimento: data.toISOString().split("T")[0] } : {}),
      ...(descricao ? { descricao } : {}),
    });

    router.back();
  }

  async function handleDeletar() {
    const user = auth.currentUser;
    const id = params.id as string;
    if (!user || !id) return;

    Alert.alert("Deletar lembrete", "Tem certeza que deseja deletar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          await excluirLembrete(user.uid, id);
          router.back();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <HeaderBack />

          <View style={styles.header}>
            <Text style={styles.title}>Refine seus</Text>
            <Text style={styles.title}>compromissos</Text>
          </View>

          <View style={styles.form}>
            <InputTexto
              label="Nome do gasto"
              atualizando={setInputNomeGasto}
              value={inputNomeGasto}
              width={300}
              height={56}
              multline={false}
            />

            <SelectField
              label="Categoria de Gasto:"
              value={escolhaGastos}
              onChange={setEscolhaGastos}
              options={opcoesGastos}
            />

            <InputTexto
              label="Valor do Gasto"
              atualizando={setValorGasto}
              value={valorGasto}
              width={300}
              height={56}
              multline={false}
            />

            <InputDateLembretes
              label="Escolha a data:"
              icon={require("../../../../../assets/icons/iconedata.svg")}
              onChange={setData}
            />

            <InputTexto
              label="Descrição do gasto:"
              placeholder="Adicione uma descrição..."
              atualizando={setDescricao}
              value={descricao}
              width={300}
              height={120}
              multline={true}
            />

            <ButtonConfirmar
              label="Salvar Alterações"
              onClick={handleAtualizar}
            />
            <ButtonDeletarLembretes
              label="Deletar lembrete"
              onClick={handleDeletar}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1252",
    paddingBottom: 50,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  header: {
    width: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fdfdff",
    textAlign: "left",
  },
  form: {
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  viewbotao: {
    marginTop: 20,
  },
});
