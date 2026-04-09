import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // ADICIONADO: ScrollView
import { SafeAreaView } from 'react-native-safe-area-context'; // ADICIONADO: SafeAreaView

import ButtonConfirmar from '@/src/components/auth/buttonaction';
import InputSenha from '@/src/components/auth/inputsenha';
import InputLogin from '../../../components/auth/inputlogin';

import { Link } from "expo-router";

import ButtonComeBack from '@/src/components/buttoncomeback';

export default function Login() {

    function debugando() {
        console.log(1)
    }

    const [manterConectado, setManterConectado] = useState(false);
    const [inputEmail,setInputEmail]=useState('')
    const [inputSenha,setInputSenha]=useState('')

    return (
        // ADICIONADO: SafeAreaView por fora — respeita notch, câmera e barras do sistema
        <SafeAreaView style={styles.safeArea}>

            {/* ScrollView por dentro — permite rolar caso necessário */}
            <ScrollView contentContainerStyle={styles.fundo}>
                <ButtonComeBack label='Voltar' url='/' color='#1D1252'></ButtonComeBack>
                <Image
                    source={require('../../../assets/images/logothinkmoney.png')}
                    style={styles.logo}
                />

                <View style={styles.main}>

                    <View>
                        <InputLogin label='Digite seu email' placeholder='nome@gmail.com' atualizando={(valor) => setInputEmail(valor)}  icon={require('../../../assets/icons/iconeusuario.svg')} value={inputEmail}/>

                        <InputSenha label='Digite sua senha' placeholder='Digite sua senha' atualizando={(valor) => setInputSenha(valor)} icon={require('../../../assets/icons/iconecadeado.svg')} iconVisibilidade={require('../../../assets/icons/iconeolho.svg')} value={inputSenha}/>

                        <View style={styles.esqueceusenha}>
                            <Link href={'/(tabs)/home'} asChild>
                                <TouchableOpacity>
                                    <Text style={styles.textesqueceu}>Esqueci a senha</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setManterConectado(!manterConectado)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.checkbox, manterConectado && styles.checkboxMarcado]}>
                            {manterConectado && <Text style={styles.checkmark}>✓</Text>}
                        </View>

                        <Text style={styles.checkboxLabel}>Me mantenha conectado</Text>
                    </TouchableOpacity>

                    <ButtonConfirmar label='Entrar' onClick={Login} />

                </View>

                <View style={styles.containerlinkcadastro}>
                    <Text style={{ color: '#867DC1' }}>Novo por aqui ?</Text>
                    <Link href={'/(auth)/cadastro'} asChild>
                        <TouchableOpacity>
                            <Text style={styles.textlinkcadastro}>Crie sua conta</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    // ADICIONADO: estilo exclusivo do SafeAreaView
    // backgroundColor aqui evita flash branco nas bordas do dispositivo
    safeArea: {
        flex: 1,
        backgroundColor: '#1D1252',
    },

    fundo: {
        flexGrow: 1,              // MUDANÇA: flexGrow:1 no lugar de height:'100%' — necessário para ScrollView expandir corretamente
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#1D1252',
        width: '100%',
        gap: 30,
        paddingBottom: 40,        // ADICIONADO: respiro no final ao scrollar
        paddingTop: 20,           // ADICIONADO: respiro no topo após a SafeArea
    },

    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain'
    },

    main: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        gap: 30,
        width: '90%',             // ADICIONADO: largura relativa para não bater nas laterais
    },

    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginHorizontal: 10,
        alignSelf: 'flex-start',
    },

    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },

    checkboxMarcado: {
        backgroundColor: '#0D7FF2',
    },

    checkmark: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
    },

    checkboxLabel: {
        fontSize: 13,
        color: '#484550',
        fontWeight: '500',
    },

    esqueceusenha: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },

    textesqueceu: {
        fontWeight: 'bold'
    },

    containerlinkcadastro: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 4
    },

    textlinkcadastro: {
        color: 'white',
        fontWeight: 'bold'
    },
});