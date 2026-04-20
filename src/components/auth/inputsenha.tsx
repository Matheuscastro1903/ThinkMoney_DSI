import { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Image } from 'react-native'

interface campoInputSenhaProps {
    label: string,
    placeholder: string,
    atualizando: (texto: string) => void,
    icon: any,
    // MUDANÇA 1: Nova prop para receber o ícone do botão de mostrar/esconder senha
    iconVisibilidade: any,
    value:string
}

export default function InputSenha({ label, placeholder, atualizando, icon, iconVisibilidade,value}: campoInputSenhaProps) {

    // MUDANÇA 2: Estado local para controlar visibilidade da senha (era controlado pelo pai antes)
    const [protegido, setProtegido] = useState(true);

    return (
        <View style={styles.containerText}>

            <Text style={styles.label}>{label}</Text>

            <View style={styles.input}>

                <Image
                    source={icon}
                    style={styles.icon}
                />

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
                    <Image
                        source={iconVisibilidade}
                        style={styles.icon}
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
        width: 300,
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

    icon: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
    },

    label: {
        color: '#484550',
        fontSize: 12,
        fontWeight: 'bold'
    },

});