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

import ButtonConfirmar from "@/src/components/details/lembretes/buttonlembretes/page";
import SelectField from "@/src/components/details/lembretes/campoescolha/page";
import InputTexto from "@/src/components/details/lembretes/campoinput/page.";
import InputDateLembretes from "@/src/components/details/lembretes/inputDataLembretes/page";
import HeaderBack from "@/src/components/headerBack";

export default function TelaCreateLembrete() {
  const [escolhaGastos, setEscolhaGastos] = useState("");
  const [inputData, setInputData] = useState<Date | null>(null);
  const [inputNomeGasto, setInputNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [descricao, setDescricao] = useState("");

  function teste() {
    console.log("teste");
  }

  const opcoesGastos = [
    { value: "ENTRETENIMENTO", label: "Entretenimento" },
    { value: "MORADIA", label: "Moradia" },
    { value: "TRANSPORTE", label: "Transporte" },
    { value: "FIXOS", label: "Contas Fixas" },
    { value: "OUTROS", label: "Outros" },
  ];

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
            <Text style={styles.title}>Adicionar lembrete</Text>
          </View>

          <View style={styles.form}>
            <InputTexto
              label="Nome do gasto"
              placeholder="Ex: Aluguel"
              atualizando={setInputNomeGasto}
              value={inputNomeGasto}
              width={300}
              height={56}
              multline={false}
            />

            <SelectField
              label="Categoria de Gasto:"
              options={opcoesGastos}
              value={escolhaGastos}
              onChange={setEscolhaGastos}
            />

            <InputTexto
              label="Valor do Gasto"
              placeholder="Ex: 67,00"
              atualizando={setValorGasto}
              value={valorGasto}
              width={300}
              height={56}
              multline={false}
            />

            <InputDateLembretes
              label="Escolha a data:"
              icon={require("../../../../../assets/icons/iconedata.svg")}
              onChange={setInputData}
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
          </View>
          <View style={styles.viewbotao}>
            <ButtonConfirmar label="Criar lembrete" onClick={teste} />
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
