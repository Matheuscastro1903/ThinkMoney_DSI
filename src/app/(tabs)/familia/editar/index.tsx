import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NavBarFamilia from '@/src/components/tabs/familia/navbar/page';
import InfoCards from '@/src/components/tabs/familia/info-cards';
import { useFamiliaEditar } from '@/src/hooks/familia/useFamiliaEditar';
import { useRouter } from 'expo-router';
import { Usuario } from '@/src/models/usuario';

export default function FamiliaEditar() {
  const router = useRouter()
  const {
    familia,
    membros,
    isLoading,
    confirmarRemoverMembro,
    confirmarSairDaFamilia,
    confirmarExcluirFamilia,
  } = useFamiliaEditar()

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.familyName}>{familia?.nome ?? 'Família'}</Text>

        <InfoCards/>

        <NavBarFamilia></NavBarFamilia>
      </View>

      <View style={styles.membrosSection}>
        <Text style={styles.sectionLabel}>MEMBROS</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
        ) : (
          membros.map((membro: Usuario, index: number) => (
            <View key={membro.email ?? index} style={styles.membroRow}>
              <View style={styles.membroInicial}>
                <Text style={styles.membroInicialText}>
                  {membro.nome?.charAt(0).toUpperCase() ?? '?'}
                </Text>
              </View>
              <View style={styles.membroInfo}>
                <Text style={styles.membroNome}>{membro.nome}</Text>
                <Text style={styles.membroRole}>MEMBRO</Text>
              </View>
              <TouchableOpacity onPress={() => confirmarRemoverMembro(membro)} activeOpacity={0.7}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={styles.acoesSection}>
        <TouchableOpacity style={styles.cancelarButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.cancelarButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sairButton} onPress={confirmarSairDaFamilia} activeOpacity={0.7}>
          <Ionicons name="exit-outline" size={16} color="#E1FF00" />
          <Text style={styles.sairButtonText}>Sair da Família</Text>
        </TouchableOpacity>

        <Text style={styles.avisoText}>
          Ao excluir a conta da família, todos os dados compartilhados e pertences de membros serão
          permanentemente removidos.
        </Text>

        <TouchableOpacity style={styles.excluirButton} onPress={confirmarExcluirFamilia} activeOpacity={0.7}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Text style={styles.excluirButtonText}>Excluir Família</Text>
          )}
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
