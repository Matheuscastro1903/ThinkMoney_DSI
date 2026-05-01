import HeaderBack from "@/src/components/headerBack";
import LayoutNavBar from "@/src/components/layoutnavbar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth } from "@/src/services/firebaseConfig";
import { buscarLembretes } from "@/src/services/lembretesService";

type Lembrete = {
  id: string;
  nomeGasto: string;
  categoria: string;
  vencimento: string;
  valor: number;
  status: 'PENDENTE' | 'PAGO';
};

export default function VerTodosLembretes() {
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const user = auth.currentUser;
      if (!user) return;
      setCarregando(true);
      buscarLembretes(user.uid).then((dados) => {
        setLembretes(dados as Lembrete[]);
        setCarregando(false);
      });
    }, [])
  );

  const lembretesFiltrados = lembretes.filter((item) => {
    const bateFiltro =
      filtro === "Todos" ||
      (filtro === "Pendentes" && item.status === "PENDENTE") ||
      (filtro === "Pagos" && item.status === "PAGO");
    const bateBusca = item.nomeGasto.toLowerCase().includes(busca.toLowerCase());
    return bateFiltro && bateBusca;
  });

  const handleEditar = (item: Lembrete) => {
    router.push({
      pathname: "/detailshome/lembretes/attlembrete/page" as any,
      params: { id: item.id, titulo: item.nomeGasto, categoria: item.categoria, valor: item.valor.toString() },
    });
  };

  return (
    <LayoutNavBar>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <HeaderBack />
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
          <View style={styles.main}>
            <Text style={styles.text1}>Todos os Lembretes</Text>
            <Text style={styles.text2}>Gerencie suas obrigações financeiras mensais.</Text>
          </View>

          <View style={styles.buscaContainer}>
            <Ionicons name="search-outline" size={20} color="#94A3B8" />
            <TextInput
              style={styles.inputDeBusca}
              placeholder="Buscar lembrete..."
              placeholderTextColor="#94A3B8"
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          <View style={styles.filtrosContainer}>
            {["Todos", "Pendentes", "Pagos"].map((opcao) => (
              <TouchableOpacity
                key={opcao}
                style={filtro === opcao ? styles.filtroAtivo : styles.filtroInativo}
                onPress={() => setFiltro(opcao)}
              >
                <Text style={filtro === opcao ? styles.textoFiltroAtivo : styles.textoFiltroInativo}>{opcao}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {carregando ? (
            <ActivityIndicator color="#FFFFFF" style={{ marginTop: 40 }} />
          ) : lembretesFiltrados.map((item) => (
            <View key={item.id} style={styles.containerLembretes}>
              <View style={styles.lembreteIcone}>
                <Ionicons name="notifications-outline" size={20} color="#1D1252" />
              </View>
              <View style={styles.lembreteInfo}>
                <Text style={styles.lembreteTitulo}>{item.nomeGasto}</Text>
                <Text style={styles.lembreteSubtitulo}>{item.categoria} • VENCE {item.vencimento}</Text>
              </View>
              <View style={styles.lembreteDireita}>
                <Text style={styles.lembreteMoeda}>R$ <Text style={styles.lembreteValor}>{item.valor.toFixed(2).replace('.', ',')}</Text></Text>
                <View style={item.status === 'PAGO' ? styles.badgePago : styles.badgePendente}>
                  <Text style={item.status === 'PAGO' ? styles.badgeTextPago : styles.badgeTextPendente}>{item.status}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEditar(item)}>
                <Ionicons name="pencil-outline" size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </LayoutNavBar>
  );
}

const styles = StyleSheet.create({
  main: { flexDirection: "column", paddingLeft: 20, marginTop: 15 },
  text1: { color: "#FFFFFF", fontSize: 35, fontWeight: "bold" },
  text2: { color: "#A8A7D5", fontSize: 14, textAlign: "left", paddingTop: 5, paddingLeft: 5, height: 52, width: 290, letterSpacing: 0.6 },
  buscaContainer: { width: "90%", height: 50, backgroundColor: "#FFFFFF", borderRadius: 25, paddingHorizontal: 20, alignItems: "center", alignSelf: "center", marginTop: 20, flexDirection: "row" },
  inputDeBusca: { flex: 1, height: "100%", fontSize: 16, color: "#000000", marginLeft: 10 },
  filtrosContainer: { alignSelf: "center", flexDirection: "row", justifyContent: "center", gap: 12, marginTop: 24, marginBottom: 12 },
  filtroAtivo: { backgroundColor: "#000000", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  textoFiltroAtivo: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 },
  filtroInativo: { backgroundColor: "#F3F4F6", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  textoFiltroInativo: { color: "#6B7280", fontWeight: "bold", fontSize: 13 },
  containerLembretes: {
    height: 72, width: "90%", backgroundColor: "#FFFFFF", borderRadius: 8, alignSelf: "center",
    alignItems: "center", marginTop: 8, flexDirection: "row", justifyContent: "space-between",
    marginBottom: 8, paddingHorizontal: 16, gap: 12,
  },
  lembreteIcone: { width: 48, height: 48, borderRadius: 12, backgroundColor: "#F1F5F9", justifyContent: "center", alignItems: "center" },
  lembreteInfo: { flex: 1, marginLeft: 12 },
  lembreteTitulo: { fontSize: 16, color: "#1D1252", fontWeight: "bold" },
  lembreteSubtitulo: { fontSize: 10, color: "#94A3B8", marginTop: 4 },
  lembreteDireita: { alignItems: "flex-end" },
  lembreteMoeda: { fontSize: 12, color: "#1D1252", fontWeight: "bold" },
  lembreteValor: { fontSize: 18 },
  badgePendente: { backgroundColor: "#FEE2E2", paddingVertical: 3, paddingHorizontal: 8, borderRadius: 12, marginTop: 5 },
  badgeTextPendente: { color: "#B91C1C", fontSize: 9, fontWeight: "bold" },
  badgePago: { backgroundColor: "#E2E8F0", paddingVertical: 3, paddingHorizontal: 8, borderRadius: 12, marginTop: 5 },
  badgeTextPago: { color: "#475569", fontSize: 9, fontWeight: "bold" },
  editButton: { width: 32, height: 32, borderRadius: 8, backgroundColor: "#F1F5F9", justifyContent: "center", alignItems: "center", marginLeft: 8 },
});
