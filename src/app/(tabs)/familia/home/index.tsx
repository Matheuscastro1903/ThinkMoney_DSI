import { Ionicons } from '@expo/vector-icons';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { avatares } from '@/src/components/auth/escolhaavantar';
import NavBarFamilia from '@/src/components/tabs/familia/navbar/page';
import InfoCards from '@/src/components/tabs/familia/info-cards';

const familyData = {
  name: 'Família Silva',
  code: 'THKM-X7R2-89',
  membersCount: 3,
  goalsCount: 5,
};

const members = [
  { id: 1, name: 'Henrique Cavalcante', role: 'Responsável', avatarId: 5 as keyof typeof avatares },
  { id: 2, name: 'Mariana Cavalcante', role: 'Membro', avatarId: 3 as keyof typeof avatares },
  { id: 3, name: 'Lucas Cavalcante', role: 'Membro', avatarId: 4 as keyof typeof avatares },
];

export default function FamiliaHome() {
  function copiarCodigo() {
    Alert.alert('Código copiado!', `${familyData.code} foi copiado para a área de transferência.`);
  }

  return (
    <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.familyName}>Família Silva</Text>

          <InfoCards/>

          <NavBarFamilia></NavBarFamilia>
        </View>

        <View style={styles.membersSection}>
          {members.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberAvatar}>
                <Image source={avatares[member.avatarId]} style={styles.memberAvatarImage} />
              </View>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        <View style={styles.codeCard}>
          <View style={styles.codeRow}>
            <View style={styles.codeInfo}>
              <Text style={styles.codeLabel}>CÓDIGO DE ACESSO DA FAMÍLIA</Text>
              <Text style={styles.codeValue}>{familyData.code}</Text>
            </View>
            <TouchableOpacity style={styles.copyButton} onPress={copiarCodigo} activeOpacity={0.7}>
              <Ionicons name="copy-outline" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <View style={styles.codeHint}>
            <Ionicons name="information-circle-outline" size={14} color="rgba(72,69,80,0.8)" />
            <Text style={styles.codeHintText}>
              Compartilhe este código com quem deseja{'\n'}convidar para o grupo.
            </Text>
          </View>
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#1D1252',
  },
  scrollContent: {
    alignItems: 'center',
    gap: 24,
    paddingBottom: 32,
  },
  familyName: {
    fontSize: 36,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.9,
    marginTop: 16,
    textAlign: 'center',
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 24,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 40,
    width: '100%',
    justifyContent: 'center',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  statInfo: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#000000',
    letterSpacing: 1,
    textAlign: 'center',
  },
  actionTabs: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(229,222,255,0.3)',
  },
  actionButtonActive: {
    backgroundColor: '#000000',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1D1252',
  },
  actionButtonTextActive: {
    color: '#ffffff',
  },
  membersSection: {
    width: '100%',
    paddingHorizontal: 24,
    gap: 16,
  },
  memberCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229,222,255,0.3)',
  },
  memberAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5DEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  memberAvatarImage: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D1252',
    textAlign: 'center',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 10,
    fontWeight: '600',
    color: '#867DC1',
    letterSpacing: 1,
    textAlign: 'center',
  },
  codeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 25,
    width: '90%',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(201,196,209,0.1)',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  codeInfo: {
    gap: 4,
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#484550',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  codeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D1252',
    letterSpacing: 2.4,
  },
  copyButton: {
    backgroundColor: '#1D1252',
    borderRadius: 8,
    padding: 12,
  },
  codeHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  codeHintText: {
    fontSize: 11,
    color: 'rgba(72,69,80,0.8)',
    lineHeight: 16.5,
    flex: 1,
  },
});
