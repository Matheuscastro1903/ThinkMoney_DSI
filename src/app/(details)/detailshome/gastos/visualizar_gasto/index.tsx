import {
  Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBack from "@/src/components/headerBack";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../../../../services/firebaseConfig";
import { buscarGastos } from "../../../../../services/gastosService";

// 1. Adicione o import no topo
import { useRouter } from "expo-router";



// ── Tipos ────────────────────────────────────────────────────────────────────

interface Gasto {
  id: string;
  descricao: string;
  categoria: string;
  valor: number;
  data: Date | { toDate: () => Date }; // Date puro ou Firestore Timestamp
  fixo: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const icones: Record<string, React.ComponentProps<typeof Ionicons>["name"]> = {
  alimentacao: "basket",
  transporte:  "car",
  lazer:       "game-controller",
  educacao:    "school",
  saude:       "medkit",
  eletronicos: "desktop",
};

function toDate(data: Gasto["data"]): Date {
  if (data instanceof Date) return data;
  if (typeof (data as any).toDate === "function") return (data as any).toDate();
  return new Date(data as any);
}

function formatarValor(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(data: Gasto["data"]) {
  return toDate(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function capitalizarCategoria(cat: string) {
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}



export default function ListaGastos() {
  const [gastos, setGastos]       = useState<Gasto[]>([]);
  const [busca, setBusca]         = useState("");
  const [carregando, setCarregando] = useState(true);
    const router = useRouter();
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    buscarGastos(user.uid)
      .then(setGastos)
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  const filtrados = gastos.filter((g) =>
    g.descricao.toLowerCase().includes(busca.toLowerCase()) ||
    g.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  const totalMensal = filtrados.reduce((acc, g) => acc + g.valor, 0);

  return (
    
    <SafeAreaView style={styles.container}>
      <HeaderBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.registrarNovoGasto} onPress={() =>   router.push('/(details)/detailshome/gastos/criar_gasto')}>
            <Ionicons name="wallet-outline" size={22} color="#1D1252" />
            <Text style={styles.text5}>
                Criar novo gasto
            </Text>
        </TouchableOpacity>

        {/* ── Busca ── */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Procurar transação..."
            placeholderTextColor="#999"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        
        <View style={styles.card}>
          <Text style={styles.visaoLabel}>VISÃO GERAL MENSAL</Text>
          <Text style={styles.visaoValor}>{formatarValor(totalMensal)}</Text>
        </View>

        
        {carregando ? (
          <ActivityIndicator color="white" style={{ marginTop: 40 }} />
        ) : filtrados.length === 0 ? (
          <Text style={styles.vazio}>Nenhum gasto encontrado.</Text>
        ) : (
          filtrados.map((gasto) => (
            <TouchableOpacity key={gasto.id} style={styles.gastoCard} activeOpacity={0.8}
            onPress={() =>                              
                router.push({
                    pathname: "/(details)/detailshome/gastos/editar_gasto",  
                    params: { gasto: JSON.stringify(gasto) },
                })
                }>
              <View style={styles.gastoIconBox}>
                <Ionicons
                  name={icones[gasto.categoria] ?? "cash"}
                  size={22}
                  color="#1D1252"
                />
              </View>

              <View style={styles.gastoInfo}>
                <Text style={styles.gastoTitulo} numberOfLines={1} ellipsizeMode="tail">
                  {gasto.descricao}
                </Text>
                <Text style={styles.gastoCategoria}>
                  {capitalizarCategoria(gasto.categoria)}
                </Text>
              </View>

              <View style={styles.gastoValorBox}>
                <Text style={styles.gastoValor}>{formatarValor(gasto.valor)}</Text>
                <Text style={styles.gastoHora}>{formatarData(gasto.data)}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1252",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },

  // Busca
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 48,
    marginTop: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1D1252",
  },

  // Visão geral
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
  },
  visaoLabel: {
    fontSize: 11,
    color: "#888",
    letterSpacing: 1,
    marginBottom: 6,
  },
  visaoValor: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1D1252",
  },

  // Item de gasto
  gastoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  gastoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EEEAF8",
    justifyContent: "center",
    alignItems: "center",
  },
  gastoInfo: {
    flex: 1,
  },
  gastoTitulo: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1D1252",
  },
  gastoCategoria: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  gastoValorBox: {
    alignItems: "flex-end",
  },
  gastoValor: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1D1252",
  },
  gastoHora: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },

  // Vazio
  vazio: {
    color: "white",
    textAlign: "center",
    marginTop: 40,
    opacity: 0.6,
  },
  registrarNovoGasto: {
        height: 55,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        flexDirection: 'row',
        gap: 5,
    },
    text5: {
        fontSize: 15,
        color: '#1D1252',
        fontWeight: 'bold',
    },
});