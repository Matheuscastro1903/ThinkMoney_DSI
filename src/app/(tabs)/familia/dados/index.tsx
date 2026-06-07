import { Feather, Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import NavBarFamilia from '@/src/components/tabs/familia/navbar/page';
import InfoCards from '@/src/components/tabs/familia/info-cards';

const MOCK_MEMBERS = [
    { id: '1', name: 'Henrique', value: 'R$ 8.240,00', percent: '60%', color: '#1D1252' },
    { id: '2', name: 'Mariana', value: 'R$ 4.880,00', percent: '40%', color: '#6366F1' },
    { id: '3', name: 'Lucas', value: 'R$ 2.300,00', percent: '20%', color: '#94A3B8' },
];

const MOCK_CATEGORIES = [
    { id: '1', name: 'Moradia', value: 'R$ 5.397,00', percent: '35%', color: '#1D1252' },
    { id: '2', name: 'Alimentação', value: 'R$ 3.855,00', percent: '25%', color: '#4F46E5' },
    { id: '3', name: 'Transporte', value: 'R$ 2.313,00', percent: '15%', color: '#818CF8' },
    { id: '4', name: 'Lazer', value: 'R$ 2.313,00', percent: '15%', color: '#CBD5E1' },
    { id: '5', name: 'Outros', value: 'R$ 1.542,00', percent: '10%', color: '#E2E8F0' },
];

const MOCK_TRANSACTIONS = [
    { id: '1', iconName: 'shopping-bag', iconFamily: 'Feather', title: 'Mariana Cavalcante', desc: 'SUPERMERCADO PREMIUM', value: '- R$ 420,50', date: '10/05/2026' },
    { id: '2', iconName: 'wallet-outline', iconFamily: 'Ionicons', title: 'Meta: Viagem Itália', desc: 'APORTE MENSAL AUTOMÁTICO', value: '+ R$ 2.000,00', date: '10/05/2026' },
    { id: '3', iconName: 'credit-card', iconFamily: 'Feather', title: 'Lucas Cavalcante', desc: 'STREAMING & GAMES', value: '- R$ 54,90', date: '10/05/2026' },
];

export default function Dados() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Família Silva</Text>

                    <InfoCards/>

                    <NavBarFamilia></NavBarFamilia>
                </View>

                <View style={styles.mainCard}>
                    <Text style={styles.cardHeaderTitle}>GASTO MENSAL DA FAMÍLIA</Text>
                    <View style={styles.cardValueContainer}>
                        <Text style={styles.currencySymbol}>R$</Text>
                        <Text style={styles.cardValue}>15.420,00</Text>
                    </View>
                    <Text style={styles.cardFooterText}>3 membros ativos este mês</Text>
                </View>

                <Text style={styles.sectionTitle}>JANEIRO 2026</Text>
                
                <View style={styles.mainCard}>
                    {MOCK_MEMBERS.map((member) => (
                        <View key={member.id} style={styles.memberItem}>
                            <View style={styles.memberHeader}>
                                <Text style={styles.memberName}>{member.name}</Text>
                                <Text style={styles.memberValue}>{member.value}</Text>
                            </View>
                            <View style={styles.progressBarBackground}>
                                <View style={[styles.progressBarFill, { width: member.percent as any, backgroundColor: member.color }]} />
                            </View>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>DESPESAS</Text>

                <View style={styles.mainCard}>
                    <View style={styles.donutContainer}>
                        <View style={styles.donutRing}>
                            <View style={styles.donutHole}>
                                <Text style={styles.donutLabel}>TOP 1</Text>
                                <Text style={styles.donutValue}>{MOCK_CATEGORIES[0].name}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.categoryList}>
                        {MOCK_CATEGORIES.map((category) => (
                            <View key={category.id} style={styles.categoryItem}>
                                <View style={styles.categoryLeft}>
                                    <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                                    <Text style={styles.categoryName}>{category.name}</Text>
                                </View>
                                <View style={styles.categoryRight}>
                                    <Text style={styles.categoryAmount}>{category.value}</Text>
                                    <Text style={styles.categoryPercent}>{category.percent}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <TouchableOpacity onPress={() => router.push('/(tabs)/familia/details/transacoes' as any)}>
                    <Text style={styles.verTodosLabel}>VER TODOS</Text>
                </TouchableOpacity>

                {MOCK_TRANSACTIONS.map((tx) => (
                    <View key={tx.id} style={styles.transactionCard}>
                        <View style={styles.transactionIcon}>
                            {tx.iconFamily === 'Ionicons' ? (
                                <Ionicons name={tx.iconName as any} size={20} color="#1D1252" />
                            ) : (
                                <Feather name={tx.iconName as any} size={20} color="#1D1252" />
                            )}
                        </View>
                        <View style={styles.transactionInfo}>
                            <Text style={styles.transactionTitle} numberOfLines={1}>{tx.title}</Text>
                            <Text style={styles.transactionDesc} numberOfLines={1}>{tx.desc}</Text>
                        </View>
                        <View style={styles.transactionValueContainer}>
                            <Text style={styles.transactionValueText}>{tx.value}</Text>
                            <Text style={styles.transactionDate}>{tx.date}</Text>
                        </View>
                    </View>
                ))}

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
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    statTextGroup: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    statLabel: {
        fontSize: 10,
        color: '#000',
        letterSpacing: 1,
    },
    navMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        gap: 8,
    },
    navPill: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    navPillActive: {
        backgroundColor: '#000000',
    },
    navPillText: {
        color: '#1D1252',
        fontSize: 12,
        fontWeight: 'bold',
    },
    navPillTextActive: {
        color: '#FFFFFF',
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
});
