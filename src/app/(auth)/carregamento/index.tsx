import { View, ActivityIndicator, StyleSheet } from 'react-native';
import ThinkMoneyLogo from '../../../assets/images/thinkmoney_logo_4k.svg';
export default function TelaCarregamento() {
    return (
        <View style={styles.main}>
            <ThinkMoneyLogo width={150} height={150} />
            
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