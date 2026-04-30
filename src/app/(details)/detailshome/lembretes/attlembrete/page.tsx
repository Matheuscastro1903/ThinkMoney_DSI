import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//usado para capturar 'atributos' passados
import InputDateLembretes from "@/src/components/details/lembretes/inputDataLembretes/page";
import { useLocalSearchParams } from "expo-router";

import ButtonDeletarLembretes from "@/src/components/details/lembretes/buttondell/page";
import ButtonConfirmar from "@/src/components/details/lembretes/buttonlembretes/page";
import SelectField from "@/src/components/details/lembretes/campoescolha/page";
import InputTexto from "@/src/components/details/lembretes/campoinput/page.";
import HeaderBack from "@/src/components/headerBack";

export default function TelaUpdateLembrete() {
  //capturando os parametros(ira retornar no formato de dicionário)
  const params = useLocalSearchParams();

  const [inputNomeGasto, setInputNomeGasto] = useState(
    (params.titulo as string) || "",
  );
  const [escolhaGastos, setEscolhaGastos] = useState(
    (params.categoria as string) || "",
  );
  const [valorGasto, setValorGasto] = useState((params.valor as string) || "");
  const [data, setData] = useState<Date | null>(null);
  const [descricao, setDescricao] = useState("");

  const opcoesGastos = [
    { value: "ENTRETENIMENTO", label: "Entretenimento" },
    { value: "MORADIA", label: "Moradia" },
    { value: "TRANSPORTE", label: "Transporte" },
    { value: "FIXOS", label: "Contas Fixas" },
    { value: "OUTROS", label: "Outros" },
  ];

  function handleAtualizar() {
    console.log("Dados atualizados:", {
      inputNomeGasto,
      escolhaGastos,
      valorGasto,
    });
  }

  function deletarlembrete() {
    console.log(1);
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
              onClick={deletarlembrete}
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
