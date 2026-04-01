import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Api_Key = "d75f7ohr01qk56kci3fgd75f7ohr01qk56kci3g0";
const Base_url = "https://finnhub.io/api/v1";

const CATEGORIES = ["general", "forex", "crypto", "merger"];

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

interface HeaderProps {
  userPhoto?: string | null;
  onPressPhoto?: () => void;
}

const fetchFinanceNews = async (category: string = "general"): Promise<NewsItem[]> => {
  const response = await fetch(
    `${Base_url}/news?category=${category}&token=${Api_Key}`
  );
  const data = await response.json();
  return data;
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Header = ({ userPhoto, onPressPhoto }: HeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logothink.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={onPressPhoto}
            activeOpacity={0.8}
          >
            {userPhoto ? (
              <Image source={{ uri: userPhoto }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>Foto</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

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


interface Props{
  userPhoto?: string | null;
  onPressPhoto?: () => void
}


const NewsFeedScreen = ({ userPhoto, onPressPhoto }: Props) => {
  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState("general");

  React.useEffect(()=>{
    loadNews(selectedCategory);
  }, [selectedCategory]);
  
  const loadNews = async (category: string) => {
    try{
      setLoading(true);
      setError(null);
      const data= await fetchFinanceNews(category);
      setNews(data);
    } catch {
      setError("Erro ao carregar notícias. Tente novamente.");
    } finally{
      setLoading(false);
    }
  };

  return(
    <View style= {styles.screenContainer}>
      <Header userPhoto={userPhoto} onPressPhoto={onPressPhoto}/>
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



// const styles = StyleSheet.create({
//   container
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    width: "100%",
  },

  headerContainer:{
    width: "100%",
    backgroundColor: "#000000",
    zIndex: 2,
  },



  safeArea: {
    backgroundColor: "#000000",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 88,
    backgroundColor: "#000000",
  },
  logoContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  logo: {
    width: 140,
    height: 56,
    tintColor: "#FFFFFF", // caso o logo seja escuro, força o branco
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarText: {
    fontSize: 12,
    color: "#333333",
    fontWeight: "500",
  },

  tabsContainer:{
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  tab:{
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  tabSelected:{
    backgroundColor: "#000000",
  },
  tabText:{
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  tabTextSelected:{
    color: "#FFFFFF",
  },
  list:{
    padding: 16,
  },
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
  cardImage:{
    width: "100%",
    height: 180,
  },
  imagePlaceholder:{
    width: "100%",
    height: 180,
    backgroundColor: "#1a1a2e",
  },
  cardContent:{
    padding: 14,
  },
  cardSource:{
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  cardTitle:{
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 22,
    marginBottom: 6,
  },
  cardSummary:{
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 8,
  },
  cardDate:{
    fontSize: 11,
    color: "#9CA3AF",
  },
  centered:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: "#000000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default NewsFeedScreen;
