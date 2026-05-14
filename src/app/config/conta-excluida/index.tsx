import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function ConfirmarExclusao() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.iconContainer}>
                <MaterialIcons name="check-circle-outline" size={64} color="#ffffff" />
        </View>

        <View style={styles.content}>
            <Text style={styles.titulo}>Conta excluída com sucesso</Text>
            <Text style={styles.aviso}>Seus dados e ativos foram removidos conforme solicitado.</Text>
        </View>

        <TouchableOpacity 
            style={styles.botao} 
            onPress={() => router.replace('/')}
        >
            <Text style={styles.textoBotao}>Voltar para o Início</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1D1252',
    gap: 30,
  },
  content: {
    gap: 5,
  },
  iconContainer: {
    backgroundColor: '#c6c6c61e',
    borderWidth: 1,
    borderColor: '#ffffff1a',
    padding: 20,
    borderRadius: 10,
  },
  titulo: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  aviso: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  botao: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 8,
    width: "100%",
  },
  textoBotao: {
    color: '#1D1252',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});