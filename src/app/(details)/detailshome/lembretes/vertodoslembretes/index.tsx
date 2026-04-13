import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import LayoutNavBar from "@/src/components/layoutnavbar";
import HeaderBack from "@/src/components/headerBack";
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import { useRouter } from "expo-router";


export default function VerTodosLembretes() {
    const [filtroSelecionado, setFiltroSelecionado] = useState('Todos');
    const router = useRouter();

    return (
        <LayoutNavBar>
            <HeaderBack />
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.main}>
                    <Text style={styles.text1}>
                        Todos os Lembretes
                    </Text>
                    <Text style={styles.text2}>
                        Gerencie suas obrigações financeiras
                        mensais.
                    </Text>
                </View>

                <View style={styles.buscaContainer}>
                    <Ionicons name="search-outline" size={20} color="#94A3B8" />
                    <TextInput
                        style={styles.inputDeBusca}
                        placeholder="Buscar lembrete..."
                        placeholderTextColor="#94A3B8"
                    />
                </View>

                {/* Filtros Centralizados e Compactos */}
                <View style={styles.filtrosContainer}>
                    <TouchableOpacity
                        style={filtroSelecionado === 'Todos' ? styles.filtroAtivo : styles.filtroInativo}
                        onPress={() => setFiltroSelecionado('Todos')}
                    >
                        <Text style={filtroSelecionado === 'Todos' ? styles.textoFiltroAtivo : styles.textoFiltroInativo}>Todos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={filtroSelecionado === 'Pendentes' ? styles.filtroAtivo : styles.filtroInativo}
                        onPress={() => setFiltroSelecionado('Pendentes')}
                    >
                        <Text style={filtroSelecionado === 'Pendentes' ? styles.textoFiltroAtivo : styles.textoFiltroInativo}>Pendentes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={filtroSelecionado === 'Pagos' ? styles.filtroAtivo : styles.filtroInativo}
                        onPress={() => setFiltroSelecionado('Pagos')}
                    >
                        <Text style={filtroSelecionado === 'Pagos' ? styles.textoFiltroAtivo : styles.textoFiltroInativo}>Pagos</Text>
                    </TouchableOpacity>
                </View>

                {/* Card 1 - Aluguel */}
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
                    <TouchableOpacity style={styles.editButton} onPress={() => router.push("/detailshome/lembretes/updatelembrete" as any)}>
                        <Ionicons name="pencil-outline" size={16} color="#94A3B8" />
                    </TouchableOpacity>
                </View>

                {/* Card 2 - Netflix */}
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
                    <TouchableOpacity style={styles.editButton} onPress={() => router.push("/detailshome/lembretes/updatelembrete" as any)}>
                        <Ionicons name="pencil-outline" size={16} color="#94A3B8" />
                    </TouchableOpacity>
                </View>

                {/* Card 3 - Seguro Carro */}
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
                    <TouchableOpacity style={styles.editButton} onPress={() => router.push("/detailshome/lembretes/updatelembrete" as any)}>
                        <Ionicons name="pencil-outline" size={16} color="#94A3B8" />
                    </TouchableOpacity>
                </View>

                {/* Card 4 - Energia Elétrica */}
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
                    <TouchableOpacity style={styles.editButton} onPress={() => router.push("/detailshome/lembretes/updatelembrete" as any)}>
                        <Ionicons name="pencil-outline" size={16} color="#94A3B8" />
                    </TouchableOpacity>
                </View>

                {/* Card 5 - Internet */}
                <View style={styles.containerLembretes}>
                    <View style={styles.lembreteIcone}>
                        <Ionicons name="wifi-outline" size={20} color="#1D1252" />
                    </View>
                    <View style={styles.lembreteInfo}>
                        <Text style={styles.lembreteTitulo}>Internet</Text>
                        <Text style={styles.lembreteSubtitulo}>CONTAS FIXAS • VENCE EM 25 MAI</Text>
                    </View>
                    <View style={styles.lembreteDireita}>
                        <Text style={styles.lembreteMoeda}>R$ <Text style={styles.lembreteValor}>149,90</Text></Text>
                        <View style={styles.badgePago}>
                            <Text style={styles.badgeTextPago}>PAGO</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.editButton} onPress={() => router.push("/detailshome/lembretes/updatelembrete" as any)}>
                        <Ionicons name="pencil-outline" size={16} color="#94A3B8" />
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
        paddingLeft: 5,
        height: 52,
        width: 290,
        letterSpacing: 0.6,
    },
    text3: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    buscaContainer: {
        width: '90%',
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingHorizontal: 20,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        flexDirection: 'row',
    },
    inputDeBusca: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#000000',
        marginLeft: 10,
    },
    filtrosContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginTop: 24,
        marginBottom: 12,
    },
    filtroAtivo: {
        backgroundColor: '#000000',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    textoFiltroAtivo: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 13,
    },
    filtroInativo: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    textoFiltroInativo: {
        color: '#6B7280',
        fontWeight: 'bold',
        fontSize: 13,
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
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lembreteInfo: {
        flex: 1,
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
        alignItems: 'flex-end',
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
        backgroundColor: '#FEE2E2',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginTop: 5,
    },
    badgeTextPendente: {
        color: '#B91C1C',
        fontSize: 9,
        fontWeight: 'bold',
    },
    badgePago: {
        backgroundColor: '#E2E8F0',
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
    editButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
})