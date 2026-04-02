import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ADICIONADO: SafeAreaView

import InputLogin from '../../../components/auth/inputlogin';
import InputSenha from '@/src/components/auth/inputsenha';
import ButtonConfirmar from '@/src/components/auth/buttonaction';

import { Link } from "expo-router";

export default function Cadastro() {

    const [termosAceitos, setTermosAceitos] = useState(false);

    function debugando() {
        console.log(1)
    }

    return (
        // ADICIONADO: SafeAreaView por fora — respeita notch, câmera e barras do sistema
        <SafeAreaView style={styles.safeArea}>

            {/* ScrollView por dentro — permite rolar quando o conteúdo ultrapassar a tela */}
            <ScrollView contentContainerStyle={styles.fundo}>

                <Image
                    source={require('../../../assets/images/logothinkmoney.png')}
                    style={styles.logo}
                />

                <View style={styles.main}>

                    <View>
                        <InputLogin
                            label='Nome completo'
                            placeholder='Seu nome'
                            atualizando={debugando}
                            icon={require('../../../assets/icons/iconeusuario.svg')}
                        />

                        <InputLogin
                            label='Email'
                            placeholder='email@gmail.com'
                            atualizando={debugando}
                            icon={require('../../../assets/icons/iconeusuario.svg')}
                        />

                        <InputSenha
                            label='Senha'
                            placeholder='Digite sua senha'
                            atualizando={debugando}
                            icon={require('../../../assets/icons/iconecadeado.svg')}
                            iconVisibilidade={require('../../../assets/icons/iconeolho.svg')}
                        />

                        <InputSenha
                            label='Confirmar senha'
                            placeholder='Confirme sua senha'
                            atualizando={debugando}
                            icon={require('../../../assets/icons/iconecadeado.svg')}
                            iconVisibilidade={require('../../../assets/icons/iconeolho.svg')}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setTermosAceitos(!termosAceitos)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.checkbox, termosAceitos && styles.checkboxMarcado]}>
                            {termosAceitos && <Text style={styles.checkmark}>✓</Text>}
                        </View>

                        <Text style={styles.checkboxLabel}>
                            Eu concordo com os Termos de Serviço e a Política de Privacidade da ThinkMoney.
                        </Text>
                    </TouchableOpacity>

                    <ButtonConfirmar label='Cadastrar' onClick={debugando} />

                </View>

                <View style={styles.containerlinklogin}>
                    <Text style={{ color: '#867DC1' }}>Já tem uma conta?</Text>
                    <Link href={'/(auth)/login'} asChild>
                        <TouchableOpacity>
                            <Text style={styles.textlinklogin}>Faça login</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    // ADICIONADO: estilo exclusivo do SafeAreaView
    // flex:1 para ocupar toda a tela — backgroundColor aqui evita flash branco no SafeArea
    safeArea: {
        flex: 1,
        backgroundColor: '#1D1252',
    },

    fundo: {
        flexGrow: 1,              // flexGrow:1 necessário para ScrollView expandir corretamente
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#1D1252',
        width: '100%',
        gap: 30,
        paddingBottom: 40,        // respiro no final ao scrollar
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
        width: '90%',
    },

    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginHorizontal: 10,
    },

    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        flexShrink: 0,
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
        flex: 1,
    },

    containerlinklogin: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 4,
    },

    textlinklogin: {
        color: 'white',
        fontWeight: 'bold',
    },

});