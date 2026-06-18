import { Feather, Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import NavBarFamilia from '@/src/components/tabs/familia/navbar/page';
import InfoCards from '@/src/components/tabs/familia/info-cards';
import { useFamiliaDados } from '@/src/hooks/familia/useFamiliaDados';

const CATEGORY_COLORS = ['#1D1252', '#4F46E5', '#818CF8', '#CBD5E1', '#94A3B8']

const SIZE = 260
const CX = SIZE / 2
const CY = SIZE / 2
const OUTER_R = 118
const OUTER_R_SEL = 126
const INNER_R = 80

function buildArc(cx: number, cy: number, outerR: number, innerR: number, startAngle: number, endAngle: number) {
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
    const x1 = cx + outerR * Math.cos(startAngle)
    const y1 = cy + outerR * Math.sin(startAngle)
    const x2 = cx + outerR * Math.cos(endAngle)
    const y2 = cy + outerR * Math.sin(endAngle)
    const ix1 = cx + innerR * Math.cos(endAngle)
    const iy1 = cy + innerR * Math.sin(endAngle)
    const ix2 = cx + innerR * Math.cos(startAngle)
    const iy2 = cy + innerR * Math.sin(startAngle)
    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2} Z`
}

function DonutChart({ data, total, selectedIndex, onPress }: {
    data: { nome: string; valor: number }[];
    total: number;
    selectedIndex: number | null;
    onPress: (i: number) => void;
}) {
    if (total <= 0) return null

    let startAngle = -Math.PI / 2
    const segments = data.map((item, i) => {
        const angle = (item.valor / total) * 2 * Math.PI
        const endAngle = startAngle + angle
        const isSelected = selectedIndex === i
        const d = buildArc(CX, CY, isSelected ? OUTER_R_SEL : OUTER_R, INNER_R, startAngle, endAngle)
        startAngle = endAngle
        return { d, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length], isSelected }
    })

    return (
        <Svg width={SIZE} height={SIZE}>
            {segments.map((seg, i) => (
                <Path
                    key={i}
                    d={seg.d}
                    fill={seg.color}
                    opacity={selectedIndex !== null && !seg.isSelected ? 0.35 : 1}
                    onPress={() => onPress(i)}
                />
            ))}
        </Svg>
    )
}

export default function Dados() {
    const router = useRouter();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    const {
        familyName,
        gastoTotal,
        gastosPorMembro,
        ultimosGastos,
        qtdMembros,
        gastosPorCategoria,
        familiaId,
        isLoading,
    } = useFamiliaDados()

    function handleSegmentPress(i: number) {
        setSelectedIndex(prev => prev === i ? null : i)
    }

    const activeCategory = selectedIndex !== null ? gastosPorCategoria[selectedIndex] : gastosPorCategoria[0]
    const centerLabel = selectedIndex !== null ? `${Math.round((activeCategory?.valor / gastoTotal) * 100)}%` : 'TOP 1'
    const centerValue = activeCategory?.nome ?? '—'
    
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
                                        <DonutChart
                                            data={gastosPorCategoria}
                                            total={gastoTotal}
                                            selectedIndex={selectedIndex}
                                            onPress={handleSegmentPress}
                                        />
                                        <View style={styles.donutHole} pointerEvents="none">
                                            <Text style={styles.donutLabel}>{centerLabel}</Text>
                                            <Text style={styles.donutValue}>{centerValue}</Text>
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
                                            <Feather name="credit-card" size={20} color="#1D1252" />
                                        </View>
                                        <View style={styles.transactionInfo}>
                                            <Text style={styles.transactionTitle} numberOfLines={1}>{tx.titulo ?? tx.title ?? '—'}</Text>
                                            <Text style={styles.transactionDesc} numberOfLines={1}>{tx.descricao ?? tx.categoria ?? ''}</Text>
                                        </View>
                                        <View style={styles.transactionValueContainer}>
                                            <Text style={styles.transactionValueText}>
                                                {tx.valor != null ? `R$ ${tx.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : tx.value ?? '—'}
                                            </Text>
                                            <Text style={styles.transactionDate}>
                                                {tx.data instanceof Date ? tx.data.toLocaleDateString('pt-BR') : tx.data ?? tx.date ?? ''}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </>
                        )}
                        
                        <TouchableOpacity 
                            style={styles.addGastoButton}
                            onPress={() => router.push(`/(details)/detailshome/gastos/criar_gasto?context=familia&familiaId=${familiaId}` as any)}
                        >
                            <Ionicons name="add-outline" size={20} color="#1D1252" />
                            <Text style={styles.addGastoText}>Adicionar gasto</Text>
                        </TouchableOpacity>

                    </>
                )}

            </ScrollView>

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
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        width: 260,
        height: 260,
    },
    donutHole: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
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
    addGastoButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingVertical: 16,
        gap: 10,
        width: "100%",
        marginTop: 15,
        marginBottom: 15
    },
    addGastoText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#1D1252",
    },
});
