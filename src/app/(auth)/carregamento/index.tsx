import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Image} from 'react-native'; // ADICIONADO: ScrollView
export default function TelaCarregamento() {
    return (
        <View style={styles.main}>
            <Image
                                source={require('../../../assets/images/logothinkmoney.png')}
                                style={styles.logo}
                            />
            
                <ActivityIndicator 
                size="large"       // tamanho grande da rodinha
                color="#ffffff"    // cor roxa do seu projeto
            />
            

        </View>
    )        
}

const styles = StyleSheet.create({
    main:{
        flex:1,//necessário,caso contrário pegaria apeans o espaço necessário
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#000000',
        gap:80
    },
    fundo: {
        
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain'
    },
});