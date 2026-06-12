import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBack from "@/src/components/headerBack";

import { ControllerBuscarListaPorId } from "@/src/hooks/useLBuyList";

//Importações dos Serviços e Classes
import { auth } from "@/src/services/firebaseConfig";
import { toBuyListService } from "@/src/services/buyList";
import { ListaCompra,ProdutoCompra } from "@/src/models/lista";


const CATEGORIAS = [
  { key: "alimentacao", label: "Alimentação", icon: "restaurant" },
  { key: "limpeza", label: "Limpeza", icon: "sparkles" },
  { key: "remedios", label: "Remédios", icon: "medkit" },
  { key: "feira", label: "Feira", icon: "basket" },
];

const formatarMoeda = (valor: string) => {
  const apenasNumeros = valor.replace(/\D/g, "");
  if (apenasNumeros === "") return "";
  const valorDecimal = parseFloat(apenasNumeros) / 100;
  return valorDecimal.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function UpdateCompras() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idLista = params.id as string; //recebe o id vindo da rota

  
  const [isFetching, setIsFetching] = useState(true); //Trava a tela inteira na chegada inicial
  const [isLoading, setIsLoading] = useState(false);  //Trava apenas os botões na hora de salvar

  
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [tituloCompra, setTituloCompra] = useState("");
  const [localCompra, setLocalCompra] = useState("");
  const [descricao, setDescricao] = useState("");
  const [listaProdutos, setListaProdutos] = useState<ProdutoCompra[]>([]);

  
  //ESTADOS TEMPORÁRIOS (Para o input de adicionar/editar um produto)
  const [produtoEditandoId, setProdutoEditandoId] = useState<string | null>(null);
  const [nomeProduto, setNomeProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");

  
  useEffect(() => {
    async function carregarLista() {
      const userId = auth.currentUser?.uid;
      
      //Se não tem usuário ou não veio ID na rota, aborta para não quebrar a tela
      if (!userId || !idLista) {
        setIsFetching(false);
        return;
      }

      try {
        // Busca o JSON bruto do banco através da subcoleção segura
        const resultado = await ControllerBuscarListaPorId(userId, idLista);

        console.log(resultado.dados)
        if (resultado.sucesso && resultado.dados) {
          //instanciando o objeto
          const listaInstanciada = ListaCompra.fromFirestore(resultado.dados);

          //Pega os dados validados da instância e joga para os estados do React
          setTituloCompra(listaInstanciada.titulo);
          setCategoriaSelecionada(listaInstanciada.categoria);
          setDescricao(listaInstanciada.descricao || "");
          // Assumindo que você incluiu 'localCompra' na sua classe
          setLocalCompra(listaInstanciada.localCompra || ""); 
          
          // O array de produtos já veio instanciado por dentro da classe!
          setListaProdutos(listaInstanciada.produtos);
        } else {
          Alert.alert("Aviso", resultado.mensagem as string);
          router.back(); //retorna o usuário para página anterior
        }
      } catch (error) {
        console.error("Erro ao carregar lista de compras", error);
        Alert.alert("Erro", "Falha ao conectar com o banco de dados.");
      } finally {
        // Libera a tela para renderizar o visual
        setIsFetching(false);
      }
    }

    carregarLista();
  }, [idLista]); //Só roda novamente se o id mudar(o que provavelmente não irá  acontecer)

  
  const handleIniciarEdicaoProduto = (produto: ProdutoCompra) => {
    setProdutoEditandoId(produto.id);
    setNomeProduto(produto.nome);
    setQuantidade(produto.quantidade > 0 ? produto.quantidade.toString() : "");
    const valorParaMascara = (produto.valor * 100).toFixed(0);
    setValorUnitario(formatarMoeda(valorParaMascara));
  };

  const handleCancelarEdicaoProduto = () => {
    setProdutoEditandoId(null);
    setNomeProduto("");
    setQuantidade("");
    setValorUnitario("");
  };

  const handleSalvarProduto = () => {
    if (!nomeProduto.trim()) {
      Alert.alert("Atenção", "O nome do produto não pode ficar em branco.");
      return;
    }

    const valorNumerico = Number(valorUnitario.replace(/\./g, '').replace(',', '.')) || 0;
    const qtdNumerica = Number(quantidade) || 0;

    if (produtoEditandoId) {
      //atualiza apenas o valor em relação ao produto especifico
      setListaProdutos(
        listaProdutos.map((prod) =>
          prod.id === produtoEditandoId
            ? { ...prod, nome: nomeProduto, quantidade: qtdNumerica, valor: valorNumerico } as ProdutoCompra
            : prod
        )
      );
      setProdutoEditandoId(null);
    } else {
      //Cria um objeto literal puro e insere no estado
      const novoProduto = {
        id: Math.random().toString(36).substring(2, 10), 
        nome: nomeProduto, 
        quantidade: qtdNumerica, 
        valor: valorNumerico, 
        comprado: false
      } as ProdutoCompra;
      
      setListaProdutos([...listaProdutos, novoProduto]);
    }
    
    //Reseta os estados de texto
    setNomeProduto("");
    setQuantidade("");
    setValorUnitario("");
  };

  const handleRemoverProduto = (idProduto: string) => {
    setListaProdutos(listaProdutos.filter(prod => prod.id !== idProduto));
  };

  const handleToggleComprado = (idProduto: string) => {
    //inverte o estado booleano do objeto literal
    setListaProdutos(
      listaProdutos.map((prod) =>
        prod.id === idProduto 
          ? { ...prod, comprado: !prod.comprado } as ProdutoCompra 
          : prod
      )
    );
  };


  // ----------------------------------------------------------------------
  // 6. FUNÇÃO FINAL: ATUALIZAR LISTA NO BANCO DE DADOS
  // ----------------------------------------------------------------------
  const handleAtualizarLista = async () => {
    
    const userId = auth.currentUser?.uid;

    if (!userId) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    if (!categoriaSelecionada) {
      Alert.alert("Atenção", "Por favor, selecione a categoria da compra.");
      return; 
    }

    if (!tituloCompra.trim()) {
    Alert.alert("Atenção", "Dê um título para a sua lista de compras.");
    return;
  }
    if (!localCompra.trim()) {
    Alert.alert("Atenção", "Coloque um local para a sua lista de compras.");
    return;
  }

    
    

    setIsLoading(true); // Trava os botões
    
    try {
      // AQUI ENTRARÁ A LÓGICA DO PRÓXIMO PASSO
      // 1. Instanciar a classe ListaCompra passando os estados atuais
      // 2. Chamar o service para mandar para o banco
      // 3. Mostrar Alert de sucesso e dar router.back()
      
      console.log("Preparando para atualizar...", { tituloCompra, categoriaSelecionada, listaProdutos });
      
      // Simulando delay de rede para você ver o loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert("Próximo Passo", "A função de envio para o banco será conectada aqui!");

    } catch (error) {
      console.error("Erro ao atualizar lista:", error);
      Alert.alert("Erro", "Ocorreu um erro ao salvar as alterações.");
    } finally {
      setIsLoading(false); // Destrava os botões
    }
  };

  // ----------------------------------------------------------------------
  // 7. FUNÇÃO FINAL: EXCLUIR LISTA
  // ----------------------------------------------------------------------
  const handleExcluirLista = () => {
    Alert.alert(
      "Excluir Lista",
      "Tem certeza que deseja excluir esta lista inteira? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            // AQUI ENTRARÁ O SERVICE DE EXCLUSÃO
            console.log("Excluindo lista...");
          },
        },
      ]
    );
  };

  // ----------------------------------------------------------------------
  // RENDERIZAÇÃO DE SEGURANÇA (Enquanto busca do banco)
  // ----------------------------------------------------------------------
  if (isFetching) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#1D1252" />
      </View>
    );
  }

  // ----------------------------------------------------------------------
  // RENDERIZAÇÃO DA VIEW
  // ----------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ marginBottom: -10}}>
          <HeaderBack />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Refine suas compras</Text>

          <Text style={styles.subtitle}>
            Atualize sua lista e produtos para não esquecer de nada importante.
          </Text>

          <View style={styles.card}>
            
            {/* --- SEÇÃO: CATEGORIA --- */}
            <Text style={styles.labelSection}>TIPO DE LISTA</Text>
            <View style={styles.gridContainer}>
              {CATEGORIAS.map((cat) => {
                const ativo = categoriaSelecionada === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    style={[styles.categoryCard, ativo && styles.categoryCardActive]}
                    onPress={() => setCategoriaSelecionada(cat.key)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={26}
                      color={ativo ? "#FFFFFF" : "#1D1252"}
                    />
                    <Text style={[styles.categoryText, ativo && styles.categoryTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.separator} />

            {/* --- SEÇÃO: PRODUTOS --- */}
            <View style={styles.sectionHeader}>
              <Text style={styles.labelSection}>PRODUTOS DA LISTA</Text>
            </View>

            <Text style={styles.label}>NOME DO PRODUTO</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputText}
                placeholder="Ex: Arroz Integral"
                placeholderTextColor="#BBBBBB"
                value={nomeProduto}
                onChangeText={setNomeProduto}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>QUANTIDADE</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.inputText}
                    placeholder="Opcional"
                    placeholderTextColor="#BBBBBB"
                    keyboardType="numeric"
                    value={quantidade}
                    onChangeText={setQuantidade}
                  />
                </View>
              </View>

              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>VALOR UNITÁRIO</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.currencyPrefix}>R$</Text>
                  <TextInput
                    style={styles.inputText}
                    placeholder="0,00"
                    placeholderTextColor="#BBBBBB"
                    keyboardType="numeric"
                    value={valorUnitario}
                    onChangeText={(texto) => setValorUnitario(formatarMoeda(texto))}
                  />
                </View>
              </View>
            </View>

            {produtoEditandoId ? (
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.buttonAdicionar, styles.buttonCancelar]} 
                  activeOpacity={0.85}
                  onPress={handleCancelarEdicaoProduto}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.buttonAdicionar, { flex: 1, marginBottom: 0 }]} 
                  activeOpacity={0.85}
                  onPress={handleSalvarProduto}
                >
                  <Text style={styles.buttonText}>Salvar Edição</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.buttonAdicionar} 
                activeOpacity={0.85}
                onPress={handleSalvarProduto}
              >
                <Text style={styles.buttonText}>Adicionar Produto</Text>
              </TouchableOpacity>
            )}

            {/* Renderização da lista de produtos mantida igual */}
            {listaProdutos.map((produto) => (
              <View 
                key={produto.id} 
                style={[
                  styles.productItem, 
                  produto.comprado && styles.productItemComprado,
                  produtoEditandoId === produto.id && styles.productItemEditando 
                ]}
              >
                <View style={styles.productInfoLeft}>
                  <Text style={[styles.productName, produto.comprado && styles.productTextRiscado]}>
                    {produto.nome}
                  </Text>
                  <Text style={[styles.productDetails, produto.comprado && styles.productTextRiscado]}>
                    {produto.quantidade ? `${produto.quantidade} unidade(s)` : 'Sem qtd'} • R$ {formatarMoeda((produto.valor * 100).toFixed(0))}/un
                  </Text>
                </View>
                
                <View style={styles.productInfoRight}>
                  <TouchableOpacity onPress={() => handleToggleComprado(produto.id)}>
                    <Ionicons 
                      name={produto.comprado ? "checkmark-circle" : "checkmark-circle-outline"} 
                      size={24} 
                      color={produto.comprado ? "#4CAF50" : "#BBBBBB"} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleIniciarEdicaoProduto(produto)}>
                    <Ionicons name="pencil-outline" size={20} color="#888888" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemoverProduto(produto.id)}>
                    <Ionicons name="trash-outline" size={20} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.separator} />

            {/* --- SEÇÃO: INFORMAÇÕES GERAIS --- */}
            <Text style={styles.labelSection}>INFORMAÇÕES DA LISTA</Text>

            <Text style={styles.label}>TÍTULO DA COMPRA</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="cart-outline" size={20} color="#BBBBBB" style={styles.inputIcon} />
              <TextInput
                style={styles.inputText}
                placeholder="Ex: Frutas e Verduras"
                placeholderTextColor="#BBBBBB"
                value={tituloCompra}
                onChangeText={setTituloCompra}
              />
            </View>
            
            <Text style={styles.label}>LOCAL DA COMPRA</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#BBBBBB" style={styles.inputIcon} />
              <TextInput
                style={styles.inputText}
                placeholder="Onde será comprado?"
                placeholderTextColor="#BBBBBB"
                value={localCompra}
                onChangeText={setLocalCompra}
              />
            </View>

            <Text style={styles.label}>DESCRIÇÃO (OPCIONAL)</Text>
            <View style={[styles.inputWrapper, styles.inputMultiline]}>
              <TextInput
                style={[styles.inputText, { flex: 1 }]}
                placeholder="Detalhes extras da compra..."
                placeholderTextColor="#BBBBBB"
                multiline
                numberOfLines={3}
                value={descricao}
                onChangeText={setDescricao}
              />
            </View>

            <View style={styles.separator} />

            {/* --- SEÇÃO: AÇÕES FINAIS --- */}
            <TouchableOpacity 
              style={[styles.buttonAtualizar, isLoading && { opacity: 0.7 }]} 
              activeOpacity={0.85}
              onPress={handleAtualizarLista}
              disabled={isLoading || isFetching}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Salvar alterações</Text>
                  <Ionicons name="save-outline" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.buttonExcluir} 
              activeOpacity={0.85} 
              onPress={handleExcluirLista}
              disabled={isFetching}
            >
              <Text style={styles.buttonText}>Excluir Lista Inteira</Text>
              <Ionicons name="trash-outline" size={20} color="white" />
            </TouchableOpacity>

            <Link href={"/"} asChild>
              <TouchableOpacity style={styles.cancelar}>
                <Text style={styles.textocancelar}>Voltar</Text>
              </TouchableOpacity>
            </Link>

            <Text style={styles.footerText}>
              THINKMONEY SECURE INFRASTRUCTURE
            </Text>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// O restante dos estilos (styles) é idêntico aos arquivos que analisamos:
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 0,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#1D1252",
    marginTop: 8,
    lineHeight: 36,
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
    lineHeight: 20,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  labelSection: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1D1252",
    letterSpacing: 1,
    marginBottom: 12,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  categoryCard: {
    width: "47%",
    paddingVertical: 20,
    backgroundColor: "#F0F0F5",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  categoryCardActive: {
    backgroundColor: "#1D1252",
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1D1252",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#888",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },

  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },

  halfInputContainer: {
    flex: 1,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F8",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },

  inputMultiline: {
    alignItems: "flex-start",
    minHeight: 80,
    paddingTop: 12,
  },

  currencyPrefix: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1D1252",
    marginRight: 8,
  },

  inputIcon: {
    marginRight: 8,
  },

  inputText: {
    flex: 1,
    fontSize: 14,
    color: "#1D1252",
  },

  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    justifyContent: 'center',
  },

  buttonAdicionar: {
    backgroundColor: "#1D1252",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    width: '50%',
    alignSelf: 'center',
    marginBottom: 24,
  },

  buttonCancelar: {
    backgroundColor: "#888888",
    flex: 1,
    marginBottom: 0,
  },

  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },

  productItemComprado: {
    backgroundColor: '#F9F9F9',
    borderColor: '#E0E0E0',
  },

  productItemEditando: {
    borderColor: '#1D1252',
    borderWidth: 1.5,
  },

  productTextRiscado: {
    textDecorationLine: 'line-through',
    color: '#BBBBBB',
  },

  productInfoLeft: {
    flex: 1,
  },

  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: "#1D1252",
    marginBottom: 4,
  },

  productDetails: {
    fontSize: 12,
    color: '#888',
  },

  productInfoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  separator: {
    height: 1,
    backgroundColor: "#F0F0F5",
    marginVertical: 20,
    width: "100%",
  },

  buttonAtualizar: {
    backgroundColor: "#1D1252",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    marginBottom: 16,
  },

  buttonExcluir: {
    backgroundColor: "#D32F2F",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    marginBottom: 16,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  cancelar: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },

  textocancelar: {
    color: "#888",
    fontWeight: "600",
  },

  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: "#BBBBBB",
    letterSpacing: 1,
  },
});