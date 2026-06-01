import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useFocusEffect } from "expo-router";

type Meta = {
    id: string,
    nomeMeta: string,
    categoria: string,
    valorPoupado: number,
    valorTotal: number,
    criador: string
}

const metasMock: (Meta & { id: string }) [] = [
  { id: "1", nomeMeta: "Viagem para Europa", categoria: "viagem", valorPoupado: 8000, valorTotal: 20000, criador: "João" },
  { id: "2", nomeMeta: "Casa própria", categoria: "casa", valorPoupado: 45000, valorTotal: 200000, criador: "Matheus" },
  { id: "3", nomeMeta: "Carro novo", categoria: "carro", valorPoupado: 12000, valorTotal: 35000, criador: "Leo" },
]

export default function Metas() {
  const [membro, setMembro] = useState("");
  const [metas, setMetas] = useState<(Meta & { id: string })[]>(metasMock);
  const [isLoading, setIsLoading] = useState(false);

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
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.nome_familia}>Família Silva</Text>

        <View style={styles.container2}>
          <View style={styles.badge1}>
            <Ionicons
              name="people"
              size={20}
              color="#1D1252"
              style={{ marginRight: 8 }}
            />
            <View style={styles.badgeContent}>
              <Text style={styles.badgeNumber}>03</Text>
              <Text style={styles.badgeLabel}>MEMBROS</Text>
            </View>
          </View>
          <View style={styles.badge2}>
            <Ionicons
              name="trophy"
              size={20}
              color="#1D1252"
              style={{ marginRight: 8 }}
            />
            <View style={styles.badgeContent}>
              <Text style={styles.badgeNumber}>05</Text>
              <Text style={styles.badgeLabel}>METAS</Text>
            </View>
          </View>
        </View>

        <View style={styles.container3}>
          <TouchableOpacity style={styles.option1}>
            <Ionicons
              name="people"
              size={15}
              color="#1D1252"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "#1D1252", fontWeight: "bold" }}>
              Família
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option2}>
            <Ionicons
              name="pencil"
              size={15}
              color="#1D1252"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "#1D1252", fontWeight: "bold" }}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option3}>
            <Ionicons
              name="flag"
              size={15}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "white", fontWeight: "bold" }}>Metas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option4}>
            <Ionicons
              name="stats-chart"
              size={15}
              color="#1D1252"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "#1D1252", fontWeight: "bold" }}>Dados</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerPicker}>
          <Picker
            selectedValue={membro}
            onValueChange={(value) => setMembro(value)}
            style={styles.picker}
            dropdownIconColor="#999"
            itemStyle={{ height: 40 }}
          >
            <Picker.Item label="Filtrar por membros" value="" />
            <Picker.Item label="João" value="joao" />
            <Picker.Item label="Maria" value="maria" />
          </Picker>
        </View>

        <View style={styles.boxPatrimonio}>
          <View style={styles.saldoHeader}>
            <View style={styles.saldoHeaderLeft}>
              <Text style={styles.patrimonio}>PATRIMÔNIO EM METAS</Text>
            </View>
          </View>
          <Text style={styles.valor}>
            R$ 45.000,00
          </Text>
          <View style={styles.saldoFooter}>
            <Ionicons name="trending-up" size={16} color="#34D399" />
            <Text style={styles.saldoTrend}> +R$ 2.450,00 este mês</Text>
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
                       <Link key={meta.id} href={{pathname: "/",
                        params: { id: meta.id }}} asChild>
                          <TouchableOpacity style={{ width: "100%" }}>
                            <View style={styles.meta1}>
                              <View style={styles.iconMeta}>
                                <Ionicons name={getIconeCategoria(meta.categoria) as any} size={28} color="#1D1252" />
                              </View>
                              <View style={styles.textMeta}>
                                <Text style={styles.tituloMeta} numberOfLines={1} ellipsizeMode="tail">
                                  {meta.nomeMeta}
                                </Text>

                                <Text style={{color: "#aaa", fontSize: 12}} numberOfLines={1} ellipsizeMode="tail">
                                    Criado por: {meta.criador}
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
        
                  <Link href="/" asChild>
                    <TouchableOpacity style={styles.addMetaButton}>
                      <Ionicons name="add-outline" size={20} color="#1D1252" />
                      <Text style={styles.addMetaText}>Nova Meta Familiar</Text>
                    </TouchableOpacity>
                  </Link> 
                </View>


      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1252",
    marginTop: -10,
  },
  nome_familia: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20
  },
  badge1: {
    backgroundColor: "white",
    borderRadius: 10,
    width: 140,
    height: 50,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    marginBottom: 15
  },
  badge2: {
    backgroundColor: "white",
    borderRadius: 10,
    width: 140,
    height: 50,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  badgeContent: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  badgeNumber: {
    fontWeight: "bold",
    color: "#1D1252",
  },
  badgeLabel: {
    fontSize: 12,
    color: "#1D1252",
  },
  container2: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    marginTop: 20,
  },
  container3: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 15,
  },
  option1: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "21%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  option2: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "21%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
    height: 40,
  },
  option3: {
    backgroundColor: "black",
    borderRadius: 10,
    width: "21%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
    height: 40,
  },
  option4: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "21%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
    height: 40,
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
  addMetaButton:{
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
  criador: {
    color: "black"
  }
});
