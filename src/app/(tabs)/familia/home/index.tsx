import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { avatares } from '@/src/components/auth/escolhaavantar';
import NavBarFamilia from '@/src/components/tabs/familia/navbar/page';
import InfoCards from '@/src/components/tabs/familia/info-cards';
import { useFamiliaHome } from '@/src/hooks/familia/useFamiliaHome';

export default function FamiliaHome() {
  const { familyName, membros, codigoConvite, isLoading, copiarCodigo, admin } = useFamiliaHome()

  return (
    <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.familyName}>{`Família ${familyName}`}</Text>

          <InfoCards/>

          <NavBarFamilia></NavBarFamilia>
        </View>

        <View style={styles.membersSection}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
          ) : membros.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum membro encontrado.</Text>
          ) : (
            membros.map((member, index) => (
              <View key={member.email ?? index} style={styles.memberCard}>
                <View style={styles.memberAvatar}>
                  <Image
                    source={avatares[member.avatar as keyof typeof avatares] ?? avatares[1]}
                    style={styles.memberAvatarImage}
                  />
                </View>
                <Text style={styles.memberName}>{member.nome}</Text>
                <Text style={styles.memberRole}>
                  {admin && member.email === admin.email ? 'ADMIN' : 'MEMBRO'}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.codeCard}>
          <View style={styles.codeRow}>
            <View style={styles.codeInfo}>
              <Text style={styles.codeLabel}>CÓDIGO DE ACESSO DA FAMÍLIA</Text>
              <Text style={styles.codeValue}>{codigoConvite}</Text>
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
  emptyText: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: 20,
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
