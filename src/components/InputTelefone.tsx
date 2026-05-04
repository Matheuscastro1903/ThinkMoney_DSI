import { StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputTelefoneProps {
    atualizando: (telefone: string) => void;
}

export default function InputTelefone({ atualizando }: InputTelefoneProps) {
    const telefone = null; // Substitua pelo telefone do usuário salvo no banco de dados

    return (
        <View style={styles.container}>
        <Text style={styles.label}>Telefone</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#888" style={{ marginRight: 8 }} />
                <TextInput
                    style={styles.input}
                    placeholder={telefone ? telefone : "ex: (11) 91234-5678"}
                    keyboardType="phone-pad"
                    placeholderTextColor="#ccc"
                    onChangeText={atualizando}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    label: { 
        color: "#484550",
        marginBottom: 5,
        fontSize: 12,
        fontWeight: "bold",
    },
    inputContainer: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EDEEEF",
        borderRadius: 8,
        paddingHorizontal: 15,
    },
    input: {
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
    },
});