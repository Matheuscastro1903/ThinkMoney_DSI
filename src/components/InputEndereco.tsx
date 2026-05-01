import { View, TextInput, Text, StyleSheet } from "react-native";

export default function InputEndereco() {
    const logradouro = null;
    const numero = null;
    const bairro = null;
    const cidade = null;
    const cep = null;

  return (
    <View style={styles.container}>
        <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 2 }]}> 
                <Text style={styles.label}>Logradouro</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#ccc"
                    placeholder={logradouro ? logradouro : "ex. rua das flores"}
                />
            </View>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Número</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#ccc"
                    placeholder={numero ? numero : "ex. 123"}
                />
            </View>
        </View>

        <View style={styles.row}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Bairro</Text>
                <TextInput
                    style={styles.input}
                    placeholder={bairro ? bairro : "ex. bairro novo"}
                    placeholderTextColor="#ccc"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Cidade</Text>
                <TextInput
                    style={styles.input}
                    placeholder={cidade ? cidade : "ex. São Paulo"}
                    placeholderTextColor="#ccc"
                />
            </View>
        </View>

        <View style={styles.inputContainer}>
            <Text style={styles.label}>CEP</Text>
            <TextInput
                style={styles.input}
                placeholderTextColor="#ccc"
                placeholder={cep ? cep : "ex. 12345-678"}
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