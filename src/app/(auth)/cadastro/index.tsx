import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ADICIONADO: SafeAreaView

import InputLogin from '../../../components/auth/inputlogin';
import InputSenha from '@/src/components/auth/inputsenha';
import ButtonConfirmar from '@/src/components/auth/buttonaction';
import EscolhaAvatar from '@/src/components/auth/escolhaavantar';
import InputDate from '@/src/components/auth/inputdata';

import { Link } from "expo-router";

export default function Cadastro() {

    

    const [avatarEscolhido, setAvatarEscolhido] = useState('../../assets/images/avatarcapivara.png');

    const [inputNome,setInputNome]=useState('')
    const [inputUserName,setUserName]=useState('')
    const [inputEmail,setInputEmail]=useState('')
    const [inputSenha,setInputSenha]=useState('')
    const [inputSenhaConfirmada,setInputSenhaConfirmada]=useState('')
    const [inputData, setInputData] = useState<Date | null>(null);

    const [termosAceitos, setTermosAceitos] = useState(false);
    

    function debugando() {
        console.log(inputNome,inputEmail,inputUserName,inputSenha,inputSenhaConfirmada,inputData,avatarEscolhido)
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

                    <View >
                        <Text style={styles.mainFrase}>Crie sua conta</Text>
                        <Text style={styles.subFrase}>Inicie sua jornada com o ThinkMoney</Text>
                    </View>

                    <EscolhaAvatar onChange={(avatar) => setAvatarEscolhido(avatar)} />

                    <View style={styles.containercadastro}>
                        <InputLogin
                            label='Digite seu Nome completo:'
                            placeholder='Ex: Matheus de Castro'
                            atualizando={(valor) => setInputNome(valor)}
                            icon={require('../../../assets/icons/iconeusuario.svg')}
                            value={inputNome}
                        />

                        <InputLogin
                            label='Digite seu Username:'
                            placeholder='Ex: Castro_07'
                            atualizando={(valor) => setUserName(valor)}
                            icon={require('../../../assets/icons/iconeusuario.svg')}
                            value={inputUserName}
                        />

                        <InputLogin
                            label='Digite seu Email:'
                            placeholder='Ex: matheuzinho1903@gmail.com'
                            atualizando={(valor) => setInputEmail(valor)}
                            icon={require('../../../assets/icons/iconeusuario.svg')}
                            value={inputEmail}
                        />

                        <InputSenha
                            label='Digite sua Senha'
                            placeholder='Ex:123456'
                            atualizando={(valor) => setInputSenha(valor)}
                            icon={require('../../../assets/icons/iconecadeado.svg')}
                            iconVisibilidade={require('../../../assets/icons/iconeolho.svg')}
                            value={inputSenha}
                        />

                        <InputSenha
                            label='Confirme sua Senha:'
                            placeholder='Ex:123456'
                            atualizando={(valor) => setInputSenhaConfirmada(valor)}
                            icon={require('../../../assets/icons/iconeescudo.svg')}
                            iconVisibilidade={require('../../../assets/icons/iconeolho.svg')}
                            value={inputSenhaConfirmada}
                        />
                        <InputDate label='Data de nascimento:' 
                        icon={require('../../../assets/icons/iconedata.svg')}
                        onChange={(dataPronta) => setInputData(dataPronta)}
                        ></InputDate>

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
        justifyContent: 'center',
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
        alignItems:'center',
        justifyContent:'center'
    },

    mainFrase:{
        color:'#1D1252',
        fontSize:24,
        fontWeight:'bold'
    },

    subFrase:{
        color:'#575F67',
        fontSize:16
    },

    
    containercadastro:{
        alignContent:'center',
        justifyContent:'center'
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

