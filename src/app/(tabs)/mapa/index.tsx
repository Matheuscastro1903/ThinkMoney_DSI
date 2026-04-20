import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function Mapa() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Mapa de gastos</Text>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -23.55052,
            longitude: -46.633308,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={{ latitude: -23.561, longitude: -46.655 }} />
          <Marker coordinate={{ latitude: -23.557, longitude: -46.661 }} />
          <Marker coordinate={{ latitude: -23.564, longitude: -46.648 }} />
          <Marker coordinate={{ latitude: -23.558, longitude: -46.643 }} />
        </MapView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Registro de Transações</Text>

          <TouchableOpacity>
            <Text style={styles.seeAll}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        <TransactionItem
          name="Posto Ipiranga Premium"
          info="São Paulo • 14:20"
          amount="- R$ 342,50"
          card="DÉBITO MASTER"
          light
        />
        <TransactionItem
          name="D.O.M Restaurante"
          info="São Paulo • 21:05"
          amount="- R$ 1.850,00"
          card="CRÉDITO BLACK"
        />
        <TransactionItem
          name="Uber Black Travel"
          info="São Paulo • 10:15"
          amount="- R$ 82,40"
          card="CRÉDITO BLACK"
        />
        <TransactionItem
          name="Pão de Açúcar Gourmet"
          info="São Paulo • 18:45"
          amount="- R$ 612,18"
          card="DÉBITO MASTER"
        />
      </ScrollView>
    </View>
  );
}

type Props = {
  name: string;
  info: string;
  amount: string;
  card: string;
  light?: boolean;
};

function TransactionItem({ name, info, amount, card, light }: Props) {
  return (
    <View style={[styles.item, light && styles.itemLight]}>
      <View style={styles.itemLeft}>
        <Text style={[styles.itemName, light && styles.textDark]}>{name}</Text>
        <Text style={styles.itemInfo}>{info}</Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={[styles.itemAmount, light && styles.textDark]}>
          {amount}
        </Text>
        <Text style={styles.itemCard}>{card}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1252",
  },
  scroll: {
    padding: 24,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  map: {
    height: 260,
    borderRadius: 20,
    marginBottom: 28,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  seeAll: {
    fontSize: 11,
    color: "#94A3B8",
    letterSpacing: 1,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 10,
  },
  itemLight: {
    backgroundColor: "#fff",
  },
  itemLeft: {
    flex: 1,
  },
  itemRight: {
    alignItems: "flex-end",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  itemInfo: {
    fontSize: 12,
    color: "#64748B",
  },
  itemAmount: {
    fontSize: 17,
    fontWeight: "800",
    color: "#fff",
    textAlign: "right",
  },
  itemCard: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  textDark: {
    color: "#000",
  },
});
