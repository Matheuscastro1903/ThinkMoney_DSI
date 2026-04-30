import { StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function InputTelefone() {
    const telefone = null; // Substitua pelo telefone do usuário salvo no banco de dados

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Telefone</Text>
        <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#484550" style={{ marginRight: 8 }} />
            <TextInput
                style={styles.input}
                placeholder={telefone ? telefone : "Digite seu telefone"}
                keyboardType="phone-pad"
            />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 15,
    },
    label: { 
        color: "#484550",
        marginBottom: 5,
        fontSize: 16,
        fontWeight: "bold",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EDEEEF",
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    input: {
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
    },
});