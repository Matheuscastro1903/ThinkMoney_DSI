import HeaderBack from "@/src/components/headerBack";
import LayoutNavBar from "@/src/components/layoutnavbar";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";


export default function VisualizarGastos() {
    const router = useRouter();

    return (
        <LayoutNavBar>
            <HeaderBack />
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

                <View style={styles.main}>
                    <Text style={styles.text1}>
                        Visualizar Gastos
                    </Text>
                    <Text style={styles.text2}>
                        Acompanhe e entenda para onde
                        está indo o seu dinheiro.
                    </Text>
                </View>

                <View style={styles.buscaContainer}>
                    <Ionicons name="search-outline" size={20} color="#94A3B8" />
                    <TextInput
                        style={styles.inputDeBusca}
                        placeholder="Buscar transação..."
                        placeholderTextColor="#94A3B8"
                    />
                </View>

                <View style={styles.listContainer}>
                    <View style={styles.gastosHistorico}>
                        <View style={styles.iconeGastos}>
                            <Ionicons name="cart-outline" size={20} color="#1D1252" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.textHistorico}>Assaí Atacadista</Text>
                            <Text style={styles.textCategoria}>Alimentação</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.textValor}>R$ 452,10</Text>
                            <Text style={styles.textCategoria}>19:00</Text>
                        </View>
                    </View>

                    <View style={styles.gastosHistorico}>
                        <View style={styles.iconeGastos}>
                            <Ionicons name="car-outline" size={20} color="#1D1252" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.textHistorico}>Posto Shell Graal</Text>
                            <Text style={styles.textCategoria}>Combustível</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.textValor}>R$ 200,00</Text>
                            <Text style={styles.textCategoria}>14:32</Text>
                        </View>
                    </View>

                    <View style={styles.gastosHistorico}>
                        <View style={styles.iconeGastos}>
                            <Ionicons name="restaurant-outline" size={20} color="#1D1252" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.textHistorico}>Coco Bambu</Text>
                            <Text style={styles.textCategoria}>Alimentação</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.textValor}>R$ 140,00</Text>
                            <Text style={styles.textCategoria}>22:00</Text>
                        </View>
                    </View>

                    <View style={styles.gastosHistorico}>
                        <View style={styles.iconeGastos}>
                            <Ionicons name="desktop-outline" size={20} color="#1D1252" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.textHistorico}>Apple Store M...</Text>
                            <Text style={styles.textCategoria}>Eletrônicos</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.textValor}>R$ 12.499,00</Text>
                            <Text style={styles.textCategoria}>15:20</Text>
                        </View>
                    </View>

                    <View style={styles.gastosHistorico}>
                        <View style={styles.iconeGastos}>
                            <Ionicons name="medkit-outline" size={20} color="#1D1252" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.textHistorico}>Droga Raia S/A</Text>
                            <Text style={styles.textCategoria}>Saúde</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.textValor}>R$ 145,90</Text>
                            <Text style={styles.textCategoria}>11:05</Text>
                        </View>
                    </View>
                </View>

                <LinearGradient
                    colors={["transparent", "#3E346B", "transparent"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.linhaSeparadora}
                ></LinearGradient>

                <View style={styles.visaoGeralContainer}>
                    <Text style={styles.visaoGeralTitulo}>VISÃO GERAL MENSAL</Text>
                    <Text style={styles.visaoGeralValor}>R$ 14.267,40</Text>
                </View>

            </ScrollView>
        </LayoutNavBar>
    );
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'column',
        paddingLeft: 20,
        marginTop: 15,
    },
    text1: {
        color: '#FFFFFF',
        fontSize: 35,
        fontWeight: 'bold',
    },
    text2: {
        color: '#A8A7D5',
        fontSize: 14,
        textAlign: 'left',
        paddingTop: 5,
        paddingLeft: 5,
        height: 52,
        width: 290,
        letterSpacing: 0.6,
    },
    buscaContainer: {
        width: '90%',
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingHorizontal: 20,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        flexDirection: 'row',
    },
    inputDeBusca: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#000000',
        marginLeft: 10,
    },
    listContainer: {
        marginTop: 24,
    },
    gastosHistorico: {
        height: 72,
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        marginBottom: 8,
        paddingHorizontal: 16,
        gap: 12,
    },
    iconeGastos: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textHistorico: {
        fontSize: 16,
        color: '#1D1252',
        fontFamily: 'Inter',
        fontWeight: 'bold',
    },
    textCategoria: {
        fontSize: 12,
        color: '#94A3B8',
        fontFamily: 'Inter',
        marginTop: 2,
    },
    textValor: {
        fontSize: 14,
        color: '#1D1252',
        fontFamily: 'Inter',
        fontWeight: 'bold',
    },
    visaoGeralContainer: {
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        alignSelf: 'center',
        marginTop: 8,
    },
    visaoGeralTitulo: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: 'bold',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    visaoGeralValor: {
        fontSize: 28,
        color: '#000000',
        fontWeight: 'bold',
    },
    linhaSeparadora: {
        width: "80%",
        height: 1,
        alignSelf: "center",
        marginTop: 30,
        marginBottom: 30,
        borderRadius: 25,
    },
});