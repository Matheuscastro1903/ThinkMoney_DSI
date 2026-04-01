

import { Image, StyleSheet, Text, View,TouchableOpacity } from 'react-native';


import { Link } from "expo-router"


//importando biblioteca de icons
import { Ionicons } from '@expo/vector-icons';

import InputLogin from '../components/inputlogin';

export default function telaInical(){

    function debugando(){
        console.log(1)
    }
     
    return(
        <View style={styles.main}>

            <Image 
                source={require('../assets/images/logothink.png')}
                style={styles.logo} 
            />

             <Link href={'/(auth)/login'} asChild>

                          <TouchableOpacity style={styles.button}>
                              <Ionicons name="arrow-forward" size={32} color="white" />
                          </TouchableOpacity>
            </Link>


            {/* botao para teste de config  */}
            <Link href={'/configurar'} asChild>
                            <TouchableOpacity style={styles.button}>
                                <Ionicons name="arrow-forward" size={32} color="white" />
                            </TouchableOpacity>

            </Link>

            <InputLogin label='Digite seu email' placeholder='nome@gmail.com' atualizando={debugando} icon={require('../assets/icons/iconeusuario.svg')}></InputLogin>

        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,                     // Ocupa a tela inteira
        justifyContent: 'center',    // Centraliza verticalmente
        alignItems: 'center',        // Centraliza horizontalmente
        backgroundColor: '#1D1252'
    },
    logo: {
        width: 412,                  // Largura da imagem
        height: 525,                 // Altura da imagem
        resizeMode: 'contain'        // Garante que a imagem não seja cortada
    },

    button:{
    width:64,
    height:64,
    backgroundColor:'black',
    borderRadius:32,

    alignItems:'center',
    justifyContent:'center',
    marginTop:100

  },
  textbutton:{
    color:'#ffffff',
    fontSize:30,
    fontWeight:'bold'
  }

});