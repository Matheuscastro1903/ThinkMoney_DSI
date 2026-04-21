import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from '@expo/vector-icons';
import { Link } from "expo-router";
import HeaderBack from "../../components/headerBack"

const CATEGORIAS = [
    { key: "viagem", label: "Viagem", icon: "airplane" },
    { key: "casa", label: "Casa", icon: "home" },
    { key: "carro", label: "Carro", icon: "car" },
    { key: "reserva", label: "Reserva", icon: "wallet" },
];

export default function AddMeta() {
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
    const [capital, setCapital] = useState("");
    const [data, setData] = useState("");
    const [descricao, setDescricao] = useState("");

    return (

        <View style={styles.container}>
             {/* Header */}
            <HeaderBack/>
            
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <SafeAreaView style={styles.safeArea}>
                {/* Título */}
                <Text style={styles.title}>Refina seu amanhã</Text>

                {/* Subtítulo */}
                <Text style={styles.subtitle}>
                    Atualize suas metas para acompanhar a evolução em tempo real
                </Text>

                {/* Card principal */}
                <View style={styles.card}>

                    {/* Tipo de Meta */}
                    <Text style={styles.labelSection}>TIPO DE META</Text>
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
                                        size={30}
                                        color={ativo ? "#FFFFFF" : "#1D1252"}
                                    />
                                    <Text style={[styles.categoryText, ativo && styles.categoryTextActive]}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Capital Necessário */}
                    <Text style={styles.label}>CAPITAL NECESSÁRIO</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.currencyPrefix}>R$</Text>
                        <TextInput
                            style={styles.inputText}
                            placeholder="0,00"
                            placeholderTextColor="#BBBBBB"
                            keyboardType="numeric"
                            value={capital}
                            onChangeText={setCapital}
                        />
                    </View>

                    {/* Data de Realização */}
                    <Text style={styles.label}>DATA DE REALIZAÇÃO</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="calendar-outline" size={18} color="#BBBBBB" style={styles.inputIcon} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Selecione o prazo"
                            placeholderTextColor="#BBBBBB"
                            value={data}
                            onChangeText={setData}
                        />
                    </View>

                    {/* Descrição */}
                    <Text style={styles.label}>DESCRIÇÃO (OPCIONAL)</Text>
                    <View style={[styles.inputWrapper, styles.inputMultiline]}>
                        <TextInput
                            style={[styles.inputText, { flex: 1 }]}
                            placeholder={"Ex: Viagem de 10 anos de\ncasados"}
                            placeholderTextColor="#BBBBBB"
                            multiline
                            numberOfLines={3}
                            value={descricao}
                            onChangeText={setDescricao}
                        />
                    </View>

                    {/* Botão para editar */}
                    <TouchableOpacity style={styles.button} activeOpacity={0.85}>
                        <Text style={styles.buttonText}>Salvar alterações</Text>
                        <Ionicons name="pencil-outline" size={20} color="white" />
                    </TouchableOpacity>

                    {/* Botão para excluir */}
                    <TouchableOpacity style={styles.button2} activeOpacity={0.85}>
                        <Text style={styles.buttonText}>Excluir Meta Pessoal</Text>
                        <Ionicons name="trash-outline" size={20} color="white" />
                    </TouchableOpacity>
                    
                    {/* Botão para cancelar */}
                    <Link href={'/metas'} asChild>
                        <TouchableOpacity style={styles.cancelar}>
                            <Text style={styles.textocancelar}>Cancelar</Text>
                        </TouchableOpacity>
                    </Link>
                    

                    {/* Footer */}
                    <Text style={styles.footerText}>THINKMONEY SECURE INFRASTRUCTURE</Text>
                </View>
                </SafeAreaView>
            </ScrollView>
       
        </View>
        
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    container: {
        flex: 1,
        
    },
    header: {
        backgroundColor: "#0A0A0A",
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    backText: {
        color: "white",
        fontSize: 15,
        fontWeight: "600",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    badge: {
        backgroundColor: "#D6D0F0",
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 12,
        alignSelf: "flex-start",
        marginTop: 24,
    },
    badgeText: {
        color: "#1D1252",
        fontSize: 10,
        fontWeight: "600",
        letterSpacing: 1,
    },
    title: {
        fontSize: 25,
        fontWeight: "800",
        color: "#1D1252",
        marginTop: 20,
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
    button: {
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
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
    },
    footerText: {
        textAlign: "center",
        fontSize: 10,
        color: "#BBBBBB",
        letterSpacing: 1,
    },
    button2: {
        backgroundColor: "red",
        borderRadius: 14,
        paddingVertical: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        marginTop: 4,
        marginBottom: 16,
        
    },
    cancelar: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
        marginTop: 10
    },
    textocancelar: {

    }
});