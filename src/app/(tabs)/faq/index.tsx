import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, styles } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';


const FAQ = [
    {
        id: '1',
        pergunta: 'Como crio minha conta?',
        resposta: 'Na tela inicial, toque em "Crie sua conta", preencha seus dados e escolha seu avatar.',
    },
    {
        id: '2',
        pergunta: 'Esqueci minha senha. O que faço?',
        resposta: 'Na tela de login, toque em "Esqueci a senha" e informe seu e-mail para receber o link de redefinição.',
    },
    {
        id: '3',
        pergunta: 'Como registro um novo gasto?',
        resposta: 'Na tela Home, toque em "REGISTRAR NOVO GASTO", informe valor, categoria e descrição.',
    },
    {
        id: '4',
        pergunta: 'O que são as Metas Pessoais?',
        resposta: 'São objetivos financeiros que você define com valor e prazo. Você contribui ao longo do tempo e acompanha o progresso.',
    },
    {
        id: '5',
        pergunta: 'Para que servem os Lembretes?',
        resposta: 'Para você não esquecer contas a vencer. Cadastre nome, valor e data de vencimento.',
    },
    {
        id: '6',
        pergunta: 'Como funciona o grupo Família?',
        resposta: 'Na aba Família, crie um grupo e compartilhe o código FAM-XXXX com os membros que deseja incluir.',
    },
    {
        id: '7',
        pergunta: 'Minha senha fica salva no app?',
        resposta: 'Não. O ThinkMoney usa Firebase Authentication — sua senha nunca é armazenada em texto puro.',
    },
];


function CardFaq({pergunta, resposta}: 
    
    {pergunta: string, resposta: string}) {
        const[aberto, setAberto]=useState(false)
        
        return(

            <TouchableOpacity
                style= {[StyleSheet.card, aberto && styles.cardAberto]}
                onPress={() => setAberto(!aberto)}
                activeOpacity={0.8}
            >
                <view style= {styles.cardTopo}>
                    <text styles={styles.pergunta}>{pergunta}</text>
                    <Ionicons name={aberto ? 'chevron-up' : 'chevron-down'} size={24} color="#94A3B8" />
                </view>
                {aberto && <text style={styles.resposta}>{resposta}</text>}
            </TouchableOpacity>
        )
    }
        
        
export default function Faq() {
    return(
        <ScrollView
            style={styles.fundo}
            contentContainerStyle={styles.scroll}
            showsHorizontalScrollIndicator={false}
        >
            <text style={styles.titulo}>Perguntas Frequentes</text>


            <text style={styles.subtitulo}>Dúvidas? Encontre aqui as respostas para as perguntas mais comuns sobre o ThinkMoney.</text>
            

    )
}

