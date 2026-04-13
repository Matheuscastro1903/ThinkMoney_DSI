import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';



export default function LinkEnviado() {
    return (
        <View style={styles.container}>
            <View style={styles.icone}>
                <Ionicons name="paper-plane" size={60} color="black" />
            </View>
            <View style={styles.main}>
                <Text style={styles.text1}>
                    Link enviado!
                </Text>
                <Text style={styles.text2}>
                    Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </Text>
            </View>
            <LinearGradient
                colors={['transparent', '#3E346B', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.linhaSeparadora}>

            </LinearGradient>
            <TouchableOpacity style={styles.confirmar} onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.textconfirmar}>
                    VOLTAR AO LOGIN
                </Text>
            </TouchableOpacity>

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1D1252',
    },
    icone: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 250,
    },
    main: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    text1: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: 'bold',

    },
    text2: {
        color: '#A8A7D5',
        fontSize: 13,
        textAlign: 'center',
        paddingTop: 5,
        height: 52,
        width: 300,
        letterSpacing: 0.6,
    },
    confirmar: {
        width: '70%',
        height: 56,
        backgroundColor: '#000000ff',
        borderRadius: 28,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        justifyContent: 'center',
    },
    textconfirmar: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.6,
    },
    linhaSeparadora: {
        width: '80%',
        height: 1,
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 20,
        borderRadius: 25,
    },
});
