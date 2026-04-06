// Importa React e os componentes base usados para montar a tela.
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Configuração da API de notícias financeiras.
const Api_Key = "d75f7ohr01qk56kci3fgd75f7ohr01qk56kci3g0";
const Base_url = "https://finnhub.io/api/v1";

// Categorias disponíveis para filtrar as notícias.
const CATEGORIES = ["general", "forex", "crypto", "merger"];

// Tipagem do objeto de notícia retornado pela API.
interface NewsItem {
  id: number;
  category: string;
  datetime: number;
  headline: string;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

// Busca notícias da categoria informada e retorna a lista tipada.
const fetchFinanceNews = async (category: string = "general"): Promise<NewsItem[]> => {
  const response = await fetch(
    `${Base_url}/news?category=${category}&token=${Api_Key}`
  );
  const data = await response.json();
  return data;
};

// Converte timestamp Unix para formato de data/hora em pt-BR.
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  // Barra de busca controlada por props para filtrar notícias na tela.
const SearchBar=({
  value,
  onChangeText,
  onSubmit,
  onClear,
  loading,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  loading: boolean;
}) => {
  // Renderiza input, botão de limpar e indicador de carregamento.
  return(
  <View style={styles.searchContainer}>
    <View style={styles.searchBox}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar notícias..."
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && !loading && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Text style={styles.clearIcon}>Limpar</Text>
        </TouchableOpacity>
      )}
      {loading && <ActivityIndicator size="small" color="#9CA3AF"/>}


    </View>
  </View>
  );  
  
};


// Card individual de notícia com imagem, texto e link externo.
const NewCard= ({item}: {item: NewsItem}) => {
  return(
  <TouchableOpacity
  style={styles.card}
  onPress={()=> Linking.openURL(item.url)}
  activeOpacity={0.85}
  >
    {item.image ? (
      <Image
        source={{uri:item.image}}
        style={styles.cardImage}
        resizeMode="cover"
      />
    ) : (
      <View style={styles.imagePlaceholder}/>
    )}
    <View style={styles.cardContent}>
      <Text style={styles.cardSource}>{item.source}</Text>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.headline}
      </Text>
      <Text style={styles.cardSummary} numberOfLines={2}>
        {item.summary}
      </Text>
      <Text style={styles.cardDate}>{formatDate(item.datetime)}</Text>
      
    </View> 
  </TouchableOpacity> 
     
)}

// Abas de categoria para trocar o filtro da API.
const CategoryTabs = ({
  selected,
  onselected,
}: {
  selected: string;
  onselected: (category: string) => void;
}) => {
  const labels: Record<string, string> = {
    general: "Geral",
    forex: "Global Markets",
    crypto: "Cripto",
    merger: "Mergers",
  };

  return(
    <View style={styles.tabsContainer}>
      {CATEGORIES.map((cat)=>(
        <TouchableOpacity
          key={cat}
          style={[styles.tab, selected === cat && styles.tabSelected]}
          onPress={() => onselected(cat)}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.tabText, selected === cat && styles.tabTextSelected]}
          >
            {labels[cat]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>   

  );
};


// Props da tela principal de notícias.
interface Props{
  userPhoto?: string | null;
  onPressPhoto?: () => void
}


// Tela principal: gerencia carregamento, erro, filtro por categoria e busca local.
const NewsFeedScreen = ({ userPhoto, onPressPhoto }: Props) => {
  // Lista atualmente exibida para o usuário.
  const [news, setNews] = React.useState<NewsItem[]>([]);
  // Estado de carregamento de requisições.
  const [loading, setLoading] = React.useState(true);
  // Mensagem de erro exibida quando a API falha.
  const [error, setError] = React.useState<string | null>(null);
  // Categoria ativa das abas.
  const [selectedCategory, setSelectedCategory] = React.useState("general");
  // Texto digitado no campo de busca.
  const [searchQuery, setSearchQuery] = React.useState("");
  // Fonte completa da categoria para permitir reset após limpar busca.
  const [allNews, setAllNews] = React.useState<NewsItem[]>([]);

  // Recarrega notícias sempre que a categoria selecionada muda.
  React.useEffect(()=>{
    loadNews(selectedCategory);
  }, [selectedCategory]);


  // Filtra localmente por título, resumo e fonte conforme o usuário digita.
  const handleSearch= (text:string)=>{
    setSearchQuery(text);
    // Se a busca estiver vazia, restaura a lista original da categoria.
    if (!text.trim()){
      setNews(allNews);
      return;
    }
    const keyword= text.toLowerCase();
    const filtered= allNews.filter(
      (item)=>
        item.headline.toLowerCase().includes(keyword) ||
        item.summary.toLowerCase().includes(keyword) ||
        item.source.toLowerCase().includes(keyword)
    );
    // Atualiza a lista exibida com os itens filtrados.
    setNews(filtered
    )
  }

  // Limpa o texto da busca e volta a exibir todas as notícias da categoria.
  const handleClear=() =>{
    setSearchQuery("");
    setNews(allNews);
  }
  
  // Carrega notícias da API, trata erro e sincroniza lista base + lista visível.
  const loadNews = async (category: string) => {
    try{
      setLoading(true);
      setError(null);
      const data= await fetchFinanceNews(category);
      // Atualiza lista visível e cache local usado na busca.
      setNews(data);
      setAllNews(data);
      setNews(data);
    } catch {
      setError("Erro ao carregar notícias. Tente novamente.");
    } finally{
      setLoading(false);
    }
  };

  // Renderização condicional: loading, erro ou lista de notícias.
  return(
    <View style= {styles.screenContainer}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onSubmit={handleSearch.bind(null, searchQuery)} // Implementar lógica de busca posteriormente
        onClear={handleClear}
        loading={loading}
      />

      <CategoryTabs selected={selectedCategory} onselected={setSelectedCategory}/>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#000000"/>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={()=> loadNews(selectedCategory)}
          >
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity> 

        </View>
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item)=> item.id.toString()}
          renderItem={({item})=> <NewCard item={item}/>}
          onRefresh={()=> loadNews(selectedCategory)}
          refreshing={loading}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}   



// Estilos visuais da tela e de seus componentes.
const styles = StyleSheet.create({
  // Fundo principal da página de notícias.
  screenContainer: {
    flex: 1,
    backgroundColor: "#1D1252",
    width: "100%",
  },

  // Bloco externo do header.
  headerContainer:{
    width: "100%",
    backgroundColor: "#000000",
    zIndex: 2,
  },



  // Área segura superior para não sobrepor status bar/notch.
  safeArea: {
    backgroundColor: "#000000",
  },
  // Conteúdo horizontal do header (logo à esquerda e avatar à direita).
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 6,
    height: 84,
    backgroundColor: "#000000",
  },
  // Área da logo no header.
  logoContainer: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: -80,
  },
  // Tamanho e aparência da logo principal.
  logo: {
    width: 236,
    height: 90,
    tintColor: "#FFFFFF", // caso o logo seja escuro, força o branco
  },
  // Botão circular do avatar.
  avatarButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  // Imagem do avatar quando há foto do usuário.
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  // Texto fallback quando não há foto.
  avatarText: {
    fontSize: 12,
    color: "#333333",
    fontWeight: "500",
  },

  // Container externo da barra de busca.
  searchContainer: {
    backgroundColor: '#1d1252',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  // Caixa branca que envolve o input de busca.
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },

  // Estilo reservado para ícone de busca (caso seja utilizado futuramente).
  searchIcon:{
    fontSize: 16,
    marginRight: 8,
  },

  // Campo de texto da busca.
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#111827',
  },
  // Botão para limpar o texto da busca.
  clearButton: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  // Texto do botão de limpar.
  clearIcon: {
    color: '#9CA3AF',
    fontSize: 14,
  },

  // Faixa horizontal de categorias.
  tabsContainer:{
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  // Botão base da aba.
  tab:{
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  // Aparência da aba selecionada.
  tabSelected:{
    backgroundColor: "#000000",
  },
  // Texto padrão da aba.
  tabText:{
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  // Texto da aba ativa.
  tabTextSelected:{
    color: "#FFFFFF",
  },
  // Espaçamento da lista de cards.
  list:{
    padding: 16,
  },
  // Card de notícia.
  card:{
     backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  // Imagem principal do card.
  cardImage:{
    width: "100%",
    height: 180,
  },
  // Placeholder exibido quando a notícia não possui imagem.
  imagePlaceholder:{
    width: "100%",
    height: 180,
    backgroundColor: "#1a1a2e",
  },
  // Área de textos do card.
  cardContent:{
    padding: 14,
  },
  // Fonte de publicação da notícia.
  cardSource:{
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  // Título principal da notícia.
  cardTitle:{
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 22,
    marginBottom: 6,
  },
  // Resumo da notícia.
  cardSummary:{
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 8,
  },
  // Data/hora formatada da notícia.
  cardDate:{
    fontSize: 11,
    color: "#9CA3AF",
  },
  // Container central para estados de loading e erro.
  centered:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  // Mensagem de erro.
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginBottom: 12,
  },
  // Botão de tentar novamente.
  retryBtn: {
    backgroundColor: "#000000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  // Texto do botão de retry.
  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

// Exporta a tela para uso no roteamento do app.
export default NewsFeedScreen;
