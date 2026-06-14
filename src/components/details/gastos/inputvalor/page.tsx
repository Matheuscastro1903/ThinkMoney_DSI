import { useState } from 'react';
import { View, TextInput, StyleSheet, Text} from 'react-native'
import { Ionicons } from '@expo/vector-icons';

interface campoInputRendaProps {
    label: string,
    placeholder: string,
    atualizando?: (texto: string) => void,
    icon?: any,
    iconVisibilidade?: any,
    value?: string,
    erro?: string | null,
    labelColor?: string,
    height?: number,
    width?: number | string
}


export default function InputValor({ label, placeholder, atualizando, value, erro, labelColor, height = 40, width = '100%' }: campoInputRendaProps) {

    //const [protegido, setProtegido] = useState(true);

    const [exibicao, setExibicao] = useState(() => {
        if (!value) return "";
        const numericValue = parseFloat(value.toString().replace(',', '.'));
        if (isNaN(numericValue)) return "";
        const digits = Math.round(numericValue * 100).toString();
        const apenasNumeros = digits.replace(/\D/g, '');
        const val = (parseInt(apenasNumeros) / 100).toFixed(2);
        return val.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    });
    function formatarMoeda(texto: string): string {
        // Remove tudo que não for número
        const apenasNumeros = texto.replace(/\D/g, '');
        
        if (!apenasNumeros) return '';

        // Converte para formato monetário (ex: 1234 → "12,34")
        const valor = (parseInt(apenasNumeros) / 100).toFixed(2);
        
        return valor.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        // Resultado: "1.234,56"
    }

    function handleChange(texto: string) {
        const digitos = texto.replace(/\D/g, '');
        const formatado = formatarMoeda(texto);
        setExibicao(formatado);
        if (typeof atualizando === 'function') {
            atualizando(formatado);
        }
    }

    const temErro = !!erro;

    return (
        <View style={[styles.containerText, { width: width as any }]}>

            <Text style={[styles.label, labelColor ? { color: labelColor } : {}]}>{label}</Text>

            <View style={[styles.input, { height }]}>

                <Ionicons name="cash-outline" size={20} color="#888" />

                <Text style={styles.prefixo}>R$</Text>

                <TextInput
                    style={styles.textinput}
                    placeholder={placeholder}
                    placeholderTextColor="#ccc"
                    // MUDANÇA 3: Removido value={placeholder} do componente original (era um bug)
                    // O valor agora é controlado pelo pai via onChangeText, sem travar o campo
                    onChangeText={handleChange}
                    keyboardType= "numeric"
                  
                    //maxLength={15}        // limita tamanho
                    returnKeyType="done"  //  botão "OK" no teclado
                    // MUDANÇA 6: secureTextEntry controla se a senha fica visível ou oculta
                    // "protegido = true" → esconde | "protegido = false" → mostra
                    
                    value={exibicao}
                />

                
                {temErro && (
                <Text style={styles.textoErro}>{erro}</Text>
                )}
            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    containerText: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginVertical: 10,
        width: '100%',
        gap: 8,
    },

    input: {
        backgroundColor: '#EDEEEF',
        borderRadius: 10,
        width: '100%',
        height: 40,
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
     prefixo: {
        fontSize: 16,
        color: '#888',
        marginLeft: 8,
        fontWeight: 'bold'
    },
    inputErro: {
        borderWidth: 1,
        borderColor: '#e74c3c',
    },

    textoErro: {
    color: '#e74c3c',
    fontSize: 11,
    marginTop: -4,
    fontWeight: "bold"
    }

});