import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBarFamilia from "@/src/components/tabs/familia/navbar/page";
import InfoCards from "@/src/components/tabs/familia/info-cards";
import { useFamiliaMetas } from "@/src/hooks/familia/useFamiliaMetas";
import { Meta } from "@/src/types/meta";

export default function Metas() {
  const {
    familyName,
    metasFiltradas,
    membros,
    membroFiltro,
    setMembroFiltro,
    patrimonioTotal,
    isLoading,
    familiaId,
  } = useFamiliaMetas()

  const getIconeCategoria = (categoria?: string) => {
    switch (categoria) {
      case "viagem": return "airplane";
      case "casa": return "home";
      case "carro": return "car";
      case "reserva": return "wallet";
      default: return "star";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
      <View>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{`Família ${familyName}`}</Text>

          <InfoCards/>

          <NavBarFamilia></NavBarFamilia>
          
        </View>

        <View style={styles.containerPicker}>
          <Picker
            selectedValue={membroFiltro}
            onValueChange={(value) => setMembroFiltro(value)}
            style={styles.picker}
            dropdownIconColor="#999"
            itemStyle={{ height: 40 }}
          >
            <Picker.Item label="Filtrar por membros" value="" />
            {membros.map((m, i) => (
              <Picker.Item key={m.email ?? i} label={m.nome} value={m.email} />
            ))}
          </Picker>
        </View>

        <View style={styles.boxPatrimonio}>
          <View style={styles.saldoHeader}>
            <View style={styles.saldoHeaderLeft}>
              <Text style={styles.patrimonio}>PATRIMÔNIO EM METAS</Text>
            </View>
          </View>
          <Text style={styles.valor}>
            R$ {patrimonioTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <View style={styles.saldoFooter}>
            <Ionicons name="trending-up" size={16} color="#34D399" />
            <Text style={styles.saldoTrend}> Patrimônio acumulado</Text>
          </View>
        </View>

        <View style={styles.listaMetas}>
          <Text style={styles.suasMetas}>Suas Metas</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
          ) : metasFiltradas.length === 0 ? (
            <Text style={{ color: "white", marginTop: 20 }}>Nenhuma meta encontrada.</Text>
          ) : (
            (metasFiltradas as Meta[]).map((meta) => {
              const valorPoupado = meta.valorPoupado ?? 0
              const valorTotal = meta.valorTotal ?? 0
              const progresso = valorTotal > 0 ? valorPoupado / valorTotal : 0;

              return (
                <Link key={meta.id} href={{
                  pathname: "/(details)/detailshome/metas/updatemetas" as any,
                  params: { id: meta.id, familiaId }
                }} asChild>
                  <TouchableOpacity style={{ width: "100%" }}>
                    <View style={styles.meta1}>
                      <View style={styles.iconMeta}>
                        <Ionicons name={getIconeCategoria(meta.categoria) as any} size={28} color="#1D1252" />
                      </View>
                      <View style={styles.textMeta}>
                        <Text style={styles.tituloMeta} numberOfLines={1} ellipsizeMode="tail">
                          {meta.nomeMeta}
                        </Text>

                        <Text style={{ color: "#aaa", fontSize: 12 }} numberOfLines={1} ellipsizeMode="tail">
                          Criado por: {meta.nomeCriador}
                        </Text>

                        <View style={styles.progressValues}>
                          <Text style={styles.progressValueStart}>
                            R$ {valorPoupado.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Text>
                          <Text style={styles.progressValueEnd}>
                            de R$ {valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Text>
                        </View>

                        <View style={styles.progressBarContainer}>
                          <View
                            style={[
                              styles.progressBar,
                              { width: `${Math.min(progresso * 100, 100)}%` },
                            ]}
                          />
                        </View>
                      </View>

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

          <Link href={{
            pathname: "/(details)/detailshome/metas/cadastrometas",
            params: { familiaId: familiaId }
          }} asChild>
            <TouchableOpacity style={styles.addMetaButton}>
              <Ionicons name="add-outline" size={20} color="#1D1252" />
              <Text style={styles.addMetaText}>Nova Meta Familiar</Text>
            </TouchableOpacity>
          </Link>
        </View>


      </View>
    </ScrollView>
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1D1252',
  },
  container: {
    flex: 1,
    backgroundColor: "#1D1252",
    marginTop: -10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 24,
  },
  containerPicker: {
    backgroundColor: "#9E9E9E",
    borderRadius: 12,
    width: "70%",
    alignSelf: "center",
    marginTop: 16,
    overflow: "hidden",
    height: 30,
    justifyContent: "center",
    color: "white"
  },
  picker: {
    color: "white",
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
    fontSize: 30,
    fontWeight: '600',
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
    flex: 1
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
  tituloMeta: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1D1252",
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
  addMetaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 10,
    width: "100%",
    marginBottom: 15
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
