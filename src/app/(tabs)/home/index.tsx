import { Feather, Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import InputRenda from '@/src/components/auth/inputrenda';
import DangerZoneModal from '@/src/components/DangerZoneModal';
import { useDangerZone } from '@/src/hooks/useDangerZone';

// Informacoes firebase
import { auth, db } from '@/src/services/firebaseConfig';
import { buscarGastos } from '@/src/services/gastosService';
import { Gasto } from '@/src/models/gasto';
import { metasService } from '@/src/services/metasService';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const icones: Record<string, React.ComponentProps<typeof Ionicons>["name"]> = {
    alimentacao: "basket",
    transporte: "car",
    lazer: "game-controller",
    educacao: "school",
    saude: "medkit",
    eletronicos: "desktop",
};

function toDate(data: any): Date {
    if (data instanceof Date) return data;
    if (data && typeof data.toDate === "function") return data.toDate();
    return new Date(data);
}

function formatarValor(valor: number) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(data: any) {
    return toDate(data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function capitalizarCategoria(cat: string) {
    if (!cat) return "";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
}

export default function Home() {
    const router = useRouter();
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [novaRenda, setNovaRenda] = useState("");
    const [salvandoRenda, setSalvandoRenda] = useState(false);

    const [usuario, setUsuario] = useState<any>(null);
    const [gastos, setGastos] = useState<(Gasto & { id: string })[]>([]);
    const [metas, setMetas] = useState<any[]>([]);

    const controleAvancado: boolean = usuario?.controleAvancado ?? false;
    const { zonaPerigo, pararAlarme, fecharAlerta } = useDangerZone(gastos, controleAvancado);

    useEffect(() => {
        async function carregarDados() {
            const uid = auth.currentUser?.uid; 

            if (!uid) return;

            const docRef = doc(db, 'usuarios', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setUsuario(docSnap.data());
            }

            try {
                const listaGastos = await buscarGastos(uid);
                setGastos(listaGastos);
            } catch (error) {
                console.error("Erro ao buscar gastos: ", error);
            }

            try {
                const listaMetas = await metasService.buscarTodas(uid);
                setMetas(listaMetas);
            } catch (error) {
                console.error("Erro ao buscar metas: ", error);
            }
        }

        carregarDados();
    }, []);

    useEffect(() => {
        setNovaRenda(usuario?.renda ?? "");
    }, [usuario]);

    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth();
    const anoAtual = dataAtual.getFullYear();

    const gastoTotalMes = gastos
        .filter(gasto => {
            const dataGasto = toDate(gasto.data);
            return dataGasto.getMonth() === mesAtual && dataGasto.getFullYear() === anoAtual;
        })
        .reduce((acc, gasto) => acc + gasto.valor, 0);

    const gastosHoje = gastos
        .filter(gasto => {
            const dataGasto = toDate(gasto.data);
            return dataGasto.getDate() === dataAtual.getDate() && 
                   dataGasto.getMonth() === mesAtual && 
                   dataGasto.getFullYear() === anoAtual;
        })
        .reduce((acc, gasto) => acc + gasto.valor, 0);

    let limiteConsumidoPerc = 0;
    let rendaVal = 0;
    if (usuario && usuario.renda) {
        const rendaString = String(usuario.renda).replace(/R\$\s?/, '').replace(/\./g, '').replace(',', '.');
        rendaVal = parseFloat(rendaString);
        if (rendaVal > 0) {
            limiteConsumidoPerc = (gastoTotalMes / rendaVal) * 100;
        }
    }
    const limiteFormatado = limiteConsumidoPerc.toFixed(1);
    const limiteGrafico = Math.min(limiteConsumidoPerc, 100);

    const saldoDisponivel = rendaVal - gastoTotalMes;

    const reserva = metas.find(m => m.nomeMeta.toLowerCase().includes('reserva'));
    const reservaPerc = reserva && reserva.valorTotal > 0 ? (reserva.valorPoupado / reserva.valorTotal) * 100 : 0;

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
                    <Text style={styles.text2}>{isBalanceVisible ? formatarValor(saldoDisponivel) : "R$ •••••"}</Text>
                    <View style={styles.saldoFooter}>
                        {gastosHoje > 0 ? (
                            <>
                                <Feather name="arrow-down-right" size={16} color="#EF4444" />
                                <Text style={styles.saldoTrend}>R$ {gastosHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gastos hoje</Text>
                            </>
                        ) : (
                            <>
                                <Feather name="check-circle" size={16} color="#34D399" />
                                <Text style={styles.saldoTrend}>Nenhum gasto hoje</Text>
                            </>
                        )}
                    </View>
                    <TouchableOpacity style={styles.botaoAtualizarRenda} onPress={() => setModalVisible(true)}>
                        <View style={styles.itensBotaoAtualizar}>
                            <Ionicons name="refresh" size={20} color="#FFFFFF" />
                            <Text style={{fontWeight: "bold", fontSize: 12, color: "white", textAlign: "center", marginTop: 4}}>Atualizar Renda Disponível</Text>
                        </View>
                      
                    </TouchableOpacity>

                    
                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Atualizar Renda</Text>
                                <Text style={styles.modalSubtitle}>Digite o novo valor da sua renda média</Text>
                                <View style={{ width: '100%', marginTop: 12 }}>
                                    
                                    <View style={{ marginBottom: 8 }}>
                                        <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Renda</Text>
                                        <Text style={{ color: '#666', marginBottom: 6 }}>Formato: 1.234,56</Text>
                                        <InputRenda
                                            label=""
                                            placeholder="Ex: 2.500,00"
                                            atualizando={(v) => setNovaRenda(v)}
                                            value={novaRenda}
                                        />
                                    </View>
                                </View>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ccc' }]} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.modalButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: '#1D1252' }]}
                                        onPress={async () => {
                                            const uid = auth.currentUser?.uid;
                                            if (!uid) {
                                                Alert.alert('Erro', 'Usuário não autenticado.');
                                                return;
                                            }
                                            try {
                                                setSalvandoRenda(true);
                                                await updateDoc(doc(db, 'usuarios', uid), { renda: novaRenda });
                                                setUsuario((prev: any) => ({ ...(prev ?? {}), renda: novaRenda }));
                                                Alert.alert('Sucesso', 'Renda atualizada!');
                                                setModalVisible(false);
                                            } catch (e) {
                                                console.error(e);
                                                Alert.alert('Erro', 'Não foi possível atualizar a renda. Tente novamente.');
                                            } finally {
                                                setSalvandoRenda(false);
                                            }
                                        }}
                                    >
                                        {salvandoRenda ? <ActivityIndicator color="white" /> : <Text style={[styles.modalButtonText, { color: 'white' }]}>Salvar</Text>}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>  
                
               

                <View style={styles.linhaDegraficos}>
                    

                    <View style={styles.stackedCard}>
                        <View style={styles.stackedHeaderRow}>
                            <Text style={styles.stackedTitle}>LIMITE CONSUMIDO</Text>
                            <TouchableOpacity onPress={() => Alert.alert("Limite Consumido", "Este gráfico mostra a porcentagem da sua renda mensal que já foi gasta. Fique de olho para não ultrapassar os 100%!")}>
                                <Ionicons name="information-circle-outline" size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.stackedValueRow}>
                            <Text style={styles.stackedValue}>{limiteFormatado}%</Text>
                        </View>

                        <View style={styles.stackedChartContainer}>
                            <CircularProgress
                                value={limiteGrafico}
                                showProgressValue={false}
                                activeStrokeWidth={12}
                                inActiveStrokeWidth={12}
                                radius={55}
                                activeStrokeColor={limiteConsumidoPerc > 90 ? '#EF4444' : '#34D399'}
                                inActiveStrokeColor={'#1A1340'}
                                inActiveStrokeOpacity={1}
                            />
                            <View style={styles.chartCenterTextContainer}>
                                <Ionicons name="card-outline" size={32} color={limiteConsumidoPerc > 90 ? '#EF4444' : '#34D399'} />
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
                            {formatarValor(gastoTotalMes)}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.registrarNovoGasto} onPress={() => router.push('/(details)/detailshome/gastos/visualizar_gasto')}>
                    <Ionicons name="wallet-outline" size={22} color="#1D1252" />
                    <Text style={styles.text5}>
                        Visualizar gastos
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.registrarNovoGasto} onPress={() => router.push('/(details)/detailshome/buyList' as any)}>
                    <Ionicons name="basket" size={22} color="#1D1252" />
                    <Text style={styles.text5}>
                        Visualizar Listas
                    </Text>
                </TouchableOpacity>
                <View style={styles.linhaBotao}>
                    <Link href="/(details)/detailshome/metas" asChild>
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
                {gastos.length === 0 ? (
                    <Text style={{ color: '#94A3B8', textAlign: 'center', marginTop: 10 }}>Nenhum gasto encontrado.</Text>
                ) : (
                    gastos.slice(0, 3).map((gasto) => (
                        <View key={gasto.id} style={styles.gastosHistorico}>
                            <View style={styles.iconeGastos}>
                                <Ionicons name={icones[gasto.categoria?.toLowerCase()] ?? "cart-outline"} size={20} color="#1D1252" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.textHistorico} numberOfLines={1}>{gasto.titulo}</Text>
                                <Text style={styles.textCategoria}>{capitalizarCategoria(gasto.categoria)}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.textValor}>{formatarValor(gasto.valor)}</Text>
                                <Text style={styles.textCategoria}>{formatarData(gasto.data)}</Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            <DangerZoneModal
                zonaPerigo={zonaPerigo}
                onPararAlarme={pararAlarme}
                onFechar={fecharAlerta}
            />
        </View>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1D1252',
        alignItems:'center'
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
    botaoAtualizarRenda:{
        backgroundColor: "#1D1252",
        borderRadius: 20,
        padding: 6,
        marginTop: 12
    }

    ,modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 480,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1D1252'
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 6,
        textAlign: 'center'
    },
    modalButtons: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 12,
        gap: 8,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonText: {
        fontWeight: 'bold'
    },
    itensBotaoAtualizar: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8
    }

})
