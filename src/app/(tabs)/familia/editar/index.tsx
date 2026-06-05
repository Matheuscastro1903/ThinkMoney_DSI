import { Feather, Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NavBarFamilia from '@/src/components/tabs/familia/navbar/page';

const membros = [
  { id: 1, nome: 'Henrique', role: 'RESPONSÁVEL', inicial: 'H' },
  { id: 2, nome: 'Mariana', role: 'MEMBRO', inicial: 'M' },
  { id: 3, nome: 'Lucas', role: 'MEMBRO', inicial: 'L' },
];

export default function FamiliaEditar() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
          <Text style={styles.familyName}>Família Silva</Text>

          <View style={styles.quickStats}>
            <View style={styles.statCard}>
              <Ionicons name="people" size={18} color="#1D1252" />
              <View style={styles.statInfo}>
                <Text style={styles.statNumber}>
                  3
                </Text>
                <Text style={styles.statLabel}>MEMBROS</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="flag-outline" size={18} color="#1D1252" />
              <View style={styles.statInfo}>
                <Text style={styles.statNumber}>
                  5
                </Text>
                <Text style={styles.statLabel}>METAS</Text>
              </View>
            </View>
          </View>

          <NavBarFamilia></NavBarFamilia>
        </View>

      <View style={styles.membrosSection}>
        <Text style={styles.sectionLabel}>MEMBROS</Text>
        {membros.map((membro) => (
          <View key={membro.id} style={styles.membroRow}>
            <View style={styles.membroInicial}>
              <Text style={styles.membroInicialText}>{membro.inicial}</Text>
            </View>
            <View style={styles.membroInfo}>
              <Text style={styles.membroNome}>{membro.nome}</Text>
              <Text style={styles.membroRole}>{membro.role}</Text>
            </View>
            <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
          </View>
        ))}
      </View>

      <View style={styles.acoesSection}>
        <TouchableOpacity style={styles.salvarButton} activeOpacity={0.7}>
          <Text style={styles.salvarButtonText}>Salvar alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelarButton} activeOpacity={0.7}>
          <Text style={styles.cancelarButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sairButton} activeOpacity={0.7}>
          <Ionicons name="exit-outline" size={16} color="#E1FF00" />
          <Text style={styles.sairButtonText}>Sair da Família</Text>
        </TouchableOpacity>

        <Text style={styles.avisoText}>
          Ao excluir a conta da família, todos os dados compartilhados e pertences de membros serão
          permanentemente removidos.
        </Text>

        <TouchableOpacity style={styles.excluirButton} activeOpacity={0.7}>
          <Text style={styles.excluirButtonText}>Excluir Família</Text>
        </TouchableOpacity>
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
    gap: 20,
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
    borderWidth: 1,
    borderColor: 'rgba(229,222,255,0.3)',
    elevation: 1,
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
  membrosSection: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  membroRow: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  membroInicial: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5DEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  membroInicialText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D1252',
  },
  membroInfo: {
    flex: 1,
  },
  membroNome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1D1252',
  },
  membroRole: {
    fontSize: 10,
    fontWeight: '600',
    color: '#867DC1',
    letterSpacing: 1,
    marginTop: 2,
  },
  acoesSection: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 12,
  },
  salvarButton: {
    backgroundColor: '#281E5D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  salvarButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelarButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cancelarButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  sairButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E1FF00',
  },
  sairButtonText: {
    color: '#E1FF00',
    fontSize: 15,
    fontWeight: 'bold',
  },
  avisoText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 10,
  },
  excluirButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  excluirButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
