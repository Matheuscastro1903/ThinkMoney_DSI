import { useState } from 'react';
import {View,TextInput,TouchableOpacity, StyleSheet,Text} from 'react-native'
import { Ionicons } from '@expo/vector-icons';


interface campoInputProps{
    label:string,
    placeholder:string,
    atualizando: (texto: string) => void;
    icon?:any
    value: string;

}

export default function InputLogin({label,placeholder,atualizando,value}:campoInputProps){




    return(
        <View style={styles.containerText}>

                <Text style={styles.label}>{label}</Text>

                <View style={styles.input}>

                    <Ionicons name="mail-outline" size={20} color="#888" />

                    <TextInput style={styles.textinput}
                        placeholder={placeholder}
                        placeholderTextColor="#ccc"
                        value={value}//definimos o valor inicial como o valor email=""
                //onChangeText será ativado quando começar a digitar
                //setando o novo texto,iremos setar o novo value também
                        onChangeText={atualizando} 
                        keyboardType="email-address" // Otimiza o teclado para e-mail
                        autoCapitalize="none"        //Evita que a primeira letra seja maiúscula
                
                
                />

                </View>
                

            </View>
    )
}


const styles = StyleSheet.create({



    containerText: {
        justifyContent: 'center',
        alignItems: 'flex-start', // aling items centraliza horizontalmente e o justify verticamelnbte
        margin:10,
        gap:8,
        
        
        
        
        
        
    },

    input:{
        backgroundColor:'#EDEEEF',
        borderRadius: 10,
        width: 300,
        height: 56,
        // CORREÇÕES AQUI:
        flexDirection: 'row',     // Coloca ícone e texto um ao lado do outro
        alignItems: 'center',      // Centraliza os dois verticalmente
        paddingHorizontal: 10,    // Dá um respiro nas pontas para não colar na borda
        overflow: 'hidden'        // Garante que nada saia das bordas arredondadas
        
       
       
        
        

    },

    textinput: {
    // backgroundColor: 'blue', // Remova o fundo azul para ver o fundo cinza do pai
    flex: 1,                   // FAZ O TEXTO OCUPAR TODO O ESPAÇO RESTANTE
    height: '100%',            //Garante que tenha a mesma altura do pai
    fontSize: 16,
    marginLeft: 10,            // Afasta o texto do ícone
},



  label: {
    color: '#484550',
    fontSize: 12,
    fontWeight:'bold'
    

  },
 


});