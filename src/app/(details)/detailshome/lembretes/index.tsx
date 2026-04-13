import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import LayoutNavBar from "@/src/components/layoutnavbar";
import HeaderBack from "@/src/components/headerBack";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";


export default function Lembretes() {
    const router = useRouter();
    return (
        <LayoutNavBar>
            <HeaderBack />
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.main}>
                    <Text style={styles.text1}>Meus Lembretes</Text>
                    <Text style={styles.text2}>Gerencie seus compromissos financeiros recorrentes.</Text>
                    <Text style={styles.text3}>Compromissos próximos</Text>
                </View>
                <View style={styles.containerLembretes}>
                    <View style={styles.lembreteIcone}>
                        <Ionicons name="home-outline" size={20} color="#1D1252" />
                    </View>
                    <View style={styles.lembreteInfo}>
                        <Text style={styles.lembreteTitulo}>Aluguel</Text>
                        <Text style={styles.lembreteSubtitulo}>MORADIA • VENCE EM 05 MAI</Text>
                    </View>
                    <View style={styles.lembreteDireita}>
                        <Text style={styles.lembreteMoeda}>R$ <Text style={styles.lembreteValor}>2.800,00</Text></Text>
                        <View style={styles.badgePendente}>
                            <Text style={styles.badgeTextPendente}>PENDENTE</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.containerLembretes}>
                    <View style={styles.lembreteIcone}>
                        <Ionicons name="film-outline" size={20} color="#1D1252" />
                    </View>
                    <View style={styles.lembreteInfo}>
                        <Text style={styles.lembreteTitulo}>Netflix</Text>
                        <Text style={styles.lembreteSubtitulo}>ENTRETENIMENTO • VENCE EM 12 MAI</Text>
                    </View>
                    <View style={styles.lembreteDireita}>
                        <Text style={styles.lembreteMoeda}>R$ <Text style={styles.lembreteValor}>55,90</Text></Text>
                        <View style={styles.badgePago}>
                            <Text style={styles.badgeTextPago}>PAGO</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.containerLembretes}>
                    <View style={styles.lembreteIcone}>
                        <Ionicons name="car-outline" size={20} color="#1D1252" />
                    </View>
                    <View style={styles.lembreteInfo}>
                        <Text style={styles.lembreteTitulo}>Seguro Carro</Text>
                        <Text style={styles.lembreteSubtitulo}>TRANSPORTE • VENCE EM 18 MAI</Text>
                    </View>
                    <View style={styles.lembreteDireita}>
                        <Text style={styles.lembreteMoeda}>R$ <Text style={styles.lembreteValor}>420,00</Text></Text>
                        <View style={styles.badgePendente}>
                            <Text style={styles.badgeTextPendente}>PENDENTE</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.containerLembretes}>
                    <View style={styles.lembreteIcone}>
                        <Ionicons name="flash-outline" size={20} color="#1D1252" />
                    </View>
                    <View style={styles.lembreteInfo}>
                        <Text style={styles.lembreteTitulo}>Energia Elétrica</Text>
                        <Text style={styles.lembreteSubtitulo}>CONTAS FIXAS • VENCE EM 22 MAI</Text>
                    </View>
                    <View style={styles.lembreteDireita}>
                        <Text style={styles.lembreteMoeda}>R$ <Text style={styles.lembreteValor}>215,40</Text></Text>
                        <View style={styles.badgePendente}>
                            <Text style={styles.badgeTextPendente}>PENDENTE</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.verTodosContainer}>
                    <TouchableOpacity style={styles.verTodosButton} onPress={() => router.push("/detailshome/lembretes/vertodoslembretes" as any)}>
                        <Text style={styles.verTodosText}>VER TODOS</Text>
                        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <LinearGradient
                    colors={['transparent', '#3E346B', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.linhaSeparadora}>

                </LinearGradient>
                <View style={styles.containerExtra}>
                    <View style={styles.addIconCircle}>
                        <Ionicons name="add" size={40} color="#000000" />
                    </View>

                    <Text style={styles.text4}>Nova despesa?</Text>
                    <Text style={styles.text5}>Automatize o acompanhamento de
                        suas contas recorrentes.</Text>
                    <TouchableOpacity style={styles.buttonAdd}>
                        <Text style={styles.buttonText}>ADICIONAR LEMBRETE</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LayoutNavBar>
    )
}


const styles = StyleSheet.create({
    main: {
        flexDirection: 'column',
        paddingLeft: 20,
        marginTop: 15,
    },
    text1: {
        color: '#FFFFFF',
        fontSize: 35,
        fontWeight: 'bold',
    },
    text2: {
        color: '#A8A7D5',
        fontSize: 14,
        textAlign: 'left',
        paddingTop: 5,
        height: 52,
        width: 290,
        letterSpacing: 0.6,
    },
    text3: {
        fontSize: 14,
        color: '#94A3B8',
        fontFamily: 'Inter',
        letterSpacing: 2.4,
        paddingTop: 40,
        paddingLeft: 1,

    },
    containerLembretes: {
        height: 72,
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingHorizontal: 16,
        gap: 12,
    },
    lembreteIcone: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F1F5F9', // Cinza clarinho
        justifyContent: 'center',
        alignItems: 'center',
    },
    lembreteInfo: {
        flex: 1, // Usa todo o espaço livre
        marginLeft: 12,
    },
    lembreteTitulo: {
        fontSize: 16,
        color: '#1D1252',
        fontWeight: 'bold',
    },
    lembreteSubtitulo: {
        fontSize: 10,
        color: '#94A3B8',
        marginTop: 4,
    },
    lembreteDireita: {
        alignItems: 'flex-end', // Alinha textos pra direita
    },
    lembreteMoeda: {
        fontSize: 12,
        color: '#1D1252',
        fontWeight: 'bold',
    },
    lembreteValor: {
        fontSize: 18,
    },
    badgePendente: {
        backgroundColor: '#FEE2E2', // Vermelho bem claro
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginTop: 5,
    },
    badgeTextPendente: {
        color: '#B91C1C', // Vermelho escuro
        fontSize: 9,
        fontWeight: 'bold',
    },
    badgePago: {
        backgroundColor: '#E2E8F0', // Cinza clarinho
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginTop: 5,
    },
    badgeTextPago: {
        color: '#475569',
        fontSize: 9,
        fontWeight: 'bold',
    },
    verTodosContainer: {
        marginTop: 28,
        marginBottom: 0,
        alignItems: 'center',
    },
    verTodosButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#3E346B',
        borderRadius: 24,
    },
    verTodosText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1.2,
        marginRight: 8,
    },
    containerExtra: {
        backgroundColor: '#1E1B3E',
        borderRadius: 20,
        width: '80%',
        height: 280,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
        padding: 24,

    },
    linhaSeparadora: {
        width: '80%',
        height: 1,
        alignSelf: 'center',
        marginTop: 40,
        marginBottom: 40,
        borderRadius: 25,
    },
    text4: {
        fontSize: 22,
        color: '#FFFFFF',
        fontFamily: 'Inter',
        paddingTop: 5,
        paddingLeft: 1,
        fontWeight: 'bold',

    },
    text5: {
        fontSize: 14,
        color: '#94A3B8',
        fontFamily: 'Inter',
        letterSpacing: 2.4,
        paddingTop: 10,
        textAlign: 'center',

    },
    buttonAdd: {
        width: '90%',
        height: 56,
        backgroundColor: '#E2E8F0',
        borderRadius: 28,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },

})













