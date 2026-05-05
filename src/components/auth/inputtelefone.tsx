import { View, Text, TextInput, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputTelefoneProps {
  label?: string;
  value: string;
  atualizando: (valor: string) => void;
  erro?: string | null;
  style?: ViewStyle;
}

function mascaraTelefone(valor: string): string {
  const nums = valor.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 10)
    return nums.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return nums.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

export default function InputTelefone({
  label = "Telefone:",
  value,
  atualizando,
  erro,
  style,
}: InputTelefoneProps) {
  return (
    <View style={[styles.containerText, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.input}>
        <Ionicons name="call-outline" size={20} color="#929297" />
        <TextInput
          style={styles.textinput}
          placeholder="Ex: (81) 99999-9999"
          placeholderTextColor="#ccc"
          value={value}
          onChangeText={(texto) => atualizando(mascaraTelefone(texto))}
          keyboardType="phone-pad"
          autoCapitalize="none"
        />
      </View>
      {erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  containerText: {
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 8,
    margin: 10,
  },
  input: {
    backgroundColor: "#EDEEEF",
    borderRadius: 10,
    width: "100%",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  textinput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    marginLeft: 10,
  },
  label: {
    color: "#484550",
    fontSize: 12,
    fontWeight: "bold",
  },
  erro: {
    color: "red",
    fontSize: 12,
    marginTop: -4,
    marginLeft: 4,
  },
});