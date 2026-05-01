import {View, TextInput, StyleSheet,Text} from 'react-native'
import { Ionicons } from '@expo/vector-icons';

interface campoInputProps{
    label:string,
    placeholder:string,
    atualizando: (texto: string) => void;
    icon?:any
    value: string;
}

export default function InputLogin({label, placeholder, atualizando, value}:campoInputProps){
    return(
        <View style={styles.containerText}>
                <Text style={styles.label}>{label}</Text>

                <View style={styles.input}>
                    <Ionicons name="mail-outline" size={20} color="#888" />

                    <TextInput style={styles.textinput}
                        placeholder={placeholder}
                        placeholderTextColor="#ccc"
                        value={value} //definimos o valor inicial como o valor email=""
                        //onChangeText será ativado quando começar a digitar
                        //setando o novo texto,iremos setar o novo value também
                        onChangeText={atualizando} 
                        keyboardType="email-address"
                        autoCapitalize="none" //Evita que a primeira letra seja maiúscula
                />
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    containerText: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap:8,
        margin: 10,
    },
    input:{
        backgroundColor:'#EDEEEF',
        borderRadius: 10,
        width: '100%',
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        overflow: 'hidden',
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
        fontWeight:'bold'
    },
});