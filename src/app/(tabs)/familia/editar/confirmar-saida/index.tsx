import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFamiliaAcoes } from '@/src/hooks/familia/useFamiliaAcoes';
import { useUsuarioLogado } from '@/src/hooks/useUsuarioLogado';

export default function ConfirmarSaidaFamilia() {
  const router = useRouter();
  const { familiaId, isLoading: isLoadingUsuario } = useUsuarioLogado();
  const { sairDaFamilia, isLoading: isLoadingAcoes } = useFamiliaAcoes();
  const isLoading = isLoadingUsuario || isLoadingAcoes;

  const handleSair = async () => {
    if (!familiaId) return;
    await sairDaFamilia(familiaId);
  };

  const handleCancelar = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.conteudo}>
          <Text style={styles.titulo}>Tem certeza que deseja sair desta família?</Text>
          <Text style={styles.aviso}>Ao sair da família, você perderá acesso imediato a todas as metas, gastos e dados compartilhados. Você precisará de um novo código de convite para entrar novamente.</Text>
        </View>

        <View style={styles.botoes}>
          <TouchableOpacity 
            style={styles.botaoCancelar} 
            onPress={handleCancelar}
            disabled={isLoading}
          >
            <Text style={styles.textoBotao}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.botaoSair, isLoading && styles.botaoDisabled]} 
            onPress={handleSair}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color='#1D1252' />
            ) : (
              <Text style={styles.textoBotao}>Sair da Família</Text>
            )}
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    gap: 30,
  },
  conteudo: {
    gap: 15,
  },
  titulo: {
    color: '#333',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  aviso: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  botoes: {
    gap: 10,
  },
  botaoSair: {
    backgroundColor: 'red',
    padding: 10,
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  botaoDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  botaoCancelar: {
    backgroundColor: '#1D1252',
    padding: 10,
    paddingVertical: 12,
    borderRadius: 8,
  },
  textoBotao: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
