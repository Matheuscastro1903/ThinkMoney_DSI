import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { usePathname, Link } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function NavBarFamilia() {
    //pegará o arquivo da tela
    const caminho = usePathname();

    return (
        <View style={styles.containerGeral}>
            <Link href={"/home"} asChild>
                <TouchableOpacity style={caminho === '/home' ? styles.botaoAtivo : styles.botao}>
                    <Ionicons
                        name="people"
                        
                        size={14} 
                        color={caminho === '/home' ? '#ffffff' : '#1D1252'}
                    />
                    <Text style={caminho === '/home' ? styles.textAtivo : styles.text}>
                        Família
                    </Text>
                </TouchableOpacity>
            </Link>

            <Link href={"/"} asChild>
                <TouchableOpacity style={caminho === '/' ? styles.botaoAtivo : styles.botao}>
                    <Ionicons
                        name="pencil"
                        size={14}
                        color={caminho === '/' ? '#ffffff' : '#1D1252'}
                    />
                    <Text style={caminho === '/' ? styles.textAtivo : styles.text}>
                        Editar
                    </Text>
                </TouchableOpacity>
            </Link>

            <Link href={"/"} asChild>
                <TouchableOpacity style={caminho === '/' ? styles.botaoAtivo : styles.botao}>
                    <Ionicons
                        name="flag"
                        size={14}
                        color={caminho === '/' ? '#ffffff' : '#1D1252'}
                    />
                    <Text style={caminho === '/' ? styles.textAtivo : styles.text}>
                        Metas
                    </Text>
                </TouchableOpacity>
            </Link>

            <Link href={"/"} asChild>
                <TouchableOpacity style={caminho === '/' ? styles.botaoAtivo : styles.botao}>
                    <Ionicons
                        name="analytics"
                        size={14}
                        color={caminho === '/' ? '#ffffff' : '#1D1252'}
                    />
                    <Text style={caminho === '/' ? styles.textAtivo : styles.text}>
                        Dados
                    </Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    containerGeral: {
        flexDirection: 'row',
        alignItems: 'center',
        
        justifyContent: 'space-between', 
        
        gap: 8,
        
        marginBottom: 30,
    },
    botao: {
        
        flex: 1, 
        backgroundColor: '#FFFFFF', 
        borderRadius: 8, 
        flexDirection: 'row',
        alignItems: 'center',
       
        justifyContent: 'center',
        
        paddingVertical: 10,
        
        gap: 6,
    },
    botaoAtivo: {
       
        flex: 1,
        backgroundColor: '#000000', 
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 6,
    },
    text: {
        fontSize: 12,
        
        fontWeight: 'bold',
        color: '#1D1252',
         
    },
    textAtivo: {
        
        fontSize: 12,
       
        fontWeight: 'bold',
        color: '#FFFFFF',
        
    }
});