import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from "expo-router";
import HeaderBack from "@/src/components/headerBack";


export default function ChatBot() {
    return (
        <View style={styles.container}>
            <HeaderBack />

            <View style={styles.chat}>
                <View style={styles.int}>
                    <View style={styles.logo}>
                        <MaterialCommunityIcons name="robot" size={30} color="white" 
                        style={styles.icon}/>
                    </View>
                    <Text style={styles.title}>Olá, sou o Din$</Text>
                    <Text style={styles.subtitle}>Sua inteligência artificial para gestão de patrimônio e investimentos</Text>
                </View>


                <View style={styles.ia}>
                    <Text>Olá! Como posso ajudar você a otimizar sua vida financeira hoje?
                        Você pode me perguntar sobre seu saldo, novas oportunidades de investimento ou análise de gastos
                    </Text>
                </View>
                <Text style={styles.time1}>10:24 AM</Text>

                <View style={styles.user}>
                    <Text style={{color: "white"}}>Gostaria de ver um resumo dos meus investimentos este mês</Text>
                </View>
                <Text style={styles.time2}>10:24 AM</Text>

                <View style={styles.ia}>
                    <Text> Com certeza. Seu portfólio teve uma valorização de 
                        <Text style={styles.dado}> +4.2%</Text> nos últimos 30 dias. Veja o Destaque:
                    </Text>
                </View>
                <Text style={styles.time1}>10:24 AM</Text>

                <View style={styles.sugestao}>
                    <TouchableOpacity style={styles.buttonSugestions}>
                        <Text style={styles.textSugestions}>Como investir?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonSugestions}>
                        <Text style={styles.textSugestions}>Ver saldo total</Text>
                    </TouchableOpacity>
                       
                    <TouchableOpacity style={styles.buttonSugestions}>
                        <Text style={styles.textSugestions}>Onde gastei mais?</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                        placeholder="Escreva sua mensagem..."
                        style={styles.input} />
                       
                       
                       <TouchableOpacity style={styles.sendButton}>
                            <View style={styles.box}>
                                <Ionicons name="send" size={16} color="white" />
                            </View>
                           
                       </TouchableOpacity>
                    </View>
                </View>


            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "white"
    },
    int: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        textAlign: "center",
        color: "#333",
        lineHeight: 22,
        paddingHorizontal: 8,
    },
    chat: {

    },
    logo: {
        backgroundColor: "#e9e9e9",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        width: 64,
        height: 64,
        marginBottom: 16,
        marginTop: 30
    },
    icon: {
        color: "#1D1252"
    },
    ia: {
        marginTop: 32,
        backgroundColor: "#e9e9e9",
        borderRadius: 15,
        marginLeft: 30,
        marginRight: 100,
        padding: 20
    },
    time1: {
        marginLeft: 50,
        fontWeight: 200,
        fontSize: 12
    },
    user: {
        marginTop: 32,
        backgroundColor: "#1D1252",
        borderRadius: 15,
        marginLeft: 100,
        marginRight: 30,
        padding: 20
    },
    time2: {
        marginLeft: 300,
        fontWeight: 200,
        fontSize: 12
    },
    dado: {
        color: "green"
    },
    buttonSugestions: {
        backgroundColor: "#e9e9e9",
        borderRadius: 10,
        padding: 4,
        marginHorizontal: 5,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sugestao: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
        paddingHorizontal: 16,
    },
    textSugestions: {
        textAlign: "center",
        color: "#1D1252",
        fontWeight: "bold",
        fontSize: 12
    },
    input: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        marginRight: 10,
        marginLeft: 10
    },
    footer: {
        backgroundColor: "#e9e9e9",
        marginTop: 12,
        borderRadius: 40,
        height: 80,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sendButton: {
        padding: 8,
    },
    box: {
        backgroundColor: "#1D1252",
        padding: 5,
        borderRadius: 5
    }
    
})