import { Feather, Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBack from '../../../../../components/headerBack';

const AVATAR_1 = require('../../../../../assets/images/avatarcapivara.png');
const AVATAR_2 = require('../../../../../assets/images/avatarjacare.png');
const AVATAR_3 = require('../../../../../assets/images/avatarleao.png');

// Mocks simulando o agrupamento de transações por data
const MOCK_TRANSACTIONS = [
    {
        section: 'HOJE',
        data: [
            { id: '1', title: 'Pão de Açúcar', time: '14:30', category: 'Mercados', value: 'R$ 142,30', icon: 'shopping-cart', iconColor: '#9333EA', iconBg: '#F3E8FF', memberName: 'Maria', memberAvatar: AVATAR_1 },
            { id: '2', title: 'Uber Trip', time: '10:15', category: 'Transporte', value: 'R$ 28,50', icon: 'truck', iconColor: '#A855F7', iconBg: '#F3E8FF', memberName: 'Sofia', memberAvatar: AVATAR_2 },
        ]
    },
    {
        section: 'ONTEM',
        data: [
            { id: '3', title: 'Restaurante Sabor', time: '20:45', category: 'Alimentação', value: 'R$ 210,00', icon: 'coffee', iconColor: '#4F46E5', iconBg: '#E0E7FF', memberName: 'João', memberAvatar: AVATAR_3 },
            { id: '4', title: 'Cinemark', time: '18:00', category: 'Lazer', value: 'R$ 95,00', icon: 'film', iconColor: '#E11D48', iconBg: '#FFE4E6', memberName: 'Sofia', memberAvatar: AVATAR_2 },
        ]
    }
];

export default function Transacoes() {
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
                            <Text style={styles.totalValue}>4.280,50</Text>
                        </View>
                        <View style={styles.monthBadge}>
                            <Text style={styles.monthBadgeText}>Este{"\n"}mês</Text>
                        </View>
                    </View>

                    <View style={styles.topCardFooter}>
                        <View style={styles.avatarGroup}>
                            <Image source={AVATAR_1} style={[styles.avatar, { zIndex: 3 }]} />
                            <Image source={AVATAR_2} style={[styles.avatar, { zIndex: 2, marginLeft: -12 }]} />
                            <Image source={AVATAR_3} style={[styles.avatar, { zIndex: 1, marginLeft: -12 }]} />
                        </View>
                        <Text style={styles.activeMembers}>3 membros ativos</Text>
                    </View>
                </View>

                {/* Sections */}
                {MOCK_TRANSACTIONS.map((section, idx) => (
                    <View key={idx}>
                        <Text style={styles.sectionTitle}>{section.section}</Text>
                        
                        {section.data.map((tx) => (
                            <View key={tx.id} style={styles.txCard}>
                                <View style={[styles.txIconContainer, { backgroundColor: tx.iconBg }]}>
                                    <Feather name={tx.icon as any} size={20} color={tx.iconColor} />
                                </View>
                                
                                <View style={styles.txInfo}>
                                    <Text style={styles.txTitle}>{tx.title}</Text>
                                    <View style={styles.txSubtitleRow}>
                                        <Text style={styles.txSubtitle}>{tx.time} • {tx.category}</Text>
                                        
                                        <View style={styles.memberPill}>
                                            <Image source={tx.memberAvatar} style={styles.memberPillDot} />
                                            <Text style={styles.memberPillText}>{tx.memberName}</Text>
                                        </View>
                                    </View>
                                </View>
                                
                                <View style={styles.txValueContainer}>
                                    <Text style={styles.txValue}>{tx.value}</Text>
                                </View>
                            </View>
                        ))}
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
    txValueContainer: {
        justifyContent: 'center',
    },
    txValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1D1252',
    },
});
