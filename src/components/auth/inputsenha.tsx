import { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

interface campoInputSenhaProps {
    label: string,
    placeholder: string,
    atualizando: (texto: string) => void,
    icon?: any,
    iconVisibilidade?: any,
    value:string
}

export default function InputSenha({ label, placeholder, atualizando, value}: campoInputSenhaProps) {

    const [protegido, setProtegido] = useState(true);

    return (
        <View style={styles.containerText}>

            <Text style={styles.label}>{label}</Text>

            <View style={styles.input}>

                <Ionicons name="lock-closed-outline" size={20} color="#888" />

                <TextInput
                    style={styles.textinput}
                    placeholder={placeholder}
                    placeholderTextColor="#ccc"
                    // MUDANÇA 3: Removido value={placeholder} do componente original (era um bug)
                    // O valor agora é controlado pelo pai via onChangeText, sem travar o campo
                    onChangeText={atualizando}
                  
                    
                    // MUDANÇA 6: secureTextEntry controla se a senha fica visível ou oculta
                    // "protegido = true" → esconde | "protegido = false" → mostra
                    secureTextEntry={protegido}
                    value={value}
                />

                
                   
                <TouchableOpacity onPress={() => setProtegido(!protegido)}>
                    <Ionicons
                        name={protegido ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#888"
                    />
                </TouchableOpacity>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    containerText: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        margin: 10,
        gap: 8,
    },

    input: {
        backgroundColor: '#EDEEEF',
        borderRadius: 10,
        width: '100%',
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        overflow: 'hidden'
    },

    textinput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        marginLeft: 10,
    },


    label: {
        color: '#484550',
        fontSize: 12,
        fontWeight: 'bold'
    },

});