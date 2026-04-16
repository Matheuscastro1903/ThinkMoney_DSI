import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default function CadastroSucesso() {
    return (
        <View style={styles.container}>
            <View style={styles.icone}>
                <Ionicons name="checkmark" size={80} color="black" />
            </View>
            <View style={styles.main}>
                <Text style={styles.text1}>
                    Cadastro realizado!
                </Text>
                <Text style={styles.text2}>
                    Agora você pode aproveitar todos os recursos que o ThinkMoney tem a oferecer.
                </Text>
            </View>
            <LinearGradient
                colors={['transparent', '#3E346B', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.linhaSeparadora}>

            </LinearGradient>
            <TouchableOpacity style={styles.prosseguir} onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.textprosseguir}>
                    Ir para login
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
    prosseguir: {
        width: '70%',
        height: 56,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        justifyContent: 'center',
    },
    textprosseguir: {
        color: '#1D1252',
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
