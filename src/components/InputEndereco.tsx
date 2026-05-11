import { View, TextInput, Text, StyleSheet } from "react-native";

export interface Endereco {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
}

interface InputEnderecoProps {
    inputEndereco: Endereco;
    atualizando: (patch: Partial<Endereco>) => void;
}

export default function InputEndereco({ inputEndereco, atualizando }: InputEnderecoProps) {
  return (
    <View style={styles.container}>
        <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 2 }]}> 
                <Text style={styles.label}>Logradouro</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#ccc"
                    placeholder={inputEndereco.logradouro ? inputEndereco.logradouro : "ex. rua das flores"}
                    onChangeText={(value) => atualizando({logradouro: value})}
                />
            </View>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Número</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#ccc"
                    placeholder={inputEndereco.numero ? inputEndereco.numero : "ex. 123"}
                    onChangeText={(value) => atualizando({numero: value})}
                />
            </View>
        </View>

        <View style={styles.row}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Bairro</Text>
                <TextInput
                    style={styles.input}
                    placeholder={inputEndereco.bairro ? inputEndereco.bairro : "ex. bairro novo"}
                    placeholderTextColor="#ccc"
                    onChangeText={(value) => atualizando({bairro: value})}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Cidade</Text>
                <TextInput
                    style={styles.input}
                    placeholder={inputEndereco.cidade ? inputEndereco.cidade : "ex. São Paulo"}
                    placeholderTextColor="#ccc"
                    onChangeText={(value) => atualizando({cidade: value})}
                />
            </View>
        </View>

        <View style={styles.inputContainer}>
            <Text style={styles.label}>CEP</Text>
            <TextInput
                style={styles.input}
                placeholderTextColor="#ccc"
                placeholder={inputEndereco.cep ? inputEndereco.cep : "ex. 12345-678"}
                onChangeText={(value) => atualizando({cep: value})}
            />
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
        borderRadius: 10,
        height: 56,
        paddingHorizontal: 10,
    },

    label: { 
        color: "#484550",
        fontSize: 12,
        fontWeight: "bold",
    },

    input: {
        backgroundColor:'#EDEEEF',
        width: "100%",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
    },
});