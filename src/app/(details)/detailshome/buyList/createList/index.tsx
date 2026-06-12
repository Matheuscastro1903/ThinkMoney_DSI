import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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
import { auth } from "@/src/services/firebaseConfig";
import { toBuyListService } from "@/src/services/buyList";

import InputDate from "@/src/components/details/metas/inputdata";
import HeaderBack from "@/src/components/headerBack";
import { Timestamp } from 'firebase/firestore';

const CATEGORIAS = [
  { key: "alimentacao", label: "Alimentação", icon: "restaurant" },
  { key: "limpeza", label: "Limpeza", icon: "sparkles" },
  { key: "remedios", label: "Remédios", icon: "medkit" },
  { key: "feira", label: "Feira", icon: "basket" },
];

export interface ListaCompra {
  titulo: string;
  categoria: string;
  descricao?: string;
  localCompra:string
}

export interface ProdutoCompra {
  id: string;
  nome: string;
  quantidade: number;
  valor: number; 
  comprado: boolean;
}

const formatarMoeda = (valor: string) => {
  //troca qualquer valor que não seja numérico por ""
  const apenasNumeros = valor.replace(/\D/g, "");
  if (apenasNumeros === "") return "";
  //transoformando em valor decimal
  const valorDecimal = parseFloat(apenasNumeros) / 100;
  return valorDecimal.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function CriarLista() {
  const router = useRouter();
  
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [localCompra, setLocalCompra] = useState("");
  const [tituloCompra, setTituloCompra] = useState("");
  const [descricao, setDescricao] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");
  
  
  const [quantidade, setQuantidade] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");

  const [listaProdutos, setListaProdutos] = useState<ProdutoCompra[]>([]);
  const [produtoEditandoId, setProdutoEditandoId] = useState<string | null>(null);

  //Prepara a tela para edição
  const handleIniciarEdicao = (produto: ProdutoCompra) => {
    setProdutoEditandoId(produto.id);
    setNomeProduto(produto.nome); 
    
    
    setQuantidade(produto.quantidade > 0 ? produto.quantidade.toString() : "");

    
    const valorParaMascara = (produto.valor * 100).toFixed(0);
    setValorUnitario(formatarMoeda(valorParaMascara));
  };

  //Cancela a edição e limpa os campos
  const handleCancelarEdicao = () => {
    setProdutoEditandoId(null);
    setNomeProduto("");
    
    
    setQuantidade("");
    setValorUnitario("");
  };

  //função refatorada que serve para criar e para salvar Edição
  const handleSalvarProduto = () => {
    if (!nomeProduto.trim()) {
      Alert.alert("Atenção", "O nome do produto não pode ficar em branco.");
      return;
    }

    if (produtoEditandoId) {
      setListaProdutos(
        listaProdutos.map((prod) =>
          prod.id === produtoEditandoId
            ? {
                ...prod, 
                nome: nomeProduto,
                
                
                // Se o usuário editou a quantidade ("5"), convertemos para Number.
                // Se ficou vazio, salvamos como 0.
                
                quantidade: Number(quantidade) || 0,
                
                //transformando o valor
                valor: Number(valorUnitario.replace(/\./g, '').replace(',', '.')) || 0,
              }
            : prod
        )
      );
      setProdutoEditandoId(null);
    } else {
      const novoProduto: ProdutoCompra = {
        id: Math.random().toString(),
        nome: nomeProduto,
        //tranformando o valor que veio como string do estado
        quantidade: Number(quantidade) || 0, 
        valor: Number(valorUnitario.replace(/\./g, '').replace(',', '.')) || 0,
        comprado: false,
      };
      setListaProdutos([...listaProdutos, novoProduto]);
    }
    
    //resetando os valroes
    setNomeProduto("");
    setQuantidade("");
    setValorUnitario("");
  };

  const handleRemoverProduto = (id: string) => {
    setListaProdutos(listaProdutos.filter(prod => prod.id !== id));
  };

  const handleToggleComprado = (id: string) => {
    setListaProdutos(
      listaProdutos.map((prod) =>
        prod.id === id ? { ...prod, comprado: !prod.comprado } : prod
      )
    );
  };

  async function CadastrarLista(){
    console.log("Criar lista");
    
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
    
    
    const inforBasicas: ListaCompra = {
      titulo: tituloCompra,
      categoria: categoriaSelecionada, 
      descricao: descricao,
      localCompra:localCompra  
    };

    const resultado = await toBuyListService.criarLista(userId,inforBasicas,listaProdutos)
  
  
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <HeaderBack />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Refine o amanhã,{"\n"}hoje.</Text>

          <Text style={styles.subtitle}>
            Organize suas compras com clareza para chegar{"\n"}muito mais longe do que imagina.
          </Text>

          <View style={styles.card}>
            
            <Text style={styles.labelSection}>TIPO DE LISTA</Text>
            <View style={styles.gridContainer}>
              {CATEGORIAS.map((cat) => {
                const ativo = categoriaSelecionada === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.categoryCard,
                      ativo && styles.categoryCardActive,
                    ]}
                    onPress={() => setCategoriaSelecionada(cat.key)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={26}
                      color={ativo ? "#FFFFFF" : "#1D1252"}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        ativo && styles.categoryTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.labelSection}>PRODUTOS</Text>
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
                    // ----------------------------------------------------------------------
                    // COMENTÁRIO QA: 10. TEXTINPUTS LIMPOS E FELIZES
                    // 'value' volta a receber 'quantidade' que agora é string e funciona liso.
                    // ----------------------------------------------------------------------
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
                  onPress={handleCancelarEdicao}
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
                <Text style={styles.buttonText}>Confirmar Produto</Text>
              </TouchableOpacity>
            )}

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
                  <Text style={[
                    styles.productName, 
                    produto.comprado && styles.productTextRiscado
                  ]}>
                    {produto.nome}
                  </Text>
                  <Text style={[
                    styles.productDetails,
                    produto.comprado && styles.productTextRiscado
                  ]}>
                    {/* COMENTÁRIO QA: 11. FORMATANDO PARA TELA
                      Chamamos formatarMoeda passando produto.valor (numero) convertido para a string
                      que a função exige usando a lógica (valor * 100).toFixed(0).
                    */}
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

                  <TouchableOpacity onPress={() => handleIniciarEdicao(produto)}>
                    <Ionicons name="pencil-outline" size={20} color="#888888" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleRemoverProduto(produto.id)}>
                    <Ionicons name="trash-outline" size={20} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <Text style={[styles.hintText, { marginTop: 16, marginBottom: 20 }]}>
              Pressione um item para marcar como comprado
            </Text>
            
            <Text style={styles.label}>TÍTULO DA COMPRA</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#BBBBBB" style={styles.inputIcon} />
              <TextInput
                style={styles.inputText}
                placeholder="Ex: Frutas de Leonardo"
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
                placeholder="Ex: Itens para o churrasco de domingo"
                placeholderTextColor="#BBBBBB"
                multiline
                numberOfLines={3}
                value={descricao}
                onChangeText={setDescricao}
              />
            </View>

            <TouchableOpacity style={styles.buttonConfirmar} 
            activeOpacity={0.85}
            onPress={CadastrarLista}>
              <Text style={styles.buttonText}>Criar Lista</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1D1252",
    marginTop: 14,
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
    borderRadius: 30, 
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
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
    color: "#888",
    letterSpacing: 1,
    marginBottom: 12,
  },
  addButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1D1252",
    letterSpacing: 1,
    marginBottom: 12,
  },
  hintText: {
    fontSize: 12,
    color: "#BBBBBB",
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  categoryCard: {
    width: "47%",
    paddingVertical: 18,
    backgroundColor: "#F4F4F8",
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
    borderRadius: 14,
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
    color: "#888",
    marginRight: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: "#1D1252",
    fontWeight: "500",
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
  productTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: "#1D1252",
  },
  buttonConfirmar: {
    backgroundColor: "#1D1252",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonExcluir: {
    backgroundColor: "#D32F2F", 
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});