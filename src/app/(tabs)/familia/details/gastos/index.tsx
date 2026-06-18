import HeaderBack from '@/src/components/headerBack';
import { useFamiliaGastos } from '@/src/hooks/familia/useFamiliaGastos';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AVATAR_1 = require('../../../../../assets/images/avatarcapivara.png');
const AVATAR_2 = require('../../../../../assets/images/avatarjacare.png');
const AVATAR_3 = require('../../../../../assets/images/avatarleao.png');

const AVATARES = [AVATAR_1, AVATAR_2, AVATAR_3]

export default function Gastos() {
    const router = useRouter();
    const { isLoading, sections, gastoTotal, qtdMembros, membros, familiaId } = useFamiliaGastos()

    return (
        <SafeAreaView style={styles.safeArea} edges={['right', 'bottom', 'left']}>
            <HeaderBack />

            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>

                {/* Top Card */}
                <View style={styles.topCard}>
                    <View style={styles.topCardHeader}>
                        <Text style={styles.topCardLabel}>Gasto Total da Família</Text>
                    </View>

                    <View style={styles.topCardBody}>
                        <View>
                            <Text style={styles.currency}>R$</Text>
                            <Text style={styles.totalValue}>
                                {gastoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Text>
                        </View>
                        <View style={styles.monthBadge}>
                            <Text style={styles.monthBadgeText}>Este{"\n"}mês</Text>
                        </View>
                    </View>

                    <View style={styles.topCardFooter}>
                        <View style={styles.avatarGroup}>
                            {membros.slice(0, 3).map((membro, i) => (
                                <Image
                                    key={membro.email || i}
                                    source={membro.avatar != null ? AVATARES[membro.avatar % AVATARES.length] : AVATARES[0]}
                                    style={[styles.avatar, { zIndex: 3 - i, marginLeft: i > 0 ? -12 : 0 }]}
                                />
                            ))}
                        </View>
                        <Text style={styles.activeMembers}>{qtdMembros} membros ativos</Text>
                    </View>
                </View>

                {/* Sections */}
                {isLoading ? (
                    <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
                ) : sections.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
                ) : (
                    sections.map((section, idx) => (
                        <View key={idx}>
                            <Text style={styles.sectionTitle}>{section.section}</Text>

                            {section.data.map((tx: any, txIdx: number) => (
                                <View key={tx.id ?? txIdx} style={styles.txCard}>
                                    <View style={[styles.txIconContainer, { backgroundColor: '#F1F5F9' }]}>
                                        <Feather name="credit-card" size={20} color="#1D1252" />
                                    </View>

                                    <View style={styles.txInfo}>
                                        <Text style={styles.txTitle}>{tx.titulo ?? tx.descricao ?? '—'}</Text>
                                        <View style={styles.txSubtitleRow}>
                                            <Text style={styles.txSubtitle}>{tx.categoria ?? ''}</Text>

                                            {tx.criador && (
                                                <View style={styles.memberPill}>
                                                    {tx.criador.avatar != null && (
                                                        <Image source={AVATARES[tx.criador.avatar % AVATARES.length]} style={styles.memberPillDot} />
                                                    )}
                                                    <Text style={styles.memberPillText}>{tx.criador.nome?.split(' ')[0]}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    <View style={styles.txActionContainer}>
                                        <Text style={styles.txValue}>
                                            {tx.valor != null
                                                ? `R$ ${tx.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                                : '—'
                                            }
                                        </Text>
                                        <View style={styles.actionButtons}>
                                            <TouchableOpacity
                                                style={styles.actionBtn}
                                                onPress={() => router.push({
                                                    pathname: '/(details)/detailshome/gastos/editar_gasto',
                                                    params: { gasto: JSON.stringify(tx), context: 'familia', familiaId }
                                                } as any)}
                                            >
                                                <Feather name="edit-2" size={16} color="#4F46E5" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))
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
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 10,
    },
    topCard: {
        backgroundColor: '#5B21B6',
        borderRadius: 20,
        padding: 24,
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    topCardHeader: {
        marginBottom: 12,
    },
    topCardLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '600',
    },
    topCardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    currency: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    totalValue: {
        color: '#FFFFFF',
        fontSize: 48,
        fontWeight: '900',
        letterSpacing: -1,
        marginTop: -4,
    },
    monthBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    topCardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarGroup: {
        flexDirection: 'row',
        marginRight: 12,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#5B21B6',
        backgroundColor: '#FFF',
    },
    activeMembers: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
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
    emptyText: {
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        marginTop: 20,
    },
    txCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        height: 90,
    },
    txIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    txInfo: {
        flex: 1,
        marginRight: 12,
    },
    txTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1D1252',
        marginBottom: 4,
    },
    txSubtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    txSubtitle: {
        fontSize: 12,
        color: '#94A3B8',
        flexShrink: 1,
    },
    memberPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    memberPillDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 4,
    },
    memberPillText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#475569',
    },
    txActionContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    txValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1D1252',
        marginBottom: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        padding: 4,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
    }
});
