
import { Image, StyleSheet, Text, View,TouchableOpacity } from 'react-native';


import { Link } from "expo-router"



import InputLogin from '../../../components/inputlogin'



export default function Login(){

    function debugando(){
        console.log(1)
    }
     
    return(
        <View>
            <View style={styles.main}>

                <InputLogin label='Digite seu email' placeholder='nome@gmail.com' atualizando={debugando} icon={require('../../../assets/icons/iconeusuario.svg')}></InputLogin>
                <InputLogin label='Digite seu email' placeholder='nome@gmail.com' atualizando={debugando} icon={require('../../../assets/icons/iconeusuario.svg')}></InputLogin>
            
            </View>
             
            
        </View>
    )
}

const styles=StyleSheet.create({
    main:{
        backgroundColor:'white'
    }
})

