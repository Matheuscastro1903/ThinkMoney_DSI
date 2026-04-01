// arquivo destinado a guardar a "primeira tela da família"
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Familia() {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View></View>
        <Text>Bem Vindo À Gestão Familiar</Text>
        <Text>
          Você ainda não faz parte de um grupo familiar. Conecte-se com seus
          entes queridos para gerir o patrimônio em conjunto.
        </Text>
      </View>
      
      <View style={styles.body}>
        <TextInput placeholder="Digite o código da família" />

        <TouchableOpacity>
          <Text>Confirmar e Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text>Criar minha família</Text>
        </TouchableOpacity>

        <Text>
          Não tem um código? <Link>Saiba Mais</Link>
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
