import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MaskInput from "react-native-mask-input";
import { Ionicons } from "@expo/vector-icons";

interface InputDateProps {
  label: string;
  icon?: any;                         
  iconComponent?: React.ReactNode;    
  onChange?: (data: Date) => void;
  style?: object;
  valorInicial?: Date | null //só será usado na parte de atualizar meta
}

export default function InputDate({ label, icon, iconComponent, onChange,valorInicial, style }: InputDateProps) {
  //caso o valor inciial não exista,irá retornar null
  const [textoExibido, setTextoExibido] = useState(formatarData(valorInicial));
  //apenas formatando a data que está no firebase para mostrar na tela
  function formatarData(data?: Date | null) {
  if (!data) return "";
  
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  
  return `${dia}/${mes}/${ano}`;
}



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


  useEffect(() => {
    if (valorInicial) {
      setTextoExibido(formatarData(valorInicial));
    }
  }, [valorInicial]);

  return (
    <View style={[styles.containerText, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.input, style]}>

        
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




