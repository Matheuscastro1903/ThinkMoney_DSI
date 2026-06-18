import { View, TextInput, Text, StyleSheet } from "react-native";
import { EnderecoProps } from "@/src/types/endereco";

interface InputEnderecoProps {
    inputEndereco: EnderecoProps;
    atualizando: (patch: Partial<EnderecoProps>) => void;
    erros?: { logradouro?: string; numero?: string; bairro?: string; cidade?: string }
    maxLengthCEP?:number,
    maxLenght?:number;
}

export default function InputEnderecoGasto({ inputEndereco, atualizando, erros,maxLenght,maxLengthCEP }: InputEnderecoProps){
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
                    maxLength={maxLenght}
                    
                />
                {erros?.logradouro ? <Text style={styles.erro}>{erros.logradouro}</Text> : null}
            </View>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Número</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#ccc"
                    placeholder={inputEndereco.numero ? inputEndereco.numero : "ex. 123"}
                    onChangeText={(value) => atualizando({numero: value})}
                    maxLength={10}
                />
            
                {erros?.numero ? <Text style={styles.erro}>{erros.numero}</Text> : null}
            </View>
        </View>

        <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1.5 }]}>
                <Text style={styles.label}>Bairro</Text>
                <TextInput
                    style={styles.input}
                    placeholder={inputEndereco.bairro ? inputEndereco.bairro : "ex. bairro novo"}
                    placeholderTextColor="#ccc"
                    onChangeText={(value) => atualizando({bairro: value})}
                    maxLength={maxLenght}
                />
                {erros?.bairro ? <Text style={styles.erro}>{erros.bairro}</Text> : null}
            </View>
            <View style={[styles.inputContainer, { flex: 1.5 }]}>
                <Text style={styles.label}>Cidade</Text>
                <TextInput
                    style={styles.input}
                    placeholder={inputEndereco.cidade ? inputEndereco.cidade : "ex. São Paulo"}
                    placeholderTextColor="#ccc"
                    onChangeText={(value) => atualizando({cidade: value})}
                    maxLength={maxLenght}
                />
                {erros?.cidade ? <Text style={styles.erro}>{erros.cidade}</Text> : null}
            </View>
        </View>

        <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>CEP</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#ccc"
                    placeholder="ex. 12345-678"
                    value={inputEndereco.cep}
                    keyboardType="numeric"
                    maxLength={9}
                    onChangeText={(value) => {
                        const d = value.replace(/\D/g, '').slice(0, 8);
                        atualizando({ cep: d.length > 5 ? `${d.slice(0,5)}-${d.slice(5)}` : d });
                    }}
                />
            </View>
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
    erro: {
    color: "red",
    fontSize: 11,
    marginTop: 2,
    fontWeight: "bold"
},
});