// arquivo que sera responsavel pela tela de recuperação de senha


import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import ButtonComeBack from '@/src/components/buttoncomeback';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { recuperarSenha } from '@/src/services/authService';
import { Alert } from 'react-native';
import { router } from 'expo-router';


export default function EsqueciSenha() {

    const [email, setEmail] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function handleRecuperarSenha() {


        if (email === '') {
            Alert.alert('Opa!', 'Você precisa digitar seu e-mail antes de enviar.');
        }

        else {
            setCarregando(true);
            try {
                await recuperarSenha(email);
                router.push('/(auth)/link-enviado');
            } catch (error: any) {
                if (error.code === 'auth/invalid-email') {
                    Alert.alert('Epa!', 'O formato do e-mail não é válido. Verifique se não esqueceu o @ ou .com');

                } else if (error.code === 'auth/user-not-found') {
                    Alert.alert('Não Cadastrado', 'Não encontramos nenhuma conta com este e-mail no sistema.');

                } else {
                    Alert.alert('Erro', 'Houve um problema ao tentar recuperar a senha. Tente depois.');
                }
            } finally {
                setCarregando(false);
            }
        }
    }


    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'
            >
                <TouchableOpacity style={styles.header}>
                    <ButtonComeBack label='Voltar' url='/app/' color='#1D1252'></ButtonComeBack>
                </TouchableOpacity>
                <View style={styles.icone}>
                    <Ionicons name="lock-closed" size={45} color="black" />
                </View>
                <View style={styles.main}>
                    <Text style={styles.text1}>Esqueceu sua senha?</Text>
                    <Text style={styles.text2}>Digite seu email cadastrado e enviaremos um link para redefinir sua senha.</Text>
                </View>
                <View style={styles.inputcontainer}>
                    <Ionicons name="mail" size={24} color="black" />
                    <TextInput style={styles.inputReal}
                        placeholder='Digite seu email'
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />
                </View>
                <TouchableOpacity style={styles.confirmar} onPress={handleRecuperarSenha}>
                    {carregando ? (
                        <ActivityIndicator size="large" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.textconfirmar}>
                            ENVIAR LINK
                        </Text>
                    )}

                </TouchableOpacity>
                <LinearGradient
                    colors={['transparent', '#3E346B', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.linhaSeparadora}>

                </LinearGradient>
                <View style={styles.containerbacklogin}>
                    <Text style={styles.textbacklogin}>
                        Lembrou a senha?
                    </Text>
                    <Link href="/(auth)/login">
                        <Text style={styles.textbacklogin2}>
                            Faça login
                        </Text>
                    </Link>

                </View>
            </ScrollView>
        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1D1252',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 74.2,
    },
    icone: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 100,
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
    inputcontainer: {
        width: '90%',
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingHorizontal: 15,
        alignItems: 'center',

        alignSelf: 'center',
        marginTop: 30,
        flexDirection: 'row',
    },
    inputReal: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#484550',
        fontWeight: '500',

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
        marginTop: 150,
        marginBottom: 20,
        borderRadius: 25,
    },
    containerbacklogin: {
        width: '80%',
        height: 30,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6,
    },
    textbacklogin: {
        color: '#A8A7D5',
        fontSize: 14,
        letterSpacing: 0.6,
    },
    textbacklogin2: {
        color: '#FFFFFF',
        fontSize: 14,
        letterSpacing: 0.6,
        fontWeight: 'bold',
    },

});
