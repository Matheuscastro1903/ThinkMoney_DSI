import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFamiliaAcoes } from '@/src/hooks/familia/useFamiliaAcoes';
import { useUsuarioLogado } from '@/src/hooks/useUsuarioLogado';

export default function ConfirmarExclusaoFamilia() {
  const router = useRouter();
  const { familiaId } = useUsuarioLogado();
  const { excluirFamilia, isLoading } = useFamiliaAcoes();

  const handleExcluir = async () => {
    if (!familiaId) return;
    await excluirFamilia(familiaId);
  };

  const handleCancelar = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.conteudo}>
          <Text style={styles.titulo}>Tem certeza que deseja excluir esta família?</Text>
          <Text style={styles.aviso}>Esta ação é permanente e resultará na perda imediata de todos os dados, gastos e metas compartilhados. Esta ação não pode ser desfeita.</Text>
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
            style={[styles.botaoExcluir, isLoading && styles.botaoDisabled]} 
            onPress={handleExcluir}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color='#1D1252' />
            ) : (
              <Text style={styles.textoBotao}>Excluir Família</Text>
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
  botaoExcluir: {
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
