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
import HeaderBack from "../../components/headerBack";
import { buscarMetas, Meta } from "../../services/metasService";
import { auth } from "../../services/firebaseConfig";

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
          const data = await buscarMetas(userId);
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
      <ScrollView>
        <View>
          <Text style={styles.metas}>Metas Pessoais</Text>

          <View style={styles.boxPatrimonio}>
            <Text style={styles.patrimonio}>PATRIMÔNIO EM METAS</Text>
            <Text style={styles.valor}>
              R$ {patrimonioTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <View style={styles.boxRendimento}>
              <Ionicons name="trending-up" size={18} color="#1D1252" />
              <Text> Seu dinheiro trabalhando</Text>
            </View>
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
                  <TouchableOpacity>
                    <View style={styles.meta1}>
                      <View style={styles.iconMeta}>
                        <Ionicons name={getIconeCategoria(meta.categoria) as any} size={25} color="#1D1252" />
                      </View>
                      <View style={styles.textMeta}>
                        <Text style={styles.tituloMeta}>{meta.nomeMeta}</Text>
                        <Text style={styles.descricaoMeta}>
                          {meta.descricao ? meta.descricao.toUpperCase() : "SEM DESCRIÇÃO"}
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

          <Link href={"/metas/addmeta"} asChild>
            <TouchableOpacity style={styles.addMetaButton}>
              <Ionicons name="add-outline" size={25} color="#1D1252" />
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
  metas: {
    color: "white",
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    marginTop: 20,
  },
  boxPatrimonio: {
    backgroundColor: "white",
    borderRadius: 25,
    height: 150,
    width: "70%",
    padding: 20,
    marginTop: 30,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  patrimonio: {
    fontWeight: 200,
    marginRight: 100,
    fontSize: 10,
    marginBottom: 10,
  },
  valor: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#1D1252",
    marginRight: 63,
  },
  boxRendimento: {
    marginTop: 10,
    marginRight: 63,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginLeft: 20,
  },
  listaMetas: {
    marginTop: 25,
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 60,
  },
  suasMetas: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  meta1: {
    backgroundColor: "white",
    borderRadius: 15,
    width: 300,
    height: 110,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  iconMeta: {
    marginRight: 15,
    backgroundColor: "#e9e9e9",
    borderRadius: 10,
    padding: 3,
  },
  textMeta: {
    flex: 1,
  },
  tituloMeta: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1D1252",
  },
  descricaoMeta: {
    fontSize: 10,
    color: "#666",
    marginTop: 5,
  },
  valorMeta: {
    fontSize: 12,
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
    marginTop: 8,
  },
  progressValueStart: {
    fontSize: 12,
    color: "#1D1252",
    fontWeight: "600",
  },
  progressValueEnd: {
    fontSize: 12,
    color: "#666",
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
    fontSize: 12,
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
  addMeta: {
    backgroundColor: "white",
    marginTop: 30,
    borderRadius: 10,
    padding: 5,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  addMetaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
    marginTop: 30,
    borderRadius: 15,
    width: 300,
  },
  addMetaText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#1D1252",
  },
});
