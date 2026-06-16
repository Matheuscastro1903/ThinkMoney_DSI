import { View, TextInput, Text, StyleSheet } from "react-native";

export interface Endereco {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
}

export interface ErrosEndereco {
    logradouro?: string | null;
    numero?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    cep?: string | null;
}

interface InputEnderecoProps {
    inputEndereco: Endereco;
    atualizando: (patch: Partial<Endereco>) => void;
    erros?: ErrosEndereco;
}

function mascaraCep(valor: string): string {
    const digits = valor.replace(/\D/g, "").slice(0, 8);
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return digits;
}

export default function InputEndereco({ inputEndereco, atualizando, erros = {} }: InputEnderecoProps) {
  return (
    <View style={styles.container}>
        <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 2 }]}>
                <Text style={styles.label}>Logradouro</Text>
                <TextInput
                    style={[styles.input, erros.logradouro ? styles.inputErro : null]}
                    placeholderTextColor="#ccc"
                    placeholder="ex. rua das flores"
                    value={inputEndereco.logradouro}
                    onChangeText={(value) => atualizando({ logradouro: value })}
                    autoCapitalize="words"
                />
                {erros.logradouro ? <Text style={styles.textoErro}>{erros.logradouro}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Número</Text>
                <TextInput
                    style={[styles.input, erros.numero ? styles.inputErro : null]}
                    placeholderTextColor="#ccc"
                    placeholder="ex. 123"
                    value={inputEndereco.numero}
                    keyboardType="numeric"
                    onChangeText={(value) => atualizando({ numero: value })}
                />
                {erros.numero ? <Text style={styles.textoErro}>{erros.numero}</Text> : null}
            </View>
        </View>

        <View style={styles.row}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Bairro</Text>
                <TextInput
                    style={[styles.input, erros.bairro ? styles.inputErro : null]}
                    placeholder="ex. bairro novo"
                    placeholderTextColor="#ccc"
                    value={inputEndereco.bairro}
                    onChangeText={(value) => atualizando({ bairro: value })}
                    autoCapitalize="words"
                />
                {erros.bairro ? <Text style={styles.textoErro}>{erros.bairro}</Text> : null}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Cidade</Text>
                <TextInput
                    style={[styles.input, erros.cidade ? styles.inputErro : null]}
                    placeholder="ex. São Paulo"
                    placeholderTextColor="#ccc"
                    value={inputEndereco.cidade}
                    onChangeText={(value) => atualizando({ cidade: value })}
                    autoCapitalize="words"
                />
                {erros.cidade ? <Text style={styles.textoErro}>{erros.cidade}</Text> : null}
            </View>
        </View>

        <View style={styles.inputContainer}>
            <Text style={styles.label}>CEP</Text>
            <TextInput
                style={[styles.input, erros.cep ? styles.inputErro : null]}
                placeholderTextColor="#ccc"
                placeholder="ex. 12345-678"
                value={inputEndereco.cep}
                keyboardType="numeric"
                maxLength={9}
                onChangeText={(value) => atualizando({ cep: mascaraCep(value) })}
            />
            {erros.cep ? <Text style={styles.textoErro}>{erros.cep}</Text> : null}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        gap: 25,
        width: "100%",
    },

    row: {
        flexDirection: "row",
    },

    inputContainer: {
        flex: 1,
        gap: 5,
        paddingHorizontal: 10,
    },

    label: {
        color: "#484550",
        fontSize: 12,
        fontWeight: "bold",
    },

    input: {
        backgroundColor: "#EDEEEF",
        width: "100%",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
    },

    inputErro: {
        borderWidth: 1,
        borderColor: "#e53935",
    },

    textoErro: {
        color: "#e53935",
        fontSize: 11,
        marginTop: 2,
    },
});
