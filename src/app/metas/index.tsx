import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import HeaderBack from "../../components/headerBack";
import { auth } from "../../services/firebaseConfig";
import { metasService, Meta } from "../../services/metasService";

export default function Metas() {
  const [metas, setMetas] = useState<(Meta & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadMetas() {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        try {
          setIsLoading(true);
          const data = await metasService.buscarTodas(userId);
          setMetas(data);
        } catch (error) {
          console.error("Erro ao buscar metas:", error);
        } finally {
          setIsLoading(false);
        }
      }

      loadMetas();
    }, [])
  );

  const patrimonioTotal = metas.reduce((acc, meta) => acc + meta.valorPoupado, 0);

  // Helper para os icones com base na categoria
  const getIconeCategoria = (categoria: string) => {
    switch (categoria) {
      case "viagem": return "airplane";
      case "casa": return "home";
      case "carro": return "car";
      case "reserva": return "wallet";
      default: return "star";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.mainContainer}>
          <Text style={styles.metas}>Metas Pessoais</Text>
          <Text style={styles.subtituloMetas}>Acompanhe e alcance seus grandes objetivos financeiros.</Text>
        </View>

        <View style={styles.boxPatrimonio}>
          <View style={styles.saldoHeader}>
            <View style={styles.saldoHeaderLeft}>
              <Ionicons name="rocket-outline" size={20} color="#34D399" />
              <Text style={styles.patrimonio}>PATRIMÔNIO EM METAS</Text>
            </View>
          </View>
          <Text style={styles.valor}>
            R$ {patrimonioTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <View style={styles.saldoFooter}>
            <Ionicons name="trending-up" size={16} color="#34D399" />
            <Text style={styles.saldoTrend}>Seu dinheiro trabalhando</Text>
          </View>
        </View>

        <View style={styles.listaMetas}>
          <Text style={styles.suasMetas}>Suas Metas</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
          ) : metas.length === 0 ? (
            <Text style={{ color: "white", marginTop: 20 }}>Nenhuma meta encontrada.</Text>
          ) : (
            metas.map((meta) => {
              const progresso = meta.valorTotal > 0 ? meta.valorPoupado / meta.valorTotal : 0;

              return (
                <Link key={meta.id} href={`/metas/editarmeta?id=${meta.id}`} asChild>
                  <TouchableOpacity style={{ width: "100%" }}>
                    <View style={styles.meta1}>
                      <View style={styles.iconMeta}>
                        <Ionicons name={getIconeCategoria(meta.categoria) as any} size={28} color="#1D1252" />
                      </View>
                      <View style={styles.textMeta}>
                        <Text style={styles.tituloMeta} numberOfLines={1} ellipsizeMode="tail">
                          {meta.nomeMeta}
                        </Text>

                        {/* Valores */}
                        <View style={styles.progressValues}>
                          <Text style={styles.progressValueStart}>
                            R$ {meta.valorPoupado.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Text>
                          <Text style={styles.progressValueEnd}>
                            de R$ {meta.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Text>
                        </View>

                        {/* Barra de Progresso */}
                        <View style={styles.progressBarContainer}>
                          <View
                            style={[
                              styles.progressBar,
                              { width: `${Math.min(progresso * 100, 100)}%` },
                            ]}
                          />
                        </View>
                      </View>

                      {/* Porcentagem no canto superior direito */}
                      <View style={styles.percentageContainer}>
                        <Text style={styles.percentageText}>
                          {Math.round(progresso * 100)}%
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Link>
              );
            })
          )}

          <LinearGradient
            colors={['transparent', '#3E346B', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.linhaSeparadora}>
          </LinearGradient>

          <Link href={"/metas/addmeta"} asChild>
            <TouchableOpacity style={styles.addMetaButton}>
              <Ionicons name="add-outline" size={20} color="#1D1252" />
              <Text style={styles.addMetaText}>Nova Meta Pessoal</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1D1252",
  },
  header: {
    backgroundColor: "black",
    height: 60,
    flexDirection: "column",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#1D1252",
    flex: 1,
  },
  mainContainer: {
    flexDirection: 'column',
    paddingLeft: 20,
    marginTop: 15,
  },
  metas: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: 'bold',
  },
  subtituloMetas: {
    color: '#A8A7D5',
    fontSize: 14,
    textAlign: 'left',
    paddingTop: 5,
    height: 52,
    width: 290,
    letterSpacing: 0.6,
  },
  boxPatrimonio: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  saldoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  saldoHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  patrimonio: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  valor: {
    fontSize: 38,
    fontWeight: '900',
    color: '#1D1252',
    letterSpacing: -1.5,
  },
  saldoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },
  saldoTrend: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  listaMetas: {
    marginTop: 25,
    paddingHorizontal: "5%",
    alignItems: "center",
    width: "100%",
  },
  suasMetas: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  meta1: {
    backgroundColor: "white",
    borderRadius: 15,
    width: "100%",
    height: 100,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  iconMeta: {
    marginRight: 15,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  textMeta: {
    flex: 1,
  },
  tituloMeta: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1D1252",
  },
  descricaoMeta: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 16,
  },
  valorMeta: {
    fontSize: 14,
    color: "#1D1252",
    marginTop: 8,
    fontWeight: "600",
  },
  progressContainer: {
    flexDirection: "column",
    marginTop: 15,
    gap: 8,
  },
  progressValues: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  progressValueStart: {
    fontSize: 14,
    color: "#1D1252",
    fontWeight: "bold",
  },
  progressValueEnd: {
    fontSize: 13,
    color: "#64748B",
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "#E5E5E5",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#1D1252",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    textAlign: "right",
  },
  percentageContainer: {
    position: "absolute",
    top: 10,
    right: 15,

    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  percentageText: {
    color: "#1D1252",
    fontSize: 14,
    fontWeight: "bold",
  },
  meta2: {
    backgroundColor: "white",
    borderRadius: 15,
    width: 300,
    height: 110,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  iconMeta2: {
    marginRight: 15,
    backgroundColor: "#e9e9e9",
    borderRadius: 10,
    padding: 3,
  },
  textMeta2: {
    flex: 1,
  },
  tituloMeta2: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1D1252",
  },
  descricaoMeta2: {
    fontSize: 10,
    color: "#666",
    marginTop: 5,
  },
  valorMeta2: {
    fontSize: 12,
    color: "#1D1252",
    marginTop: 8,
    fontWeight: "600",
  },
  progressContainer2: {
    flexDirection: "column",
    marginTop: 15,
    gap: 8,
  },
  progressValues2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  progressValueStart2: {
    fontSize: 12,
    color: "#1D1252",
    fontWeight: "600",
  },
  progressValueEnd2: {
    fontSize: 12,
    color: "#666",
  },
  progressBarContainer2: {
    height: 12,
    backgroundColor: "#E5E5E5",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 8,
  },
  progressBar2: {
    height: "100%",
    backgroundColor: "#1D1252",
    borderRadius: 4,
  },
  progressText2: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    textAlign: "right",
  },
  percentageContainer2: {
    position: "absolute",
    top: 10,
    right: 15,

    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  percentageText2: {
    color: "#1D1252",
    fontSize: 12,
    fontWeight: "bold",
  },
  addMetaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 10,
    width: "100%",
  },
  addMetaText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1D1252",
  },
  linhaSeparadora: {
    width: '80%',
    height: 1,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
    borderRadius: 25,
  },
});
