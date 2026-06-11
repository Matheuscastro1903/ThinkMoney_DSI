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

import HeaderBack from "@/src/components/headerBack";
import { auth } from "@/src/services/firebaseConfig";
import { ControllerBuscarResumoListas } from "@/src/hooks/useLBuyList";
import { toBuyListService, ResumoListaCompra } from "@/src/services/buyList";

export default function ListasComprasHome() {
  const [listas, setListas] = useState<ResumoListaCompra[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  //se utilizasse um useEffect padrão,só iria carregar da primeira vez
  //já que se entrasse em uma aba e voltasse,a tela ficaria apenas "escondida"
  //por isso usamos o useFocusEffect para que toda vez que a tela aparececr
  //chama novamente a requisição
  useFocusEffect(
  useCallback(() => {
    async function loadListas() {
      const userId = auth.currentUser?.uid;
      
      setIsLoading(true);
      
      //chamada do Controller
      const resposta = await ControllerBuscarResumoListas(userId);
      
      if (resposta.sucesso && resposta.dados) {
        // Alimenta a tela com os dados
        setListas(resposta.dados);
      } else {
        // Se deu erro na validação ou no banco, o Controller avisa
        console.error(resposta.mensagem);
        // Aqui você poderia colocar um Alert.alert("Ops", resposta.mensagem);
      }
      
      setIsLoading(false);
    }

    loadListas();
    // O React guarda essa função num cofre.
  // Ela não será recriada em renderizações desnecessárias.
  }, [])
);

  const gastoTotal = listas.reduce((acc, lista) => acc + lista.totalCompra, 0);

  const getIconeCategoria = (categoria: string) => {
    switch (categoria) {
      case "alimentacao": return "restaurant";
      case "limpeza": return "sparkles";
      case "remedios": return "medkit";
      case "feira": return "basket";
      default: return "cart"; 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        
        <View style={styles.mainContainer}>
          <Text style={styles.tituloPagina}>Compras da Semana</Text>
          <Text style={styles.subtituloPagina}>Organize seus gastos e vá ao mercado com clareza.</Text>
        </View>

        

    
        <View style={styles.containerListas}>
          <Text style={styles.tituloSuasListas}>Suas Listas</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
          ) : listas.length === 0 ? (
            <Text style={{ color: "white", marginTop: 20 }}>Nenhuma lista encontrada.</Text>
          ) : (
            listas.map((lista) => {
              return (
            
                <Link 
                  key={lista.id} 
                  href={{
                    pathname: "/(details)/detailshome/metas/updatemetas", // Caminho temporário conforme solicitado
                    params: { id: lista.id }
                  }} 
                  asChild
                >
                  <TouchableOpacity style={{ width: "100%" }}>
                    
                    <View style={styles.cardLista}>
                      <View style={styles.containerIcone}>
                        <Ionicons name={getIconeCategoria(lista.categoria) as any} size={28} color="#1D1252" />
                      </View>
                      
                      <View style={styles.containerTextoLista}>
                        <Text style={styles.tituloLista} numberOfLines={1} ellipsizeMode="tail">
                          {lista.titulo}
                        </Text>

                        <View style={styles.progressValues}>
                          <Text style={styles.progressValueStart}>
                            R$ {lista.totalCompra.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Text>
                          <Text style={[styles.progressValueEnd, { textTransform: 'capitalize' }]}>
                            {lista.categoria}
                          </Text>
                        </View>
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

          
          <Link href={"/(details)/detailshome/buyList/createList" as any} asChild>
            <TouchableOpacity style={styles.botaoAdicionarLista}>
              <Ionicons name="add-outline" size={20} color="#1D1252" />
              <Text style={styles.textoBotaoAdicionar}>Nova Lista de Compras</Text>
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
    backgroundColor: "#1D1252" 
  },
  header: { 
    backgroundColor: "black", 
    height: 60, 
    flexDirection: "column", 
    justifyContent: "center" 
  },
  container: { 
    backgroundColor: "#1D1252", 
    flex: 1 
  },
  mainContainer: { 
    flexDirection: 'column', 
    paddingLeft: 20, 
    marginTop: 15 
  },
  
  tituloPagina: { 
    color: '#FFFFFF', 
    fontSize: 35, 
    fontWeight: 'bold' 
  },
  subtituloPagina: { 
    color: '#A8A7D5', 
    fontSize: 14, 
    textAlign: 'left', 
    paddingTop: 5, 
    height: 52, 
    width: 290, 
    letterSpacing: 0.6 
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
    elevation: 8 
  },
  saldoHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  saldoHeaderLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  patrimonio: { 
    fontSize: 12, 
    color: '#64748B', 
    fontWeight: 'bold', 
    letterSpacing: 1.5 
  },
  valor: { 
    fontSize: 38, 
    fontWeight: '900', 
    color: '#1D1252', 
    letterSpacing: -1.5 
  },
  saldoFooter: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 16, 
    paddingTop: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#F1F5F9', 
    gap: 6 
  },
  saldoTrend: { 
    fontSize: 12, 
    color: '#64748B', 
    fontWeight: '600' 
  },
  
  containerListas: { 
    marginTop: 25, 
    paddingHorizontal: "5%", 
    alignItems: "center", 
    width: "100%" 
  },
  tituloSuasListas: { 
    color: "white", 
    fontWeight: "bold", 
    fontSize: 20, 
    alignSelf: "flex-start", 
    marginBottom: 5 
  },
 
  cardLista: { 
    backgroundColor: "white", 
    borderRadius: 15, 
    width: "100%", 
    height: 100, 
    marginTop: 15, 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 15 
  },
  containerIcone: { 
    marginRight: 15, 
    backgroundColor: "#F1F5F9", 
    borderRadius: 12, 
    width: 50, 
    height: 50, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  containerTextoLista: { 
    flex: 1 
  },
  tituloLista: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#1D1252" 
  },
  
  progressValues: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: 10 
  },
  progressValueStart: { 
    fontSize: 16, 
    color: "#1D1252", 
    fontWeight: "bold" 
  },
  progressValueEnd: { 
    fontSize: 13, 
    color: "#64748B" 
  },
  
  botaoAdicionarLista: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "#FFFFFF", 
    borderRadius: 12, 
    paddingVertical: 16, 
    gap: 10, 
    width: "100%" 
  },
  textoBotaoAdicionar: { 
    fontSize: 15, 
    fontWeight: "bold", 
    color: "#1D1252" 
  },
  linhaSeparadora: { 
    width: '80%', 
    height: 1, 
    alignSelf: 'center', 
    marginTop: 40, 
    marginBottom: 40, 
    borderRadius: 25 
  },
});