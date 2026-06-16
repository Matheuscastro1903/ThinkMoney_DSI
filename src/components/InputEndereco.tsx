import { View, TextInput, Text, StyleSheet, ActivityIndicator } from "react-native";

export interface ErrosEndereco {
    logradouro?: string | null;
    numero?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    cep?: string | null;
}

interface InputEnderecoProps {
  cep: string;
  setCep: (v: string) => void;
  logradouro: string;
  setLogradouro: (v: string) => void;
  numero: string;
  setNumero: (v: string) => void;
  bairro: string;
  setBairro: (v: string) => void;
  cidade: string;
  setCidade: (v: string) => void;
  buscando?: boolean;
  erroCep?: string | null;
}

export default function InputEndereco({ cep, setCep, logradouro, setLogradouro, numero, setNumero, bairro, setBairro, cidade, setCidade, buscando, erroCep  }: InputEnderecoProps) {
    const preenchidoPorCep = logradouro.length > 0
  
    return (
        <View style={styles.container}>

      {/* CEP — primeiro campo */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>CEP</Text>
        <View style={styles.cepRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholderTextColor="#ccc"
            placeholder="00000-000"
            value={cep}
            onChangeText={setCep}
            keyboardType="numeric"
            maxLength={8}
          />
          {buscando && <ActivityIndicator style={{ marginLeft: 10 }} color="#1D1252" />}
        </View>
        {erroCep && <Text style={styles.erro}>{erroCep}</Text>}
      </View>

      {/* Logradouro + Número */}
      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 2 }]}>
          <Text style={styles.label}>Logradouro</Text>
          <TextInput
            style={[styles.input, preenchidoPorCep && styles.inputAutoFill]}
            placeholderTextColor="#ccc"
            placeholder="ex. Rua das Flores"
            value={logradouro}
            onChangeText={setLogradouro}
            editable={!preenchidoPorCep}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Número</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#ccc"
            placeholder="ex. 123"
            value={numero}
            onChangeText={setNumero}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
      </View>

      {/* Bairro + Cidade */}
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bairro</Text>
          <TextInput
            style={[styles.input, preenchidoPorCep && styles.inputAutoFill]}
            placeholderTextColor="#ccc"
            placeholder="ex. Centro"
            value={bairro}
            onChangeText={setBairro}
            editable={!preenchidoPorCep}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={[styles.input, preenchidoPorCep && styles.inputAutoFill]}
            placeholderTextColor="#ccc"
            placeholder="ex. São Paulo"
            value={cidade}
            onChangeText={setCidade}
            editable={!preenchidoPorCep}
          />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20, width: "100%" },
  row: { flexDirection: "row", gap: 8 },
  cepRow: { flexDirection: "row", alignItems: "center" },
  inputContainer: { flex: 1, gap: 5 },
  label: { color: "#484550", fontSize: 12, fontWeight: "bold" },
  input: {
    backgroundColor: '#EDEEEF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputAutoFill: {
    backgroundColor: '#E0F0FF',
    color: '#1D1252',
  },
  erro: { color: '#EF4444', fontSize: 12, marginTop: 2 },
});
