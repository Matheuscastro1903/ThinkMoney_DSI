import { useState, useEffect } from "react"
import { Feather, Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';


// Informacoes firebase
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/src/services/firebaseConfig';

export default function Home() {
    const router = useRouter();
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);

    const [usuario, setUsuario] = useState<any>(null);

    useEffect(() => {
        async function carregarDados() {
        const uid = auth.currentUser?.uid; // ✅ pega o usuário logado

        if (!uid) return;

        const docRef = doc(db, 'usuarios', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setUsuario(docSnap.data());
        }
        }

        carregarDados();
    }, []);

    return (
        <View style={styles.container}>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.saldo}>
                    <View style={styles.saldoHeader}>
                        <View style={styles.saldoHeaderLeft}>
                            <Ionicons name="wallet-outline" size={20} color="#34D399" />
                            <Text style={styles.text1}>SALDO DISPONÍVEL</Text>
                        </View>
                        <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
                            <Ionicons name={isBalanceVisible ? "eye-outline" : "eye-off-outline"} size={20} color="#94A3B8" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.text2}>{isBalanceVisible ? `R$ ${usuario?.renda}` : "R$ •••••"}</Text>
                    <View style={styles.saldoFooter}>
                        <Feather name="arrow-up-right" size={16} color="#34D399" />
                        <Text style={styles.saldoTrend}>R$ 1.250,00 entraram hoje</Text>
                    </View>
                </View>
                <View style={styles.linhaDegraficos}>
                    <View style={styles.stackedCard}>
                        <View style={styles.stackedHeaderRow}>
                            <Text style={styles.stackedTitle}>RESERVA DE EMERGÊNCIA</Text>
                            <Ionicons name="information-circle-outline" size={20} color="#94A3B8" />
                        </View>
                        <View style={styles.stackedValueRow}>
                            <Text style={styles.stackedValue}>30.0%</Text>
                        </View>

                        <View style={styles.barChartContainer}>
                            <View style={[styles.bar, { height: '30%', backgroundColor: 'rgba(139, 92, 246, 0.3)' }]} />
                            <View style={[styles.bar, { height: '50%', backgroundColor: 'rgba(139, 92, 246, 0.5)' }]} />
                            <View style={[styles.bar, { height: '25%', backgroundColor: 'rgba(139, 92, 246, 0.7)' }]} />
                            <View style={[styles.bar, { height: '80%', backgroundColor: 'rgba(139, 92, 246, 0.85)' }]} />
                            <View style={[styles.bar, { height: '100%', backgroundColor: 'rgba(139, 92, 246, 1.0)' }]} />
                        </View>

                        <Text style={styles.stackedFooterText}>Sua reserva cresceu <Text style={{ color: '#8B5CF6' }}>12%</Text> comparado ao mês anterior.</Text>
                    </View>

                    <View style={styles.stackedCard}>
                        <View style={styles.stackedHeaderRow}>
                            <Text style={styles.stackedTitle}>LIMITE CONSUMIDO</Text>
                            <Ionicons name="information-circle-outline" size={20} color="#94A3B8" />
                        </View>
                        <View style={styles.stackedValueRow}>
                            <Text style={styles.stackedValue}>72.0%</Text>
                            <Text style={styles.stackedTrend}>↗ +5.0%</Text>
                        </View>

                        <View style={styles.stackedChartContainer}>
                            <CircularProgress
                                value={72}
                                showProgressValue={false}
                                activeStrokeWidth={12}
                                inActiveStrokeWidth={12}
                                radius={55}
                                activeStrokeColor={'#34D399'}
                                inActiveStrokeColor={'#1A1340'}
                                inActiveStrokeOpacity={1}
                            />
                            <View style={styles.chartCenterTextContainer}>
                                <Ionicons name="card-outline" size={32} color="#34D399" />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.gastosDoMes}>
                    <Feather name="trending-up" size={32} color="#4ADE80" />
                    <View>
                        <Text style={styles.text3}>
                            Seu gasto este mês foi de:
                        </Text>
                        <Text style={styles.text4}>
                            R$ 1.234,56
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.registrarNovoGasto} onPress={() => console.log('clicou para registrar um novo gasto!')}>
                    <Ionicons name="wallet-outline" size={22} color="#1D1252" />
                    <Text style={styles.text5}>
                        Registrar novo gasto
                    </Text>
                </TouchableOpacity>
                <View style={styles.linhaBotao}>
                    <Link href="/metas" asChild>
                        <TouchableOpacity style={styles.metasPessoais}>
                            <Ionicons name="rocket-outline" size={18} color="#1D1252" />
                            <Text style={styles.text6}>Metas</Text>
                        </TouchableOpacity>
                    </Link>
                    <TouchableOpacity style={styles.lembretes} onPress={() => router.push('/(details)/detailshome/lembretes')}>
                        <Ionicons name="notifications-outline" size={18} color="#1D1252" />
                        <Text style={styles.text6}>Lembretes</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.ultimosGastos}>ÚLTIMOS GASTOS</Text>
                </View>
                <View style={styles.gastosHistorico}>
                    <View style={styles.iconeGastos}>
                        <Ionicons name="cart-outline" size={20} color="#1D1252" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.textHistorico}>Assaí Atacadista</Text>
                        <Text style={styles.textCategoria}>Alimentação</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.textValor}>R$ 452,10</Text>
                        <Text style={styles.textCategoria}>19:00</Text>
                    </View>
                </View>
                <View style={styles.gastosHistorico}>
                    <View style={styles.iconeGastos}>
                        <Ionicons name="car-outline" size={20} color="#1D1252" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.textHistorico}>Posto Shell Graal</Text>
                        <Text style={styles.textCategoria}>Combustível</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.textValor}>R$ 200,00</Text>
                        <Text style={styles.textCategoria}>14:32</Text>
                    </View>
                </View>
                <View style={styles.gastosHistorico}>
                    <View style={styles.iconeGastos}>
                        <Ionicons name="restaurant-outline" size={20} color="#1D1252" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.textHistorico}>Coco Bambu</Text>
                        <Text style={styles.textCategoria}>Alimentação</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.textValor}>R$ 140,00</Text>
                        <Text style={styles.textCategoria}>22:00</Text>
                    </View>
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
    saldo: {
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        alignSelf: 'center',
        marginTop: 35,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
    },
    saldoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    saldoHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    text1: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    text2: {
        fontSize: 42,
        fontWeight: '900',
        color: '#1D1252',
        letterSpacing: -1.5,
    },
    saldoFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        gap: 6,
    },
    saldoTrend: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    linhaDegraficos: {
        flexDirection: 'column',
        width: '100%',
        marginTop: 35,
    },
    stackedCard: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#281E5D',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
    },
    stackedHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stackedTitle: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: 'bold',
        letterSpacing: 1.2,
    },
    stackedValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 24,
    },
    stackedValue: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    stackedTrend: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#34D399',
        marginLeft: 12,
    },
    stackedChartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    chartCenterTextContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartCenterTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    chartCenterSubtitle: {
        fontSize: 10,
        color: '#94A3B8',
        marginTop: 2,
    },
    barChartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 110,
        marginTop: 10,
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    bar: {
        width: '14%',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    stackedFooterText: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 5,
        lineHeight: 18,
    },
    gastosDoMes: {
        height: 96,
        width: '90%',
        backgroundColor: '#08082F',
        alignSelf: 'center',
        marginTop: 15,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 20,
        paddingHorizontal: 20,
    },
    text3: {
        fontSize: 14,
        color: '#E1E0FF',
        fontFamily: 'Inter',
        letterSpacing: 2.4,

    },
    text4: {
        fontSize: 14,
        color: '#72FF72',
        fontFamily: 'Inter',
        letterSpacing: 2.4,
        marginTop: 5,
    },
    registrarNovoGasto: {
        height: 55,
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        flexDirection: 'row',
        gap: 5,
    },
    text5: {
        fontSize: 15,
        color: '#1D1252',
        fontWeight: 'bold',
    },
    text6: {
        fontSize: 15,
        color: '#1D1252',
        fontWeight: 'bold',
    },
    metasPessoais: {
        height: 55,
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        flexDirection: 'row',
        gap: 5,
    },
    lembretes: {
        height: 55,
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        flexDirection: 'row',
        gap: 5,
    },
    linhaBotao: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        alignSelf: 'center',
        marginTop: 1,
    },
    ultimosGastos: {
        fontSize: 14,
        color: '#94A3B8',
        fontFamily: 'Inter',
        letterSpacing: 2.4,
        marginBottom: 8,
        paddingTop: 40,
        paddingLeft: 25,
    },
    gastosHistorico: {
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
    textHistorico: {
        fontSize: 16,
        color: '#1D1252',
        fontFamily: 'Inter',
        fontWeight: 'bold',

    },
    textValor: {
        fontSize: 14,
        color: '#1D1252',
        fontFamily: 'Inter',
        fontWeight: 'bold',
    },
    textCategoria: {
        fontSize: 12,
        color: '#94A3B8',
        fontFamily: 'Inter',
        marginTop: 2,
    },
    iconeGastos: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },

})
