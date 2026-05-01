import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import LayoutNavBar from "@/src/components/layoutnavbar";
import HeaderBack from "@/src/components/headerBack";
import React, { useCallback, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Link, useFocusEffect } from "expo-router";
import { auth } from "@/src/services/firebaseConfig";
import { buscarLembretes } from "@/src/services/lembretesService";

type Lembrete = {
  id: string;
  nomeGasto: string;
  categoria: string;
  vencimento: string;
  valor: number;
  status: 'PENDENTE' | 'PAGO';
};

export default function Lembretes() {
    const router = useRouter();
    const [lembretes, setLembretes] = useState<Lembrete[]>([]);
    const [carregando, setCarregando] = useState(true);

    useFocusEffect(
      useCallback(() => {
        const user = auth.currentUser;
        if (!user) return;
        setCarregando(true);
        buscarLembretes(user.uid).then((dados) => {
          setLembretes(dados as Lembrete[]);
          setCarregando(false);
        });
      }, [])
    );

    const handleUpdate = (item: Lembrete) => {
        router.push({
            pathname: "/detailshome/lembretes/attlembrete/page" as any,
            params: { id: item.id, titulo: item.nomeGasto, categoria: item.categoria, valor: item.valor.toString() }
        });
    };

    return (
        <LayoutNavBar>
            <HeaderBack />
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.main}>
                    <Text style={styles.text1}>Meus Lembretes</Text>
                    <Text style={styles.text2}>Gerencie seus compromissos financeiros recorrentes.</Text>
                    <Text style={styles.text3}>Compromissos próximos</Text>
                </View>

                {carregando ? (
                  <ActivityIndicator color="#FFFFFF" style={{ marginTop: 40 }} />
                ) : lembretes.slice(0, 4).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.containerLembretes}
                    activeOpacity={0.7}
                    onPress={() => handleUpdate(item)}
                  >
                    <View style={styles.lembreteIcone}>
                      <Ionicons name="notifications-outline" size={20} color="#1D1252" />
                    </View>
                    <View style={styles.lembreteInfo}>
                      <Text style={styles.lembreteTitulo}>{item.nomeGasto}</Text>
                      <Text style={styles.lembreteSubtitulo}>{item.categoria} • VENCE {item.vencimento}</Text>
                    </View>
                    <View style={styles.lembreteDireita}>
                      <Text style={styles.lembreteMoeda}>R$ <Text style={styles.lembreteValor}>{item.valor.toFixed(2).replace('.', ',')}</Text></Text>
                      <View style={item.status === 'PAGO' ? styles.badgePago : styles.badgePendente}>
                        <Text style={item.status === 'PAGO' ? styles.badgeTextPago : styles.badgeTextPendente}>{item.status}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}

                <View style={styles.verTodosContainer}>
                    <TouchableOpacity style={styles.verTodosButton} onPress={() => router.push("/detailshome/lembretes/vertodoslembretes" as any)}>
                        <Text style={styles.verTodosText}>VER TODOS</Text>
                        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <LinearGradient
                    colors={['transparent', '#3E346B', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.linhaSeparadora}>
                </LinearGradient>

                <View style={styles.containerExtra}>
                    <Link href="/detailshome/lembretes/createLembrete/page" asChild>
                        <TouchableOpacity style={styles.addIconCircle}>
                            <Ionicons name="add" size={40} color="#000000" />
                        </TouchableOpacity>
                    </Link>
                    <Text style={styles.text4}>Nova despesa?</Text>
                    <Text style={styles.text5}>Automatize o acompanhamento de suas contas recorrentes.</Text>
                    <Link href="/detailshome/lembretes/createLembrete/page" asChild>
                        <TouchableOpacity style={styles.buttonAdd}>
                            <Text style={styles.buttonText}>ADICIONAR LEMBRETE</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </ScrollView>
        </LayoutNavBar>
    );
}

const styles = StyleSheet.create({
    main: { flexDirection: 'column', paddingLeft: 20, marginTop: 15 },
    text1: { color: '#FFFFFF', fontSize: 35, fontWeight: 'bold' },
    text2: { color: '#A8A7D5', fontSize: 14, textAlign: 'left', paddingTop: 5, height: 52, width: 290, letterSpacing: 0.6 },
    text3: { fontSize: 14, color: '#94A3B8', letterSpacing: 2.4, paddingTop: 40, paddingLeft: 1 },
    containerLembretes: {
        height: 72, width: '90%', backgroundColor: '#FFFFFF', borderRadius: 8,
        alignSelf: 'center', alignItems: 'center', marginTop: 8, flexDirection: 'row',
        justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 16, gap: 12,
    },
    lembreteIcone: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
    lembreteInfo: { flex: 1, marginLeft: 12 },
    lembreteTitulo: { fontSize: 16, color: '#1D1252', fontWeight: 'bold' },
    lembreteSubtitulo: { fontSize: 10, color: '#94A3B8', marginTop: 4 },
    lembreteDireita: { alignItems: 'flex-end' },
    lembreteMoeda: { fontSize: 12, color: '#1D1252', fontWeight: 'bold' },
    lembreteValor: { fontSize: 18 },
    badgePendente: { backgroundColor: '#FEE2E2', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 12, marginTop: 5 },
    badgeTextPendente: { color: '#B91C1C', fontSize: 9, fontWeight: 'bold' },
    badgePago: { backgroundColor: '#E2E8F0', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 12, marginTop: 5 },
    badgeTextPago: { color: '#475569', fontSize: 9, fontWeight: 'bold' },
    verTodosContainer: { marginTop: 28, alignItems: 'center' },
    verTodosButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#3E346B', borderRadius: 24 },
    verTodosText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold', letterSpacing: 1.2, marginRight: 8 },
    containerExtra: { backgroundColor: '#1E1B3E', borderRadius: 20, width: '80%', height: 280, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 0, padding: 24 },
    linhaSeparadora: { width: '80%', height: 1, alignSelf: 'center', marginTop: 40, marginBottom: 40, borderRadius: 25 },
    text4: { fontSize: 22, color: '#FFFFFF', paddingTop: 5, fontWeight: 'bold' },
    text5: { fontSize: 14, color: '#94A3B8', letterSpacing: 2.4, paddingTop: 10, textAlign: 'center' },
    buttonAdd: { width: '90%', height: 56, backgroundColor: '#E2E8F0', borderRadius: 28, alignItems: 'center', alignSelf: 'center', marginTop: 20, justifyContent: 'center' },
    buttonText: { color: '#000000', fontSize: 16, fontWeight: 'bold' },
    addIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
});
