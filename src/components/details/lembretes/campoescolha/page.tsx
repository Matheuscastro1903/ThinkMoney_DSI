import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

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
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <View style={styles.containerText}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.input} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Text style={[styles.inputText, !selected && styles.placeholder]}>
          {selected ? selected.label : 'Selecione uma opção'}
        </Text>
        <Text style={styles.arrow}>▾</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, item.value === value && styles.optionSelected]}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.optionText, item.value === value && styles.optionTextSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    backgroundColor: '#EDEEEF',
    borderRadius: 10,
    width: 300,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 14,
    color: '#484550',
  },
  placeholder: {
    color: '#aaa',
  },
  arrow: {
    fontSize: 16,
    color: '#484550',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 300,
    maxHeight: 260,
    overflow: 'hidden',
    elevation: 5,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionSelected: {
    backgroundColor: '#ede8ff',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  optionTextSelected: {
    color: '#1D1252',
    fontWeight: 'bold',
  },
});
