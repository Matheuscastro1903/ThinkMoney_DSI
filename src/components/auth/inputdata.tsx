import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MaskInput from "react-native-mask-input";
import { Ionicons } from "@expo/vector-icons";

interface InputDateProps {
  label: string;
  icon?: any;                         
  iconComponent?: React.ReactNode;    
  onChange?: (data: Date) => void;
}

export default function InputDate({ label, icon, iconComponent, onChange }: InputDateProps) {
  const [textoExibido, setTextoExibido] = useState("");

  function aoDigitar(masked: string, unmasked: string) {
    setTextoExibido(masked);

    if (masked.length === 10) {
      const [dia, mes, ano] = masked.split("/").map(Number);
      const dataConvertida = new Date(ano, mes - 1, dia);

      const isValid =
        !isNaN(dataConvertida.getTime()) &&
        dataConvertida.getDate() === dia &&
        dataConvertida.getMonth() === mes - 1;

      if (isValid) {
        onChange?.(dataConvertida);
      }
    }
  }

  return (
    <View style={styles.containerText}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.input}>

        {/* ✅ Prioriza iconComponent, depois icon antigo, depois ícone padrão */}
        {iconComponent
          ? iconComponent
          : <Ionicons name="calendar-outline" size={20} color="#888" />
        }

        <MaskInput
          style={styles.textinput}
          value={textoExibido}
          onChangeText={aoDigitar}
          mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#ccc"
          keyboardType="numeric"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerText: {
    justifyContent: "center",
    alignItems: "flex-start",
    margin: 10,
    gap: 8,
  },
  input: {
    backgroundColor: "#EDEEEF",
    borderRadius: 10,
    width: 300,
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
    color: "#000",
  },
  label: {
    color: "#484550",
    fontSize: 12,
    fontWeight: "bold",
  },
});