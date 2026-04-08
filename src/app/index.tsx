import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


import { Link } from "expo-router";


//importando biblioteca de icons
import { Ionicons } from '@expo/vector-icons';


export default function telaInical(){

    function debugando(){
        console.log(1)
    }
     
    return(
        <View style={styles.main}>

            <Image 
                source={require('../assets/images/logothinkmoney.png')}
                style={styles.logo} 
            />

            <Text style={styles.fraseImpacto}>Comece hoje. Seu futuro agradece.</Text>
            
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

            

        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,                     // Ocupa a tela inteira
        justifyContent: 'center',    // Centraliza verticalmente
        alignItems: 'center',        // Centraliza horizontalmente
        backgroundColor: '#1D1252',
        gap:8
    },
    logo: {
        width: 256,                  // Largura da imagem
        height: 276,                 // Altura da imagem
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
  },

  fraseImpacto: {
        
                  
        left: 0,
        right: 0,               // left:0 + right:0 garante largura total para centralizar o texto
        textAlign: 'center',    // centraliza o texto horizontalmente
         
        
        fontSize: 22,
        
        color: '#ffffff',
        paddingHorizontal: 30,  // evita que o texto cole nas bordas em telas menores
        lineHeight: 32,         // respiro entre linhas caso quebre
    },

});