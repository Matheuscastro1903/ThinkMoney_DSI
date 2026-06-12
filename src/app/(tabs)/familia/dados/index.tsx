import { Feather, Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import NavBarFamilia from '@/src/components/tabs/familia/navbar/page';
import InfoCards from '@/src/components/tabs/familia/info-cards';
import { useFamiliaDados } from '@/src/hooks/familia/useFamiliaDados';

// Cores fixas para os itens de categoria (visual)
const CATEGORY_COLORS = ['#1D1252', '#4F46E5', '#818CF8', '#CBD5E1', '#E2E8F0']

export default function Dados() {
    const router = useRouter();
    
    const {
        familyName,
        //gastoTotal,
        //gastosPorMembro,
        // ultimosGastos,
        // qtdMembros,
        familiaId,
        isLoading,
    } = useFamiliaDados()
    

    // --- INÍCIO DOS MOCKS (Apague isso depois) ---
    const gastoTotal = 4500.50;
    const qtdMembros = 4;
    const gastosPorMembro = [
        { nome: 'João Silva', valor: 2500.00 },
        { nome: 'Maria Silva', valor: 1500.50 },
        { nome: 'Pedro Silva', valor: 500.00 },
    ];
    const gastosPorCategoria = [
        { nome: 'Alimentação', valor: 2000.00 },
        { nome: 'Lazer', valor: 1500.00 },
        { nome: 'Transporte', valor: 1000.50 },
    ];
    const ultimosGastos = [
        { id: '1', iconFamily: 'Ionicons', iconName: 'cart-outline', titulo: 'Mercado', descricao: 'Compras do mês', valor: 850.00, data: '10/06/2026' },
        { id: '2', iconFamily: 'Feather', iconName: 'monitor', titulo: 'Netflix', descricao: 'Assinatura', valor: 55.90, data: '05/06/2026' },
        { id: '3', iconFamily: 'Ionicons', iconName: 'restaurant-outline', titulo: 'Pizzaria', descricao: 'Jantar de fim de semana', valor: 120.00, data: '01/06/2026' },
    ];
    // --- FIM DOS MOCKS ---

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>{`Família ${familyName}`}</Text>

                    <InfoCards/>

                    <NavBarFamilia></NavBarFamilia>
                </View>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 40 }} />
                ) : (
                    <>
                        <View style={styles.mainCard}>
                            <Text style={styles.cardHeaderTitle}>GASTO MENSAL DA FAMÍLIA</Text>
                            <View style={styles.cardValueContainer}>
                                <Text style={styles.currencySymbol}>R$</Text>
                                <Text style={styles.cardValue}>
                                    {gastoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Text>
                            </View>
                            <Text style={styles.cardFooterText}>{qtdMembros} membros ativos este mês</Text>
                        </View>

                        {gastosPorMembro.length > 0 && (
                            <>
                                <Text style={styles.sectionTitle}>GASTOS POR MEMBRO</Text>
                                <View style={styles.mainCard}>
                                    {gastosPorMembro.map((item, i) => (
                                        <View key={i} style={styles.memberItem}>
                                            <View style={styles.memberHeader}>
                                                <Text style={styles.memberName}>{item.nome}</Text>
                                                <Text style={styles.memberValue}>
                                                    R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </Text>
                                            </View>
                                            <View style={styles.progressBarBackground}>
                                                <View style={[styles.progressBarFill, {
                                                    width: gastoTotal > 0 ? `${(item.valor / gastoTotal) * 100}%` as any : '0%',
                                                    backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length]
                                                }]} />
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}

                        {gastosPorCategoria.length > 0 && (
                            <>
                                <Text style={styles.sectionTitle}>DESPESAS</Text>
                                <View style={styles.mainCard}>
                                    <View style={styles.donutContainer}>
                                        <View style={styles.donutRing}>
                                            <View style={styles.donutHole}>
                                                <Text style={styles.donutLabel}>TOP 1</Text>
                                                <Text style={styles.donutValue}>
                                                    {gastosPorCategoria[0]?.nome ?? '—'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.categoryList}>
                                        {gastosPorCategoria.map((cat, i) => (
                                            <View key={i} style={styles.categoryItem}>
                                                <View style={styles.categoryLeft}>
                                                    <View style={[styles.categoryDot, { backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }]} />
                                                    <Text style={styles.categoryName}>{cat.nome}</Text>
                                                </View>
                                                <View style={styles.categoryRight}>
                                                    <Text style={styles.categoryAmount}>
                                                        R$ {cat.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </Text>
                                                    <Text style={styles.categoryPercent}>
                                                        {gastoTotal > 0 ? `${Math.round((cat.valor / gastoTotal) * 100)}%` : '0%'}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </>
                        )}

                        {ultimosGastos.length > 0 && (
                            <>
                                <TouchableOpacity onPress={() => router.push('/(tabs)/familia/details/gastos' as any)}>
                                    <Text style={styles.verTodosLabel}>VER TODOS</Text>
                                </TouchableOpacity>

                                {ultimosGastos.slice(0, 3).map((tx: any, i: number) => (
                                    <View key={tx.id ?? i} style={styles.transactionCard}>
                                        <View style={styles.transactionIcon}>
                                            {tx.iconFamily === 'Ionicons' ? (
                                                <Ionicons name={tx.iconName ?? 'wallet-outline'} size={20} color="#1D1252" />
                                            ) : (
                                                <Feather name={tx.iconName ?? 'credit-card'} size={20} color="#1D1252" />
                                            )}
                                        </View>
                                        <View style={styles.transactionInfo}>
                                            <Text style={styles.transactionTitle} numberOfLines={1}>{tx.titulo ?? tx.title ?? '—'}</Text>
                                            <Text style={styles.transactionDesc} numberOfLines={1}>{tx.descricao ?? tx.desc ?? ''}</Text>
                                        </View>
                                        <View style={styles.transactionValueContainer}>
                                            <Text style={styles.transactionValueText}>
                                                {tx.valor != null ? `R$ ${tx.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : tx.value ?? '—'}
                                            </Text>
                                            <Text style={styles.transactionDate}>{tx.data ?? tx.date ?? ''}</Text>
                                        </View>
                                    </View>
                                ))}
                            </>
                        )}
                    </>
                )}

            </ScrollView>

            {!isLoading && familiaId && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => router.push(`/(details)/detailshome/gastos/criar_gasto?context=familia&familiaId=${familiaId}` as any)}
                >
                    <Ionicons name="add" size={30} color="#FFFFFF" />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#1D1252',
    },
    container: {
        flex: 1,
        backgroundColor: '#1D1252',
    },
    headerContainer: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 10,
        gap: 24,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 0,
        paddingBottom: 100,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    mainCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
        marginBottom: 20,
    },
    cardHeaderTitle: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: 'bold',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    cardValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 16,
    },
    currencySymbol: {
        fontSize: 20,
        color: '#94A3B8',
        fontWeight: '500',
    },
    cardValue: {
        fontSize: 42,
        fontWeight: '900',
        color: '#1D1252',
        letterSpacing: -1.5,
    },
    cardFooterText: {
        fontSize: 12,
        color: '#334155',
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 'bold',
        letterSpacing: 1.5,
        marginBottom: 12,
        marginTop: 10,
        paddingLeft: 4,
    },
    memberItem: {
        marginBottom: 20,
    },
    memberHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    memberName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1D1252',
    },
    memberValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1D1252',
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    donutContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 30,
    },
    donutRing: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    donutHole: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    donutLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    donutValue: {
        fontSize: 18,
        color: '#1D1252',
        fontWeight: 'bold',
        marginTop: 4,
    },
    categoryList: {
        marginTop: 10,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    categoryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    categoryDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    categoryName: {
        fontSize: 14,
        color: '#475569',
    },
    categoryRight: {
        alignItems: 'flex-end',
    },
    categoryAmount: {
        fontSize: 14,
        color: '#1D1252',
        fontWeight: 'bold',
    },
    categoryPercent: {
        fontSize: 10,
        color: '#94A3B8',
        marginTop: 2,
    },
    verTodosLabel: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 'bold',
        letterSpacing: 1.5,
        marginBottom: 12,
        marginTop: 10,
        paddingRight: 4,
        textAlign: 'right',
    },
    transactionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        height: 88,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    transactionIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    transactionInfo: {
        flex: 1,
        marginRight: 12,
    },
    transactionTitle: {
        fontSize: 16,
        color: '#1D1252',
        fontWeight: 'bold',
    },
    transactionDesc: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    },
    transactionValueContainer: {
        alignItems: 'flex-end',
    },
    transactionValueText: {
        fontSize: 16,
        color: '#1D1252',
        fontWeight: 'bold',
    },
    transactionDate: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    },
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 120, // acima da tab bar
        backgroundColor: '#4F46E5',
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },
});
