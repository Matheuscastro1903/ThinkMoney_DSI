import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { buscarGastos, atualizarGasto } from "../../../services/gastosService";
import { Gasto } from "@/src/models/gasto";
import { geocodificarEndereco } from "../../../services/geocodingService";
import { auth } from "../../../services/firebaseConfig";

type GastoComId = Gasto & { id: string };

const REGIAO_PADRAO = {
  latitude: -23.55052,
  longitude: -46.633308,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

function formatarValor(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data: any): string {
  try {
    const d = data?.toDate ? data.toDate() : new Date(data);
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function Mapa() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [gastos, setGastos] = useState<GastoComId[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setCarregando(false);
      return;
    }

    const uid = user.uid;

    buscarGastos(uid)
      .then(async (dados) => {
        // Exibe a lista imediatamente enquanto geocodifica
        setGastos(dados);
        setCarregando(false);

        // Geocodifica sequencialmente (1 req/s — limite do Nominatim)
        const lista: GastoComId[] = [...dados];

        for (let i = 0; i < lista.length; i++) {
          const g = lista[i];

          const jaTemCoords = g.endereco?.latitude != null && g.endereco?.longitude != null;
          const semEndereco = !g.endereco?.logradouro || !g.endereco?.cidade;
          if (jaTemCoords || semEndereco) continue;

          // Respeita o rate limit do Nominatim (1 req/s)
          if (i > 0) await new Promise((r) => setTimeout(r, 1100));

          const coords = await geocodificarEndereco(
            g.endereco!.logradouro,
            g.endereco!.numero,
            g.endereco!.bairro,
            g.endereco!.cidade,
            g.endereco!.cep,
          );

          if (!coords) continue;

          g.endereco!.latitude = coords.latitude;
          g.endereco!.longitude = coords.longitude;
          lista[i] = g;

          // Atualiza os marcadores progressivamente
          setGastos([...lista]);

          // Persiste no Firebase para não geocodificar novamente
          atualizarGasto(uid, g.id as string, g).catch(console.error);
        }

        // Centraliza o mapa para englobar todos os pins
        const comCoordenadas = lista.filter(
          (g) => g.endereco?.latitude != null && g.endereco?.longitude != null,
        );

        if (comCoordenadas.length > 0) {
          const lats = comCoordenadas.map((g) => g.endereco!.latitude!);
          const lons = comCoordenadas.map((g) => g.endereco!.longitude!);
          const padding = 0.02;

          mapRef.current?.animateToRegion(
            {
              latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
              longitude: (Math.min(...lons) + Math.max(...lons)) / 2,
              latitudeDelta: Math.max(Math.max(...lats) - Math.min(...lats) + padding, 0.04),
              longitudeDelta: Math.max(Math.max(...lons) - Math.min(...lons) + padding, 0.02),
            },
            800,
          );
        }
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  const gastosComCoordenadas = gastos.filter(
    (g) => g.endereco?.latitude != null && g.endereco?.longitude != null,
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Mapa de gastos</Text>

        <MapView ref={mapRef} style={styles.map} initialRegion={REGIAO_PADRAO}>
          {gastosComCoordenadas.map((g) => (
            <Marker
              key={g.id}
              coordinate={{
                latitude: g.endereco!.latitude!,
                longitude: g.endereco!.longitude!,
              }}
              title={g.endereco?.titulo || g.titulo}
              description={`${formatarValor(g.valor)} • ${g.categoria}`}
            />
          ))}
        </MapView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Registro de Transações</Text>
          <TouchableOpacity onPress={() => router.push("/(details)/detailsmapa/visualizar-gastos")}>
            <Text style={styles.seeAll}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        {carregando ? (
          <ActivityIndicator color="#fff" style={{ marginTop: 20 }} />
        ) : gastos.length === 0 ? (
          <Text style={styles.vazio}>Nenhum gasto registrado ainda.</Text>
        ) : (
          gastos.slice(0, 5).map((g) => (
            <TransactionItem
              key={g.id}
              name={g.titulo}
              info={`${g.endereco?.cidade || "—"} • ${formatarData(g.data)}`}
              amount={`- ${formatarValor(g.valor)}`}
              card={g.categoria}
              light={true}
              onPress={() => {
                if (g.endereco?.latitude != null && g.endereco?.longitude != null) {
                  mapRef.current?.animateToRegion(
                    {
                      latitude: g.endereco.latitude,
                      longitude: g.endereco.longitude,
                      latitudeDelta: 0.01, // Zoom de aproximação
                      longitudeDelta: 0.01,
                    },
                    1000
                  );
                } else {
                  Alert.alert("Localização indisponível", "Este gasto não possui um endereço associado no mapa.");
                }
              }}
            />
          ))
        )}
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
  onPress?: () => void;
};

function TransactionItem({ name, info, amount, card, light, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1} style={[styles.item, light && styles.itemLight]}>
      <View style={styles.itemLeft}>
        <Text style={[styles.itemName, light && styles.textDark]}>{name}</Text>
        <Text style={styles.itemInfo}>{info}</Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={[styles.itemAmount, light && styles.textDark]}>{amount}</Text>
        <Text style={styles.itemCard}>{card}</Text>
      </View>
    </TouchableOpacity>
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
    textTransform: "capitalize",
  },
  textDark: {
    color: "#000",
  },
  vazio: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});
