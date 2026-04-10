//Arquivo responsável pela tema "home" do nosso app.


import { Feather, Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useRouter } from 'expo-router';


export default function Home() {
    const router = useRouter();


    return (
        <View style={styles.container}>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.saldo}>
                    <Text style={styles.text1}>
                        SALDO RESTANTE
                    </Text>
                    <Text style={styles.text2}>
                        R$ 340,00
                    </Text>

                </View>
                <View style={styles.linhaDegraficos}>
                    <View style={styles.grafico}>
                        <CircularProgress
                            value={72}
                            activeStrokeWidth={12}
                            inActiveStrokeWidth={12}
                            progressValueColor={'#FFFFFF'}
                            progressValueFontSize={30}
                            radius={60}
                            valueSuffix='%'
                            activeStrokeColor={'#4ADE80'}
                            inActiveStrokeColor={'#FFFFFF'}
                            inActiveStrokeOpacity={0.05} />
                        <Text style={styles.limiteEreserva}>Limite</Text>
                    </View>
                    <View style={styles.grafico}>
                        <CircularProgress
                            value={30}
                            activeStrokeWidth={12}
                            inActiveStrokeWidth={12}
                            progressValueColor={'#FFFFFF'}
                            progressValueFontSize={30}
                            radius={60}
                            valueSuffix='%'
                            activeStrokeColor={'#4ADE80'}
                            inActiveStrokeColor={'#FFFFFF'}
                            inActiveStrokeOpacity={0.05} />
                        <Text style={styles.limiteEreserva}>Reserva</Text>
                    </View>
                </View>
                <View style={styles.gastosDoMes}>
                    <Feather name="trending-up" size={32} color="#4ADE80" />
                    <View>
                        <Text style={styles.text3}>
                            Seu gasto este mês foi de:
                        </Text>
                        <Text style={styles.text4}>
                            R$ 1.234,56
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.registrarNovoGasto} onPress={() => console.log('clicou para registrar um novo gasto!')}>
                    <Ionicons name="add-circle-outline" size={24} color="black" />
                    <Text style={styles.text5}>
                        REGISTRAR NOVO GASTO
                    </Text>
                </TouchableOpacity>
                <View style={styles.linhaBotao}>
                    <TouchableOpacity style={styles.metasPessoais} onPress={() => console.log('clicou em metas pessoais!')}>
                        <Text style={styles.text6}>METAS PESSOAIS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.lembretes} onPress={() => router.push('/(details)/detailshome/lembretes')}>
                        <Text style={styles.text6}>LEMBRETES</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.ultimosGastos}>ÚLTIMOS GASTOS</Text>
                </View>
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
            </ScrollView>
        </View>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1D1252',
    },
    saldo: {
        height: 116,
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 48,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,

        paddingTop: 32,
        paddingRight: 24,
        paddingBottom: 24,
        paddingLeft: 24,
    },
    text1: {
        fontSize: 14,
        color: '#000000',
        fontFamily: 'Inter',
        letterSpacing: 2.4,
        marginBottom: 8

    },
    text2: {
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        color: '#000000',
    },
    grafico: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        backgroundColor: '#281E5D',
        width: 170,
        height: 190,
        borderRadius: 24,
    },
    linhaDegraficos: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
        gap: 30,
    },
    limiteEreserva: {
        fontSize: 14,
        color: '#FFFFFF',
        fontFamily: 'Inter',
        letterSpacing: 2.4,
        marginTop: 14,
    },
    gastosDoMes: {
        height: 96,
        width: '90%',
        backgroundColor: '#08082F',
        alignSelf: 'center',
        marginTop: 35,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 20,
        paddingHorizontal: 20,
    },
    text3: {
        fontSize: 14,
        color: '#E1E0FF',
        fontFamily: 'Inter',
        letterSpacing: 2.4,

    },
    text4: {
        fontSize: 14,
        color: '#72FF72',
        fontFamily: 'Inter',
        letterSpacing: 2.4,
        marginTop: 5,
    },
    registrarNovoGasto: {
        height: 55,
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 48,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        flexDirection: 'row',
        gap: 20,
    },
    text5: {
        fontSize: 14,
        color: '#000000',
        fontFamily: 'Inter',
        letterSpacing: 2.4,
    },
    text6: {
        fontSize: 14,
        color: '#000000',
        fontFamily: 'Inter',
        letterSpacing: 2.4,
    },
    metasPessoais: {
        height: 55,
        width: '43%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        flexDirection: 'row',
        gap: 1,
    },
    lembretes: {
        height: 55,
        width: '43%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        flexDirection: 'row',
        gap: 1,
    },
    linhaBotao: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 1,
        gap: 10,
    },
    ultimosGastos: {
        fontSize: 14,
        color: '#94A3B8',
        fontFamily: 'Inter',
        letterSpacing: 2.4,
        marginBottom: 8,
        paddingTop: 40,
        paddingLeft: 25,
    },
    gastosHistorico: {
        height: 72,
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingHorizontal: 16,
        gap: 12,
    },
    textHistorico: {
        fontSize: 16,
        color: '#1D1252',
        fontFamily: 'Inter',
        fontWeight: 'bold',

    },
    textValor: {
        fontSize: 14,
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
    iconeGastos: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F1F5F9', // Cinza clarinho padrão
        justifyContent: 'center',
        alignItems: 'center',
    },

})
