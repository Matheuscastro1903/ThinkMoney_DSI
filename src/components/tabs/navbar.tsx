//arquivo destinado a gardar um footer de navegação
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
//biblioteca para a importação dos icons
import { Ionicons } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';

export default function NavBar() {

    //hook para pegar o caminho da página na hora da troca de telas
    //e aplicar estilo
    const caminho = usePathname();
    console.log('teste')
    console.log(caminho)
    console.log('CAMINHO ATUAL:', caminho)

    return (
        <View style={styles.footer}>

            {/* botão Home 
            se o ccaminho for home aplica determinado estilo,caso contrário,aplica o outro
            
            */}
            <Link href="/home" asChild>
                <TouchableOpacity style={caminho === '/home'
        ? styles.botaoAtivo
        : styles.botaoDesativado}>
                    <Ionicons
                        name="home"
                        size={24}
                        // destaca o ícone se estiver na rota correspondente
                        color={caminho === '/home' ? '#1D1252' : '#ffffff'}
                    />
                    <Text style={[styles.label, caminho === '/home' && styles.labelAtivo]}>
                        Home
                    </Text>
                </TouchableOpacity>
            </Link>


            {/* botão FAQ */}
            <Link href="/faq" asChild>
                <TouchableOpacity style={styles.botaoDesativado}>
                    <Ionicons
                        name="chatbubble-ellipses"
                        size={24}
                        color={caminho === '/faq' ? '#1D1252' : '#ffffff'}
                        //se for true=cor do icon=roxo,se for false=cinza
                    />
                    <Text style={[styles.label, caminho === '/faq' && styles.labelAtivo]}>
                        FAQ
                    </Text>
                </TouchableOpacity>
            </Link>

            {/* botão central — Mapa */}
            <Link href="/mapa" asChild>
                <TouchableOpacity style={styles.botaoMais}>
                    <Ionicons
                        name="location"
                        size={32}
                        color={caminho === '/mapa' ? '#1D1252' : '#ffffff'}
                    />
                    <Text style={[styles.labelMais, caminho === '/mapa' && styles.labelAtivo]}>
                        Mapa
                    </Text>
                </TouchableOpacity>
            </Link>

            {/* botão Notícias */}
            <Link href="/noticias" asChild>
                <TouchableOpacity style={styles.botaoDesativado}>
                    <Ionicons
                        name="newspaper"
                        size={24}
                        color={caminho === '/noticias' ? '#1D1252' : '#ffffff'}
                    />
                    <Text style={[styles.label, caminho === '/noticias' && styles.labelAtivo]}>
                        Notícias
                    </Text>
                </TouchableOpacity>
            </Link>

            {/* botão Família */}
            <Link href="/familia" asChild>
                <TouchableOpacity style={styles.botaoDesativado}>
                    <Ionicons
                        name="people"
                        size={24}
                        color={caminho === '/familia' ? '#1D1252' : '#ffffff'}
                    />
                    <Text style={[styles.label, caminho === '/familia' && styles.labelAtivo]}>
                        Família
                    </Text>
                </TouchableOpacity>
            </Link>

        </View>
    )
}

const styles = StyleSheet.create({

    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#000000',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 10,
        width: '100%',
    },

    botaoDesativado: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        flex: 1,
    },

    botaoMais: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        flex: 1,
    },

    botaoAtivo:{
    //aplicando os mesmo estilos do botão desativado
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flex: 1,
    backgroundColor:'#ffffff',
    borderRadius:12
    },

    label: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '500',
    },

    labelMais: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: 'bold',
    },

    // ADICIONADO: estilo do label quando o botão está ativo
    labelAtivo: {
        color: '#1D1252',
        fontWeight: 'bold',
    },

})