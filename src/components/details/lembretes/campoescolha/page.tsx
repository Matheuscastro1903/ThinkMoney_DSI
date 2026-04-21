import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Biblioteca padrão do Expo para selects

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export default function SelectField({ label, options, value, onChange }: SelectFieldProps) {
  return (
    <View style={styles.containerText}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.input}>
        {/*Picker é uma tag nativa do ReacNative para esoclhas */}
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onChange(itemValue)}
          style={styles.picker}
          dropdownIconColor="#484550"
        >
          {/*opção fantasma de placeholder pois o Picker não tem placegholder nativo*/}
          <Picker.Item 
            label="Selecione uma opção" 
            value="" 
            enabled={false} 
            style={{ fontSize: 14, color: '#ccc' }} 
          />

          {/* Mapeamento das opções conforme seu componente original */}
          {options.map((opt) => (
            <Picker.Item 
              key={opt.value} 
              label={opt.label} 
              value={opt.value} 
              style={{ fontSize: 16 }}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerText: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: 10,
    gap: 8,
  },
  label: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#EDEEEF', // Mantendo o padrão do seu inputLogin
    borderRadius: 10,
    width: 300,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 5, // Ajuste para o Picker não colar na borda
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: '100%',
    color: '#484550',
  },
});