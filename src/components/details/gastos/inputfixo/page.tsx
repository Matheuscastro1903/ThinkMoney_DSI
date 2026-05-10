import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  value: boolean;
  onChange: (fixo: boolean) => void;
}

export default function InputFixo({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>TIPO DE GASTO</Text>
      <View style={styles.botoes}>

        <TouchableOpacity
          onPress={() => onChange(false)}
          style={[styles.box, !value ? styles.ativo : styles.inativo]}
        >
          <Ionicons
            name="flash"
            size={20}
            color={!value ? "white" : "black"}
            style={styles.icon}
          />
          <Text style={[styles.texto, !value ? styles.textoAtivo : styles.textoInativo]}>
            Variável
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onChange(true)}
          style={[styles.box, value ? styles.ativo : styles.inativo]}
        >
          <Ionicons
            name="repeat"
            size={20}
            color={value ? "white" : "black"}
            style={styles.icon}
          />
          <Text style={[styles.texto, value ? styles.textoAtivo : styles.textoInativo]}>
            Fixo
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 8,
    marginTop: 15,
    marginRight: 10,
    marginLeft: 10
  },
  botoes: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  box: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    width: 70,
    alignItems: "center",
  },
  ativo: {
    backgroundColor: "#1D1252",
  },
  inativo: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#1D1252",
  },
  icon: {
    marginBottom: 6,
  },
  texto: {
    textAlign: "center",
    fontSize: 12,
    includeFontPadding: false,
  },
  textoAtivo: {
    color: "white",
  },
  textoInativo: {
    color: "black",
  },
  label: {
    color: '#484550',
    fontSize: 12,
    fontWeight: 'bold'
  }
  
});