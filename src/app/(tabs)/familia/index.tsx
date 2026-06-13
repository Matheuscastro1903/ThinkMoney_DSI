import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useUsuarioLogado } from '@/src/hooks/useUsuarioLogado';

export default function FamiliaIndex() {
  const { familiaId, isLoading } = useUsuarioLogado();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  // Se o usuário possui um familiaId, redireciona para a home da família
  if (familiaId) {
    return <Redirect href="/familia/home" />;
  }

  // Se não possui, redireciona para a tela de criar/entrar em uma família
  return <Redirect href="/familia/entrar" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1D1252',
  },
});
