import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBack from "../../components/headerBack";


// Informacoes firebase
import { avatares } from '@/src/components/auth/escolhaavantar';
import { auth, db } from '@/src/services/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function App() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [controleAvancado, setControleAvancado] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dados = docSnap.data();
        setUsuario(dados);
        setControleAvancado(dados?.controleAvancado ?? false);
      }
    }

    carregarDados();
  }, []);

  async function toggleControleAvancado(valor: boolean) {
    setControleAvancado(valor);
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await updateDoc(doc(db, 'usuarios', uid), { controleAvancado: valor });
  }


  const avatarKey = (usuario?.avatar || 1) as keyof typeof avatares;
  const endereco = usuario?.endereco || usuario || {};

  let dataFormatada = "";
  if (usuario?.datanascimento) {
    if (typeof usuario.datanascimento === "string") {
      dataFormatada = usuario.datanascimento.split("-").reverse().join("/");
    } else if (typeof usuario.datanascimento.toDate === "function") {
      dataFormatada = usuario.datanascimento.toDate().toLocaleDateString("pt-BR");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack />
      <ScrollView>
        <View style={styles.safeArea}>
          <View style={styles.container2}>
            <Image
              source={avatares[avatarKey]}
              style={styles.avatar}
            />
            <Text style={styles.name}>{usuario?.nome}</Text>
            <Text style={styles.email}>{usuario?.email}</Text>
            <Text style={styles.address}>
              {endereco?.cidade}
              {endereco?.cidade && endereco?.logradouro ? " - " : ""}
              {endereco?.logradouro}
            </Text>
          </View>

          <View style={styles.container3}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="at-circle" size={24} color="grey" />
                <Text style={styles.rowLabel}>Nome de Usuário</Text>
              </View>
              <Text style={styles.rowValue}>{usuario?.username}</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="calendar-outline" size={24} color="grey" />
                <Text style={styles.rowLabel}>Data de Nascimento</Text>
              </View>
              <Text style={styles.rowValue}>{dataFormatada}</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="briefcase-outline" size={24} color="grey" />
                <Text style={styles.rowLabel}>Profissão</Text>
              </View>
              <Text style={styles.rowValue}>{usuario?.profissao}</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="location-outline" size={24} color="grey" />
                <Text style={styles.rowLabel}>Endereço</Text>
              </View>
              <Text style={styles.rowValue}>
                {endereco?.logradouro}
                {endereco?.numero ? `, ${endereco?.numero}` : ""}
              </Text>
            </View>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="call-outline" size={24} color="grey" />
                <Text style={styles.rowLabel}>Telefone</Text>
              </View>
              <Text style={styles.rowValue}>{usuario?.telefone}</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={24}
                  color="grey"
                />
                <Text style={styles.rowLabel}>Senha</Text>
              </View>
              <Text style={styles.rowValue}>•⁠•⁠•⁠•⁠•⁠•⁠</Text>
            </View>
          </View>

          <View style={styles.controleAvancadoCard}>
            <View style={styles.controleAvancadoLeft}>
              <Ionicons name="navigate-circle-outline" size={24} color="#4ADE80" />
              <View style={{ marginLeft: 12, flexShrink: 1 }}>
                <Text style={styles.controleAvancadoTitulo}>Controle Avançado</Text>
                <Text style={styles.controleAvancadoDesc}>
                  Monitora localização em tempo real e alerta zonas de risco
                </Text>
              </View>
            </View>
            <Switch
              value={controleAvancado}
              onValueChange={toggleControleAvancado}
              trackColor={{ false: '#3D3478', true: '#34D399' }}
              thumbColor={controleAvancado ? '#ffffff' : '#94A3B8'}
            />
          </View>

          <TouchableOpacity onPress={() => router.push("./config/editar")}>
            <View style={styles.container4}>
              <Ionicons name="create-outline" size={22} color="#000" />
              <Text>Editar conta</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("./config/confirmar-exclusao")}
          >
            <View style={styles.container5}>
              <Ionicons
                name="trash-outline"
                size={22}
                color="#000"
                style={{ color: "red" }}
              />
              <Text style={{ color: "red" }}>Excluir conta</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1252",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "black",
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 40,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#1D1252",
  },
  textHeader: {
    color: "white",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 20,
  },
  arrow: {
    marginRight: 30,
    height: 20,
    width: 20,
  },
  container2: {
    alignItems: "center",
    marginTop: 20,
  },
  name: {
    color: "white",
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 10,
  },
  email: {
    color: "white",
    marginBottom: 10,
  },
  address: {
    color: "white",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#4ADE80",
    marginBottom: 10,
  },
  container3: {
    marginTop: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 20,
    height: 250,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowLabel: {
    marginLeft: 8,
  },
  rowValue: {
    color: "black",
  },
  container4: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    marginLeft: 20,
    marginRight: 20,
    height: 40,
  },
  container5: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    marginLeft: 20,
    marginRight: 20,
    height: 40,
  },
  controleAvancadoCard: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#281E5D",
    borderRadius: 15,
    marginLeft: 20,
    marginRight: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  controleAvancadoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  controleAvancadoTitulo: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  controleAvancadoDesc: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 2,
  },
});
