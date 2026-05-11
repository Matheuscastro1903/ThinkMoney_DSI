import { View, Text, TextInput, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputNumeroProps {
  label?: string;
  value: string;
  atualizando: (valor: string) => void;
  erro?: string | null;
  style?: ViewStyle;
}

export default function InputNumero({
  label = "Nº:",
  value,
  atualizando,
  erro,
  style,
}: InputNumeroProps) {
  return (
    <View style={[styles.containerText, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.input}>
        <Ionicons name="keypad-outline" size={20} color="#929297" />
        <TextInput
          style={styles.textinput}
          placeholder="123"
          placeholderTextColor="#ccc"
          value={value}
          onChangeText={atualizando}
          keyboardType="numeric"
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