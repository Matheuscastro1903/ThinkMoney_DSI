import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function ConfirmarExclusao() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleExcluir = async () => {
    setIsLoading(true);
    try {
      // await api.deletarConta(); // excluir conta do firebase
      // await AsyncStorage.clear(); // excluir dados locais do usuário

      router.replace('./conta-excluida'); // redirecionar para tela de conta excluída
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      setIsLoading(false);
    }
  };

  const handleCancelar = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.conteudo}>
          <Text style={styles.titulo}>Tem certeza que deseja excluir sua conta?</Text>
          <Text style={styles.aviso}>Esta ação é permanente e resultará na perda imediata de todos os seus dados e ativos digitais relacionados à sua conta no Thinkmoney.</Text>
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
            style={[styles.botaoExcluir, isLoading && styles.botaoExcluirDisabled]} 
            onPress={handleExcluir}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color='#1D1252' />
            ) : (
              <Text style={styles.textoBotao}>Excluir</Text>
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
  botaoExcluirDisabled: {
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