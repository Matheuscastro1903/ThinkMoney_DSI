import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ConfirmarExclusao() {
  const router = useRouter();

  const handleExcluir = () => {
    // await api.deletarConta(); // excluir conta do firebase
    // await AsyncStorage.clear(); // excluir dados locais do usuário

    router.replace('/(auth)/login');
  };

  const handleCancelar = () => {
    router.back();
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Tem certeza que deseja excluir sua conta?</Text>
        <Text style={styles.aviso}>Esta ação é permanente e resultará na perda imediata de todos os seus dados e ativos digitais relacionados à sua conta no Thinkmoney.</Text>
      </View>

      <View style={styles.botoes}>
        <TouchableOpacity style={styles.botaoExcluir} onPress={handleExcluir}>
          <Text style={styles.textoBotao}>Excluir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoCancelar} onPress={handleCancelar}>
          <Text style={styles.textoBotao}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'white',
    gap: 30,
  },
  conteudo: {
    flex: 1,
    gap: 15,
  },
  titulo: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
  },
  aviso: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  botoes: {
    flex: 1,
    gap: 10,
  },
  botaoExcluir: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  botaoCancelar: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  textoBotao: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});